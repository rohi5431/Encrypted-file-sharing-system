import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Users, Download, Search, Shield, User } from "lucide-react";

import { DashboardLayout } from "@/components/layout";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
  Button,
  Badge,
  Avatar,
  Input,
  EmptyState,
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "@/components/ui";
import api from "@/api/axios";
import { formatDate, cn } from "@/lib/utils";

export default function AdminUsers() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => {
    api
      .get("/admin/users")
      .then((res) => setUsers(res.data.users || []))
      .catch((err) => console.error("AdminUsers error:", err))
      .finally(() => setLoading(false));
  }, []);

  const filteredUsers = users.filter(
    (u) =>
      u.email?.toLowerCase().includes(search.toLowerCase()) ||
      u.name?.toLowerCase().includes(search.toLowerCase())
  );

  const totalUsers = users.length;
  const adminCount = users.filter((u) => u.role === "admin").length;

  return (
    <DashboardLayout isAdmin>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Users</h1>
            <p className="text-muted-foreground mt-1">
              {totalUsers} users · {adminCount} admins
            </p>
          </div>

          <a href={`${import.meta.env.VITE_API_BASE_URL || ""}/api/admin/export-users`}>
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
            placeholder="Search users..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="h-10 w-full rounded-lg border border-input bg-background pl-10 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
          />
        </div>

        {/* Users Table */}
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
              ) : filteredUsers.length === 0 ? (
                <EmptyState
                  icon={<Users className="h-8 w-8" />}
                  title={search ? "No users found" : "No users yet"}
                  description={
                    search
                      ? "Try a different search term"
                      : "Users will appear here when they register"
                  }
                  className="py-16"
                />
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>User</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>Role</TableHead>
                      <TableHead>Joined</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredUsers.map((user, index) => (
                      <motion.tr
                        key={user._id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.05 }}
                        className="border-b border-border hover:bg-muted/50 transition-colors"
                      >
                        <td className="p-4">
                          <div className="flex items-center gap-3">
                            <Avatar name={user.name || user.email} size="sm" />
                            <span className="font-medium text-foreground">
                              {user.name || "User"}
                            </span>
                          </div>
                        </td>
                        <td className="p-4 text-muted-foreground">
                          {user.email}
                        </td>
                        <td className="p-4">
                          <Badge
                            variant={user.role === "admin" ? "accent" : "secondary"}
                            className="text-xs"
                          >
                            {user.role === "admin" && (
                              <Shield className="h-3 w-3 mr-1" />
                            )}
                            {user.role || "user"}
                          </Badge>
                        </td>
                        <td className="p-4 text-muted-foreground">
                          {formatDate(user.createdAt)}
                        </td>
                      </motion.tr>
                    ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </DashboardLayout>
  );
}
