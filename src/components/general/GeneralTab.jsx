export default function GeneralTab({ onLogout }) {
  return (
    <div className="space-y-3">
      <div>
        <div className="text-2xl font-semibold">General</div>
        <div className="text-sm text-zinc-500">Account</div>
      </div>

<div className="rounded-2xl border border-[var(--border)] bg-[var(--panel)] shadow-[var(--shadow)] p-5 flex items-center justify-between">
        <div>
<button
  className="px-4 py-2 rounded-xl bg-[var(--danger)] text-white font-semibold shadow-sm hover:brightness-95"
  onClick={onLogout}
>
  Logout
</button>
          <div className="text-sm text-zinc-500">Sign out from Chato</div>
        </div>
        <button
          className="px-4 py-2 rounded-xl border border-zinc-700 hover:border-zinc-500"
          onClick={onLogout}
        >
          Logout
        </button>
      </div>
    </div>
  );
}
