import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { closeCreateApp } from "../store/uiSlice";
import { createAppThunk } from "../store/appsSlice";

export default function CreateAppModal() {
  const dispatch = useDispatch();
  const open = useSelector((s) => s.ui.createAppOpen);
  const token = useSelector((s) => s.auth.token);
  const [name, setName] = useState("");

  if (!open) return null;

  const create = async () => {
    if (!name.trim()) return;
    await dispatch(createAppThunk({ token, name: name.trim() }));
    setName("");
    dispatch(closeCreateApp());
  };

  return (
    <div className="fixed inset-0 bg-black/30 flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-[var(--panel)] border border-[var(--border)] shadow-[var(--shadow)] rounded-2xl p-6">
        <h3 className="text-lg font-semibold text-[var(--ink)]">
          Create App
        </h3>
        <p className="text-sm text-[var(--muted)] mt-1">
          Give it a name so you can differentiate apps.
        </p>

        <div className="mt-4">
          <label className="block text-xs font-semibold text-[var(--muted)] mb-2">
            App name
          </label>
          <input
            className="w-full bg-[var(--soft)] border border-[var(--border)] rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-[var(--primary)] text-sm text-[var(--ink)] placeholder:text-[var(--muted)]"
            placeholder="e.g. My Android App"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>

        <div className="mt-6 flex gap-2 justify-end">
          <button
            className="px-4 py-2 rounded-xl bg-[var(--panel)] border border-[var(--border)] text-[var(--ink)] font-semibold hover:bg-[var(--soft)]"
            onClick={() => dispatch(closeCreateApp())}
          >
            Cancel
          </button>

          <button
            className="px-4 py-2 rounded-xl bg-[var(--primary)] text-[var(--ink)] font-semibold shadow-sm hover:brightness-95 disabled:opacity-60"
            onClick={create}
            disabled={!name.trim()}
          >
            Create
          </button>
        </div>
      </div>
    </div>
  );
}
