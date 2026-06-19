import { cn } from "@/lib/utils";

const variants = {
  default: "bg-muted border-border text-foreground",
  destructive: "bg-destructive/10 border-destructive/50 text-destructive",
  success: "bg-success/10 border-success/50 text-success",
  warning: "bg-warning/10 border-warning/50 text-warning",
  info: "bg-accent/10 border-accent/50 text-accent",
};

const icons = {
  default: null,
  destructive: (
    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
    </svg>
  ),
  success: (
    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  ),
  warning: (
    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  ),
  info: (
    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  ),
};

function Alert({ title, description, variant = "default", icon, className }) {
  return (
    <div
      className={cn(
        "flex gap-3 rounded-lg border p-4",
        variants[variant],
        className
      )}
    >
      {(icon || icons[variant]) && (
        <div className="shrink-0 mt-0.5">
          {icon || icons[variant]}
        </div>
      )}
      <div className="flex-1">
        {title && (
          <h4 className="text-sm font-medium">{title}</h4>
        )}
        {description && (
          <p className="text-sm opacity-90">{description}</p>
        )}
      </div>
    </div>
  );
}

export { Alert };
