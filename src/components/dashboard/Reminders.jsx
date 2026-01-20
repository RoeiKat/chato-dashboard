import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  createReminderThunk,
  deleteReminderThunk,
  loadRemindersThunk,
} from "../../store/dashboardSlice";


const TRASH_SVG = `<svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
  <path d="M10 12V17" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path>
  <path d="M14 12V17" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path>
  <path d="M4 7H20" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path>
  <path d="M6 10V18C6 19.6569 7.34315 21 9 21H15C16.6569 21 18 19.6569 18 18V10" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path>
  <path d="M9 5C9 3.89543 9.89543 3 11 3H13C14.1046 3 15 3.89543 15 5V7H9V5Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path>
</svg>`;


export default function Reminders() {
  const dispatch = useDispatch();
  const token = useSelector((s) => s.auth.token);
  const reminders = useSelector((s) => s.dashboard.reminders);
  const loading = useSelector((s) => s.dashboard.loadingReminders);

  const [text, setText] = useState("");

  useEffect(() => {
    if (!token) return;
    dispatch(loadRemindersThunk({ token }));
  }, [dispatch, token]);

  const add = async () => {
    const t = text.trim();
    if (!t) return;
    await dispatch(createReminderThunk({ token, text: t }));
    setText("");
  };

  const remove = async (id) => {
    await dispatch(deleteReminderThunk({ token, id }));
  };

  const onKeyDown = (e) => {
    if (e.key === "Enter") add();
  };

  return (
    <div className="bg-[var(--panel)] border border-[var(--border)] shadow-[var(--shadow)] rounded-2xl p-5 min-h-[275px] flex flex-col">
      <div>
        <div className="text-lg font-bold text-[var(--ink)]">Reminders</div>
      </div>

      <div className="mt-3 flex gap-2">
        <input
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={onKeyDown}
          placeholder="Add a reminder…"
          className="flex-1 px-3 py-2 rounded-xl border border-[var(--border)] bg-[var(--panel)] text-[var(--ink)] outline-none focus:ring-2 focus:ring-black/10"
        />
<button
  onClick={add}
  disabled={!text.trim()}
  className="
    px-4 py-2 rounded-xl font-semibold inline-flex items-center gap-2
    bg-[var(--primary)] text-[var(--ink)]
    enabled:hover:brightness-95 enabled:cursor-pointer
    disabled:opacity-40 disabled:cursor-not-allowed
  "
  title="Add"
>
  <span className="text-lg leading-none font-extrabold">+</span>
  <span>New</span>
</button>
      </div>

      <div className="mt-3 flex-1 min-h-0 pr-1 overflow-auto">
        {loading ? (
          <div className="h-full flex items-center justify-center text-sm text-[var(--muted)]">
            Loading…
          </div>
        ) : reminders.length === 0 ? (
          <div className="mt-15 h-full flex items-center justify-center text-md text-extrabold text-[var(--muted)]">
            No reminders yet
          </div>
        ) : (
          <div className="space-y-2">
            {reminders.map((r) => (
              <div
                key={r.id}
                className="flex items-center justify-between gap-3 rounded-xl border-2 border-[var(--soft)] bg-transparent px-4 py-3"
              >
                <div className="text-base font-semibold text-[var(--ink)] whitespace-pre-wrap break-words">
                  {r.text}
                </div>
<button
  onClick={() => remove(r.id)}
  className="group shrink-0 w-9 h-9 rounded-full border border-[var(--border)] bg-transparent cursor-pointer inline-flex items-center justify-center text-[var(--muted)] hover:text-[var(--danger)] hover:border-[var(--danger)] hover:bg-[color:color-mix(in_oklab,var(--danger)_12%,transparent)]"
  title="Delete"
>
  <span
    className="w-5 h-5"
    aria-hidden="true"
    dangerouslySetInnerHTML={{ __html: TRASH_SVG }}
  />
</button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
