export default function AccessDenied() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100">
      <div className="rounded bg-white p-8 text-center shadow">
        <h1 className="mb-2 text-2xl font-bold text-red-500">403</h1>
        <p className="text-gray-600">You do not have permission to access this page.</p>
      </div>
    </div>
  );
}
