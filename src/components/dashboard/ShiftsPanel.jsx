import { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  createShiftThunk,
  loadWeekShiftsThunk,
  setWeekStartMs,
} from "../../store/dashboardSlice";

const LS_KEY = "chato_shift_timer_v1";

const PLAY_SVG = `<svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><g> <path d="M16.6582 9.28638C18.098 10.1862 18.8178 10.6361 19.0647 11.2122C19.2803 11.7152 19.2803 12.2847 19.0647 12.7878C18.8178 13.3638 18.098 13.8137 16.6582 14.7136L9.896 18.94C8.29805 19.9387 7.49907 20.4381 6.83973 20.385C6.26501 20.3388 5.73818 20.0469 5.3944 19.584C5 19.053 5 18.1108 5 16.2264V7.77357C5 5.88919 5 4.94701 5.3944 4.41598C5.73818 3.9531 6.26501 3.66111 6.83973 3.6149C7.49907 3.5619 8.29805 4.06126 9.896 5.05998L16.6582 9.28638Z" stroke="#000000" stroke-width="2" stroke-linejoin="round"></path> </g></svg>`;

const PAUSE_SVG = `<svg fill="#000000" viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg"><g> <path d="M5.92 24.096q0 0.832 0.576 1.408t1.44 0.608h4.032q0.832 0 1.44-0.608t0.576-1.408v-16.16q0-0.832-0.576-1.44t-1.44-0.576h-4.032q-0.832 0-1.44 0.576t-0.576 1.44v16.16zM18.016 24.096q0 0.832 0.608 1.408t1.408 0.608h4.032q0.832 0 1.44-0.608t0.576-1.408v-16.16q0-0.832-0.576-1.44t-1.44-0.576h-4.032q-0.832 0-1.408 0.576t-0.608 1.44v16.16z"></path> </g></svg>`;

const STOP_SVG = `<svg viewBox="0 0 28 28" xmlns="http://www.w3.org/2000/svg" fill="#ffffff" stroke="#ffffff"><g><g fill="#ffffff"><path d="M26 0H2C.896 0 0 .896 0 2v24c0 1.104.896 2 2 2h24c1.104 0 2-.896 2-2V2c0-1.104-.896-2-2-2z"/></g></g></svg>`;

const CALENDAR_SVG = `<svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><g><path d="M7 2V4" stroke="currentColor" stroke-width="2" stroke-linecap="round"/><path d="M17 2V4" stroke="currentColor" stroke-width="2" stroke-linecap="round"/><path d="M3 9H21" stroke="currentColor" stroke-width="2" stroke-linecap="round"/><path d="M5 6H19C20.1046 6 21 6.89543 21 8V19C21 20.1046 20.1046 21 19 21H5C3.89543 21 3 20.1046 3 19V8C3 6.89543 3.89543 6 5 6Z" stroke="currentColor" stroke-width="2" stroke-linejoin="round"/></g></svg>`;

function pad2(n) {
  const v = Math.floor(n);
  return v < 10 ? `0${v}` : String(v);
}
function formatMs(ms) {
  const totalSeconds = Math.max(0, Math.floor(ms / 1000));
  const h = Math.floor(totalSeconds / 3600);
  const m = Math.floor((totalSeconds % 3600) / 60);
  const s = totalSeconds % 60;
  return `${pad2(h)}:${pad2(m)}:${pad2(s)}`;
}

function startOfWeekMsFrom(dateOrMs) {
  const d = new Date(dateOrMs);
  d.setHours(0, 0, 0, 0);
  d.setDate(d.getDate() - d.getDay());
  return d.getTime();
}

function weekLabel(weekStartMs) {
  const a = new Date(weekStartMs);
  const b = new Date(weekStartMs + 6 * 24 * 60 * 60 * 1000);
  const fmt = new Intl.DateTimeFormat("en-US", { month: "short", day: "2-digit" });
  return `${fmt.format(a)} – ${fmt.format(b)}`;
}

function readTimer() {
  try {
    const raw = localStorage.getItem(LS_KEY);
    if (!raw) return { running: false, startedAt: null, accumulatedMs: 0 };
    const s = JSON.parse(raw);
    return {
      running: Boolean(s.running),
      startedAt: typeof s.startedAt === "number" ? s.startedAt : null,
      accumulatedMs: typeof s.accumulatedMs === "number" ? s.accumulatedMs : 0,
    };
  } catch {
    return { running: false, startedAt: null, accumulatedMs: 0 };
  }
}
function writeTimer(next) {
  localStorage.setItem(LS_KEY, JSON.stringify(next));
}

function CalendarModal({ open, initialMs, onClose, onPickWeek }) {
  const [cursor, setCursor] = useState(() => {
    const d = new Date(initialMs || Date.now());
    d.setDate(1);
    d.setHours(0, 0, 0, 0);
    return d;
  });

  useEffect(() => {
    if (!open) return;
    const d = new Date(initialMs || Date.now());
    d.setDate(1);
    d.setHours(0, 0, 0, 0);
    setCursor(d);
  }, [open, initialMs]);

  const year = cursor.getFullYear();
  const month = cursor.getMonth();
  const title = new Intl.DateTimeFormat("en-US", { month: "long", year: "numeric" }).format(
    cursor
  );

  const firstDay = new Date(year, month, 1);
  const startWeekday = firstDay.getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const cells = [];
  for (let i = 0; i < startWeekday; i++) cells.push(null);
  for (let d = 1; d <= daysInMonth; d++) cells.push(new Date(year, month, d));
  while (cells.length % 7 !== 0) cells.push(null);

  const weekdayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 p-4">
      <div className="w-full max-w-sm rounded-2xl bg-[var(--panel)] border border-[var(--border)] shadow-xl p-4">
        <div className="flex items-center justify-between">
          <button
            className="px-3 py-2 rounded-xl border border-[var(--border)] bg-[var(--panel)] hover:bg-[var(--soft)] cursor-pointer"
            onClick={() => setCursor(new Date(year, month - 1, 1))}
            title="Previous month"
          >
            {"<"}
          </button>

          <div className="text-sm font-semibold text-[var(--ink)]">{title}</div>

          <button
            className="px-3 py-2 rounded-xl border border-[var(--border)] bg-[var(--panel)] hover:bg-[var(--soft)] cursor-pointer"
            onClick={() => setCursor(new Date(year, month + 1, 1))}
            title="Next month"
          >
            {">"}
          </button>
        </div>

        <div className="mt-3 grid grid-cols-7 gap-1 text-xs text-[var(--muted)]">
          {weekdayNames.map((w) => (
            <div key={w} className="text-center py-1">
              {w}
            </div>
          ))}
        </div>

        <div className="mt-1 grid grid-cols-7 gap-1">
          {cells.map((d, idx) => {
            if (!d) return <div key={idx} className="h-9" />;

            const isToday = (() => {
              const t = new Date();
              return (
                d.getFullYear() === t.getFullYear() &&
                d.getMonth() === t.getMonth() &&
                d.getDate() === t.getDate()
              );
            })();

            return (
              <button
                key={idx}
                className={
                  "h-9 rounded-xl flex items-center justify-center text-sm cursor-pointer " +
                  (isToday
                    ? "bg-[var(--primary)] text-[var(--ink)] font-semibold"
                    : "bg-[var(--soft)] hover:brightness-95 text-[var(--ink)]")
                }
                onClick={() => {
                  const ws = startOfWeekMsFrom(d.getTime());
                  onPickWeek(ws);
                  onClose();
                }}
                title="Pick week"
              >
                {d.getDate()}
              </button>
            );
          })}
        </div>

        <div className="mt-4 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl border border-[var(--border)] bg-[var(--panel)] hover:bg-[var(--soft)] cursor-pointer font-semibold"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}

export default function ShiftsPanel() {
  const dispatch = useDispatch();
  const token = useSelector((s) => s.auth.token);

  const weekStartMs = useSelector((s) => s.dashboard.weekStartMs);
  const shifts = useSelector((s) => s.dashboard.shifts);
  const loadingShifts = useSelector((s) => s.dashboard.loadingShifts);

  const [timer, setTimer] = useState(() => readTimer());
  const [now, setNow] = useState(() => Date.now());

  const [confirmOpen, setConfirmOpen] = useState(false);
  const [pendingSave, setPendingSave] = useState(null);

  const [calendarOpen, setCalendarOpen] = useState(false);

  useEffect(() => {
    const id = setInterval(() => setNow(Date.now()), 250);
    return () => clearInterval(id);
  }, []);

  useEffect(() => {
    const onStorage = (e) => {
      if (e.key === LS_KEY) setTimer(readTimer());
    };
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  useEffect(() => {
    if (!token) return;
    dispatch(loadWeekShiftsThunk({ token, weekStartMs }));
  }, [dispatch, token, weekStartMs]);

  const elapsedMs = useMemo(() => {
    if (!timer.running || !timer.startedAt) return timer.accumulatedMs;
    return timer.accumulatedMs + (now - timer.startedAt);
  }, [timer, now]);

  const onPlay = () => {
    const current = readTimer();
    if (current.running) return;
    const next = { ...current, running: true, startedAt: Date.now() };
    writeTimer(next);
    setTimer(next);
  };

  const onPause = () => {
    const current = readTimer();
    if (!current.running) return;
    const additional = current.startedAt ? Date.now() - current.startedAt : 0;
    const next = {
      running: false,
      startedAt: null,
      accumulatedMs: current.accumulatedMs + additional,
    };
    writeTimer(next);
    setTimer(next);
  };

  const onStop = () => {
    const current = readTimer();

    const runningAdditional =
      current.running && current.startedAt ? Date.now() - current.startedAt : 0;

    const durationMs = current.accumulatedMs + runningAdditional;
    if (durationMs <= 0) return;

    const endedAt = Date.now();
    const startedAt = endedAt - durationMs;

    // Freeze immediately so the timer does NOT keep ticking during modal
    const frozen = { running: false, startedAt: null, accumulatedMs: durationMs };
    writeTimer(frozen);
    setTimer(frozen);

    setPendingSave({ startedAt, endedAt, durationMs });
    setConfirmOpen(true);
  };

  const discardStop = () => {
    const next = { running: false, startedAt: null, accumulatedMs: 0 };
    writeTimer(next);
    setTimer(next);
    setConfirmOpen(false);
    setPendingSave(null);
  };

  const saveStop = async () => {
    if (!pendingSave) return;

    await dispatch(
      createShiftThunk({
        token,
        startedAt: pendingSave.startedAt,
        endedAt: pendingSave.endedAt,
        durationMs: pendingSave.durationMs,
      })
    );

    const next = { running: false, startedAt: null, accumulatedMs: 0 };
    writeTimer(next);
    setTimer(next);

    setConfirmOpen(false);
    setPendingSave(null);
  };

  const goPrevWeek = () => dispatch(setWeekStartMs(weekStartMs - 7 * 24 * 60 * 60 * 1000));
  const goNextWeek = () => dispatch(setWeekStartMs(weekStartMs + 7 * 24 * 60 * 60 * 1000));

  const PANEL_H = 248; // Sessions list scrolls within the fixed height
  const LIST_H = 152; // List area height inside sessions card

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:h-[248px]">
<div className="relative h-full bg-[var(--panel)] border border-[var(--border)] shadow-[var(--shadow)] rounded-2xl px-5 py-4 flex flex-col justify-center overflow-hidden">
<div className="pointer-events-none absolute bottom-[5px] left-[5px] w-1/2 h-1/2 -translate-x-1/4 translate-y-1/4 rotate-45 opacity-70">
  <svg
    viewBox="0 0 24 24"
    className="w-full h-full"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M5.06152 12C5.55362 8.05369 8.92001 5 12.9996 5C17.4179 5 20.9996 8.58172 20.9996 13C20.9996 17.4183 17.4179 21 12.9996 21H8M13 13V9M11 3H15M3 15H8M5 18H10"
      stroke="var(--primary)"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
</div>
          <div className="text-center">
            <div className="text-2xl font-bold text-[var(--ink)]">Time Tracker</div>

            <div className="mt-4 text-4xl font-bold tracking-tight text-[var(--ink)]">
              {formatMs(elapsedMs)}
            </div>

            <div className="mt-5 flex items-center justify-center gap-3">
              {!timer.running ? (
<button
  onClick={onPlay}
  className="w-12 h-12 rounded-full bg-[var(--primary)] border border-black/10 hover:bg-white/80 cursor-pointer flex items-center justify-center"
  title="Play"
>
  <span className="w-5 h-5" dangerouslySetInnerHTML={{ __html: PLAY_SVG }} />
</button>
              ) : (
<button
  onClick={onPause}
  className="w-12 h-12 rounded-full bg-black/10 border border-black/10 hover:bg-black/15 cursor-pointer flex items-center justify-center"
  title="Pause"
>
  <span className="w-5 h-5" dangerouslySetInnerHTML={{ __html: PAUSE_SVG }} />
</button>

              )}
<button
  onClick={onStop}
  className="w-12 h-12 rounded-full bg-[var(--danger)] border border-black/10 hover:brightness-95 cursor-pointer flex items-center justify-center"
  title="Stop"
>
  <span className="w-5 h-5" dangerouslySetInnerHTML={{ __html: STOP_SVG }} />
</button>
            </div>
          </div>
        </div>

        {/* Sessions */}
        <div className="h-full bg-[var(--panel)] border border-[var(--border)] shadow-[var(--shadow)] rounded-2xl p-5 flex flex-col">
          {/* Header */}
          <div className="flex items-start justify-between gap-3">
            <div>
              <div className="text-sm font-semibold text-[var(--ink)]">Sessions</div>
              <div className="text-xs text-[var(--muted)] mt-1">{weekLabel(weekStartMs)}</div>
            </div>

            <button
              onClick={() => setCalendarOpen(true)}
              className="w-10 h-10 rounded-xl border border-[var(--border)] bg-[var(--panel)] hover:bg-[var(--soft)] cursor-pointer flex items-center justify-center text-[var(--ink)]"
              title="Pick week"
            >
              <span className="w-5 h-5" dangerouslySetInnerHTML={{ __html: CALENDAR_SVG }} />
            </button>
          </div>

          {/* List */}
          <div className="mt-3 pr-1 overflow-auto" style={{ height: LIST_H }}>
            {loadingShifts ? (
              <div className="text-sm text-[var(--muted)] py-6 text-center">Loading…</div>
            ) : shifts.length === 0 ? (
              <div className="text-sm text-[var(--muted)] py-6 text-center">No sessions</div>
            ) : (
              <div className="space-y-2">
                {shifts.map((s) => {
                  const st = new Date(s.startedAt);
                  const en = new Date(s.endedAt);
                  const tf = new Intl.DateTimeFormat("en-US", {
                    hour: "2-digit",
                    minute: "2-digit",
                  });

                  return (
                    <div
                      key={s.id}
                      className="rounded-xl border border-[var(--border)] bg-[var(--soft)] px-3 py-3"
                      style={{ minHeight: 64 }}
                    >
                      <div className="flex items-center justify-between gap-3">
                        <div className="text-sm font-semibold text-[var(--ink)]">
                          {formatMs(s.durationMs)}
                        </div>
                        <div className="text-xs text-[var(--muted)]">
                          {tf.format(st)} – {tf.format(en)}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Bottom arrows */}
          <div className="mt-auto pt-3 flex items-center justify-between">
            <button
              onClick={goPrevWeek}
              className="px-4 py-2 rounded-xl border border-[var(--border)] bg-[var(--panel)] hover:bg-[var(--soft)] cursor-pointer"
              title="Previous week"
            >
              {"<"}
            </button>

            <button
              onClick={goNextWeek}
              className="px-4 py-2 rounded-xl border border-[var(--border)] bg-[var(--panel)] hover:bg-[var(--soft)] cursor-pointer"
              title="Next week"
            >
              {">"}
            </button>
          </div>
        </div>
      </div>

      {confirmOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 p-4">
          <div className="w-full max-w-md rounded-2xl bg-white shadow-xl border border-black/10 p-5">
            <div className="text-lg font-semibold text-[var(--ink)]">Save session?</div>
            <div className="text-sm text-black/60 mt-2">
              Duration:{" "}
              <span className="font-semibold text-[var(--ink)]">
                {pendingSave ? formatMs(pendingSave.durationMs) : "—"}
              </span>
            </div>

<div className="mt-4 flex items-center justify-between">
  {/* Left side */}
  <button
    onClick={discardStop}
    className="px-4 py-2 rounded-xl bg-[var(--danger)] text-white hover:brightness-95 cursor-pointer font-semibold"
    title="Stop without saving"
  >
    Discard
  </button>

  {/* Right side */}
  <div className="flex gap-2">
    <button
      onClick={() => {
        setConfirmOpen(false);
        setPendingSave(null);
      }}
      className="px-4 py-2 rounded-xl border border-black/10 bg-white hover:bg-black/5 cursor-pointer font-semibold"
    >
      Cancel
    </button>

    <button
      onClick={saveStop}
      className="px-4 py-2 rounded-xl bg-[var(--primary)] hover:brightness-95 cursor-pointer font-semibold"
    >
      Save
    </button>
  </div>
</div>
          </div>
        </div>
      )}

      <CalendarModal
        open={calendarOpen}
        initialMs={weekStartMs}
        onClose={() => setCalendarOpen(false)}
        onPickWeek={(ws) => dispatch(setWeekStartMs(ws))}
      />
    </>
  );
}
