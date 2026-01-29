import { onValue, ref } from "firebase/database";
import { rtdb } from "./firebase";

const CUSTOMER_LEFT_TEXT = "Customer left the conversation";

function getLastMessageText(session) {
  if (typeof session?.lastMessageText === "string") return session.lastMessageText;
  if (typeof session?.lastText === "string") return session.lastText;
  if (typeof session?.lastMessage === "string") return session.lastMessage;
  if (typeof session?.lastMessage?.text === "string") return session.lastMessage.text;
  if (typeof session?.lastMsg?.text === "string") return session.lastMsg.text;
  return "";
}

// sessions/{apiKey} + messages/{apiKey}
export function subscribeAppSessions(apiKey, cb) {
  const sessionsRef = ref(rtdb, `sessions/${apiKey}`);
  const messagesRootRef = ref(rtdb, `messages/${apiKey}`);

  let latestSessions = [];
  let latestMessagesByDay = [0, 0, 0, 0, 0, 0, 0];

  // Debounced emit to prevent rapid UI updates (jitter)
  let emitTimer = null;
  let lastSig = "";

  function emitDebounced() {
    if (emitTimer) return;

    emitTimer = setTimeout(() => {
      emitTimer = null;

      const sessions = latestSessions;

      const unread = sessions.reduce((sum, s) => sum + (s.unreadOwner || 0), 0);
      const sessionsCount = sessions.length;

      // Active = last message text is NOT "Customer left the conversation"
      const activeCount = sessions.filter((s) => {
        const lastText = getLastMessageText(s);

        if (lastText) return lastText !== CUSTOMER_LEFT_TEXT;

        // Fallback if session object doesn't store last message text
        return (s.status || "open") === "open";
      }).length;

      // Skip redundant payloads (reduces dispatch spam)
      const sig = JSON.stringify({
        unread,
        sessionsCount,
        activeCount,
        messagesByDay: latestMessagesByDay,
        sessionIds: sessions.map((s) => s.id),
      });

      if (sig === lastSig) return;
      lastSig = sig;

      cb({
        sessions,
        unread,
        sessionsCount,
        activeCount,
        messagesByDay: latestMessagesByDay,
      });
    }, 80);
  }

  // 1) Sessions listener
  const unsubSessions = onValue(
    sessionsRef,
    (snap) => {
      const sessionsObj = snap.val() || {};
      const sessions = Object.entries(sessionsObj).map(([id, s]) => ({ id, ...(s || {}) }));

      // newest first
      sessions.sort((a, b) => (b.updatedAt || 0) - (a.updatedAt || 0));

      latestSessions = sessions;
      emitDebounced();
    },
    (err) => {
      console.error("[RTDB] subscribeAppSessions(sessions) failed:", err?.code, err?.message, {
        apiKey,
      });
      latestSessions = [];
      emitDebounced();
    }
  );

  // Messages listener (aggregate last 7 days)
  const unsubMessages = onValue(
    messagesRootRef,
    (snap) => {
      const all = snap.val() || {};

      // Start = 00:00 (today - 6 days)
      const now = new Date();
      const start = new Date(now);
      start.setHours(0, 0, 0, 0);
      start.setDate(start.getDate() - 6);

      const startMs = start.getTime();
      const dayMs = 24 * 60 * 60 * 1000;

      const buckets = [0, 0, 0, 0, 0, 0, 0];

      // All: { sessionId: { messageId: { at, ... } } }
      for (const sessionId of Object.keys(all)) {
        const msgsObj = all[sessionId] || {};
        for (const msgId of Object.keys(msgsObj)) {
          const m = msgsObj[msgId];
          const at = typeof m?.at === "number" ? m.at : null; // your messages use `at`
          if (!at) continue;
          if (at < startMs) continue;

          const idx = Math.floor((at - startMs) / dayMs);
          if (idx >= 0 && idx < 7) buckets[idx] += 1;
        }
      }

      latestMessagesByDay = buckets;
      emitDebounced();
    },
    (err) => {
      console.error("[RTDB] subscribeAppSessions(messages) failed:", err?.code, err?.message, {
        apiKey,
      });
      latestMessagesByDay = [0, 0, 0, 0, 0, 0, 0];
      emitDebounced();
    }
  );

  return () => {
    unsubSessions();
    unsubMessages();
  };
}

// messages/{apiKey}/{sessionId}
export function subscribeSessionMessages(apiKey, sessionId, cb) {
  const msgsRef = ref(rtdb, `messages/${apiKey}/${sessionId}`);

  const unsub = onValue(
    msgsRef,
    (snap) => {
      const obj = snap.val() || {};
      const messages = Object.entries(obj).map(([id, m]) => ({ id, ...(m || {}) }));
      messages.sort((a, b) => (a.at || 0) - (b.at || 0));
      cb(messages);
    },
    (err) => {
      console.error("[RTDB] subscribeSessionMessages failed:", err?.code, err?.message, {
        apiKey,
        sessionId,
      });
      cb([]);
    }
  );

  return () => unsub();
}
