import { useEffect, useMemo, useRef, useState } from "react";
import { ensureFirebaseAnonAuth } from "../../firebase/webAuth";
import { subscribeAppSessions } from "../../firebase/listeners";
import { onValue, ref, off } from "firebase/database";
import { rtdb } from "../../firebase/firebase";

function useIsMobile() {
  const [isMobile, setIsMobile] = useState(() => {
    if (typeof window === "undefined") return false;
    return window.matchMedia("(max-width: 640px)").matches;
  });

  useEffect(() => {
    const mq = window.matchMedia("(max-width: 640px)");
    const handler = (e) => setIsMobile(e.matches);
    handler(mq);
    mq.addEventListener?.("change", handler);
    return () => mq.removeEventListener?.("change", handler);
  }, []);

  return isMobile;
}

function cx(...c) {
  return c.filter(Boolean).join(" ");
}

function Pagination({ page, totalPages, onPage }) {
  if (totalPages <= 1) return null;
  const pages = Array.from({ length: totalPages }, (_, i) => i + 1);

  return (
    <div className="w-full">
      <div className="flex items-center justify-center gap-2">
        <button
          className="px-3 py-2 rounded-xl bg-[var(--panel)] border border-[var(--border)] text-[var(--ink)] font-semibold hover:bg-[var(--soft)] disabled:opacity-50 cursor-pointer shrink-0"
          onClick={() => onPage(page - 1)}
          disabled={page <= 1}
        >
          Prev
        </button>

        <div className="flex items-center gap-2 flex-nowrap overflow-x-auto max-w-[70vw] sm:max-w-none py-1">
          {pages.map((p) => (
            <button
              key={p}
              className={cx(
                "w-10 h-10 rounded-xl border font-semibold cursor-pointer shrink-0",
                p === page
                  ? "bg-[var(--primary)] border-transparent text-[var(--ink)] shadow-sm"
                  : "bg-[var(--panel)] border-[var(--border)] text-[var(--ink)] hover:bg-[var(--soft)]"
              )}
              onClick={() => onPage(p)}
            >
              {p}
            </button>
          ))}
        </div>

        <button
          className="px-3 py-2 rounded-xl bg-[var(--panel)] border border-[var(--border)] text-[var(--ink)] font-semibold hover:bg-[var(--soft)] disabled:opacity-50 cursor-pointer shrink-0"
          onClick={() => onPage(page + 1)}
          disabled={page >= totalPages}
        >
          Next
        </button>
      </div>
    </div>
  );
}

function shortId(id = "") {
  if (id.length <= 18) return id;
  return `${id.slice(0, 8)}…${id.slice(-6)}`;
}

function formatLastMessageAt(ts) {
  if (!ts) return "Unknown";

  const now = new Date();
  const d = new Date(ts);

  const startToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const startThat = new Date(d.getFullYear(), d.getMonth(), d.getDate());
  const diffDays = Math.round((startToday - startThat) / (1000 * 60 * 60 * 24));

  if (diffDays === 0) {
    // show time HH:MM
    const hh = String(d.getHours()).padStart(2, "0");
    const mm = String(d.getMinutes()).padStart(2, "0");
    return `${hh}:${mm}`;
  }
  if (diffDays === 1) return "Yesterday";

  const dd = String(d.getDate()).padStart(2, "0");
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const yy = String(d.getFullYear()).slice(-2);
  return `${dd}/${mm}/${yy}`;
}

/**
 * Reads messages for a session and extracts:
 * - first 2 messages (chronological)
 * - last message (chronological)
 */
function subscribeSessionMessages(apiKey, sessionId, cb) {
  const r = ref(rtdb, `messages/${apiKey}/${sessionId}`);
  const handler = (snap) => {
    const obj = snap.val() || {};
    // obj is keyed by push ids
    const items = Object.entries(obj)
      .map(([id, m]) => ({ id, ...m }))
      .sort((a, b) => Number(a.createdAt || a.at || 0) - Number(b.createdAt || b.at || 0));

    const msg1 = items?.[1]?.text || items?.[1]?.message || "";
    const msg2 = items?.[3]?.text || items?.[3]?.message || "";

    const last = items?.[items.length - 1];
    const lastText = last?.text || last?.message || "";

    cb({
      msg1,
      msg2,
      lastText,
    });
  };

  onValue(r, handler);
  return () => off(r, "value", handler);
}

export default function AppConversations({ app, onBack, onOpenChat }) {
  const [sessions, setSessions] = useState([]);
  const [unreadTotal, setUnreadTotal] = useState(0);

  // pagination requirements
  const isMobile = useIsMobile();
  const pageSize = isMobile ? 5 : 6;
  const [page, setPage] = useState(1);

  // per-session messages preview cache
  const [previews, setPreviews] = useState({}); // sessionId -> {msg1,msg2,lastText}
  const previewUnsubs = useRef({}); // sessionId -> unsub

  useEffect(() => {
    let stop = false;
    let unsub = null;

    (async () => {
      await ensureFirebaseAnonAuth();
      if (stop) return;

      unsub = subscribeAppSessions(app.apiKey, ({ sessions, unread }) => {
        setSessions(sessions || []);
        setUnreadTotal(unread || 0);
      });
    })();

    return () => {
      stop = true;
      unsub?.();
      // cleanup message preview listeners
      Object.values(previewUnsubs.current).forEach((fn) => fn?.());
      previewUnsubs.current = {};
    };
  }, [app.apiKey]);

  const totalPages = useMemo(() => {
    return Math.max(1, Math.ceil((sessions?.length || 0) / pageSize));
  }, [sessions?.length, pageSize]);

  useEffect(() => {
    setPage((p) => Math.min(Math.max(1, p), totalPages));
  }, [totalPages]);

  useEffect(() => {
    setPage(1);
  }, [pageSize]);

  const pagedSessions = useMemo(() => {
    const start = (page - 1) * pageSize;
    return (sessions || []).slice(start, start + pageSize);
  }, [sessions, page, pageSize]);

  // Subscribe message previews only for sessions visible on the current page
  useEffect(() => {
    if (!app?.apiKey) return;

    const visibleIds = new Set(
      pagedSessions.map((s) => s.sessionId || s.id).filter(Boolean)
    );

    // Remove listeners that are no longer visible
    for (const [sid, unsub] of Object.entries(previewUnsubs.current)) {
      if (!visibleIds.has(sid)) {
        unsub?.();
        delete previewUnsubs.current[sid];
      }
    }

    // Add listeners for newly visible
    for (const s of pagedSessions) {
      const sid = s.sessionId || s.id;
      if (!sid) continue;
      if (previewUnsubs.current[sid]) continue;

      previewUnsubs.current[sid] = subscribeSessionMessages(app.apiKey, sid, (data) => {
        setPreviews((prev) => ({ ...prev, [sid]: data }));
      });
    }
  }, [app?.apiKey, pagedSessions]);

  return (
    <div className="min-h-[calc(100vh-96px)] flex flex-col">
      {/* Header */}
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-start gap-3">
          <button
            className="px-3 py-2 rounded-xl border border-[var(--border)] bg-[var(--panel)] text-[var(--ink)] hover:bg-[var(--soft)] cursor-pointer"
            onClick={onBack}
          >
            ← Back
          </button>

          <div>
            <div className="text-2xl font-semibold text-[var(--ink)]">
              {app?.name || "App"}
            </div>
            <div className="text-sm text-[var(--muted)]">
              Sessions (Chats) • Total unread: {unreadTotal}
            </div>
          </div>
        </div>
      </div>

      {/* List */}
      <div className="mt-5 space-y-3">
        {pagedSessions.length === 0 ? (
          <div className="rounded-2xl border border-[var(--border)] bg-[var(--panel)] shadow-[var(--shadow)] p-6 text-[var(--muted)]">
            No conversations yet.
          </div>
        ) : (
          pagedSessions.map((s) => {
            const sid = s.sessionId || s.id || "";
            const p = previews[sid] || {};
            const msg1 = (p.msg1 || "").trim();
            const msg2 = (p.msg2 || "").trim();
            const lastMsg = (s.lastMessage || p.lastText || "").trim();
            const lastAt = s.lastMessageAt || s.updatedAt || 0;

            return (
              <button
                key={sid}
                type="button"
                className="w-full rounded-2xl border border-[var(--border)] bg-white shadow-[var(--shadow)] p-5 flex items-center justify-between gap-4 hover:bg-[var(--soft)] cursor-pointer"
                onClick={() => onOpenChat?.(s)}
              >
                <div className="min-w-0 flex-1 text-left">
                  {/* Session id */}
                  <div className="text-sm font-semibold text-[var(--ink)] truncate">
                    Session: {shortId(sid)}
                  </div>

                  {/* First 2 messages */}
                  <div className="text-xs text-[var(--muted)] mt-2 truncate">
                    {msg1 || msg2 ? (
                      <>
                        {msg1 || "—"} <span className="mx-1">|</span> {msg2 || "—"}
                      </>
                    ) : (
                      "— | —"
                    )}
                  </div>

                  {/* Last message line */}
                  <div className="text-xs text-[var(--muted)] mt-2 truncate">
                    <span className="font-semibold text-[var(--ink)]">
                      Last message at {formatLastMessageAt(lastAt)}:
                    </span>{" "}
                    {lastMsg ? `“${lastMsg}”` : "“No messages yet.”"}
                  </div>
                </div>

                {/* Unread pill (danger, with label) */}
<div
  className={[
    "shrink-0 h-10 px-3 rounded-full flex items-center justify-center text-sm font-bold",
    (s.unreadOwner || 0) > 0
      ? "text-white"
      : "text-[var(--muted)] border border-[var(--border)]",
  ].join(" ")}
  style={{
    background:
      (s.unreadOwner || 0) > 0 ? "var(--danger)" : "var(--soft)",
  }}
  title={`Unread: ${s.unreadOwner || 0}`}
>
  Unread: {s.unreadOwner || 0}
</div>

              </button>
            );
          })
        )}
      </div>

      {/* Sticky pagination */}
      <div className="mt-auto">
        <div className="sticky bottom-0 bg-[var(--bg)] pt-4 pb-2">
          <Pagination page={page} totalPages={totalPages} onPage={setPage} />
        </div>
      </div>
    </div>
  );
}
