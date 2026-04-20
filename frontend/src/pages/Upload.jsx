import { useState } from "react";
import api from "../api/axios";
import ProgressBar from "../components/ProgressBar";

export default function Upload() {
  const [file, setFile] = useState(null);
  const [progress, setProgress] = useState(0);
  const [status, setStatus] = useState("");

  const uploadFile = async (ignoreDLP = false) => {
    if (!file) {
      alert("Please select a file");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);
    if (ignoreDLP === true) {
      formData.append("ignoreDLP", "true");
    }

    setStatus("");
    setProgress(0);

    try {
      await api.post("/file/upload", formData, {
        onUploadProgress: (e) =>
          setProgress(Math.round((e.loaded * 100) / e.total)),
      });

      setStatus("File uploaded securely ✅");
      setFile(null);
      setProgress(0);
    } catch (err) {
      console.error("UPLOAD ERROR:", err);
      
      if (err?.response?.data?.warning) {
        const proceed = window.confirm(err.response.data.message);
        if (proceed) {
          return uploadFile(true);
        } else {
          setStatus("Upload cancelled to protect sensitive data.");
          setProgress(0);
          return;
        }
      }

      setStatus(
        err?.response?.data?.message ||
          err.message ||
          "Upload failed ❌"
      );
    }
  };

  return (
    <div className="min-h-screen bg-slate-100 p-10">
      <div className="mx-auto max-w-3xl rounded-2xl bg-white p-10 shadow">

        {/* HEADER */}
        <h2 className="text-3xl font-semibold text-slate-800">
          Upload Secure File
        </h2>
        <p className="mt-2 text-base text-slate-500">
          Your files are encrypted and stored securely
        </p>

        {/* DROP ZONE */}
        <div className="mt-10 rounded-xl border-2 border-dashed border-slate-300 bg-slate-50 p-12 text-center">
          <div className="text-5xl">📁</div>

          <p className="mt-4 text-lg font-medium text-slate-700">
            Drag & drop your file here
          </p>
          <p className="mt-1 text-sm text-slate-500">
            or select a file from your device
          </p>

          <label className="mt-6 inline-block cursor-pointer rounded-lg bg-slate-800 px-8 py-3 text-base font-medium text-white hover:bg-slate-900">
            Choose File
            <input
              type="file"
              hidden
              onChange={(e) => setFile(e.target.files[0])}
            />
          </label>

          {file && (
            <p className="mt-4 text-sm text-slate-600">
              Selected file: <span className="font-medium">{file.name}</span>
            </p>
          )}
        </div>

        {/* PROGRESS */}
        {progress > 0 && (
          <div className="mt-6">
            <ProgressBar value={progress} />
          </div>
        )}

        {/* UPLOAD BUTTON */}
        <button
          onClick={uploadFile}
          className="mt-8 w-full rounded-xl bg-slate-800 py-4 text-lg font-medium text-white hover:bg-slate-900"
        >
          Upload File
        </button>

        {/* STATUS */}
        {status && (
          <p className="mt-4 text-center text-base text-slate-600">
            {status}
          </p>
        )}
      </div>
    </div>
  );
}
