import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  LineElement,
  PointElement,
  Tooltip,
  Legend,
} from "chart.js";
import { Line } from "react-chartjs-2";

ChartJS.register(
  CategoryScale,
  LinearScale,
  LineElement,
  PointElement,
  Tooltip,
  Legend
);

export default function UploadChart({ data }) {
  const chartData = {
    labels: data.map((d) => d.date),
    datasets: [
      {
        label: "Uploads per Day",
        data: data.map((d) => d.count),
        borderColor: "#2563eb",
        backgroundColor: "#93c5fd",
      },
    ],
  };

  return (
    <div className="rounded-xl bg-white p-6 shadow">
      <h3 className="mb-4 font-semibold">Daily Uploads</h3>
      <Line data={chartData} />
    </div>
  );
}
