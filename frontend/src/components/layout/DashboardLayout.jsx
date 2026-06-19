import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import { Sidebar } from "./Sidebar";
import { Navbar } from "./Navbar";
import { Toaster } from "react-hot-toast";

function DashboardLayout({ children, isAdmin = false }) {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  // Store sidebar state in localStorage
  useEffect(() => {
    const stored = localStorage.getItem("sidebarCollapsed");
    if (stored !== null) {
      setSidebarCollapsed(stored === "true");
    }
  }, []);

  const toggleSidebar = () => {
    setSidebarCollapsed((prev) => {
      localStorage.setItem("sidebarCollapsed", (!prev).toString());
      return !prev;
    });
  };

  return (
    <div className="min-h-screen bg-background">
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 4000,
          style: {
            background: "var(--color-background)",
            color: "var(--color-foreground)",
            border: "1px solid var(--color-border)",
          },
        }}
      />

      <Sidebar
        collapsed={sidebarCollapsed}
        onToggle={toggleSidebar}
        isAdmin={isAdmin}
      />

      <Navbar
        onMenuClick={toggleSidebar}
        sidebarCollapsed={sidebarCollapsed}
      />

      <main
        className={cn(
          "min-h-screen pt-16 transition-all duration-300",
          sidebarCollapsed ? "pl-16" : "pl-64"
        )}
      >
        <div className="p-6">{children}</div>
      </main>
    </div>
  );
}

export { DashboardLayout };
