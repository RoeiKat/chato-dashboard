import { onValue, ref } from "firebase/database";
import { rtdb } from "./firebase";

// sessions/{apiKey}
export function subscribeAppSessions(apiKey, cb) {
  const sessionsRef = ref(rtdb, `sessions/${apiKey}`);

  const unsub = onValue(
    sessionsRef,
    (snap) => {
      const sessionsObj = snap.val() || {};
      const sessions = Object.entries(sessionsObj).map(([id, s]) => ({ id, ...s }));

      // newest first
      sessions.sort((a, b) => (b.updatedAt || 0) - (a.updatedAt || 0));

      const unread = sessions.reduce((sum, s) => sum + (s.unreadOwner || 0), 0);
      const sessionsCount = sessions.length;
      const activeCount = sessions.filter((s) => (s.status || "open") === "open").length;

      cb({ sessions, unread, sessionsCount, activeCount });
    },
    (err) => {
      console.error("[RTDB] subscribeAppSessions failed:", err?.code, err?.message, { apiKey });
      cb({ sessions: [], unread: 0, sessionsCount: 0, activeCount: 0 });
    }
  );

  return () => unsub();
}

// messages/{apiKey}/{sessionId}
export function subscribeSessionMessages(apiKey, sessionId, cb) {
  const msgsRef = ref(rtdb, `messages/${apiKey}/${sessionId}`);

  const unsub = onValue(
    msgsRef,
    (snap) => {
      const obj = snap.val() || {};
      const messages = Object.entries(obj).map(([id, m]) => ({ id, ...m }));
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
