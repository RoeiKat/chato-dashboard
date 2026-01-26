import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import ColorPickerModal from "../components/ui/ColorPickerModal";
import HelloIllustration from "../assets/illustrations/hello_illustration.svg";
import SettingsIllustration from "../assets/illustrations/settings_illustration.svg";
import Dashboardllustration from "../assets/illustrations/dashboard_illustration.svg";

const LinkedInIcon = ({ className }) => (
  <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
    <path d="M4.98 3.5C4.98 4.88 3.86 6 2.5 6S0 4.88 0 3.5 1.12 1 2.5 1s2.48 1.12 2.48 2.5ZM0.5 8h4V24h-4V8ZM8.5 8h3.8v2.2h.05c.53-1 1.83-2.2 3.77-2.2 4.03 0 4.78 2.65 4.78 6.1V24h-4v-7.9c0-1.88-.03-4.3-2.62-4.3-2.63 0-3.03 2.05-3.03 4.17V24h-4V8Z" />
  </svg>
);

const GitHubIcon = ({ className }) => (
  <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
    <path d="M12 .5C5.73.5.5 5.73.5 12c0 5.09 3.29 9.4 7.86 10.93.57.1.78-.25.78-.55v-2.02c-3.2.7-3.88-1.54-3.88-1.54-.53-1.34-1.3-1.7-1.3-1.7-1.06-.72.08-.7.08-.7 1.17.08 1.78 1.2 1.78 1.2 1.04 1.78 2.72 1.27 3.39.97.1-.75.4-1.27.73-1.56-2.55-.29-5.23-1.28-5.23-5.7 0-1.26.45-2.29 1.2-3.1-.12-.3-.52-1.52.12-3.16 0 0 .98-.31 3.2 1.18a11.2 11.2 0 0 1 5.82 0c2.22-1.5 3.2-1.18 3.2-1.18.64 1.64.24 2.86.12 3.16.75.81 1.2 1.84 1.2 3.1 0 4.43-2.69 5.41-5.25 5.69.41.36.78 1.07.78 2.16v3.2c0 .3.2.66.79.55A11.52 11.52 0 0 0 23.5 12C23.5 5.73 18.27.5 12 .5Z" />
  </svg>
);

const FacebookIcon = ({ className }) => (
  <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
    <path d="M22.68 0H1.32C.59 0 0 .59 0 1.32v21.36C0 23.41.59 24 1.32 24H12.82v-9.29H9.69V11.1h3.13V8.41c0-3.1 1.89-4.79 4.65-4.79 1.32 0 2.46.1 2.79.14v3.24h-1.91c-1.5 0-1.79.71-1.79 1.75v2.3h3.58l-.47 3.61h-3.11V24h6.09c.73 0 1.32-.59 1.32-1.32V1.32C24 .59 23.41 0 22.68 0Z" />
  </svg>
);

function Modal({ open, onClose, title = "Examples", children }) {
  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-[100] grid place-items-center px-4"
      role="dialog"
      aria-modal="true"
      aria-label={title}
    >
      <button
        className="absolute inset-0 bg-black/50 cursor-pointer"
        onClick={onClose}
        aria-label="Close modal backdrop"
      />
      <div className="relative w-full max-w-5xl rounded-3xl bg-white shadow-2xl border border-zinc-200 overflow-hidden">
        <div className="flex items-center justify-between px-6 py-4 border-b border-zinc-200">
          <div className="font-semibold">{title}</div>
          <button
            onClick={onClose}
            className="h-10 w-10 grid place-items-center rounded-xl hover:bg-zinc-100 cursor-pointer"
            aria-label="Close"
          >
            ✕
          </button>
        </div>
        <div className="p-6">{children}</div>
      </div>
    </div>
  );
}

function PhonePreview({ primary, bubbleColor, title = "Support", messages }) {
  const primaryStyle = { backgroundColor: primary };
  const bubbleStyle = { backgroundColor: bubbleColor };

  return (
    <div className="w-full flex items-center justify-center">
      <div className="relative w-[300px] h-[620px] rounded-[42px] bg-zinc-950 shadow-2xl border border-zinc-800 overflow-hidden">
        <div className="absolute top-0 left-0 right-0 h-10 bg-zinc-950/80" />
        <div className="absolute inset-0 bg-zinc-900">
          <div className="absolute inset-0 opacity-20 bg-[radial-gradient(circle_at_20%_20%,white,transparent_55%)]" />
        </div>

        <div className="absolute left-3 top-1/2 -translate-y-1/2">
          <div
            className="h-14 w-14 rounded-full shadow-lg border border-white/10 grid place-items-center"
            style={bubbleStyle}
          >
            <span className="text-zinc-900 font-bold">C</span>
          </div>
        </div>

        <div className="absolute right-4 top-20 w-[250px] h-[460px] rounded-3xl bg-white shadow-xl overflow-hidden border border-zinc-200">
          <div className="h-12 px-4 flex items-center justify-between border-b border-zinc-200 bg-white">
            <div className="text-sm font-semibold text-zinc-900">{title}</div>
            <div className="h-8 w-8 grid place-items-center rounded-lg hover:bg-zinc-100 cursor-pointer">
              ✕
            </div>
          </div>

          <div className="px-3 py-3 h-[356px] overflow-hidden bg-white">
            <div className="space-y-2">
              {messages.map((m, idx) => {
                const isUser = m.side === "right";
                return (
                  <div
                    key={idx}
                    className={["w-full flex", isUser ? "justify-end" : "justify-start"].join(" ")}
                  >
                    <div
                      className={[
                        "max-w-[78%] rounded-2xl px-3 py-2 text-[12px] leading-snug",
                        isUser ? "text-zinc-900" : "bg-zinc-100 text-zinc-900",
                      ].join(" ")}
                      style={isUser ? primaryStyle : undefined}
                    >
                      {m.text}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="h-12 border-t border-zinc-200 px-2 flex items-center gap-2 bg-white">
            <div className="flex-1 h-9 rounded-xl bg-zinc-100 px-3 text-[12px] text-zinc-500 flex items-center">
              Type a message...
            </div>
            <button
              className="h-9 w-9 rounded-xl grid place-items-center cursor-pointer"
              style={primaryStyle}
              aria-label="Send"
            >
              <svg viewBox="0 0 24 24" className="h-4 w-4" fill="currentColor">
                <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function MainPage() {
  const navigate = useNavigate();
  const goAuth = () => navigate("/auth");

  const [examplesOpen, setExamplesOpen] = useState(false);

  const [primary, setPrimary] = useState("#FFE95C");
  const [bubbleColor, setBubbleColor] = useState("#FFE95C");
  const [activePicker, setActivePicker] = useState(null);

  const exampleMessages = useMemo(
    () => [
      { side: "right", text: "This is customizable" },
      { side: "left", text: "First Name Last Name" },
      { side: "right", text: "This is also customizable" },
      { side: "left", text: "example@example.com" },
      { side: "right", text: "And also this is customizable." },
    ],
    []
  );

  // unified styles for all screenshots: bigger (+20%) on desktop, centered on mobile
  const screenshotClass =
    "w-full max-w-xl mx-auto lg:mx-0 lg:w-[120%] select-none rounded-2xl shadow-xl";

  return (
    <div className="min-h-screen bg-[#F6FAF9] text-zinc-900">
      {/* NAVBAR */}
      <header className="sticky top-0 z-50 bg-[#F6FAF9]/80 backdrop-blur border-b border-zinc-200">
        <div className="mx-auto max-w-6xl px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2 font-semibold text-xl">
            <img
              src="/logo.png"
              alt="Chato logo"
              className="h-8 w-8 rounded-xl object-contain -mr-1"
              draggable={false}
            />
            Chato
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={goAuth}
              className="rounded-xl bg-[var(--primary)] px-4 py-2 text-sm font-semibold text-zinc-900 hover:brightness-95 cursor-pointer"
            >
              Login
            </button>
          </div>
        </div>
      </header>

      {/* HERO */}
      <section className="mx-auto max-w-6xl px-6 py-20 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
        {/* Left */}
        <div>
          <h1 className="text-4xl sm:text-5xl font-semibold tracking-tight">
            In-app support chat <br /> built for modern apps.
          </h1>

          <p className="mt-5 max-w-xl text-zinc-600">
            Chato gives you a lightweight Android SDK and a powerful web dashboard
            so you can support your users in real time,
            <br />
            Directly inside your app.
          </p>

          <div className="mt-8 flex items-center gap-4">
            <button
              onClick={goAuth}
              className="rounded-xl bg-[var(--primary)] px-6 py-3 text-sm font-semibold text-zinc-900 hover:brightness-95 cursor-pointer"
            >
              Get started
            </button>
          </div>

          <div className="mt-10 text-xs text-zinc-500">
            Trusted by apps built for learning & demos
          </div>
        </div>

        {/* Right */}
        <div className="relative flex justify-center lg:justify-end">
          <div className="absolute inset-0 -z-10 rounded-[40px] bg-white/60" />
          <img
            src={HelloIllustration}
            alt="Hello"
            className={screenshotClass}
            draggable={false}
          />
        </div>
      </section>

      {/* FEATURES STRIP */}
      <section className="mx-auto max-w-6xl px-6">
        <div className="rounded-[32px] bg-white p-10 grid grid-cols-1 md:grid-cols-3 gap-8 shadow-sm">
          {[
            {
              title: "Realtime messaging",
              desc: "Messages update instantly between your dashboard and the app.",
            },
            {
              title: "Multiple apps",
              desc: "Create API keys per app and keep conversations organized.",
            },
            {
              title: "Secure by default",
              desc: "Auth-protected sessions and controlled access.",
            },
          ].map((f) => (
            <div key={f.title}>
              <div className="font-semibold">{f.title}</div>
              <p className="mt-2 text-sm text-zinc-600">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* PLUG & PLAY SECTION */}
      <section className="mx-auto max-w-6xl px-6 py-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
          {/* LEFT: photos */}
          <div className="grid grid-cols-2 gap-4">
            <img
              src="/screenshots/sdk_screenshot1.png"
              alt="SDK Screenshot 1"
              className="w-full h-[210px] object-cover rounded-2xl border border-zinc-200 shadow-sm"
              draggable={false}
            />
            <img
              src="/screenshots/sdk_screenshot2.png"
              alt="SDK Screenshot 2"
              className="w-full h-[210px] object-cover rounded-2xl border border-zinc-200 shadow-sm"
              draggable={false}
            />
            <img
              src="/screenshots/sdk_screenshot3.png"
              alt="SDK Screenshot 3"
              className="w-full h-[210px] object-cover rounded-2xl border border-zinc-200 shadow-sm col-span-2"
              draggable={false}
            />
          </div>

          {/* RIGHT: copy + docs */}
          <div>
            <div className="text-xs font-semibold text-zinc-500">SDK PREVIEW</div>
            <h2 className="mt-3 text-3xl font-semibold tracking-tight">
              Plug-and-play in minutes.
            </h2>
            <p className="mt-4 text-zinc-600 max-w-xl">
              Drop the SDK into your Android app, paste your API key, and you’re live.
              The bubble and chat popup feel native, while you can answer from the dashboard.
            </p>

            <div className="mt-8">
              <button className="rounded-xl border border-zinc-300 px-6 py-3 text-sm font-semibold hover:bg-zinc-100 cursor-pointer"
              onClick={() => {navigate("/sdk-docs")}}
              >
                View Docs
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* CUSTOMIZATION */}
      <section className="mx-auto max-w-6xl px-6 py-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
          {/* LEFT: explanation */}
          <div>
            <div className="text-xs font-semibold text-zinc-500">CUSTOMIZATION</div>
            <h2 className="mt-3 text-3xl font-semibold tracking-tight">
              Make it feel like your product.
            </h2>
            <p className="mt-4 text-zinc-600 max-w-xl">
              Chato is designed to blend into your app’s brand. Customize the
              bubble, colors, and messaging flow so users feel like they never
              left your UI.
            </p>

            <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="rounded-2xl bg-white p-6 shadow-sm border border-zinc-200">
                <div className="font-semibold">Brand colors</div>
                <p className="mt-2 text-sm text-zinc-600">
                  Primary color, accents, and UI tone that matches your app.
                </p>
              </div>

              <div className="rounded-2xl bg-white p-6 shadow-sm border border-zinc-200">
                <div className="font-semibold">Bubble icon</div>
                <p className="mt-2 text-sm text-zinc-600">
                  Upload your own SVG icon for the launcher bubble.
                </p>
              </div>

              <div className="rounded-2xl bg-white p-6 shadow-sm border border-zinc-200">
                <div className="font-semibold">Pre-chat flow</div>
                <p className="mt-2 text-sm text-zinc-600">
                  Set the questions (name/email) and a final “FAQ / wait” message.
                </p>
              </div>

              <div className="rounded-2xl bg-white p-6 shadow-sm border border-zinc-200">
                <div className="font-semibold">Chat title & copy</div>
                <p className="mt-2 text-sm text-zinc-600">
                  Customize the header title and microcopy shown to users.
                </p>
              </div>
            </div>

            <div className="mt-8 flex items-center gap-3">
              <button
                onClick={() => setExamplesOpen(true)}
                className="rounded-xl bg-[var(--primary)] px-6 py-3 text-sm font-semibold text-zinc-900 hover:brightness-95 cursor-pointer"
              >
                See examples
              </button>
            </div>
          </div>

          {/* RIGHT: screenshot */}
          <div className="relative flex justify-center lg:justify-end">
            <div className="absolute inset-0 -z-10 rounded-[40px] bg-white/60" />
            <img
              src={SettingsIllustration}
              alt="Customization"
              className={screenshotClass}
              draggable={false}
            />
          </div>
        </div>
      </section>

      {/* WHY CHATO */}
      <section className="mx-auto max-w-6xl px-6 py-20">
        <div className="text-center max-w-2xl mx-auto">
          <div className="text-xs font-semibold text-zinc-500">WHY CHATO</div>
          <h2 className="mt-3 text-3xl font-semibold">Support that feels native</h2>
        </div>

        <div className="mt-12 grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
          <div className="flex justify-center lg:justify-start">
            <img
              src={Dashboardllustration}
              alt="Dashboard"
              className={[
                "w-full max-w-xl mx-auto lg:mx-0 select-none rounded-2xl shadow-xl",
                "lg:w-[120%] lg:-ml-[6%]",
              ].join(" ")}
              draggable={false}
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="rounded-2xl bg-white p-6 shadow-sm">
              <div className="text-3xl font-semibold">3k+</div>
              <div className="mt-2 text-sm text-zinc-600">
                Messages handled in demos
              </div>
            </div>

            <div className="rounded-2xl bg-white p-6 shadow-sm">
              <div className="font-semibold">Instant replies</div>
              <p className="mt-2 text-sm text-zinc-600">
                Answer users as soon as they message.
              </p>
            </div>

            <div className="rounded-2xl bg-white p-6 shadow-sm">
              <div className="font-semibold">No clutter</div>
              <p className="mt-2 text-sm text-zinc-600">
                A clean dashboard focused on conversations.
              </p>
            </div>

            <div className="rounded-2xl bg-white p-6 shadow-sm">
              <div className="font-semibold">Fully customizable</div>
              <p className="mt-2 text-sm text-zinc-600">
                Colors, icon, title, and pre-chat flow can be tailored to match
                your app’s brand.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* DARK CTA */}
      <section className="bg-[var(--ink)] text-white">
        <div className="mx-auto max-w-6xl px-6 py-20">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-8">
            <div>
              <h2 className="text-4xl sm:text-5xl font-semibold max-w-2xl">
                Ready to level up your in-app support?
              </h2>

              <p className="mt-4 max-w-2xl text-white/70 text-lg">
                Integrate Chato in minutes and start chatting with your users today.
              </p>
            </div>

            <div className="flex lg:justify-end">
              <button
                onClick={goAuth}
                className="rounded-xl bg-[var(--primary)] px-7 py-3.5 text-sm font-semibold text-[var(--ink)] hover:brightness-95 cursor-pointer"
              >
                Get started
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="bg-white border-t border-zinc-200">
        <div className="mx-auto max-w-6xl px-6 py-14 grid grid-cols-2 sm:grid-cols-4 gap-8 text-sm">
          <div>
            <div className="font-semibold">Chato</div>
            <p className="mt-2 text-zinc-500">Support chat SDK & dashboard.</p>
          </div>

          <div>
            <div className="font-semibold">Product</div>
            <ul className="mt-2 space-y-2 text-zinc-500">
              <li onClick={() => {navigate("/sdk-docs")}} className="hover:text-zinc-900 cursor-pointer w-fit">
                SDK
              </li>
              <li onClick={() => {navigate("/auth")}} className="hover:text-zinc-900 cursor-pointer w-fit">
                Dashboard
              </li>
            </ul>
          </div>

          <div>
            <div className="font-semibold">Company</div>
            <ul className="mt-2 space-y-2 text-zinc-500">
              <li className="hover:text-zinc-900 cursor-pointer w-fit" onClick={() => {}}>
                About
              </li>
              <li className="hover:text-zinc-900 cursor-pointer w-fit" onClick={() => {}}>
                Privacy Policy
              </li>
              <li className="hover:text-zinc-900 cursor-pointer w-fit" onClick={() => {}}>
                Terms of Service
              </li>
            </ul>
          </div>

          <div>
            <div className="font-semibold">Follow</div>

            <div className="mt-3 flex items-center gap-4">
              <a
                href="https://www.linkedin.com/in/roei-katabi-a66931208/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-zinc-500 hover:text-zinc-900 transition cursor-pointer"
                aria-label="LinkedIn"
              >
                <LinkedInIcon className="h-5 w-5" />
              </a>

              <a
                href="https://github.com/RoeiKat"
                target="_blank"
                rel="noopener noreferrer"
                className="text-zinc-500 hover:text-zinc-900 transition cursor-pointer"
                aria-label="GitHub"
              >
                <GitHubIcon className="h-5 w-5" />
              </a>

              <a
                href="https://www.facebook.com/roei.katabi/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-zinc-500 hover:text-zinc-900 transition cursor-pointer"
                aria-label="Facebook"
              >
                <FacebookIcon className="h-5 w-5" />
              </a>
            </div>
          </div>
        </div>

        <div className="border-t border-zinc-200 text-center py-6 text-xs text-zinc-500">
          © {new Date().getFullYear()} Chato - Made with ❤︎⁠ by Roei Katabi.
        </div>
        <div className="text-center text-[11px] text-zinc-400 py-4">
  <a
    href="https://storyset.com/technology"
    target="_blank"
    rel="noopener noreferrer"
    className="hover:text-zinc-500 transition"
  >
    Technology illustrations by Storyset
  </a>
</div>
      </footer>

      {/* EXAMPLES MODAL */}
      <Modal
        open={examplesOpen}
        onClose={() => setExamplesOpen(false)}
        title="SDK Customization Preview"
      >
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
          <div className="rounded-3xl bg-zinc-50 border border-zinc-200 p-6">
            <PhonePreview
              primary={primary}
              bubbleColor={bubbleColor}
              title="Support"
              messages={exampleMessages}
            />
          </div>

          <div className="rounded-3xl bg-white border border-zinc-200 p-6">
            <div className="text-sm font-semibold">Live controls</div>
            <p className="mt-2 text-sm text-zinc-600">
              Primary controls the message bubbles and send button. Bubble controls only
              the launcher circle.
            </p>

            <div className="mt-6 space-y-4">
              <div>
                <div className="text-sm font-medium mb-1">Primary color</div>
                <button
                  onClick={() => setActivePicker("primary")}
                  className="w-full rounded-xl border border-zinc-300 bg-white px-3 py-2 flex items-center justify-between hover:bg-zinc-100"
                >
                  <div className="flex items-center gap-3">
                    <div className="h-8 w-8 rounded-lg border" style={{ background: primary }} />
                    <div className="text-sm font-semibold">{primary}</div>
                  </div>
                  <div className="text-xs text-zinc-500">Pick</div>
                </button>
              </div>

              <div>
                <div className="text-sm font-medium mb-1">Bubble color</div>
                <button
                  onClick={() => setActivePicker("bubble")}
                  className="w-full rounded-xl border border-zinc-300 bg-white px-3 py-2 flex items-center justify-between hover:bg-zinc-100"
                >
                  <div className="flex items-center gap-3">
                    <div className="h-8 w-8 rounded-lg border" style={{ background: bubbleColor }} />
                    <div className="text-sm font-semibold">{bubbleColor}</div>
                  </div>
                  <div className="text-xs text-zinc-500">Pick</div>
                </button>
              </div>
            </div>

            <div className="mt-8 flex items-center gap-3">
              <button
                onClick={() => {
                  setPrimary("#FFE95C");
                  setBubbleColor("#FFE95C");
                }}
                className="rounded-xl border border-zinc-300 px-5 py-2.5 text-sm font-semibold hover:bg-zinc-100 cursor-pointer"
              >
                Reset
              </button>

              <button
                onClick={goAuth}
                className="rounded-xl bg-[var(--primary)] px-5 py-2.5 text-sm font-semibold text-zinc-900 hover:brightness-95 cursor-pointer"
              >
                Go to Login
              </button>
            </div>
          </div>
        </div>
      </Modal>

      <ColorPickerModal
        open={activePicker === "primary"}
        label="Primary color"
        value={primary}
        onChange={setPrimary}
        onClose={() => setActivePicker(null)}
      />

      <ColorPickerModal
        open={activePicker === "bubble"}
        label="Bubble color"
        value={bubbleColor}
        onChange={setBubbleColor}
        onClose={() => setActivePicker(null)}
      />
    </div>
  );
}
