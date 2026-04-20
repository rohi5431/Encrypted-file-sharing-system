import { useEffect, useState } from "react";
import api from "../api/axios";
import FileCard from "../components/FileCard";

export default function MyFiles() {
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api
      .get("/file/my-files")
      .then((res) => setFiles(res.data))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="mx-auto max-w-4xl">
        <h2 className="mb-6 text-2xl font-bold">My Files</h2>

        {loading && <p>Loading files...</p>}

        {!loading && files.length === 0 && (
          <p className="text-gray-500">No files uploaded yet.</p>
        )}

        <div className="space-y-4">
          {files.map((file) => (
            <FileCard key={file._id} file={file} />
          ))}
        </div>
      </div>
    </div>
  );
}
