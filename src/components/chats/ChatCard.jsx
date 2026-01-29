import { useEffect, useMemo, useState } from "react";
import { ensureFirebaseAnonAuth } from "../../firebase/webAuth";
import { subscribeAppSessions} from "../../firebase/listeners"

function unreadLabel(n) {
  if (!n || n <= 0) return "0";
  if (n > 99) return "99+";
  return String(n);
}

function truncate(text, max = 10) {
  if (!text) return "";
  return text.length > max ? text.slice(0, max) + "..." : text;
}

function formatLastMessage(ts) {
  if (!ts) return "Last updated: Unknown";

  const now = new Date();
  const d = new Date(ts);

  const startToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const startThat = new Date(d.getFullYear(), d.getMonth(), d.getDate());
  const diffDays = Math.round((startToday - startThat) / (1000 * 60 * 60 * 24));

  if (diffDays === 0) return "Last updated: Today";
  if (diffDays === 1) return "Last updated: 1 Day ago";
  if (diffDays > 1 && diffDays < 7) return `Last updated: ${diffDays} days ago`;

  const dd = String(d.getDate()).padStart(2, "0");
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  return `Last updated: ${dd}/${mm}`;
}

export default function ChatCard({ app, onOpen }) {
  const [stats, setStats] = useState({
    unread: 0,
    sessionsCount: 0,
    lastMessage: "",
    lastMessageAt: 0,
  });

  useEffect(() => {
    let stop = false;
    let unsub = null;

    (async () => {
      await ensureFirebaseAnonAuth();

      if (stop) return;

      unsub = subscribeAppSessions(app.apiKey, ({ sessions, unread, sessionsCount }) => {
        const newest = sessions?.[0];
        setStats({
          unread: unread || 0,
          sessionsCount: sessionsCount || 0,
          lastMessage: newest?.lastMessage || "",
          lastMessageAt: newest?.lastMessageAt || newest?.updatedAt || 0,
        });
      });
    })();

    return () => {
      stop = true;
      unsub?.();
    };
  }, [app.apiKey]);

  const unread = stats.unread;
  const totalConvos = stats.sessionsCount;
  const lastText = truncate((stats.lastMessage || "").trim(), 30);
  const timeLabel = useMemo(() => formatLastMessage(stats.lastMessageAt), [stats.lastMessageAt]);

  return (
    <div className="w-full max-w-[360px]">
      <div className="relative">
        {/* Outer layer */}
        <div
          className="absolute inset-0 rounded-[26px] translate-y-2 translate-x-2"
          style={{ background: "var(--primary)" }}
        />

        {/* Inner card */}
        <div className="relative rounded-[26px] border border-[var(--border)] bg-white shadow-[var(--shadow)] p-5">
          {/* Top row */}
          <div className="flex items-center justify-between gap-3">
            <div className="min-w-0">
              <div className="text-sm font-semibold text-[var(--ink)] truncate">
                {app?.name || "App"}
              </div>
              <div className="text-xs text-[var(--muted)] mt-0.5">{timeLabel}</div>
            </div>

            <div
              className={[
                "h-9 px-3 rounded-full inline-flex items-center justify-center text-sm font-bold whitespace-nowrap",
                unread > 0
                  ? "bg-[var(--danger)] text-white"
                  : "bg-[var(--soft)] text-[var(--muted)] border border-[var(--border)]",
              ].join(" ")}
              title={`Unread: ${unread}`}
            >
              Unread: {unreadLabel(unread)}
            </div>
          </div>

          {/* Middle */}
          <div className="mt-4">
            <div className="text-2xl font-extrabold tracking-tight text-[var(--ink)]">
              {totalConvos}
              <span className="ml-2 text-base font-semibold text-[var(--muted)]">
                conversations
              </span>
            </div>

            <div className="mt-2 text-sm text-[var(--muted)] line-clamp-2">
              Last message: {lastText ? `“${lastText}”` : "“No messages yet.”"}
            </div>
          </div>

          <div className="mt-5 flex items-center justify-end">
            <button
              type="button"
              className="px-4 py-2 rounded-full bg-[var(--primary)] text-[var(--ink)] text-sm font-semibold shadow-sm hover:brightness-95 cursor-pointer"
              onClick={() => onOpen?.(app)}
            >
              See chats
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
