import { useEffect, useState } from "react";

export default function CountdownTimer({ seconds }) {
  const [time, setTime] = useState(seconds);

  useEffect(() => {
    if (time <= 0) return;
    const timer = setInterval(() => setTime((t) => t - 1), 1000);
    return () => clearInterval(timer);
  }, [time]);

  const min = Math.floor(time / 60);
  const sec = time % 60;

  return (
    <p className="text-sm text-gray-500">
      OTP expires in {min}:{sec.toString().padStart(2, "0")}
    </p>
  );
}
