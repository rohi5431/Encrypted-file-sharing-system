export default function OTPInput({ value, onChange }) {
  return (
    <input
      value={value}
      onChange={(e) => onChange(e.target.value)}
      maxLength={6}
      placeholder="Enter 6-digit OTP"
      className="w-full rounded border p-3 text-center text-lg tracking-widest focus:outline-none focus:ring-2 focus:ring-blue-500"
    />
  );
}
