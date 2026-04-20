import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const COLORS = ["#2563eb", "#e5e7eb"];

export default function AdminStoragePie({ totalStorage }) {
  const data = [
    { name: "Used Storage", value: totalStorage },
    { name: "Free Space", value: Math.max(1, 10 * 1024 * 1024 * 1024 - totalStorage) },
  ];

  return (
    <div className="rounded-xl bg-white p-6 shadow">
      <h3 className="mb-4 text-lg font-semibold text-gray-800">
        Storage Usage
      </h3>

      <ResponsiveContainer width="100%" height={260}>
        <PieChart>
          <Pie
            data={data}
            dataKey="value"
            innerRadius={60}
            outerRadius={90}
            paddingAngle={4}
          >
            {data.map((_, index) => (
              <Cell key={index} fill={COLORS[index]} />
            ))}
          </Pie>
          <Tooltip />
        </PieChart>
      </ResponsiveContainer>

      <p className="mt-2 text-center text-sm text-gray-500">
        Used: {(totalStorage / (1024 * 1024)).toFixed(2)} MB
      </p>
    </div>
  );
}
