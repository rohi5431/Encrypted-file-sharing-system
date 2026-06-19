import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  Folder,
  Download,
  Search,
  Trash2,
  HardDrive,
  FileText,
  Image,
  FileCode,
  FileArchive,
} from "lucide-react";
import toast from "react-hot-toast";

import { DashboardLayout } from "@/components/layout";
import {
  Card,
  CardContent,
  Button,
  Badge,
  EmptyState,
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
  AlertDialog,
} from "@/components/ui";
import api from "@/api/axios";
import { formatBytes, formatDate, cn } from "@/lib/utils";

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

export default function AdminFiles() {
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [deleteDialog, setDeleteDialog] = useState({ open: false, file: null });

  useEffect(() => {
    fetchFiles();
  }, []);

  const fetchFiles = () => {
    api
      .get("/admin/files")
      .then((res) => setFiles(res.data.files || []))
      .catch((err) => console.error("AdminFiles error:", err))
      .finally(() => setLoading(false));
  };

  const handleDelete = async () => {
    if (!deleteDialog.file) return;

    try {
      await api.delete(`/admin/file/${deleteDialog.file._id}`);
      setFiles((prev) => prev.filter((f) => f._id !== deleteDialog.file._id));
      toast.success("File deleted successfully");
    } catch (err) {
      toast.error("Failed to delete file");
    } finally {
      setDeleteDialog({ open: false, file: null });
    }
  };

  const filteredFiles = files.filter(
    (f) =>
      f.originalName?.toLowerCase().includes(search.toLowerCase()) ||
      f.owner?.email?.toLowerCase().includes(search.toLowerCase())
  );

  const totalStorage = files.reduce((sum, f) => sum + (f.size || 0), 0);

  return (
    <DashboardLayout isAdmin>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Files</h1>
            <p className="text-muted-foreground mt-1">
              {files.length} files · {formatBytes(totalStorage)} total
            </p>
          </div>

          <a href={`${import.meta.env.VITE_API_BASE_URL || ""}/api/admin/export`}>
            <Button variant="outline">
              <Download className="mr-2 h-4 w-4" />
              Export CSV
            </Button>
          </a>
        </div>

        {/* Search */}
        <div className="relative max-w-sm">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <input
            type="search"
            placeholder="Search files..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="h-10 w-full rounded-lg border border-input bg-background pl-10 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
          />
        </div>

        {/* Files Table */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <Card>
            <CardContent className="p-0">
              {loading ? (
                <div className="space-y-4 p-6">
                  {[...Array(5)].map((_, i) => (
                    <div key={i} className="h-14 skeleton rounded-lg" />
                  ))}
                </div>
              ) : filteredFiles.length === 0 ? (
                <EmptyState
                  icon={<Folder className="h-8 w-8" />}
                  title={search ? "No files found" : "No files yet"}
                  description={
                    search
                      ? "Try a different search term"
                      : "Files will appear here when users upload them"
                  }
                  className="py-16"
                />
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>File</TableHead>
                      <TableHead>Owner</TableHead>
                      <TableHead>Size</TableHead>
                      <TableHead>Storage</TableHead>
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
                              <div>
                                <p className="font-medium text-foreground text-sm">
                                  {file.originalName}
                                </p>
                                <p className="text-xs text-muted-foreground">
                                  {file.mimeType?.split("/")[1] || "file"}
                                </p>
                              </div>
                            </div>
                          </td>
                          <td className="p-4 text-muted-foreground">
                            {file.owner?.email || "Unknown"}
                          </td>
                          <td className="p-4 text-muted-foreground">
                            {formatBytes(file.size)}
                          </td>
                          <td className="p-4">
                            <Badge variant="secondary" className="text-xs">
                              <HardDrive className="h-3 w-3 mr-1" />
                              {file.storage}
                            </Badge>
                          </td>
                          <td className="p-4 text-muted-foreground">
                            {formatDate(file.createdAt)}
                          </td>
                          <td className="p-4 text-right">
                            <Button
                              variant="ghost"
                              size="sm"
                              className="text-destructive hover:text-destructive hover:bg-destructive/10"
                              onClick={() =>
                                setDeleteDialog({ open: true, file })
                              }
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </td>
                        </motion.tr>
                      );
                    })}
                  </TableBody>
                </Table>
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
