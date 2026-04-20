export default function StatCard({ title, value, icon }) {
  return (
    <div className="
      flex items-center gap-4
      rounded-2xl
      border border-gray-200
      bg-white
      p-6
      shadow-sm
      hover:shadow-md
      transition
    ">
      {/* ICON */}
      <div className="
        flex h-12 w-12 items-center justify-center
        rounded-xl
        bg-blue-50
        text-blue-600
      ">
        {icon}
      </div>

      {/* TEXT */}
      <div>
        <p className="text-sm font-medium text-gray-500">
          {title}
        </p>

        <p className="mt-1 text-2xl font-semibold text-gray-900">
          {value}
        </p>
      </div>
    </div>
  );
}
