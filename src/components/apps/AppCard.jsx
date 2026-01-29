import { useState } from "react";

function maskAllKey(key) {
  if (!key) return "••••••••••••••••";
  return "•".repeat(Math.max(24, key.length));
}

function EyeIcon({ open }) {
  return open ? (
    // Eye open svg
    <svg viewBox="0 0 24 24" className="w-5 h-5" fill="none">
      <path
        d="M1.5 12s4-7.5 10.5-7.5S22.5 12 22.5 12s-4 7.5-10.5 7.5S1.5 12 1.5 12Z"
        stroke="currentColor"
        strokeWidth="2"
      />
      <circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="2" />
    </svg>
  ) : (
    // Eye closed svg
    <svg viewBox="0 0 24 24" className="w-5 h-5" fill="none">
      <path
        d="M3 3l18 18"
        stroke="currentColor"
        strokeWidth="2"
      />
      <path
        d="M10.6 5.2A9.7 9.7 0 0 1 12 4.5c6.5 0 10.5 7.5 10.5 7.5a19.6 19.6 0 0 1-4.1 5.3M6.5 6.5C3.2 9.2 1.5 12 1.5 12s4 7.5 10.5 7.5a9.6 9.6 0 0 0 5.4-1.6"
        stroke="currentColor"
        strokeWidth="2"
      />
    </svg>
  );
}

function safeColor(v, fallback = "#FFE95C") {
  const s = (v ?? "").toString().trim();
  if (!s || s === '"' || s === "null" || s === "undefined") return fallback;
  const hex = s.startsWith("#") ? s : `#${s}`;
  return /^#[0-9a-fA-F]{6}$/.test(hex) ? hex.toUpperCase() : fallback;
}

const TRASH_SVG = `<svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
  <path d="M10 12V17" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path>
  <path d="M14 12V17" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path>
  <path d="M4 7H20" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path>
  <path d="M6 10V18C6 19.6569 7.34315 21 9 21H15C16.6569 21 18 19.6569 18 18V10" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path>
  <path d="M9 5C9 3.89543 9.89543 3 11 3H13C14.1046 3 15 3.89543 15 5V7H9V5Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path>
</svg>`;


export default function AppCard({ app, onCopy, onDelete, onPrimary, primaryLabel = "Configure" }) {
const bubbleBg = safeColor(
  app?.theme?.bubbleBg ?? app?.bubbleBg ?? app?.settings?.theme?.bubbleBg,
  "#FFE95C"
);
const primary = safeColor(
  app?.theme?.primary ?? app?.primary ?? app?.settings?.theme?.primary,
  "#FFE95C"
);

  const [showKey, setShowKey] = useState(false);

  return (
    <div className="w-full max-w-[360px]">
      <div className="relative">
        {/* OUTER layer */}
        <div
          className="absolute inset-0 rounded-[26px] translate-y-2 -translate-x-2"
          style={{ background: "var(--primary)" }}
        />

        {/* Inner card */}
        <div className="relative rounded-[26px] border border-[var(--border)] bg-white shadow-[var(--shadow)] p-5">
          {/* Header row */}
          <div className="flex items-center justify-between gap-3">
<button
  type="button"
  className="group w-10 h-10 rounded-full border border-[var(--border)] bg-transparent cursor-pointer inline-flex items-center justify-center text-[var(--muted)] hover:text-[var(--danger)] hover:border-[var(--danger)] hover:bg-[var(--danger)]/10"
  title="Delete app"
  onClick={(e) => {
    e.stopPropagation();
    onDelete?.(app);
  }}
>
  <span
    className="w-5 h-5"
    aria-hidden="true"
    dangerouslySetInnerHTML={{ __html: TRASH_SVG }}
  />
</button>
            <div className="ml-3 min-w-0 flex-1">
              <div className="text-lg font-bold text-[var(--ink)] truncate">
                {app?.name || "App"}
              </div>
              <div className="text-xs text-[var(--muted)] mt-0.5">
                Configuration
              </div>
            </div>

            {/* spacer to keep symmetry */}
            <div className="w-10 h-10" />
          </div>

          {/* Body */}
          <div className="mt-4">
            {/* API key */}
            <div className="text-xs font-semibold text-[var(--muted)]">API Key</div>
<div className="mt-2 flex items-center gap-3">
  <div className="text-sm text-[var(--ink)] font-medium tracking-widest select-none truncate">
    {showKey ? app?.apiKey : maskAllKey(app?.apiKey)}
  </div>

  <button
    type="button"
    className="text-[var(--muted)] hover:text-[var(--ink)] cursor-pointer"
    title={showKey ? "Hide API key" : "Show API key"}
    onClick={(e) => {
      e.stopPropagation();
      setShowKey((v) => !v);
    }}
  >
    <EyeIcon open={showKey} />
  </button>
</div>


            {/* Color swatches */}
            <div className="mt-4">
              <div className="text-xs font-semibold text-[var(--muted)]">Colors</div>
              <div className="mt-2 flex items-center gap-3">
                <div className="flex items-center gap-2">
                  <div
                    className="w-9 h-9 rounded-xl border border-[var(--border)]"
                    style={{ background: bubbleBg }}
                    title={`bubbleBg: ${bubbleBg}`}
                  />
                  <div className="text-xs text-[var(--muted)]">Bubble background</div>
                </div>

                <div className="flex items-center gap-2">
                  <div
                    className="w-9 h-9 rounded-xl border border-[var(--border)]"
                    style={{ background: primary }}
                    title={`primary: ${primary}`}
                  />
                  <div className="text-xs text-[var(--muted)]">Primary color</div>
                </div>
              </div>
            </div>
          </div>

          {/* Bottom row */}
          <div className="mt-5 flex items-center justify-between gap-2">
            <button
              type="button"
              className="px-4 py-2 rounded-full bg-[var(--soft)] border border-[var(--border)] text-[var(--ink)] text-sm font-semibold hover:bg-white cursor-pointer"
              onClick={(e) => {
                e.stopPropagation();
                onCopy?.(app?.apiKey);
              }}
            >
              Copy Key
            </button>

            <button
              type="button"
              className="px-4 py-2 rounded-full bg-[var(--primary)] text-[var(--ink)] text-sm font-semibold shadow-sm hover:brightness-95 cursor-pointer"
              onClick={(e) => {
                e.stopPropagation();
                onPrimary?.(app);
              }}
            >
              {primaryLabel}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
