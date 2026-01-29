import { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { loginThunk, registerThunk } from "../store/authSlice";
import WelcomeIllustration from "../assets/illustrations/welcome_illustration.svg";


const EyeOpenIcon = ({ className }) => (
  <svg
    width="20"
    height="20"
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
  >
    <path
      d="M1.5 12S5.5 5 12 5s10.5 7 10.5 7-4 7-10.5 7S1.5 12 1.5 12Z"
      stroke="currentColor"
      strokeWidth="1.5"
    />
    <circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="1.5" />
  </svg>
);

const EyeClosedIcon = ({ className }) => (
  <svg
    width="20"
    height="20"
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
  >
    <path d="M3 3L21 21" stroke="currentColor" strokeWidth="1.5" />
    <path
      d="M10.6 5.2A9.3 9.3 0 0 1 12 5c6.5 0 10.5 7 10.5 7a18.3 18.3 0 0 1-4.3 5.1"
      stroke="currentColor"
      strokeWidth="1.5"
    />
    <path
      d="M6.6 6.6C3.8 8.6 1.5 12 1.5 12S5.5 19 12 19c1.1 0 2.1-.2 3-.5"
      stroke="currentColor"
      strokeWidth="1.5"
    />
  </svg>
);

export default function AuthPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const auth = useSelector((s) => s.auth);
  const { status, error } = auth;

  const [mode, setMode] = useState("login"); // "login" | "register"
  const isLogin = mode === "login";

  const [hideError, setHideError] = useState(false);

  useEffect(() => {
    if (error) setHideError(false);
  }, [error]);



  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [showPassword, setShowPassword] = useState(false);

  // Error -> mark fields red until edited
  const [touchedError, setTouchedError] = useState({ email: false, password: false });

  const [didSpinOnce, setDidSpinOnce] = useState(false);

  // Password hint
  const [showPwHint, setShowPwHint] = useState(false);

  // Fullscreen spinner transition after success
  const [showSuccessSpinner, setShowSuccessSpinner] = useState(false);

  const title = useMemo(() => (isLogin ? "Welcome back!" : "Create new Account"), [isLogin]);
  const subtitle = useMemo(
    () => (isLogin ? "Login to your dashboard." : "Start for free and create your account."),
    [isLogin]
  );

const displayError = useMemo(() => {
  if (!error) return null;

  return isLogin
    ? "Email or password incorrect."
    : "User already exists or Password does not meet the requierments.";
}, [error, isLogin]);

const isSubmitDisabled = useMemo(() => {
  return (
    status === "loading" ||
    email.trim() === "" ||
    password.trim() === ""
  );
}, [status, email, password]);


  const submit = (e) => {
    e.preventDefault();
    setTouchedError({ email: false, password: false });

    if (isLogin) dispatch(loginThunk({ email, password }));
    else dispatch(registerThunk({ email, password }));
  };

  // When we receive an error, tint both fields red
  useEffect(() => {
    if (error) setTouchedError({ email: true, password: true });
  }, [error]);

useEffect(() => {
  const success = status === "succeeded" && !!auth.token;

  if (!success || didSpinOnce) return;

  setDidSpinOnce(true);
  setShowSuccessSpinner(true);

  const t = setTimeout(() => {
    navigate("/dashboard");
  }, 3000);

  return () => clearTimeout(t);
}, [status, auth.token, didSpinOnce, navigate]);


  // When spinner is active, render ONLY the spinner screen
  if (showSuccessSpinner) {
    return (
      <div className="min-h-screen grid place-items-center bg-white">
        <div className="animate-[spinnerFade_3000ms_ease-in-out_forwards] flex flex-col items-center gap-4">
          <div className="h-20 w-20 rounded-full border-4 border-zinc-200 border-t-[#FFE95C] animate-spin" />
          <div className="text-sm text-zinc-600">Loading…</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white text-zinc-900 animate-[pageFade_450ms_ease-out_forwards]">
      {/* Back to home */}
<div className="absolute top-4 left-4 z-50">
  <button
    type="button"
    onClick={() => navigate("/")}
    className="px-3 py-2 rounded-xl border border-[var(--border)] bg-[var(--panel)] text-[var(--ink)] hover:bg-[var(--soft)] cursor-pointer shadow-sm"
  >
    ← Back
  </button>
</div>

      <div className="mx-auto flex min-h-screen max-w-6xl items-center justify-center p-4 sm:p-6 lg:p-10">
        <div className="w-full overflow-hidden rounded-[28px] border border-zinc-200 bg-white shadow-sm">
          <div className="grid grid-cols-1 lg:grid-cols-2">
            {/* LEFT */}
            <div className="p-6 sm:p-10">
              <div className="flex items-center gap-2 text-sm text-zinc-500">
                <span className="inline-block h-2 w-2 rounded-full bg-zinc-300" />
                <span>{isLogin ? "Nice to see you again" : "Start for FREE!"}</span>
              </div>

              <h1 className="mt-3 text-3xl font-semibold tracking-tight sm:text-4xl">{title}</h1>
              <p className="mt-2 text-sm text-zinc-500">{subtitle}</p>

              <div className="mt-6 flex items-center gap-3">
                <div className="h-px flex-1 bg-zinc-200" />
              </div>

              <form onSubmit={submit} className="mt-6 space-y-4">
                {/* EMAIL */}
                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-zinc-700">Email</label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value);
                      setHideError(true);
                      if (touchedError.email) setTouchedError((p) => ({ ...p, email: false }));
                    }}
                    placeholder="name@company.com"
                    autoComplete="email"
                    className={[
                      "w-full rounded-xl border bg-white px-3 py-2.5 text-sm outline-none placeholder:text-zinc-400",
                      "transition-colors duration-200",
                      touchedError.email
                        ? "border-red-300 focus:border-red-400 focus:ring-4 focus:ring-red-100"
                        : "border-zinc-200 text-zinc-900 focus:border-zinc-400 focus:ring-4 focus:ring-zinc-100",
                    ].join(" ")}
                  />
                </div>

                {/* PASSWORD */}
                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-zinc-700">Password</label>

                  <div className="relative">
                    <input
                      type={showPassword ? "text" : "password"}
                      value={password}
                      onChange={(e) => {
                        setPassword(e.target.value);
                        setHideError(true);
                        if (touchedError.password)
                          setTouchedError((p) => ({ ...p, password: false }));
                      }}
                      onFocus={() => !isLogin && setShowPwHint(true)}
                      onBlur={() => setShowPwHint(false)}
                      autoComplete={isLogin ? "current-password" : "new-password"}
                      placeholder="••••••••"
                      className={[
                        "w-full rounded-xl border bg-white px-3 py-2.5 pr-10 text-sm outline-none placeholder:text-zinc-400",
                        "transition-colors duration-200",
                        touchedError.password
                          ? "border-red-300 focus:border-red-400 focus:ring-4 focus:ring-red-100"
                          : "border-zinc-200 text-zinc-900 focus:border-zinc-400 focus:ring-4 focus:ring-zinc-100",
                      ].join(" ")}
                    />

                    <button
                      type="button"
                      onClick={() => setShowPassword((v) => !v)}
                      className="absolute inset-y-0 right-3 flex items-center text-zinc-400 hover:text-zinc-700"
                      aria-label={showPassword ? "Hide password" : "Show password"}
                    >
                      {showPassword ? (
                        <EyeClosedIcon className="h-5 w-5" />
                      ) : (
                        <EyeOpenIcon className="h-5 w-5" />
                      )}
                    </button>

                    {/* Speech bubble */}
                    {!isLogin && showPwHint && password.trim() === "" && (
                      <div className="absolute left-0 top-full z-10 mt-2 w-full">
                        <div className="relative w-full rounded-xl border border-zinc-200 bg-white p-3 text-xs text-zinc-600 shadow-sm animate-[hintFade_160ms_ease-out_forwards]">
                          <div className="absolute -top-2 left-6 h-3 w-3 rotate-45 border-l border-t border-zinc-200 bg-white" />
                          <div className="font-medium text-zinc-800">Password requirements</div>
                          <ul className="mt-2 list-disc space-y-1 pl-4">
                            <li>At least 8 characters</li>
                            <li>One uppercase letter</li>
                            <li>One number</li>
                            <li>One special character</li>
                          </ul>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Terms checkbox */}
                {!isLogin && (
                  <label className="flex items-start gap-2 text-sm text-zinc-600">
                    <input
                      type="checkbox"
                      className="mt-1 h-4 w-4 rounded border-zinc-300 [accent-color:#FFE95C]"
                      defaultChecked
                    />
                    <span>
                      I agree to the{" "}
                      <a className="underline hover:text-zinc-900" href="#">
                        Terms &amp; Conditions
                      </a>
                    </span>
                  </label>
                )}
{displayError && !hideError && (
  <div className="rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700 transition-opacity duration-200">
    {displayError}
  </div>
)}


<button
  disabled={isSubmitDisabled}
  className="
    w-full rounded-xl px-4 py-2.5 text-sm font-semibold
    bg-[var(--primary)] text-zinc-900
    transition
    hover:brightness-95
    active:brightness-90
    disabled:opacity-50
    disabled:cursor-not-allowed
    disabled:hover:brightness-100
  "
>
                  {status === "loading"
                    ? "Please wait..."
                    : isLogin
                    ? "Login"
                    : "Create Account"}
                </button>

                <div className="pt-2 text-center text-sm text-zinc-500">
                  {isLogin ? "Not a member? " : "Already a member? "}
                  <button
                    type="button"
                    onClick={() => {
                      setMode(isLogin ? "register" : "login");
                      setHideError(true);
                      setTouchedError({ email: false, password: false });
                    }}
                    className="font-medium text-zinc-900 underline underline-offset-4 hover:text-zinc-700"
                  >
                    {isLogin ? "Create an account" : "Login"}
                  </button>
                </div>
              </form>
            </div>

            {/* RIGHT placeholder */}

{/* RIGHT illustration */}
<div className="relative hidden lg:block border-t border-zinc-200 bg-zinc-50 p-6 sm:p-10 lg:border-l lg:border-t-0">
  <div className="flex h-full items-center justify-center">
    <img
      src={WelcomeIllustration}
      alt="Welcome"
      className="w-full max-w-md select-none"
      draggable={false}
    />
  </div>
</div>

          </div>
        </div>
      </div>
      <div className="-mt-15 text-center text-[11px] text-zinc-400 py-4">
  <a
    href="https://storyset.com/technology"
    target="_blank"
    rel="noopener noreferrer"
    className="hover:text-zinc-500 transition"
  >
    Technology illustrations by Storyset
  </a>
</div>

    </div>
  );
}

function Field({ label, type = "text", placeholder, value, onChange, autoComplete }) {
  return (
    <div className="space-y-1.5">
      <label className="text-sm font-medium text-zinc-700">{label}</label>
      <input
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        autoComplete={autoComplete}
        className="w-full rounded-xl border border-zinc-200 bg-white px-3 py-2.5 text-sm text-zinc-900 outline-none placeholder:text-zinc-400 focus:border-zinc-400 focus:ring-4 focus:ring-zinc-100 transition-colors duration-200"
      />
    </div>
  );
}
