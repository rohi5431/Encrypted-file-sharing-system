import { useState } from "react";
import api from "../api/axios";
import ProgressBar from "../components/ProgressBar";

export default function Upload() {
  const [file, setFile] = useState(null);
  const [progress, setProgress] = useState(0);
  const [status, setStatus] = useState("");

  const uploadFile = async (ignoreDLP = false) => {
    if (!file) return alert("Please select a file");

    const formData = new FormData();
    formData.append("file", file);
    if (ignoreDLP === true) {
      formData.append("ignoreDLP", "true");
    }

    setStatus("");
    try {
      await api.post("/file/upload", formData, {
        onUploadProgress: (e) => {
          const percent = Math.round((e.loaded * 100) / e.total);
          setProgress(percent);
        },
      });
      setStatus("File uploaded securely ✅");
      setFile(null);
      setProgress(0);
    } catch (err) {
      if (err?.response?.data?.warning) {
        const proceed = window.confirm(err.response.data.message);
        if (proceed) {
          return uploadFile(true);
        } else {
          setStatus("Upload cancelled.");
          setProgress(0);
          return;
        }
      }
      setStatus("Upload failed ❌");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="mx-auto max-w-xl rounded-xl bg-white p-6 shadow">
        <h2 className="mb-4 text-xl font-bold">Upload Secure File</h2>

        <input
          type="file"
          onChange={(e) => setFile(e.target.files[0])}
          className="w-full rounded border p-2"
        />

        {progress > 0 && <ProgressBar value={progress} />}

        <button
          onClick={uploadFile}
          className="mt-4 w-full rounded bg-blue-600 py-2 text-white hover:bg-blue-700"
        >
          Upload
        </button>

        {status && (
          <p className="mt-3 text-center text-sm text-gray-600">{status}</p>
        )}
      </div>
    </div>
  );
}
