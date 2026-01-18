import { useEffect, useState } from "react";
import { subscribeAppSessions } from "../../firebase/listeners";
import { ensureFirebaseAnonAuth } from "../../firebase/webAuth";

export default function AppConversations({ app, onBack, onOpenChat }) {
  const [sessions, setSessions] = useState([]);

  useEffect(() => {
    if (!app?.apiKey) return;

    let stopped = false;
    let unsub = null;

    (async () => {
      await ensureFirebaseAnonAuth();
      if (stopped) return;

      unsub = subscribeAppSessions(app.apiKey, ({ sessions }) => {
        setSessions(sessions);
      });
    })().catch((e) => console.error("AppConversations auth/subscribe failed:", e));

    return () => {
      stopped = true;
      unsub && unsub();
    };
  }, [app?.apiKey]);

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-3">
        <button
          className="px-3 py-2 rounded-xl border border-[var(--border)] bg-[var(--panel)] text-[var(--ink)] hover:bg-[var(--soft)]"
          onClick={onBack}
        >
          ← Back
        </button>
        <div>
          <div className="text-2xl font-semibold">{app?.name}</div>
          <div className="text-sm text-zinc-500">Conversations (sessions)</div>
        </div>
      </div>

      {sessions.length === 0 ? (
        <div className="rounded-2xl border border-[var(--border)] bg-[var(--panel)] shadow-[var(--shadow)] p-6 text-[var(--muted)]">
          No conversations yet.
        </div>
      ) : (
        <div className="grid gap-2">
          {sessions.map((s) => (
            <button
              key={s.id}
              className="text-left rounded-2xl border border-[var(--border)] bg-[var(--panel)] shadow-[var(--shadow)] p-5 hover:bg-[var(--soft)] transition"
              onClick={() => onOpenChat(s)}
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <div className="font-semibold">Session: {s.id}</div>
                  <div className="mt-1 text-sm text-zinc-500">{s.platform || "Unknown platform"}</div>
                </div>

                {(s.unreadOwner || 0) > 0 ? (
                  <div className="min-w-7 h-7 px-2 rounded-full bg-[var(--primary)] text-[var(--ink)] flex items-center justify-center text-xs font-bold">
                    {s.unreadOwner}
                  </div>
                ) : (
                  <div className="min-w-7 h-7 px-2 rounded-full bg-[var(--soft)] text-[var(--muted)] border border-[var(--border)] flex items-center justify-center text-xs font-semibold">
                    0
                  </div>
                )}
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
