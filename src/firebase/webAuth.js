import { signInAnonymously, onAuthStateChanged, signOut } from "firebase/auth";
import { firebaseAuth } from "./firebase";

let bootPromise = null;

// Ensures we have a Firebase user (anonymous)
export function ensureFirebaseAnonAuth() {
  if (firebaseAuth.currentUser) return Promise.resolve(firebaseAuth.currentUser);

  if (bootPromise) return bootPromise;

  bootPromise = signInAnonymously(firebaseAuth)
    .then((cred) => cred.user)
    .finally(() => {
      bootPromise = null;
    });

  return bootPromise;
}

// Resolves when firebaseAuth.currentUser becomes non-null
export function waitForFirebaseAuthReady() {
  if (firebaseAuth.currentUser) return Promise.resolve(firebaseAuth.currentUser);

  return new Promise((resolve) => {
    const unsub = onAuthStateChanged(firebaseAuth, (user) => {
      if (user) {
        unsub();
        resolve(user);
      }
    });
  });
}

// Used on logout
export async function signOutFirebase() {
  if (!firebaseAuth.currentUser) return;
  await signOut(firebaseAuth);
}
