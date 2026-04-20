import { Link } from "react-router-dom";

export default function FileCard({ file }) {
  return (
    <div className="flex items-center justify-between rounded-lg border bg-white p-4 shadow-sm">
      <div>
        <p className="font-medium">{file.filename}</p>
        <p className="text-sm text-gray-500">
          {(file.size / 1024).toFixed(2)} KB · Expires:{" "}
          {new Date(file.expiresAt).toLocaleString()}
        </p>
      </div>

      <Link
        to={`/share/${file._id}`}
        className="rounded bg-blue-600 px-4 py-2 text-sm text-white hover:bg-blue-700"
      >
        Share
      </Link>
    </div>
  );
}
