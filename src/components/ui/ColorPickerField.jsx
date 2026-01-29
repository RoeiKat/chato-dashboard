import { useEffect, useMemo, useRef, useState } from "react";
import { HexColorPicker } from "react-colorful";

function clamp01(n) {
  return Math.min(1, Math.max(0, n));
}

function hexToRgb(hex) {
  const h = (hex || "").replace("#", "").trim();
  if (h.length !== 6) return { r: 0, g: 0, b: 0 };
  const r = parseInt(h.slice(0, 2), 16);
  const g = parseInt(h.slice(2, 4), 16);
  const b = parseInt(h.slice(4, 6), 16);
  return { r, g, b };
}

function rgbToHsl(r, g, b) {
  // r,g,b in [0..255]
  let rr = r / 255;
  let gg = g / 255;
  let bb = b / 255;

  const max = Math.max(rr, gg, bb);
  const min = Math.min(rr, gg, bb);
  const d = max - min;

  let h = 0;
  let s = 0;
  const l = (max + min) / 2;

  if (d !== 0) {
    s = d / (1 - Math.abs(2 * l - 1));
    switch (max) {
      case rr:
        h = ((gg - bb) / d) % 6;
        break;
      case gg:
        h = (bb - rr) / d + 2;
        break;
      default:
        h = (rr - gg) / d + 4;
    }
    h = Math.round(h * 60);
    if (h < 0) h += 360;
  }

  return {
    h: Math.round(h),
    s: Math.round(s * 100),
    l: Math.round(l * 100),
  };
}

function normalizeHex(value, fallback = "#FFE95C") {
  const v = (value ?? "").toString().trim();
  if (!v || v === '"' || v === "null" || v === "undefined") return fallback;

  // Ensure leading '#'
  let hex = v.startsWith("#") ? v : `#${v}`;
  // Basic validation
  if (!/^#[0-9a-fA-F]{6}$/.test(hex)) return fallback;

  return hex.toUpperCase();
}

function CopyIcon({ className = "w-4 h-4" }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M9 9h10v10H9V9Z"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinejoin="round"
      />
      <path
        d="M5 15H4a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1h10a1 1 0 0 1 1 1v1"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function useOutsideClick(ref, onClose) {
  useEffect(() => {
    function onDown(e) {
      if (!ref.current) return;
      if (!ref.current.contains(e.target)) onClose?.();
    }
    document.addEventListener("mousedown", onDown);
    return () => document.removeEventListener("mousedown", onDown);
  }, [ref, onClose]);
}

export default function ColorPickerField({
  label,
  value,
  onChange,
  fallback = "#FFE95C",
}) {
  const [open, setOpen] = useState(false);
  const wrapRef = useRef(null);
  useOutsideClick(wrapRef, () => setOpen(false));

  const hex = useMemo(() => normalizeHex(value, fallback), [value, fallback]);
  const rgb = useMemo(() => hexToRgb(hex), [hex]);
  const hsl = useMemo(() => rgbToHsl(rgb.r, rgb.g, rgb.b), [rgb]);

  const hexText = hex;
  const rgbText = `rgb(${rgb.r}, ${rgb.g}, ${rgb.b})`;
  const hslText = `hsl(${hsl.h}, ${hsl.s}%, ${hsl.l}%)`;

  const copy = async (text) => {
    try {
      await navigator.clipboard.writeText(text);
    } catch {
      // ignore
    }
  };

  return (
    <div className="space-y-2" ref={wrapRef}>
      <label className="text-sm font-semibold text-[var(--ink)]">{label}</label>

      {/* Trigger */}
      <button
        type="button"
        className="w-full rounded-xl border border-[var(--border)] bg-white px-3 py-2 flex items-center justify-between gap-3 hover:bg-[var(--soft)] cursor-pointer"
        onClick={() => setOpen((s) => !s)}
      >
        <div className="flex items-center gap-3">
          <div
            className="w-8 h-8 rounded-lg border border-[var(--border)]"
            style={{ background: hex }}
          />
          <div className="text-sm font-semibold text-[var(--ink)]">{hexText}</div>
        </div>

        <div className="text-xs text-[var(--muted)]">
          {open ? "Close" : "Pick"}
        </div>
      </button>

      {/* Panel */}
      {open && (
        <div className="rounded-2xl border border-[var(--border)] bg-[var(--panel)] shadow-[var(--shadow)] p-4">
          {/* Swatches */}
          <div className="flex gap-3">
            <div
              className="h-14 w-24 rounded-xl border border-[var(--border)]"
              style={{ background: hex }}
              title={hexText}
            />
            <div
              className="h-14 w-24 rounded-xl border border-[var(--border)]"
              style={{
                background: `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, ${clamp01(0.65)})`,
              }}
              title="Alt swatch"
            />
          </div>

          <div className="mt-4">
            <HexColorPicker color={hex} onChange={(c) => onChange(normalizeHex(c, fallback))} />
          </div>

          {/* Rows */}
          <div className="mt-4 space-y-2">
            <div className="flex items-center rounded-xl border border-[var(--border)] bg-white overflow-hidden">
              <div className="px-3 py-2 text-xs font-semibold text-[var(--muted)] w-14 border-r border-[var(--border)]">
                HEX
              </div>
              <input
                value={hexText}
                onChange={(e) => onChange(normalizeHex(e.target.value, fallback))}
                className="flex-1 px-3 py-2 text-sm text-[var(--ink)] outline-none bg-transparent"
              />
              <button
                type="button"
                className="px-3 py-2 text-[var(--muted)] hover:text-[var(--ink)] cursor-pointer"
                onClick={() => copy(hexText)}
                title="Copy HEX"
              >
                <CopyIcon />
              </button>
            </div>

            <div className="flex items-center rounded-xl border border-[var(--border)] bg-white overflow-hidden">
              <div className="px-3 py-2 text-xs font-semibold text-[var(--muted)] w-14 border-r border-[var(--border)]">
                RGB
              </div>
              <div className="flex-1 px-3 py-2 text-sm text-[var(--ink)]">{rgbText}</div>
              <button
                type="button"
                className="px-3 py-2 text-[var(--muted)] hover:text-[var(--ink)] cursor-pointer"
                onClick={() => copy(rgbText)}
                title="Copy RGB"
              >
                <CopyIcon />
              </button>
            </div>

            <div className="flex items-center rounded-xl border border-[var(--border)] bg-white overflow-hidden">
              <div className="px-3 py-2 text-xs font-semibold text-[var(--muted)] w-14 border-r border-[var(--border)]">
                HSL
              </div>
              <div className="flex-1 px-3 py-2 text-sm text-[var(--ink)]">{hslText}</div>
              <button
                type="button"
                className="px-3 py-2 text-[var(--muted)] hover:text-[var(--ink)] cursor-pointer"
                onClick={() => copy(hslText)}
                title="Copy HSL"
              >
                <CopyIcon />
              </button>
            </div>

            <div className="text-xs text-[var(--muted)]">
              Default is {fallback} when empty/invalid.
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
