export default function PasswordStrength({ password }) {
  const getStrength = () => {
    if (password.length < 6) return "Weak";
    if (/[A-Z]/.test(password) && /\d/.test(password)) return "Strong";
    return "Medium";
  };

  const strength = getStrength();

  const color =
    strength === "Strong"
      ? "text-green-600"
      : strength === "Medium"
      ? "text-yellow-500"
      : "text-red-500";

  return (
    <p className={`text-sm ${color}`}>
      Password strength: {strength}
    </p>
  );
}
