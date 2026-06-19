import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  Users,
  Folder,
  HardDrive,
  Download,
  TrendingUp,
  Shield,
  Activity,
} from "lucide-react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import io from "socket.io-client";

import { DashboardLayout } from "@/components/layout";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
  Button,
  Badge,
  SkeletonCard,
} from "@/components/ui";
import api from "@/api/axios";
import { formatBytes, cn } from "@/lib/utils";

const COLORS = ["#3b82f6", "#22c55e", "#f59e0b", "#ef4444", "#8b5cf6"];

function StatCard({ title, value, icon: Icon, change, loading }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <Card className="relative overflow-hidden">
        <CardContent className="p-6">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">{title}</p>
              {loading ? (
                <div className="h-8 w-20 skeleton mt-2 rounded" />
              ) : (
                <p className="text-3xl font-bold text-foreground mt-2">{value}</p>
              )}
              {change && (
                <p className="text-xs text-success mt-1 flex items-center gap-1">
                  <TrendingUp className="h-3 w-3" />
                  {change}
                </p>
              )}
            </div>
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-accent/10">
              <Icon className="h-6 w-6 text-accent" />
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}

export default function AdminDashboard() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [alerts, setAlerts] = useState([]);

  useEffect(() => {
    api
      .get("/admin/stats")
      .then((res) => setStats(res.data.stats))
      .catch((err) => console.error("Admin stats error:", err))
      .finally(() => setLoading(false));

    api
      .get("/admin/alerts")
      .then((res) => {
        if (res.data.success) setAlerts(res.data.alerts);
      })
      .catch(console.error);

    // Socket connection for live alerts
    const socketUrl = import.meta.env.VITE_API_URL?.replace("/api", "") || "http://localhost:5000";
    const socket = io(socketUrl);

    socket.on("new_alert", (alert) => {
      setAlerts((prev) => [alert, ...prev].slice(0, 50));
    });

    return () => socket.disconnect();
  }, []);

  const resolveAlert = async (id) => {
    try {
      await api.put(`/admin/alerts/${id}/resolve`);
      setAlerts((prev) =>
        prev.map((a) => (a._id === id ? { ...a, status: "resolved" } : a))
      );
    } catch (err) {
      console.error(err);
    }
  };

  const storageData = stats?.totalStorageBytes
    ? [
        { name: "Used", value: stats.totalStorageBytes },
        { name: "Free", value: Math.max(1, 10 * 1024 * 1024 * 1024 - stats.totalStorageBytes) },
      ]
    : [];

  return (
    <DashboardLayout isAdmin>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Admin Dashboard</h1>
            <p className="text-muted-foreground mt-1">
              System overview and analytics
            </p>
          </div>

          <a href={`${import.meta.env.VITE_API_BASE_URL || ""}/api/admin/export`}>
            <Button variant="outline">
              <Download className="mr-2 h-4 w-4" />
              Export CSV
            </Button>
          </a>
        </div>

        {/* Stats Grid */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <StatCard
            title="Total Users"
            value={stats?.totalUsers ?? 0}
            icon={Users}
            loading={loading}
          />
          <StatCard
            title="Total Files"
            value={stats?.totalFiles ?? 0}
            icon={Folder}
            loading={loading}
          />
          <StatCard
            title="Storage Used"
            value={formatBytes(stats?.totalStorageBytes ?? 0)}
            icon={HardDrive}
            loading={loading}
          />
          <StatCard
            title="Security"
            value="Active"
            icon={Shield}
            loading={loading}
          />
        </div>

        {/* Charts Row */}
        <div className="grid gap-6 lg:grid-cols-2">
          {/* Upload Chart */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <Card className="h-full">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Activity className="h-5 w-5 text-accent" />
                  Daily Uploads
                </CardTitle>
                <CardDescription>Last 14 days activity</CardDescription>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <div className="h-64 skeleton rounded-lg" />
                ) : (
                  <ResponsiveContainer width="100%" height={250}>
                    <AreaChart data={stats?.dailyUploads || []}>
                      <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                      <XAxis
                        dataKey="_id"
                        tick={{ fontSize: 12 }}
                        className="fill-muted-foreground"
                      />
                      <YAxis
                        tick={{ fontSize: 12 }}
                        className="fill-muted-foreground"
                      />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: "var(--color-background)",
                          border: "1px solid var(--color-border)",
                          borderRadius: "8px",
                        }}
                      />
                      <Area
                        type="monotone"
                        dataKey="count"
                        stroke="#3b82f6"
                        fill="#3b82f6"
                        fillOpacity={0.2}
                        strokeWidth={2}
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                )}
              </CardContent>
            </Card>
          </motion.div>

          {/* Storage Pie */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
          >
            <Card className="h-full">
              <CardHeader>
                <CardTitle>Storage Distribution</CardTitle>
                <CardDescription>
                  {formatBytes(stats?.totalStorageBytes ?? 0)} of 10 GB used
                </CardDescription>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <div className="h-64 skeleton rounded-lg" />
                ) : (
                  <ResponsiveContainer width="100%" height={250}>
                    <PieChart>
                      <Pie
                        data={storageData}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={90}
                        paddingAngle={5}
                        dataKey="value"
                      >
                        {storageData.map((entry, index) => (
                          <Cell key={index} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip
                        formatter={(value) => formatBytes(value)}
                        contentStyle={{
                          backgroundColor: "var(--color-background)",
                          border: "1px solid var(--color-border)",
                          borderRadius: "8px",
                        }}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                )}
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Live Alerts */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="relative">
                    <Shield className="h-5 w-5 text-accent" />
                    <span className="absolute -top-1 -right-1 h-2 w-2 rounded-full bg-destructive animate-pulse" />
                  </div>
                  <div>
                    <CardTitle>Live Security Alerts</CardTitle>
                    <CardDescription>Real-time threat detection</CardDescription>
                  </div>
                </div>
                <Badge variant="warning" className="animate-pulse">
                  {alerts.filter((a) => a.status !== "resolved").length} Active
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              {alerts.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  <Shield className="h-12 w-12 mx-auto mb-2 opacity-50" />
                  <p>No active alerts</p>
                </div>
              ) : (
                <div className="space-y-3 max-h-96 overflow-y-auto">
                  {alerts.slice(0, 10).map((alert) => (
                    <div
                      key={alert._id}
                      className={cn(
                        "flex items-center justify-between p-4 rounded-lg border transition-colors",
                        alert.status === "resolved"
                          ? "bg-muted/50 opacity-60"
                          : alert.severity === "high" || alert.severity === "critical"
                          ? "bg-destructive/5 border-destructive/20"
                          : "bg-warning/5 border-warning/20"
                      )}
                    >
                      <div className="flex items-center gap-3">
                        <div
                          className={cn(
                            "h-2 w-2 rounded-full",
                            alert.status === "resolved"
                              ? "bg-muted-foreground"
                              : alert.severity === "high"
                              ? "bg-destructive"
                              : "bg-warning"
                          )}
                        />
                        <div>
                          <p className="font-medium text-foreground text-sm">
                            {alert.type?.replace(/_/g, " ").toUpperCase()}
                          </p>
                          <p className="text-xs text-muted-foreground mt-0.5">
                            {alert.message}
                          </p>
                        </div>
                      </div>
                      {alert.status !== "resolved" && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => resolveAlert(alert._id)}
                        >
                          Resolve
                        </Button>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </DashboardLayout>
  );
}
