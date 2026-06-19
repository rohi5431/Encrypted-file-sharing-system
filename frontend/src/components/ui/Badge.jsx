import { cn } from "@/lib/utils";

const variants = {
  default:
    "bg-primary text-primary-foreground hover:bg-primary/80",
  secondary:
    "bg-secondary text-secondary-foreground hover:bg-secondary/80",
  accent:
    "bg-accent text-accent-foreground",
  destructive:
    "bg-destructive text-destructive-foreground hover:bg-destructive/80",
  success:
    "bg-success text-success-foreground",
  warning:
    "bg-warning text-warning-foreground",
  outline:
    "text-foreground border border-input",
  ghost:
    "text-muted-foreground hover:text-foreground",
};

const sizes = {
  default: "px-2.5 py-0.5 text-xs",
  sm: "px-2 py-0.5 text-xs",
  lg: "px-3 py-1 text-sm",
};

function Badge({ className, variant = "default", size = "default", ...props }) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full font-medium transition-colors duration-200",
        variants[variant],
        sizes[size],
        className
      )}
      {...props}
    />
  );
}

export { Badge };
