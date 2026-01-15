import { onValue, ref } from "firebase/database";
import { rtdb } from "./firebase";

export function subscribeAppSessions(apiKey, cb) {
  const sessionsRef = ref(rtdb, `sessions/${apiKey}`);
  const unsub = onValue(sessionsRef, (snap) => {
    const sessionsObj = snap.val() || {};
    const sessions = Object.entries(sessionsObj).map(([id, s]) => ({ id, ...s }));

    const unread = sessions.reduce((sum, s) => sum + (s.unreadOwner || 0), 0);

    cb({ sessions, unread });
  });

  return () => unsub();
}
