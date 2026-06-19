import { cn } from "@/lib/utils";

function AlertDialog({ open, onClose, onConfirm, title, description, confirmText = "Confirm", cancelText = "Cancel", variant = "destructive" }) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/50 backdrop-blur-sm animate-fade-in"
        onClick={onClose}
      />

      {/* Dialog */}
      <div className="fixed inset-0 flex items-center justify-center p-4">
        <div
          className={cn(
            "relative z-50 w-full max-w-md rounded-xl bg-background p-6 shadow-lg animate-scale-in",
            "border border-border"
          )}
          onClick={(e) => e.stopPropagation()}
        >
          <h2 className="text-lg font-semibold text-foreground">{title}</h2>

          {description && (
            <p className="mt-2 text-sm text-muted-foreground">{description}</p>
          )}

          <div className="mt-6 flex items-center justify-end gap-3">
            <button
              onClick={onClose}
              className="rounded-lg px-4 py-2 text-sm font-medium text-foreground hover:bg-muted transition-colors"
            >
              {cancelText}
            </button>
            <button
              onClick={() => {
                onConfirm?.();
                onClose();
              }}
              className={cn(
                "rounded-lg px-4 py-2 text-sm font-medium text-white transition-colors",
                variant === "destructive"
                  ? "bg-destructive hover:bg-destructive/90"
                  : "bg-accent hover:bg-accent/90"
              )}
            >
              {confirmText}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export { AlertDialog };
