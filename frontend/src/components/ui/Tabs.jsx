import { useState } from "react";
import { cn } from "@/lib/utils";

function Tabs({ defaultValue, children, className, onChange }) {
  const [active, setActive] = useState(defaultValue);

  const handleChange = (value) => {
    setActive(value);
    onChange?.(value);
  };

  return (
    <div className={cn("w-full", className)}>
      {children({ active, setActive: handleChange })}
    </div>
  );
}

function TabsList({ children, className }) {
  return (
    <div
      className={cn(
        "inline-flex h-10 items-center justify-center rounded-lg bg-muted p-1 text-muted-foreground",
        className
      )}
    >
      {children}
    </div>
  );
}

function TabsTrigger({ value, active, onClick, children, className }) {
  return (
    <button
      onClick={() => onClick(value)}
      className={cn(
        "inline-flex items-center justify-center rounded-md px-3 py-1.5 text-sm font-medium transition-all duration-200",
        active === value
          ? "bg-background text-foreground shadow-sm"
          : "hover:text-foreground",
        className
      )}
    >
      {children}
    </button>
  );
}

function TabsContent({ value, active, children, className }) {
  if (active !== value) return null;

  return (
    <div className={cn("mt-4 animate-fade-in", className)}>
      {children}
    </div>
  );
}

export { Tabs, TabsList, TabsTrigger, TabsContent };
