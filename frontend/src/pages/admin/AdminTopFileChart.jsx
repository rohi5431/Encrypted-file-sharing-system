import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

export default function AdminTopFileChart({ file }) {
  if (!file) {
    return (
      <div className="rounded-xl bg-white p-6 shadow text-gray-500">
        No download data available
      </div>
    );
  }

  const data = [
    {
      name: file.originalName,
      downloads: file.downloadCount,
    },
  ];

  return (
    <div className="rounded-xl bg-white p-6 shadow">
      <h3 className="mb-4 text-lg font-semibold text-gray-800">
        Most Downloaded File
      </h3>

      <ResponsiveContainer width="100%" height={260}>
        <BarChart data={data}>
          <XAxis dataKey="name" hide />
          <YAxis allowDecimals={false} />
          <Tooltip />
          <Bar dataKey="downloads" fill="#16a34a" radius={[6, 6, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>

      <p className="mt-2 text-sm text-gray-600">
        📄 {file.originalName}
      </p>
    </div>
  );
}
