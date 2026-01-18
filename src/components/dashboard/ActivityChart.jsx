import {
  Chart as ChartJS,
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
} from "chart.js";
import { Bar } from "react-chartjs-2";

ChartJS.register(BarElement, CategoryScale, LinearScale, Tooltip);

export default function ActivityChart({ values }) {
  const labels = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  const data = {
    labels,
    datasets: [
      {
        label: "Activity",
        data: values,
        backgroundColor: "rgba(255, 233, 92, 0.85)", // uses your primary visually
        borderRadius: 10,
        barThickness: 18,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: { legend: { display: false } },
    scales: {
      x: {
        grid: { display: false },
        ticks: { color: "#6b7280" },
        border: { display: false },
      },
      y: {
        grid: { color: "rgba(0,0,0,0.06)" },
        ticks: { color: "#6b7280" },
        border: { display: false },
      },
    },
  };

  return (
    <div className="rounded-2xl border border-[var(--border)] bg-[var(--panel)] shadow-[var(--shadow)] p-5">
      <div className="flex items-center justify-between">
        <div>
          <div className="text-sm text-[var(--muted)]">Project Analytics</div>
          <div className="text-xs text-[var(--muted)] mt-1">
            Placeholder until you wire message counts
          </div>
        </div>
        <div className="text-xs text-[var(--muted)]">Last 7 days</div>
      </div>

      <div className="mt-4">
        <Bar data={data} options={options} />
      </div>
    </div>
  );
}
