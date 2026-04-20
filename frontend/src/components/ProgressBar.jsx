export default function ProgressBar({ value }) {
  return (
    <div className="mt-3 h-3 w-full rounded bg-gray-200">
      <div
        className="h-3 rounded bg-blue-600 transition-all"
        style={{ width: `${value}%` }}
      />
    </div>
  );
}
