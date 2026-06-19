import { cn } from "@/lib/utils";
import { getInitials } from "@/lib/utils";

const sizes = {
  sm: "h-8 w-8 text-xs",
  default: "h-10 w-10 text-sm",
  lg: "h-12 w-12 text-base",
  xl: "h-16 w-16 text-lg",
};

function Avatar({ className, src, alt, name, size = "default", fallbackClassName }) {
  const initials = getInitials(name);

  return (
    <div
      className={cn(
        "relative flex shrink-0 items-center justify-center overflow-hidden rounded-full bg-muted",
        sizes[size],
        className
      )}
    >
      {src ? (
        <img
          src={src}
          alt={alt || name || "Avatar"}
          className="h-full w-full object-cover"
        />
      ) : (
        <span
          className={cn(
            "font-medium text-muted-foreground",
            fallbackClassName
          )}
        >
          {initials}
        </span>
      )}
    </div>
  );
}

export { Avatar };
