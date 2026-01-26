function Card({ title, value, sub, className = "" }) {
  return (
    <div
      className={
        "rounded-2xl border border-[var(--border)] shadow-[var(--shadow)] p-5 " +
        className
      }
    >
      <div className="text-sm text-current/70">{title}</div>

      <div className="mt-2 text-3xl font-semibold tracking-tight text-current">
        {value}
      </div>

      {sub ? (
        <div className="mt-1 text-xs text-current/60">{sub}</div>
      ) : null}
    </div>
  );
}



export default function StatsCards({ appsCount, unreadTotal, activeTotal, sessionsTotal }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
      {/* Gradient only for Connected Apps */}
      <Card
        title="Connected Apps"
        value={appsCount}
        sub="API keys"
        className="bg-gradient-to-br from-[#ffe95c] to-[#f3d74f] border-black/5"
      />

      <Card
        title="Active Conversations"
        value={activeTotal}
        sub="Across all apps"
        className="bg-[var(--panel)]"
      />

      <Card
        title="Total Conversations"
        value={sessionsTotal}
        sub="Across all apps"
        className="bg-[var(--panel)]"
      />

<Card
  title="Unread Messages"
  value={unreadTotal}
  sub="Across all apps"
  className={`transition ${
    unreadTotal > 0
      ? "bg-[var(--danger)] text-white"
      : "bg-[var(--panel)]"
  }`}
/>



    </div>
  );
}
