import { useEffect, useState, useContext } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Folder, Upload, Download, Share2, Trash2, MoveVertical as MoreVertical, FileText, Image, FileCode, FileArchive, Search, Grid3x2 as Grid3X3, List } from "lucide-react";
import toast from "react-hot-toast";

import { DashboardLayout } from "@/components/layout";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  Button,
  Input,
  Badge,
  EmptyState,
  Dropdown,
  DropdownItem,
  DropdownSeparator,
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
  AlertDialog,
} from "@/components/ui";
import { formatBytes, formatDate, cn } from "@/lib/utils";
import api from "@/api/axios";
import { AuthContext } from "@/context/AuthContext";

const getFileIcon = (type) => {
  if (type?.startsWith("image/")) return Image;
  if (type?.startsWith("text/")) return FileText;
  if (type?.includes("javascript") || type?.includes("json")) return FileCode;
  if (type?.includes("zip") || type?.includes("rar")) return FileArchive;
  return FileText;
};

const getFileTypeColor = (type) => {
  if (type?.startsWith("image/")) return "bg-pink-500/10 text-pink-500";
  if (type?.startsWith("text/")) return "bg-blue-500/10 text-blue-500";
  if (type?.includes("pdf")) return "bg-red-500/10 text-red-500";
  if (type?.includes("zip") || type?.includes("rar")) return "bg-yellow-500/10 text-yellow-500";
  return "bg-gray-500/10 text-gray-500";
};

export default function MyFiles() {
  const { user } = useContext(AuthContext);
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [viewMode, setViewMode] = useState("table");
  const [deleteDialog, setDeleteDialog] = useState({ open: false, file: null });

  useEffect(() => {
    fetchFiles();
  }, []);

  const fetchFiles = async () => {
    try {
      const res = await api.get("/file/my-files");
      setFiles(res.data.files || []);
    } catch (err) {
      console.error("Failed to fetch files:", err);
      toast.error("Failed to load files");
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = async (file) => {
    try {
      const res = await api.get(`/file/download/${file._id}`, {
        responseType: "blob",
      });
      const url = window.URL.createObjectURL(res.data);
      const a = document.createElement("a");
      a.href = url;
      a.download = file.originalName;
      a.click();
      toast.success("Download started");
    } catch (err) {
      toast.error("Download failed");
    }
  };

  const handleDelete = async () => {
    if (!deleteDialog.file) return;

    try {
      await api.delete(`/admin/file/${deleteDialog.file._id}`);
      setFiles((prev) => prev.filter((f) => f._id !== deleteDialog.file._id));
      toast.success("File deleted");
    } catch (err) {
      toast.error("Failed to delete file");
    } finally {
      setDeleteDialog({ open: false, file: null });
    }
  };

  const filteredFiles = files.filter(
    (f) =>
      f.originalName?.toLowerCase().includes(search.toLowerCase()) ||
      f.mimeType?.toLowerCase().includes(search.toLowerCase())
  );

  const totalStorage = files.reduce((sum, f) => sum + (f.size || 0), 0);

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-2xl font-bold text-foreground">My Files</h1>
            <p className="text-muted-foreground mt-1">
              {files.length} files · {formatBytes(totalStorage)} used
            </p>
          </div>

          <Link to="/upload">
            <Button>
              <Upload className="mr-2 h-4 w-4" />
              Upload File
            </Button>
          </Link>
        </div>

        {/* Toolbar */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="relative max-w-sm flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <input
              type="search"
              placeholder="Search files..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="h-10 w-full rounded-lg border border-input bg-background pl-10 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
            />
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant={viewMode === "table" ? "secondary" : "ghost"}
              size="icon"
              onClick={() => setViewMode("table")}
            >
              <List className="h-4 w-4" />
            </Button>
            <Button
              variant={viewMode === "grid" ? "secondary" : "ghost"}
              size="icon"
              onClick={() => setViewMode("grid")}
            >
              <Grid3X3 className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Files */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <Card>
            <CardContent className="p-0">
              {loading ? (
                <div className="space-y-4 p-6">
                  {[...Array(5)].map((_, i) => (
                    <div key={i} className="h-16 skeleton rounded-lg" />
                  ))}
                </div>
              ) : filteredFiles.length === 0 ? (
                <EmptyState
                  icon={<Folder className="h-8 w-8" />}
                  title={search ? "No files found" : "No files yet"}
                  description={
                    search
                      ? "Try a different search term"
                      : "Upload your first file to get started"
                  }
                  action={
                    !search && (
                      <Link to="/upload">
                        <Button>
                          <Upload className="mr-2 h-4 w-4" />
                          Upload File
                        </Button>
                      </Link>
                    )
                  }
                  className="py-16"
                />
              ) : viewMode === "table" ? (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>File</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>Size</TableHead>
                      <TableHead>Uploaded</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredFiles.map((file, index) => {
                      const Icon = getFileIcon(file.mimeType);
                      const typeColor = getFileTypeColor(file.mimeType);
                      return (
                        <motion.tr
                          key={file._id}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: index * 0.05 }}
                          className="border-b border-border hover:bg-muted/50 transition-colors"
                        >
                          <td className="p-4">
                            <div className="flex items-center gap-3">
                              <div
                                className={cn(
                                  "flex h-10 w-10 items-center justify-center rounded-lg",
                                  typeColor
                                )}
                              >
                                <Icon className="h-5 w-5" />
                              </div>
                              <span className="font-medium text-foreground">
                                {file.originalName}
                              </span>
                            </div>
                          </td>
                          <td className="p-4">
                            <Badge variant="secondary" className="text-xs">
                              {file.mimeType?.split("/")[1] || "file"}
                            </Badge>
                          </td>
                          <td className="p-4 text-muted-foreground">
                            {formatBytes(file.size)}
                          </td>
                          <td className="p-4 text-muted-foreground">
                            {formatDate(file.createdAt)}
                          </td>
                          <td className="p-4 text-right">
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
                                onClick={() => handleDownload(file)}
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
                              <DropdownSeparator />
                              <DropdownItem
                                icon={<Trash2 className="h-4 w-4 text-destructive" />}
                                onClick={() =>
                                  setDeleteDialog({ open: true, file })
                                }
                                className="text-destructive"
                              >
                                Delete
                              </DropdownItem>
                            </Dropdown>
                          </td>
                        </motion.tr>
                      );
                    })}
                  </TableBody>
                </Table>
              ) : (
                <div className="grid grid-cols-2 gap-4 p-6 sm:grid-cols-3 lg:grid-cols-4">
                  {filteredFiles.map((file, index) => {
                    const Icon = getFileIcon(file.mimeType);
                    const typeColor = getFileTypeColor(file.mimeType);
                    return (
                      <motion.div
                        key={file._id}
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: index * 0.05 }}
                        className="group relative rounded-xl border border-border bg-card p-4 hover:shadow-md transition-all"
                      >
                        <div
                          className={cn(
                            "mb-3 flex h-12 w-12 items-center justify-center rounded-lg",
                            typeColor
                          )}
                        >
                          <Icon className="h-6 w-6" />
                        </div>
                        <p className="font-medium text-foreground truncate text-sm">
                          {file.originalName}
                        </p>
                        <p className="text-xs text-muted-foreground mt-1">
                          {formatBytes(file.size)}
                        </p>

                        <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                          <Dropdown
                            align="right"
                            trigger={
                              <Button variant="ghost" size="icon" className="h-8 w-8">
                                <MoreVertical className="h-4 w-4" />
                              </Button>
                            }
                          >
                            <DropdownItem
                              icon={<Download className="h-4 w-4" />}
                              onClick={() => handleDownload(file)}
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
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Delete Confirmation Dialog */}
      <AlertDialog
        open={deleteDialog.open}
        onClose={() => setDeleteDialog({ open: false, file: null })}
        onConfirm={handleDelete}
        title="Delete File"
        description={`Are you sure you want to delete "${deleteDialog.file?.originalName}"? This action cannot be undone.`}
        confirmText="Delete"
        variant="destructive"
      />
    </DashboardLayout>
  );
}
