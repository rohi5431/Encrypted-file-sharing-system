import { cn } from "@/lib/utils";

const variants = {
  default: "border-border text-foreground",
  destructive: "border-destructive/50 text-destructive bg-destructive/10",
  success: "border-success/50 text-success bg-success/10",
  warning: "border-warning/50 text-warning bg-warning/10",
};

function EmptyState({
  icon,
  title,
  description,
  action,
  className
}) {
  return (
    <div className={cn(
      "flex flex-col items-center justify-center py-12 px-4 text-center",
      className
    )}>
      {icon && (
        <div className="mb-4 rounded-full bg-muted p-3">
          {icon}
        </div>
      )}
      <h3 className="text-lg font-semibold text-foreground">{title}</h3>
      {description && (
        <p className="mt-2 text-sm text-muted-foreground max-w-sm">{description}</p>
      )}
      {action && (
        <div className="mt-6">
          {action}
        </div>
      )}
    </div>
  );
}

export { EmptyState };
