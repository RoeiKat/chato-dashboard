export default function DeleteAppModal({ open, appName, onCancel, onConfirm }) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black/30 flex items-center justify-center p-4 z-50">
      <div className="w-full max-w-md bg-[var(--panel)] border border-[var(--border)] shadow-[var(--shadow)] rounded-2xl p-6">
        <div className="text-lg font-semibold text-[var(--ink)]">
          Delete "{appName}"?
        </div>

        <div className="mt-4 text-sm text-[var(--ink)]">
          <div className="font-semibold mb-2">This will permanently delete:</div>
          <ul className="list-disc pl-5 space-y-1 text-[var(--ink)]">
            <li>the API key</li>
            <li>sessions</li>
            <li>messages</li>
          </ul>

          <div className="mt-4 text-[var(--muted)]">This cannot be undone.</div>
        </div>

        <div className="mt-6 flex gap-2 justify-end">
          <button
            className="px-4 py-2 rounded-xl bg-[var(--panel)] border border-[var(--border)] text-[var(--ink)] font-semibold hover:bg-[var(--soft)] cursor-pointer"
            onClick={onCancel}
          >
            Cancel
          </button>

          <button
            className="px-4 py-2 rounded-xl bg-[var(--danger)] text-white font-semibold hover:brightness-95 cursor-pointer"
            onClick={onConfirm}
          >
            Delete anyway
          </button>
        </div>
      </div>
    </div>
  );
}
