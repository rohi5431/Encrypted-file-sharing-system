import { useState } from "react";
import { Eye, EyeOff, Lock } from "lucide-react";

export default function PasswordInput({
  label,
  placeholder,
  value,
  onChange,
  error,
  id,
}) {
  const [visible, setVisible] = useState(false);

  return (
    <div className="space-y-1.5">
      {label && (
        <label
          htmlFor={id}
          className="block text-sm font-medium"
          style={{ color: "#CBD5E1" }}
        >
          {label}
        </label>
      )}
      <div className="relative group">
        <div
          className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none transition-colors"
          style={{ color: "#475569" }}
        >
          <Lock className="w-4 h-4" />
        </div>
        <input
          id={id}
          type={visible ? "text" : "password"}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          className="w-full h-11 pl-10 pr-11 rounded-xl text-sm outline-none transition-all"
          style={{
            background: "rgba(255,255,255,0.05)",
            border: error
              ? "1px solid rgba(239,68,68,0.6)"
              : "1px solid rgba(255,255,255,0.1)",
            color: "#F1F5F9",
            caretColor: "#3B82F6",
          }}
          onFocus={(e) => {
            if (!error) {
              e.target.style.border = "1px solid rgba(59,130,246,0.6)";
              e.target.style.boxShadow = "0 0 0 3px rgba(59,130,246,0.1)";
              e.target.style.background = "rgba(255,255,255,0.07)";
            }
          }}
          onBlur={(e) => {
            e.target.style.boxShadow = "none";
            e.target.style.background = "rgba(255,255,255,0.05)";
            if (!error) {
              e.target.style.border = "1px solid rgba(255,255,255,0.1)";
            }
          }}
        />
        <button
          type="button"
          onClick={() => setVisible((v) => !v)}
          className="absolute right-3 top-1/2 -translate-y-1/2 transition-colors"
          style={{ color: "#475569" }}
          onMouseEnter={(e) => (e.currentTarget.style.color = "#94A3B8")}
          onMouseLeave={(e) => (e.currentTarget.style.color = "#475569")}
          tabIndex={-1}
        >
          {visible ? (
            <EyeOff className="w-4 h-4" />
          ) : (
            <Eye className="w-4 h-4" />
          )}
        </button>
      </div>
      {error && (
        <p className="text-xs" style={{ color: "#F87171" }}>
          {error}
        </p>
      )}
    </div>
  );
}
