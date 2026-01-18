import StatsCards from "./StatsCards";
import ActivityChart from "./ActivityChart";
import TimeTracker from "./TimeTracker";

export default function DashboardTab({ appsCount, unreadTotal }) {
  const base = Math.floor(unreadTotal / 7);
  const rem = unreadTotal % 7;
  const values = Array.from({ length: 7 }).map((_, i) => base + (i < rem ? 1 : 0));

  return (
    <div className="space-y-4">
      <StatsCards appsCount={appsCount} unreadTotal={unreadTotal} />

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">
        <div className="xl:col-span-2">
          <ActivityChart values={values} />
        </div>
        <TimeTracker />
      </div>
    </div>
  );
}
