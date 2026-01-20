import { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { appsApi } from "../../api/appsApi";
import { updateAppSettingsThunk } from "../../store/appsSlice";
import ColorPickerField from "../ui/ColorPickerField";

function safeColor(v, fallback = "#FFE95C") {
  const s = (v ?? "").toString().trim();
  if (!s || s === '"' || s === "null" || s === "undefined") return fallback;
  return s;
}

function safeText(v) {
  const s = (v ?? "").toString();
  if (s === "null" || s === "undefined" || s === '"') return "";
  return s;
}

function maskKey(key) {
  if (!key) return "";
  return "•".repeat(Math.max(24, key.length));
}

export default function AppSettings({ app, onBack }) {
  const dispatch = useDispatch();
  const token = useSelector((s) => s.auth.token);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [showKey, setShowKey] = useState(false);
  const [focused, setFocused] = useState(null);

  const [title, setTitle] = useState("");
  const [bubbleBg, setBubbleBg] = useState("#FFE95C");
  const [primary, setPrimary] = useState("#FFE95C");
  const [iconSvg, setIconSvg] = useState("");

  const [q1, setQ1] = useState("");
  const [q2, setQ2] = useState("");
  const [q3, setQ3] = useState("");

  useEffect(() => {
    if (!app?.apiKey) return;

    let stopped = false;
    (async () => {
      setLoading(true);
      try {
        const data = await appsApi.getConfig(app.apiKey);
        if (stopped) return;

        setTitle(safeText(data?.theme?.title));
        setBubbleBg(safeColor(data?.theme?.bubbleBg));
        setPrimary(safeColor(data?.theme?.primary));
        setIconSvg(safeText(data?.theme?.iconSvg));

        setQ1(safeText(data?.prechat?.q1));
        setQ2(safeText(data?.prechat?.q2));
        setQ3(safeText(data?.prechat?.q3));
      } finally {
        if (!stopped) setLoading(false);
      }
    })();

    return () => {
      stopped = true;
    };
  }, [app?.apiKey]);

  const onCopy = async () => {
    await navigator.clipboard.writeText(app.apiKey);
  };

  const onSave = async () => {
    setSaving(true);
    try {
      await dispatch(
        updateAppSettingsThunk({
          token,
          apiKey: app.apiKey,
          prechat: { q1, q2, q3 },
          theme: {
            bubbleBg: safeColor(bubbleBg),
            primary: safeColor(primary),
            iconSvg: safeText(iconSvg),
            title: safeText(title),
          },
        })
      ).unwrap();
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center gap-3">
        <button
          className="px-3 py-2 rounded-xl border border-[var(--border)] bg-[var(--panel)] text-[var(--ink)] hover:bg-[var(--soft)]"
          onClick={onBack}
        >
          ← Back
        </button>

        <div>
          <div className="text-2xl font-semibold text-[var(--ink)]">
            {app?.name}
          </div>
          <div className="text-sm text-[var(--muted)]">
            App configuration (theme + prechat)
          </div>
        </div>

        <div className="ml-auto">
          <button
            onClick={onSave}
            disabled={saving || loading}
            className={[
              "px-5 py-2.5 rounded-xl font-semibold transition-all",
              saving || loading
                ? "bg-[var(--primary)] opacity-60 cursor-not-allowed"
                : "bg-[var(--primary)] hover:brightness-95",
              "text-[var(--ink)]",
            ].join(" ")}
          >
            {saving ? "Saving..." : "Save changes"}
          </button>
        </div>
      </div>

      {/* API Key */}
      <div className="rounded-2xl border border-[var(--border)] bg-[var(--panel)] shadow-[var(--shadow)] p-5">
        <div className="flex items-center justify-between gap-3">
          <div>
            <div className="text-sm font-semibold text-[var(--ink)]">API Key</div>
            <div className="text-sm text-[var(--muted)]">
              Keep it private, your SDK uses it to connect.
            </div>
          </div>

          <div className="flex gap-2">
            <button
              className="px-3 py-2 rounded-xl border border-[var(--border)] bg-[var(--panel)]"
              onClick={() => setShowKey((s) => !s)}
            >
              {showKey ? "Hide" : "Show"}
            </button>
            <button
              className="px-3 py-2 rounded-xl bg-[var(--primary)] text-[var(--ink)] font-semibold"
              onClick={onCopy}
            >
              Copy
            </button>
          </div>
        </div>

        <div className="mt-3 font-medium tracking-widest text-[var(--ink)] select-none">
          {showKey ? app.apiKey : maskKey(app.apiKey)}
        </div>
      </div>

      {loading ? (
        <div className="rounded-2xl border border-[var(--border)] bg-[var(--panel)] p-6 text-[var(--muted)]">
          Loading settings...
        </div>
      ) : (
        <div className="grid gap-4 lg:grid-cols-2">
          {/* Theme */}
          <div className="rounded-2xl border border-[var(--border)] bg-[var(--panel)] p-5">
            <div className="text-lg font-semibold text-[var(--ink)]">Theme</div>

            <div className="mt-4 space-y-4">
              <div>
                <label className="text-sm font-semibold text-[var(--ink)]">
                  Chat title
                </label>
                <input
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Support"
                  className="mt-1 w-full rounded-xl border border-[var(--border)] bg-white px-3 py-2 text-sm"
                />
                <div className="text-xs text-[var(--muted)] mt-1">
                  Defaults to <b>Support</b> when empty
                </div>
              </div>

              <ColorPickerField
                label="Bubble Background"
                value={bubbleBg}
                onChange={setBubbleBg}
                fallback="#FFE95C"
              />

              <ColorPickerField
                label="Primary color"
                value={primary}
                onChange={setPrimary}
                fallback="#FFE95C"
              />

              <div>
                <label className="text-sm font-semibold text-[var(--ink)]">
                  iconSvg (optional)
                </label>
                <textarea
                  value={iconSvg}
                  onChange={(e) => setIconSvg(e.target.value)}
                  rows={6}
                  className="mt-1 w-full rounded-xl border border-[var(--border)] bg-white px-3 py-2 text-sm"
                />
              </div>
            </div>
          </div>

          {/* Prechat */}
          <div className="rounded-2xl border border-[var(--border)] bg-[var(--panel)] p-5">
            <div className="text-lg font-semibold text-[var(--ink)]">Prechat</div>

            <div className="mt-4 space-y-4">
              {/* q1 */}
              <div>
                <label className="text-sm font-semibold text-[var(--ink)]">q1</label>
                <textarea
                  value={q1}
                  onChange={(e) => setQ1(e.target.value)}
                  onFocus={() => setFocused("q1")}
                  onBlur={() => setFocused(null)}
                  rows={2}
                  className="mt-1 w-full rounded-xl border border-[var(--border)] bg-white px-3 py-2 text-sm"
                />
                {focused === "q1" && (
                  <div className="mt-2 text-xs text-[var(--muted)]">
                  This message is used to ask the customer for their name so you can personalize the conversation.                  </div>
                )}
              </div>

              {/* q2 */}
              <div>
                <label className="text-sm font-semibold text-[var(--ink)]">q2</label>
                <textarea
                  value={q2}
                  onChange={(e) => setQ2(e.target.value)}
                  onFocus={() => setFocused("q2")}
                  onBlur={() => setFocused(null)}
                  rows={2}
                  className="mt-1 w-full rounded-xl border border-[var(--border)] bg-white px-3 py-2 text-sm"
                />
                {focused === "q2" && (
                  <div className="mt-2 text-xs text-[var(--muted)]">
                  This message asks for the customer’s email, which is used to contact them if they leave the chat before it’s answered.
                  </div>
                )}
              </div>

              {/* q3 */}
              <div>
                <label className="text-sm font-semibold text-[var(--ink)]">q3</label>
                <textarea
                  value={q3}
                  onChange={(e) => setQ3(e.target.value)}
                  onFocus={() => setFocused("q3")}
                  onBlur={() => setFocused(null)}
                  rows={2}
                  className="mt-1 w-full rounded-xl border border-[var(--border)] bg-white px-3 py-2 text-sm"
                />
                {focused === "q3" && (
                  <div className="mt-2 text-xs text-[var(--muted)]">
                  This message is shown after the prechat questions. You can use it to share FAQs, helpful information, or thank the customer while they wait for a response.
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
