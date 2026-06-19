export default function AuthInput({
  label,
  type = "text",
  placeholder,
  value,
  onChange,
  error,
  icon,
  id,
}) {
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
      <div className="relative">
        {icon && (
          <div
            className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none"
            style={{ color: "#475569" }}
          >
            {icon}
          </div>
        )}
        <input
          id={id}
          type={type}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          className="w-full h-11 rounded-xl text-sm outline-none transition-all"
          style={{
            paddingLeft: icon ? "2.5rem" : "0.875rem",
            paddingRight: "0.875rem",
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
      </div>
      {error && (
        <p className="text-xs" style={{ color: "#F87171" }}>
          {error}
        </p>
      )}
    </div>
  );
}
