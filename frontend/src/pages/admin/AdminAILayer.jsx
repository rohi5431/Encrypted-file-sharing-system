import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Activity, Shield, Search, Download, Upload, Share2, Lock } from "lucide-react";

import { DashboardLayout } from "@/components/layout";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
  Badge,
  EmptyState,
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
  Input,
} from "@/components/ui";
import api from "@/api/axios";
import { formatDateTime, cn } from "@/lib/utils";

const actionColors = {
  file_access: "bg-blue-500/10 text-blue-500",
  file_download: "bg-green-500/10 text-green-500",
  file_share: "bg-purple-500/10 text-purple-500",
  login: "bg-cyan-500/10 text-cyan-500",
  failed_login: "bg-red-500/10 text-red-500",
};

const actionIcons = {
  file_access: Upload,
  file_download: Download,
  file_share: Share2,
  login: Lock,
  failed_login: Shield,
};

export default function AdminAILayer() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => {
    api
      .get("/admin/events")
      .then((res) => {
        if (res.data.success) {
          setEvents(res.data.events);
        }
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const filteredEvents = events.filter(
    (e) =>
      e.action?.toLowerCase().includes(search.toLowerCase()) ||
      e.userId?.email?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <DashboardLayout isAdmin>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-2xl font-bold text-foreground flex items-center gap-2">
              <Activity className="h-6 w-6 text-accent" />
              Security Events
            </h1>
            <p className="text-muted-foreground mt-1">
              Real-time file access, downloads, and anomaly detection
            </p>
          </div>

          <div className="flex items-center gap-2">
            <Badge variant="success" className="animate-pulse">
              <span className="h-2 w-2 rounded-full bg-success mr-1.5" />
              Live
            </Badge>
          </div>
        </div>

        {/* Search */}
        <div className="relative max-w-sm">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <input
            type="search"
            placeholder="Search events..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="h-10 w-full rounded-lg border border-input bg-background pl-10 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
          />
        </div>

        {/* Events Table */}
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
              ) : filteredEvents.length === 0 ? (
                <EmptyState
                  icon={<Activity className="h-8 w-8" />}
                  title={search ? "No events found" : "No events yet"}
                  description={
                    search
                      ? "Try a different search term"
                      : "Events will appear here as users interact with the system"
                  }
                  className="py-16"
                />
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Action</TableHead>
                      <TableHead>User</TableHead>
                      <TableHead>IP Address</TableHead>
                      <TableHead>Target</TableHead>
                      <TableHead>Time</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredEvents.map((event, index) => {
                      const Icon = actionIcons[event.action] || Activity;
                      const colorClass = actionColors[event.action] || "bg-gray-500/10 text-gray-500";
                      return (
                        <motion.tr
                          key={event._id}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: index * 0.05 }}
                          className="border-b border-border hover:bg-muted/50 transition-colors"
                        >
                          <td className="p-4">
                            <div className="flex items-center gap-3">
                              <div
                                className={cn(
                                  "flex h-8 w-8 items-center justify-center rounded-lg",
                                  colorClass
                                )}
                              >
                                <Icon className="h-4 w-4" />
                              </div>
                              <span className="font-medium text-foreground">
                                {event.action?.replace(/_/g, " ")}
                              </span>
                            </div>
                          </td>
                          <td className="p-4 text-muted-foreground">
                            {event.userId?.email || "Anonymous"}
                          </td>
                          <td className="p-4">
                            <code className="text-xs bg-muted px-2 py-1 rounded">
                              {event.ipAddress || "—"}
                            </code>
                          </td>
                          <td className="p-4 text-muted-foreground text-sm">
                            {event.targetId || "—"}
                          </td>
                          <td className="p-4 text-muted-foreground text-sm">
                            {formatDateTime(event.createdAt)}
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
    </DashboardLayout>
  );
}
