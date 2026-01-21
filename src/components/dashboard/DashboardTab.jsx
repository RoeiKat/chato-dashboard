import StatsCards from "./StatsCards";
import ActivityChart from "./ActivityChart";
import ShiftsPanel from "./ShiftsPanel";
import Reminders from "./Reminders";

export default function DashboardTab({
  appsCount,
  unreadTotal,
  activeTotal,
  sessionsTotal,
  weekLabels,
  weekCounts,
}) {
  return (
    <div className="space-y-4">
      <StatsCards
        appsCount={appsCount}
        unreadTotal={unreadTotal}
        activeTotal={activeTotal}
        sessionsTotal={sessionsTotal}
      />

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">
        <div className="xl:col-span-2">
          <ActivityChart labels={weekLabels} values={weekCounts} />
        </div>

        <div className="space-y-4">
          <Reminders />
          <ShiftsPanel />
        </div>
      </div>
    </div>
  );
}
