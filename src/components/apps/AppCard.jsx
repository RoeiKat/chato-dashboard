import { useState } from "react";

function maskAllKey(key) {
  if (!key) return "••••••••••••••••";
  return "•".repeat(Math.max(24, key.length));
}

function EyeIcon({ open }) {
  return open ? (
    // eye open
    <svg viewBox="0 0 24 24" className="w-5 h-5" fill="none">
      <path
        d="M1.5 12s4-7.5 10.5-7.5S22.5 12 22.5 12s-4 7.5-10.5 7.5S1.5 12 1.5 12Z"
        stroke="currentColor"
        strokeWidth="2"
      />
      <circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="2" />
    </svg>
  ) : (
    // eye closed
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

function TrashIcon({ className = "w-5 h-5" }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
    >
      <path
        d="M4 6H20M16 6L15.7294 5.18807C15.4671 4.40125 15.3359 4.00784 15.0927 3.71698C14.8779 3.46013 14.6021 3.26132 14.2905 3.13878C13.9376 3 13.523 3 12.6936 3H11.3064C10.477 3 10.0624 3 9.70951 3.13878C9.39792 3.26132 9.12208 3.46013 8.90729 3.71698C8.66405 4.00784 8.53292 4.40125 8.27064 5.18807L8 6M18 6V16.2C18 17.8802 18 18.7202 17.673 19.362C17.3854 19.9265 16.9265 20.3854 16.362 20.673C15.7202 21 14.8802 21 13.2 21H10.8C9.11984 21 8.27976 21 7.63803 20.673C7.07354 20.3854 6.6146 19.9265 6.32698 19.362C6 18.7202 6 17.8802 6 16.2V6M14 10V17M10 10V17"
        stroke="var(--danger)"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

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
        {/* OUTER layer (primary) on the LEFT */}
        <div
          className="absolute inset-0 rounded-[26px] translate-y-2 -translate-x-2"
          style={{ background: "var(--primary)" }}
        />

        {/* Inner card */}
        <div className="relative rounded-[26px] border border-[var(--border)] bg-white shadow-[var(--shadow)] p-5">
          {/* Header row: delete + title */}
          <div className="flex items-center justify-between gap-3">
            <button
              type="button"
              className="w-10 h-10 rounded-full bg-white border border-[var(--border)] flex items-center justify-center hover:bg-[var(--soft)] cursor-pointer"
              title="Delete app"
              onClick={(e) => {
                e.stopPropagation();
                onDelete?.(app);
              }}
            >
              <TrashIcon />
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
            {/* API key (fully masked) */}
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


            {/* Color swatches (display-only) */}
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
