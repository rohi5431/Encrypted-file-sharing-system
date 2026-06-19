import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  Folder,
  Upload,
  Share2,
  Settings,
  Shield,
  LogOut,
  ChevronLeft,
  ChevronRight,
  Lock,
} from "lucide-react";
import { useTheme } from "./ThemeProvider";

const userNavItems = [
  { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { name: "My Files", href: "/files", icon: Folder },
  { name: "Upload", href: "/upload", icon: Upload },
  { name: "Shared", href: "/shared", icon: Share2 },
];

const adminNavItems = [
  { name: "Admin Dashboard", href: "/admin", icon: Shield },
  { name: "Users", href: "/admin/users", icon: Shield },
  { name: "Files", href: "/admin/files", icon: Folder },
  { name: "Security", href: "/admin/security", icon: Lock },
];

function Sidebar({ collapsed, onToggle, isAdmin = false }) {
  const location = useLocation();
  const { resolvedTheme } = useTheme();

  const navItems = isAdmin ? adminNavItems : userNavItems;

  const isActive = (href) => {
    if (href === "/dashboard" || href === "/admin") {
      return location.pathname === href;
    }
    if (href === "/admin/users") {
      return location.pathname.startsWith("/admin/users");
    }
    if (href === "/admin/files") {
      return location.pathname.startsWith("/admin/files");
    }
    if (href === "/admin/security") {
      return location.pathname.startsWith("/admin/security");
    }
    return location.pathname.startsWith(href);
  };

  return (
    <aside
      className={cn(
        "fixed left-0 top-0 z-40 h-screen border-r border-border bg-card transition-all duration-300",
        collapsed ? "w-16" : "w-64"
      )}
    >
      {/* Logo */}
      <div
        className={cn(
          "flex h-16 items-center border-b border-border px-4",
          collapsed ? "justify-center" : "justify-between"
        )}
      >
        {!collapsed && (
          <Link to="/" className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-accent">
              <Lock className="h-5 w-5 text-accent-foreground" />
            </div>
            <span className="text-lg font-semibold text-foreground">
              SecureShare
            </span>
          </Link>
        )}

        <button
          onClick={onToggle}
          className={cn(
            "flex h-8 w-8 items-center justify-center rounded-lg text-muted-foreground hover:bg-muted hover:text-foreground transition-colors",
            collapsed && "mx-auto"
          )}
        >
          {collapsed ? (
            <ChevronRight className="h-4 w-4" />
          ) : (
            <ChevronLeft className="h-4 w-4" />
          )}
        </button>
      </div>

      {/* Navigation */}
      <nav className="flex flex-col gap-1 p-3">
        {navItems.map((item) => {
          const Icon = item.icon;
          const active = isActive(item.href);

          return (
            <Link
              key={item.href}
              to={item.href}
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-200",
                active
                  ? "bg-accent text-accent-foreground"
                  : "text-muted-foreground hover:bg-muted hover:text-foreground",
                collapsed && "justify-center px-2"
              )}
              title={collapsed ? item.name : undefined}
            >
              <Icon className="h-5 w-5 shrink-0" />
              {!collapsed && <span>{item.name}</span>}
            </Link>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="absolute bottom-0 left-0 right-0 border-t border-border p-3">
        <button
          className={cn(
            "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-muted-foreground hover:bg-muted hover:text-foreground transition-colors w-full",
            collapsed && "justify-center px-2"
          )}
        >
          <LogOut className="h-5 w-5 shrink-0" />
          {!collapsed && <span>Logout</span>}
        </button>
      </div>
    </aside>
  );
}

export { Sidebar };
