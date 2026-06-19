import { forwardRef } from "react";
import { cn } from "@/lib/utils";
import { Check } from "lucide-react";

const Checkbox = forwardRef(
  ({ className, label, checked, onChange, ...props }, ref) => {
    return (
      <label className="flex items-center gap-2 cursor-pointer">
        <div
          className={cn(
            "peer relative h-4 w-4 shrink-0 rounded border border-input bg-background transition-all duration-200",
            "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
            "disabled:cursor-not-allowed disabled:opacity-50",
            checked && "bg-primary border-primary",
            className
          )}
        >
          <input
            ref={ref}
            type="checkbox"
            className="sr-only"
            checked={checked}
            onChange={onChange}
            {...props}
          />
          {checked && (
            <Check className="absolute inset-0 h-4 w-4 text-primary-foreground" strokeWidth={3} />
          )}
        </div>
        {label && (
          <span className="text-sm font-medium text-foreground">{label}</span>
        )}
      </label>
    );
  }
);

Checkbox.displayName = "Checkbox";

export { Checkbox };
