import {
  Chart as ChartJS,
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
} from "chart.js";
import { Bar } from "react-chartjs-2";

ChartJS.register(BarElement, CategoryScale, LinearScale, Tooltip);

export default function ActivityChart({ labels, values }) {
  const safeLabels =
    Array.isArray(labels) && labels.length === 7
      ? labels
      : ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  const safeValues =
    Array.isArray(values) && values.length === 7 ? values : [0, 0, 0, 0, 0, 0, 0];

  const data = {
    labels: safeLabels,
    datasets: [
      {
        label: "Messages",
        data: safeValues,
        backgroundColor: "rgba(255, 233, 92, 0.85)",
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
        ticks: { color: "#6b7280", precision: 0 },
        border: { display: false },
        beginAtZero: true,
      },
    },
  };

  return (
    <div className="rounded-2xl border border-[var(--border)] bg-[var(--panel)] shadow-[var(--shadow)] p-5">
      <div className="flex items-center justify-between">
        <div>
          <div className="text-sm text-[var(--muted)]">Messages Analytics</div>
          <div className="text-xs text-[var(--muted)] mt-1">
            Messages per day (last 7 days)
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
