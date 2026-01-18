import { useEffect, useMemo, useState } from "react";
import AppsGrid from "./AppsGrid";
import AppConversations from "./AppConversations";
import ChatView from "./ChatView";

function cx(...c) {
  return c.filter(Boolean).join(" ");
}

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

function Pagination({ page, totalPages, onPage }) {
  if (totalPages <= 1) return null;

  const pages = Array.from({ length: totalPages }, (_, i) => i + 1);

  return (
    <div className="w-full max-w-7xl mx-auto">
      <div className="flex items-center justify-center gap-2">
        <button
          className="px-3 py-2 rounded-xl bg-[var(--panel)] border border-[var(--border)] text-[var(--ink)] font-semibold hover:bg-[var(--soft)] disabled:opacity-50 cursor-pointer shrink-0"
          onClick={() => onPage(page - 1)}
          disabled={page <= 1}
        >
          Prev
        </button>

        {/* Keep horizontal on mobile by preventing wrap + allow scroll */}
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

export default function AppsTab({ apps, onCopy, onDelete, onCreate }) {
  const [screen, setScreen] = useState("grid"); // grid | conversations | chat
  const [activeApp, setActiveApp] = useState(null);
  const [activeSession, setActiveSession] = useState(null);

  // ✅ Pagination: 3 per page on mobile, 8 per page on desktop
  const isMobile = useIsMobile();
  const pageSize = isMobile ? 3 : 8;

  const [page, setPage] = useState(1);

  const totalPages = useMemo(() => {
    return Math.max(1, Math.ceil((apps?.length || 0) / pageSize));
  }, [apps?.length, pageSize]);

  useEffect(() => {
    // clamp page if apps count or page size changes
    setPage((p) => Math.min(Math.max(1, p), totalPages));
  }, [totalPages]);

  useEffect(() => {
    // nice UX when switching between mobile/desktop
    setPage(1);
  }, [pageSize]);

  const pagedApps = useMemo(() => {
    const start = (page - 1) * pageSize;
    return (apps || []).slice(start, start + pageSize);
  }, [apps, page, pageSize]);

  if (screen === "grid") {
    return (
      <div className="min-h-[calc(100vh-96px)] flex flex-col">
        <div className="flex items-end justify-between gap-3">
          <div>
            <div className="text-2xl font-semibold text-[var(--ink)]">Apps</div>
            <div className="text-sm text-[var(--muted)]">
              API keys & notification counters
            </div>
          </div>

          <button
            className="px-4 py-2 rounded-xl bg-[var(--primary)] text-[var(--ink)] font-semibold shadow-sm hover:brightness-95 cursor-pointer"
            onClick={onCreate}
          >
            + Create App
          </button>
        </div>

        <div className="mt-5">
          {apps.length === 0 ? (
            <div className="rounded-2xl border border-[var(--border)] bg-[var(--panel)] shadow-[var(--shadow)] p-6 text-[var(--muted)]">
              No apps yet. Create one to generate your first API key.
            </div>
          ) : (
            <AppsGrid
              apps={pagedApps}
              onCopy={onCopy}
              onDelete={onDelete}
              onOpenApp={(app) => {
                setActiveApp(app);
                setScreen("conversations");
              }}
            />
          )}
        </div>

        {/* Sticky footer pagination */}
        <div className="mt-auto">
          <div className="sticky bottom-0 bg-[var(--bg)] pt-4 pb-2">
            <Pagination page={page} totalPages={totalPages} onPage={setPage} />
          </div>
        </div>
      </div>
    );
  }

  if (screen === "conversations") {
    return (
      <AppConversations
        app={activeApp}
        onBack={() => {
          setActiveApp(null);
          setScreen("grid");
        }}
        onOpenChat={(session) => {
          setActiveSession(session);
          setScreen("chat");
        }}
      />
    );
  }

  return (
    <ChatView
      app={activeApp}
      session={activeSession}
      onBack={() => {
        setActiveSession(null);
        setScreen("conversations");
      }}
    />
  );
}
