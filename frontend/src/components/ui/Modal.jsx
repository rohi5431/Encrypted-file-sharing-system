import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { cn } from "@/lib/utils";
import { X } from "lucide-react";
import { Button } from "./Button";

function Modal({ open, onClose, children, className }) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);

    if (open) {
      document.body.style.overflow = "hidden";
    }

    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  if (!mounted || !open) return null;

  return createPortal(
    <div className="fixed inset-0 z-50">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/50 backdrop-blur-sm animate-fade-in"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="fixed inset-0 flex items-center justify-center p-4">
        <div
          className={cn(
            "relative z-50 w-full max-w-lg rounded-xl bg-background p-6 shadow-lg animate-scale-in",
            "border border-border",
            className
          )}
          onClick={(e) => e.stopPropagation()}
        >
          <button
            onClick={onClose}
            className="absolute right-4 top-4 rounded-md p-1 text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
          >
            <X className="h-4 w-4" />
          </button>
          {children}
        </div>
      </div>
    </div>,
    document.body
  );
}

function ModalHeader({ className, ...props }) {
  return (
    <div className={cn("mb-4", className)} {...props} />
  );
}

function ModalTitle({ className, ...props }) {
  return (
    <h2
      className={cn("text-lg font-semibold text-foreground", className)}
      {...props}
    />
  );
}

function ModalDescription({ className, ...props }) {
  return (
    <p
      className={cn("text-sm text-muted-foreground mt-1", className)}
      {...props}
    />
  );
}

function ModalContent({ className, ...props }) {
  return (
    <div className={cn("my-4", className)} {...props} />
  );
}

function ModalFooter({ className, ...props }) {
  return (
    <div
      className={cn(
        "mt-6 flex items-center justify-end gap-2",
        className
      )}
      {...props}
    />
  );
}

export { Modal, ModalHeader, ModalTitle, ModalDescription, ModalContent, ModalFooter };
