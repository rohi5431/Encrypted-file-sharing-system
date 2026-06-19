import { useState, useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { motion, AnimatePresence } from "framer-motion";
import { Upload, File, X, CircleCheck as CheckCircle, TriangleAlert as AlertTriangle, Shield } from "lucide-react";
import toast from "react-hot-toast";

import { DashboardLayout } from "@/components/layout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, Button, Progress, Alert } from "@/components/ui";
import api from "@/api/axios";
import { formatBytes, cn } from "@/lib/utils";

function UploadPage() {
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [dlpWarning, setDlpWarning] = useState(null);
  const [success, setSuccess] = useState(false);

  const onDrop = useCallback((acceptedFiles) => {
    if (acceptedFiles.length > 0) {
      setFile(acceptedFiles[0]);
      setDlpWarning(null);
      setSuccess(false);
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    multiple: false,
  });

  const handleUpload = async (ignoreDLP = false) => {
    if (!file) return;

    const formData = new FormData();
    formData.append("file", file);
    if (ignoreDLP) formData.append("ignoreDLP", "true");

    setUploading(true);
    setProgress(0);
    setDlpWarning(null);

    try {
      await api.post("/file/upload", formData, {
        onUploadProgress: (e) => {
          setProgress(Math.round((e.loaded * 100) / e.total));
        },
      });

      setSuccess(true);
      toast.success("File uploaded successfully!");
      setFile(null);

      setTimeout(() => {
        setSuccess(false);
      }, 3000);
    } catch (err) {
      if (err?.response?.data?.warning) {
        setDlpWarning(err.response.data.message);
      } else {
        toast.error(err?.response?.data?.message || "Upload failed");
      }
    } finally {
      setUploading(false);
      setProgress(0);
    }
  };

  return (
    <DashboardLayout>
      <div className="mx-auto max-w-3xl space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-2xl font-bold text-foreground">Upload File</h1>
          <p className="text-muted-foreground mt-1">
            Upload and encrypt your files securely
          </p>
        </div>

        {/* Upload Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <Card>
            <CardContent className="p-8">
              {/* Dropzone */}
              <div
                {...getRootProps()}
                className={cn(
                  "relative flex flex-col items-center justify-center rounded-xl border-2 border-dashed p-12 transition-all cursor-pointer",
                  isDragActive
                    ? "border-accent bg-accent/5"
                    : "border-border hover:border-muted-foreground/50",
                  file && "border-success bg-success/5"
                )}
              >
                <input {...getInputProps()} />

                <AnimatePresence mode="wait">
                  {file ? (
                    <motion.div
                      key="file"
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="text-center"
                    >
                      <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-success/10">
                        <File className="h-8 w-8 text-success" />
                      </div>
                      <p className="text-lg font-medium text-foreground">
                        {file.name}
                      </p>
                      <p className="text-sm text-muted-foreground mt-1">
                        {formatBytes(file.size)}
                      </p>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setFile(null);
                          setDlpWarning(null);
                        }}
                        className="mt-4 inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-destructive transition-colors"
                      >
                        <X className="h-4 w-4" />
                        Remove
                      </button>
                    </motion.div>
                  ) : (
                    <motion.div
                      key="upload"
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="text-center"
                    >
                      <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-muted">
                        <Upload className="h-8 w-8 text-muted-foreground" />
                      </div>
                      <p className="text-lg font-medium text-foreground">
                        {isDragActive
                          ? "Drop your file here"
                          : "Drag and drop your file"}
                      </p>
                      <p className="text-sm text-muted-foreground mt-1">
                        or click to browse
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* DLP Warning */}
              <AnimatePresence>
                {dlpWarning && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    className="mt-6 overflow-hidden"
                  >
                    <Alert
                      variant="warning"
                      icon={<AlertTriangle className="h-4 w-4" />}
                      title="Sensitive Data Detected"
                      description={dlpWarning}
                    />
                    <div className="mt-4 flex items-center gap-3">
                      <Button
                        variant="outline"
                        onClick={() => {
                          setFile(null);
                          setDlpWarning(null);
                        }}
                      >
                        Cancel
                      </Button>
                      <Button
                        variant="accent"
                        onClick={() => handleUpload(true)}
                      >
                        Upload Anyway
                      </Button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Progress */}
              <AnimatePresence>
                {uploading && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    className="mt-6 overflow-hidden"
                  >
                    <Progress value={progress} />
                    <p className="text-sm text-muted-foreground text-center mt-2">
                      {progress < 100
                        ? `Encrypting and uploading... ${progress}%`
                        : "Finalizing..."}
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Success */}
              <AnimatePresence>
                {success && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    className="mt-6 flex items-center justify-center gap-3 p-4 rounded-xl bg-success/10 text-success"
                  >
                    <CheckCircle className="h-5 w-5" />
                    <span className="font-medium">File uploaded successfully!</span>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Upload Button */}
              {!dlpWarning && !uploading && !success && (
                <Button
                  className="w-full mt-6 h-12"
                  disabled={!file}
                  onClick={() => handleUpload(false)}
                >
                  <Shield className="mr-2 h-4 w-4" />
                  Upload & Encrypt
                </Button>
              )}
            </CardContent>
          </Card>
        </motion.div>

        {/* Info Cards */}
        <div className="grid gap-4 sm:grid-cols-3">
          {[
            {
              title: "AES-256 Encryption",
              description: "Military-grade encryption for all files",
            },
            {
              title: "DLP Scanner",
              description: "AI-powered sensitive data detection",
            },
            {
              title: "Secure Storage",
              description: "Files stored encrypted in cloud or local",
            },
          ].map((item, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 * (i + 1) }}
            >
              <Card className="h-full">
                <CardContent className="p-4">
                  <h3 className="font-medium text-foreground text-sm">
                    {item.title}
                  </h3>
                  <p className="text-xs text-muted-foreground mt-1">
                    {item.description}
                  </p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </DashboardLayout>
  );
}

export default UploadPage;
