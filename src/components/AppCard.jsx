import { useState } from "react";

const EyeOpenIcon = ({ className }) => (
  <svg
    width="20"
    height="20"
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
  >
    <path
      d="M1.5 12S5.5 5 12 5s10.5 7 10.5 7-4 7-10.5 7S1.5 12 1.5 12Z"
      stroke="currentColor"
      strokeWidth="1.5"
    />
    <circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="1.5" />
  </svg>
);

const EyeClosedIcon = ({ className }) => (
  <svg
    width="20"
    height="20"
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
  >
    <path d="M3 3L21 21" stroke="currentColor" strokeWidth="1.5" />
    <path
      d="M10.6 5.2A9.3 9.3 0 0 1 12 5c6.5 0 10.5 7 10.5 7a18.3 18.3 0 0 1-4.3 5.1"
      stroke="currentColor"
      strokeWidth="1.5"
    />
    <path
      d="M6.6 6.6C3.8 8.6 1.5 12 1.5 12S5.5 19 12 19c1.1 0 2.1-.2 3-.5"
      stroke="currentColor"
      strokeWidth="1.5"
    />
  </svg>
);

function XIcon({ className = "w-4 h-4" }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M6 6l12 12M18 6 6 18"
        stroke="currentColor"
        strokeWidth="2.2"
        strokeLinecap="round"
      />
    </svg>
  );
}

function unreadLabel(n) {
  if (!n || n <= 0) return "0";
  if (n > 9) return "9+";
  return String(n);
}

function maskKey(key) {
  if (!key) return "";
  if (key.length <= 10) return "•".repeat(key.length);
  const start = key.slice(0, 6);
  const end = key.slice(-4);
  return `${start}••••••••••${end}`;
}

export default function AppCard({ app, onCopy, onDelete, onViewChats }) {
  const [showKey, setShowKey] = useState(false);

  const unread = app?.unread || 0;
  const pillText = `Unread: ${unreadLabel(unread)}`;

  const pillClass =
    unread > 0
      ? "bg-[var(--danger)] text-white"
      : "bg-[var(--soft)] text-[var(--muted)] border border-[var(--border)]";

  return (
    <div className="w-full max-w-[340px] bg-[var(--panel)] border border-[var(--border)] shadow-[var(--shadow)] rounded-2xl overflow-hidden">
      {/* Primary header */}
      <div className="bg-[var(--primary)] px-4 py-4">
        <div className="flex items-center justify-between gap-3">
          {/* X */}
          <button
            type="button"
            className="w-9 h-9 rounded-full bg-[var(--danger)] text-white flex items-center justify-center shadow-sm hover:brightness-95 cursor-pointer"
            title="Delete app"
            onClick={(e) => {
              e.stopPropagation();
              onDelete(app);
            }}
          >
            <XIcon />
          </button>

          {/* Title */}
          <div className="min-w-0 flex-1 text-center">
            <div className="text-base font-bold text-[var(--ink)] truncate">
              {app?.name || "App"}
            </div>
          </div>

          {/* Unread pill aligned with title row */}
          <div
            className={[
              "h-9 px-3 rounded-full inline-flex items-center justify-center text-sm font-bold whitespace-nowrap",
              pillClass,
            ].join(" ")}
            title={`Unread: ${unread}`}
          >
            {pillText}
          </div>
        </div>
      </div>

      {/* Body (taller card) */}
      <div className="px-4 pt-5 pb-5 min-h-[260px] flex flex-col">
        <div className="flex items-center justify-between gap-2">
          <div className="text-xs font-semibold text-[var(--muted)]">API Key</div>

          <button
            type="button"
            className="inline-flex items-center gap-2 text-[var(--ink)] hover:opacity-80 cursor-pointer"
            onClick={() => setShowKey((s) => !s)}
            title={showKey ? "Hide API key" : "Show API key"}
          >
            {showKey ? (
              <EyeClosedIcon className="text-[var(--ink)]" />
            ) : (
              <EyeOpenIcon className="text-[var(--ink)]" />
            )}
          </button>
        </div>

        <div className="mt-2 text-sm text-[var(--ink)] font-medium break-all">
          {showKey ? app.apiKey : maskKey(app.apiKey)}
        </div>

        {/* Bottom actions */}
        <div className="mt-auto pt-6 flex items-center justify-between gap-2">
          <button
            type="button"
            className="px-4 py-2 rounded-xl bg-[var(--soft)] border border-[var(--border)] text-[var(--ink)] text-sm font-semibold hover:bg-white cursor-pointer"
            onClick={(e) => {
              e.stopPropagation();
              onCopy(app.apiKey);
            }}
          >
            Copy
          </button>

          <button
            type="button"
            className="px-4 py-2 rounded-xl bg-[var(--primary)] text-[var(--ink)] text-sm font-semibold shadow-sm hover:brightness-95 cursor-pointer"
            onClick={(e) => {
              e.stopPropagation();
              onViewChats?.();
            }}
          >
            View Chats
          </button>
        </div>
      </div>
    </div>
  );
}
