import { useEffect, useState, useContext } from "react";
import { Link, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Folder, Upload, Shield, HardDrive, Share2, Download, MoveVertical as MoreVertical, FileText, Image, FileCode, FileArchive } from "lucide-react";
import toast from "react-hot-toast";

import { DashboardLayout } from "@/components/layout";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
  Button,
  Progress,
  Badge,
  EmptyState,
  Dropdown,
  DropdownItem,
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
  SkeletonCard,
} from "@/components/ui";
import { formatBytes, formatDate, cn } from "@/lib/utils";
import api from "@/api/axios";
import { AuthContext } from "@/context/AuthContext";
import useIdleLogout from "@/hooks/useIdleLogout";

const statCards = [
  { title: "Total Files", icon: Folder, key: "totalFiles" },
  { title: "Storage Used", icon: HardDrive, key: "storage" },
  { title: "Shared", icon: Share2, key: "shared" },
  { title: "Security", icon: Shield, key: "security" },
];

const getFileIcon = (type) => {
  if (type?.startsWith("image/")) return Image;
  if (type?.startsWith("text/")) return FileText;
  if (type?.includes("javascript") || type?.includes("json")) return FileCode;
  if (type?.includes("zip") || type?.includes("rar")) return FileArchive;
  return FileText;
};

export default function Dashboard() {
  const { user, loadUser } = useContext(AuthContext);
  const location = useLocation();

  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [uploadModal, setUploadModal] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [selectedFile, setSelectedFile] = useState(null);

  /* OAuth token handling */
  useEffect(() => {
    const token = new URLSearchParams(location.search).get("token");
    if (token) {
      localStorage.setItem("token", token);
      loadUser();
    }
  }, [location.search]);

  /* Fetch files */
  useEffect(() => {
    fetchFiles();
  }, []);

  const fetchFiles = async () => {
    try {
      const res = await api.get("/file/my-files");
      setFiles(res.data.files || []);
    } catch (err) {
      console.error("Failed to fetch files:", err);
    } finally {
      setLoading(false);
    }
  };

  /* Upload logic */
  const handleUpload = async (ignoreDLP = false) => {
    if (!selectedFile) {
      toast.error("Please select a file");
      return;
    }

    const formData = new FormData();
    formData.append("file", selectedFile);
    if (ignoreDLP) formData.append("ignoreDLP", "true");

    setUploading(true);
    setUploadProgress(0);

    try {
      await api.post("/file/upload", formData, {
        onUploadProgress: (e) =>
          setUploadProgress(Math.round((e.loaded * 100) / e.total)),
      });

      toast.success("File uploaded successfully!");
      setUploadModal(false);
      setSelectedFile(null);
      fetchFiles();
    } catch (err) {
      if (err?.response?.data?.warning) {
        const proceed = window.confirm(err.response.data.message);
        if (proceed) return handleUpload(true);
        toast.error("Upload cancelled for security");
      } else {
        toast.error(err?.response?.data?.message || "Upload failed");
      }
    } finally {
      setUploading(false);
      setUploadProgress(0);
    }
  };

  useIdleLogout();

  /* Stats calculation */
  const stats = {
    totalFiles: files.length,
    storage: formatBytes(files.reduce((s, f) => s + (f.size || 0), 0)),
    shared: files.filter((f) => f.shared).length,
    security: "Protected",
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-2xl font-bold text-foreground">
              Welcome back, {user?.name?.split(" ")[0] || "User"}
            </h1>
            <p className="text-muted-foreground mt-1">
              Here's an overview of your secure files
            </p>
          </div>

          <Button onClick={() => setUploadModal(true)}>
            <Upload className="mr-2 h-4 w-4" />
            Upload File
          </Button>
        </div>

        {/* Stats Grid */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {statCards.map((stat, i) => (
            <motion.div
              key={stat.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
            >
              <Card className="hover:shadow-md transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">
                        {stat.title}
                      </p>
                      <p className="text-2xl font-bold text-foreground mt-1">
                        {stats[stat.key]}
                      </p>
                    </div>
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-accent/10">
                      <stat.icon className="h-6 w-6 text-accent" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Recent Files */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Recent Files</CardTitle>
                <CardDescription>
                  Your recently uploaded files
                </CardDescription>
              </div>
              <Link to="/files">
                <Button variant="ghost" size="sm">
                  View all
                </Button>
              </Link>
            </CardHeader>

            <CardContent>
              {loading ? (
                <div className="space-y-4">
                  {[...Array(3)].map((_, i) => (
                    <div key={i} className="h-16 skeleton rounded-lg" />
                  ))}
                </div>
              ) : files.length === 0 ? (
                <EmptyState
                  icon={<Folder className="h-8 w-8" />}
                  title="No files yet"
                  description="Upload your first file to get started"
                  action={
                    <Button onClick={() => setUploadModal(true)}>
                      <Upload className="mr-2 h-4 w-4" />
                      Upload File
                    </Button>
                  }
                />
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>File</TableHead>
                      <TableHead>Size</TableHead>
                      <TableHead>Uploaded</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {files.slice(0, 5).map((file) => {
                      const Icon = getFileIcon(file.mimeType);
                      return (
                        <TableRow key={file._id}>
                          <TableCell>
                            <div className="flex items-center gap-3">
                              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-muted">
                                <Icon className="h-5 w-5 text-muted-foreground" />
                              </div>
                              <div>
                                <p className="font-medium text-foreground">
                                  {file.originalName}
                                </p>
                                <p className="text-xs text-muted-foreground">
                                  {file.mimeType || "Unknown"}
                                </p>
                              </div>
                            </div>
                          </TableCell>
                          <TableCell className="text-muted-foreground">
                            {formatBytes(file.size)}
                          </TableCell>
                          <TableCell className="text-muted-foreground">
                            {formatDate(file.createdAt)}
                          </TableCell>
                          <TableCell className="text-right">
                            <Dropdown
                              align="right"
                              trigger={
                                <Button variant="ghost" size="icon">
                                  <MoreVertical className="h-4 w-4" />
                                </Button>
                              }
                            >
                              <DropdownItem
                                icon={<Download className="h-4 w-4" />}
                                onClick={() => {
                                  api
                                    .get(`/file/download/${file._id}`, {
                                      responseType: "blob",
                                    })
                                    .then((res) => {
                                      const url = window.URL.createObjectURL(
                                        res.data
                                      );
                                      const a = document.createElement("a");
                                      a.href = url;
                                      a.download = file.originalName;
                                      a.click();
                                    });
                                }}
                              >
                                Download
                              </DropdownItem>
                              <DropdownItem
                                icon={<Share2 className="h-4 w-4" />}
                                onClick={() => {
                                  window.location.href = `/share/${file._id}`;
                                }}
                              >
                                Share
                              </DropdownItem>
                            </Dropdown>
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Upload Modal */}
      <AnimatePresence>
        {uploadModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm"
            onClick={() => !uploading && setUploadModal(false)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-lg rounded-xl bg-card border border-border p-6 shadow-xl"
            >
              <h2 className="text-xl font-bold text-foreground mb-4">
                Upload File
              </h2>

              <div className="mb-6">
                <label className="flex flex-col items-center justify-center w-full h-40 border-2 border-dashed border-border rounded-xl bg-muted/50 hover:bg-muted cursor-pointer transition-colors">
                  {selectedFile ? (
                    <div className="text-center">
                      <FileText className="h-10 w-10 mx-auto text-muted-foreground mb-2" />
                      <p className="text-sm font-medium text-foreground">
                        {selectedFile.name}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {formatBytes(selectedFile.size)}
                      </p>
                    </div>
                  ) : (
                    <div className="text-center">
                      <Upload className="h-10 w-10 mx-auto text-muted-foreground mb-2" />
                      <p className="text-sm font-medium text-foreground">
                        Click to upload
                      </p>
                      <p className="text-xs text-muted-foreground">
                        or drag and drop
                      </p>
                    </div>
                  )}
                  <input
                    type="file"
                    className="hidden"
                    onChange={(e) => setSelectedFile(e.target.files[0])}
                  />
                </label>
              </div>

              {uploading && (
                <div className="mb-6">
                  <Progress value={uploadProgress} />
                  <p className="text-sm text-muted-foreground text-center mt-2">
                    {uploadProgress}% uploaded
                  </p>
                </div>
              )}

              <div className="flex justify-end gap-3">
                <Button
                  variant="outline"
                  onClick={() => setUploadModal(false)}
                  disabled={uploading}
                >
                  Cancel
                </Button>
                <Button
                  onClick={() => handleUpload(false)}
                  loading={uploading}
                  disabled={!selectedFile || uploading}
                >
                  Upload
                </Button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </DashboardLayout>
  );
}
