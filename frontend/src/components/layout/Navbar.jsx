import { Link } from "react-router-dom";
import { cn } from "@/lib/utils";
import { useTheme } from "./ThemeProvider";
import { Bell, Search, Menu, Moon, Sun, User, Settings, LogOut } from "lucide-react";
import { Avatar } from "@/components/ui";
import { Dropdown, DropdownItem, DropdownSeparator, DropdownLabel } from "@/components/ui/Dropdown";
import { Button } from "@/components/ui";
import { useContext } from "react";
import { AuthContext } from "@/context/AuthContext";

function Navbar({ onMenuClick, sidebarCollapsed }) {
  const { resolvedTheme, toggleTheme } = useTheme();
  const { user, logout } = useContext(AuthContext);

  const userInitial = user?.name?.charAt(0)?.toUpperCase() || "U";

  return (
    <header
      className={cn(
        "fixed top-0 right-0 z-30 flex h-16 items-center border-b border-border bg-background/95 backdrop-blur-sm transition-all duration-300",
        sidebarCollapsed ? "left-16" : "left-64"
      )}
    >
      <div className="flex flex-1 items-center justify-between px-6">
        {/* Left side */}
        <div className="flex items-center gap-4">
          <button
            onClick={onMenuClick}
            className="flex h-9 w-9 items-center justify-center rounded-lg text-muted-foreground hover:bg-muted hover:text-foreground transition-colors lg:hidden"
          >
            <Menu className="h-5 w-5" />
          </button>

          {/* Search */}
          <div className="relative hidden md:block">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <input
              type="search"
              placeholder="Search files..."
              className="h-9 w-64 rounded-lg border border-input bg-background pl-10 pr-4 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
            />
          </div>
        </div>

        {/* Right side */}
        <div className="flex items-center gap-3">
          {/* Theme toggle */}
          <button
            onClick={toggleTheme}
            className="flex h-9 w-9 items-center justify-center rounded-lg text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
          >
            {resolvedTheme === "dark" ? (
              <Sun className="h-5 w-5" />
            ) : (
              <Moon className="h-5 w-5" />
            )}
          </button>

          {/* Notifications */}
          <Dropdown
            align="right"
            trigger={
              <button className="relative flex h-9 w-9 items-center justify-center rounded-lg text-muted-foreground hover:bg-muted hover:text-foreground transition-colors">
                <Bell className="h-5 w-5" />
                <span className="absolute right-1 top-1 h-2 w-2 rounded-full bg-destructive" />
              </button>
            }
          >
            <DropdownLabel>Notifications</DropdownLabel>
            <DropdownItem>No new notifications</DropdownItem>
          </Dropdown>

          {/* User menu */}
          <Dropdown
            align="right"
            trigger={
              <button className="flex items-center gap-2 rounded-lg px-2 py-1.5 hover:bg-muted transition-colors">
                <Avatar name={user?.name} size="sm" />
                <div className="hidden md:block text-left">
                  <p className="text-sm font-medium text-foreground">
                    {user?.name || "User"}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {user?.email || ""}
                  </p>
                </div>
              </button>
            }
          >
            <DropdownLabel>Account</DropdownLabel>
            <DropdownItem icon={<User className="h-4 w-4" />}>
              Profile
            </DropdownItem>
            <DropdownItem icon={<Settings className="h-4 w-4" />}>
              Settings
            </DropdownItem>
            <DropdownSeparator />
            <DropdownItem
              icon={<LogOut className="h-4 w-4" />}
              onClick={logout}
            >
              Logout
            </DropdownItem>
          </Dropdown>
        </div>
      </div>
    </header>
  );
}

export { Navbar };
