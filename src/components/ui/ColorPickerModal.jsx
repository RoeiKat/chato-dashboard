import { HexColorPicker } from "react-colorful";
import { useMemo } from "react";

function normalizeHex(value, fallback = "#FFE95C") {
  const v = (value ?? "").toString().trim();
  if (!v || v === '"' || v === "null" || v === "undefined") return fallback;
  let hex = v.startsWith("#") ? v : `#${v}`;
  if (!/^#[0-9a-fA-F]{6}$/.test(hex)) return fallback;
  return hex.toUpperCase();
}

export default function ColorPickerModal({
  open,
  onClose,
  label,
  value,
  onChange,
  fallback = "#FFE95C",
}) {
  const hex = useMemo(() => normalizeHex(value, fallback), [value, fallback]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[200] grid place-items-center px-4">
      {/* Backdrop */}
      <button
        className="absolute inset-0 bg-black/50"
        onClick={onClose}
        aria-label="Close backdrop"
      />

      {/* Modal */}
      <div className="relative w-full max-w-sm rounded-3xl bg-white border border-zinc-200 shadow-2xl p-6">
        <div className="flex flex-col items-center text-center gap-5">
          {/* Header */}
          <div className="w-full flex items-center justify-between">
            <div className="font-semibold text-lg">{label}</div>
            <button
              onClick={onClose}
              className="h-9 w-9 rounded-xl hover:bg-zinc-100 grid place-items-center"
            >
              ✕
            </button>
          </div>

          {/* Swatch + HEX */}
          <div className="flex items-center gap-4">
            <div
              className="h-14 w-14 rounded-xl border"
              style={{ background: hex }}
            />
            <div className="text-md font-semibold text-zinc-700">{hex}</div>
          </div>

          {/* Picker */}
          <div className="flex justify-center">
            <HexColorPicker
              color={hex}
              onChange={(c) => onChange(normalizeHex(c, fallback))}
              style={{ width: 220, height: 160 }}
            />
          </div>

          {/* Action */}
          <button
            onClick={onClose}
            className="mt-2 w-full rounded-xl bg-[var(--primary)] py-2.5 text-sm font-semibold text-[var(--ink)] hover:brightness-95"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
}
