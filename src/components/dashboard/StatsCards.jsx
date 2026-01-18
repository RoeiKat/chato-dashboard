function Card({ title, value, sub }) {
  return (
    <div className="rounded-2xl border border-[var(--border)] bg-[var(--panel)] shadow-[var(--shadow)] p-5">
      <div className="text-sm text-[var(--muted)]">{title}</div>
      <div className="mt-2 text-3xl font-semibold tracking-tight text-[var(--ink)]">
        {value}
      </div>
      {sub ? <div className="mt-1 text-xs text-[var(--muted)]">{sub}</div> : null}
    </div>
  );
}

export default function StatsCards({ appsCount, unreadTotal }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
      <Card title="Connected Apps" value={appsCount} sub="API keys" />
      <Card title="Unread Messages" value={unreadTotal} sub="All apps" />
      <Card title="Active Conversations" value="—" sub="Later (no backend changes)" />
      <Card title="Total Conversations" value="—" sub="Later (no backend changes)" />
    </div>
  );
}
