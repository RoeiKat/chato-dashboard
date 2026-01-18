import { useEffect, useRef, useState } from "react";
import { subscribeSessionMessages } from "../../firebase/listeners";
import { http } from "../../api/http";
import { useSelector } from "react-redux";

function cx(...c) {
  return c.filter(Boolean).join(" ");
}

export default function ChatView({ app, session, onBack }) {
  const token = useSelector((s) => s.auth?.token);

  const apiKey = app?.apiKey;
  const sessionId = session?.id;

  const [messages, setMessages] = useState([]);
  const [text, setText] = useState("");

  const bottomRef = useRef(null);

  // Realtime messages
  useEffect(() => {
    if (!apiKey || !sessionId) return;

    setMessages([]);

    const unsub = subscribeSessionMessages(apiKey, sessionId, (msgs) => {
      setMessages(msgs);
      // scroll to bottom after paint
      setTimeout(() => bottomRef.current?.scrollIntoView({ behavior: "smooth" }), 0);
    });

    return () => unsub && unsub();
  }, [apiKey, sessionId]);

  // Mark read on open
  useEffect(() => {
    if (!apiKey || !sessionId || !token) return;
    http("/dashboard/session/read", {
      method: "POST",
      token,
      body: { apiKey, sessionId },
    }).catch(() => {});
  }, [apiKey, sessionId, token]);

  const send = async () => {
    const msg = text.trim();
    if (!msg || !apiKey || !sessionId) return;

    setText("");

    // optimistic UI
    setMessages((prev) => [
      ...prev,
      { id: crypto.randomUUID(), from: "owner", text: msg, at: Date.now() },
    ]);

    await http("/dashboard/message", {
      method: "POST",
      token,
      body: { apiKey, sessionId, text: msg },
    });
  };

  return (
    <div className="h-[calc(100vh-48px)] flex flex-col">
      {/* Header */}
      <div className="flex items-center gap-3 mb-4">
        <button
          className="px-3 py-2 rounded-xl border border-[var(--border)] bg-[var(--panel)] text-[var(--ink)] hover:bg-[var(--soft)]"
          onClick={onBack}
        >
          ← Back
        </button>

        <div className="min-w-0">
          <div className="text-lg font-semibold text-[var(--ink)] truncate">
            {app?.name || "App"}
          </div>
          <div className="text-xs text-[var(--muted)] truncate">
            Session: {sessionId || "—"}
          </div>
        </div>
      </div>

      {/* Chat panel */}
      <div className="flex-1 rounded-2xl border border-[var(--border)] bg-[var(--panel)] shadow-[var(--shadow)] overflow-hidden flex flex-col">
        <div className="flex-1 p-5 overflow-y-auto space-y-3">
          {messages.map((m) => {
            const ts = m.at || m.ts || Date.now();
            return (
              <div
                key={m.id}
                className={cx(
                  "max-w-[78%] rounded-2xl px-4 py-3 border",
                  m.from === "owner"
                    ? "ml-auto bg-[var(--primary)] text-[var(--ink)] border-transparent"
                    : "mr-auto bg-[var(--soft)] text-[var(--ink)] border-[var(--border)]"
                )}
              >
                <div className="text-sm leading-relaxed">{m.text}</div>
                <div className="mt-1 text-[11px] text-[var(--muted)]">
                  {new Date(ts).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                </div>
              </div>
            );
          })}
          <div ref={bottomRef} />
        </div>

        {/* Composer */}
        <div className="border-t border-[var(--border)] p-4 flex gap-2">
          <input
            className="flex-1 px-4 py-3 rounded-xl bg-[var(--soft)] border border-[var(--border)] outline-none focus:ring-2 focus:ring-[var(--primary)] text-sm text-[var(--ink)] placeholder:text-[var(--muted)]"
            placeholder="Type a message…"
            value={text}
            onChange={(e) => setText(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                send();
              }
            }}
          />
          <button
            className="px-5 py-3 rounded-xl bg-[var(--primary)] text-[var(--ink)] font-semibold shadow-sm hover:brightness-95"
            onClick={send}
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
}
