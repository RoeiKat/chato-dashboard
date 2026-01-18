import { useEffect, useMemo, useState } from "react";

const LS_KEY = "chato_time_tracker_v1";

function readState() {
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

function writeState(next) {
  localStorage.setItem(LS_KEY, JSON.stringify(next));
}

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

export default function TimeTracker() {
  const [store, setStore] = useState(() => readState());
  const [now, setNow] = useState(() => Date.now());

  // tick while mounted (UI refresh)
  useEffect(() => {
    const id = setInterval(() => setNow(Date.now()), 500);
    return () => clearInterval(id);
  }, []);

  // if multiple tabs/windows, keep in sync
  useEffect(() => {
    const onStorage = (e) => {
      if (e.key === LS_KEY) setStore(readState());
    };
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  const elapsedMs = useMemo(() => {
    if (!store.running || !store.startedAt) return store.accumulatedMs;
    return store.accumulatedMs + (now - store.startedAt);
  }, [store, now]);

  const toggle = () => {
    const current = readState();
    if (!current.running) {
      const next = { ...current, running: true, startedAt: Date.now() };
      writeState(next);
      setStore(next);
    } else {
      const additional = current.startedAt ? Date.now() - current.startedAt : 0;
      const next = {
        running: false,
        startedAt: null,
        accumulatedMs: current.accumulatedMs + additional,
      };
      writeState(next);
      setStore(next);
    }
  };

  const reset = () => {
    const next = { running: false, startedAt: null, accumulatedMs: 0 };
    writeState(next);
    setStore(next);
  };

  return (
    <div className="bg-[var(--panel)] border border-[var(--border)] shadow-[var(--shadow)] rounded-2xl p-5">
      <div className="text-sm font-semibold text-[var(--ink)]">Time tracker</div>
      <div className="text-xs text-[var(--muted)] mt-1">
        Frontend-only • saved locally
      </div>

      <div className="mt-4 text-4xl font-extrabold tracking-tight text-[var(--ink)]">
        {formatMs(elapsedMs)}
      </div>

      <div className="mt-4 flex gap-2">
        <button
          className="px-4 py-2 rounded-xl bg-[var(--primary)] text-[var(--ink)] font-semibold hover:brightness-95 cursor-pointer"
          onClick={toggle}
        >
          {store.running ? "Pause" : "Start"}
        </button>

        <button
          className="px-4 py-2 rounded-xl bg-[var(--panel)] border border-[var(--border)] text-[var(--ink)] font-semibold hover:bg-[var(--soft)] cursor-pointer"
          onClick={reset}
        >
          Reset
        </button>
      </div>
    </div>
  );
}
