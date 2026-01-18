import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import { ensureFirebaseAnonAuth } from "../firebase/webAuth";

function SpinnerScreen() {
  return (
    <div className="min-h-screen grid place-items-center bg-white overflow-hidden">
      <div className="flex flex-col items-center gap-4">
        <div className="h-24 w-24 rounded-full border-[14px] border-zinc-200 border-t-[#FFE95C] animate-spin" />
        <div className="text-sm text-zinc-600">Loading…</div>
      </div>
    </div>
  );
}

export default function AuthGuard() {
  const token = useSelector((s) => s.auth.token);
  const location = useLocation();
  const navigate = useNavigate();

  const [ready, setReady] = useState(false);

  useEffect(() => {
    let cancelled = false;

    async function boot() {
      if (!token) {
        if (!cancelled) setReady(true);
        return;
      }

      try {
        // ✅ wait for Firebase auth so RTDB rules pass
        await ensureFirebaseAnonAuth();
      } catch (e) {
        console.error("Firebase anon auth failed:", e);
      }

      if (cancelled) return;

      setReady(true);

      // if user is logged in and currently on /auth, redirect to dashboard
      if (location.pathname.startsWith("/auth")) {
        navigate("/dashboard", { replace: true });
      }
    }

    setReady(false);
    boot();

    return () => {
      cancelled = true;
    };
  }, [token, location.pathname, navigate]);

  if (!token) return <Outlet />;

  if (!ready) return <SpinnerScreen />;

  return <Outlet />;
}
