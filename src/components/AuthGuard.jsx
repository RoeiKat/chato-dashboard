import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Outlet, useLocation, useNavigate } from "react-router-dom";

function SpinnerScreen() {
  return (
    <div className="min-h-screen grid place-items-center bg-white overflow-hidden">
      <div className="animate-[spinnerFade_3000ms_ease-in-out_forwards] flex flex-col items-center gap-4">
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

  const [showSpinner, setShowSpinner] = useState(false);

  useEffect(() => {
    if (!token) return;

    if (location.pathname.startsWith("/auth")) {
      setShowSpinner(true);

      const t = setTimeout(() => {
        navigate("/dashboard", { replace: true });
      }, 3000);

      return () => clearTimeout(t);
    }
  }, [token, location.pathname, navigate]);

  if (!token) return <Outlet />;

  if (showSpinner) return <SpinnerScreen />;

  return null;
}
