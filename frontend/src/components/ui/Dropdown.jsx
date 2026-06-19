import { useState, useRef, useEffect } from "react";
import { cn } from "@/lib/utils";
import { ChevronDown } from "lucide-react";

function Dropdown({ children, trigger, align = "right", className }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    function handleClickOutside(event) {
      if (ref.current && !ref.current.contains(event.target)) {
        setOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div ref={ref} className="relative">
      <div onClick={() => setOpen(!open)}>{trigger}</div>

      {open && (
        <div
          className={cn(
            "absolute z-50 mt-2 min-w-[180px] rounded-xl border border-border bg-popover p-1 shadow-lg animate-fade-in-down",
            align === "right" && "right-0",
            align === "left" && "left-0",
            className
          )}
        >
          {children}
        </div>
      )}
    </div>
  );
}

function DropdownItem({ children, className, onClick, icon, disabled }) {
  return (
    <button
      onClick={() => {
        onClick?.();
      }}
      disabled={disabled}
      className={cn(
        "flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm text-popover-foreground transition-colors",
        "hover:bg-muted",
        "disabled:pointer-events-none disabled:opacity-50",
        className
      )}
    >
      {icon && <span className="text-muted-foreground">{icon}</span>}
      {children}
    </button>
  );
}

function DropdownSeparator() {
  return <div className="my-1 h-px bg-border" />;
}

function DropdownLabel({ children, className }) {
  return (
    <div className={cn("px-3 py-2 text-xs font-medium text-muted-foreground", className)}>
      {children}
    </div>
  );
}

export { Dropdown, DropdownItem, DropdownSeparator, DropdownLabel };
