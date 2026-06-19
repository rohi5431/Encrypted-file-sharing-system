import { useMemo } from "react";

const PARTICLES = Array.from({ length: 60 }, (_, i) => {
  const seed = i * 137.508;
  return {
    id: i,
    left: ((seed * 1.618) % 100).toFixed(2),
    top: ((seed * 2.414) % 100).toFixed(2),
    size: (((seed * 0.618) % 3) + 1).toFixed(1),
    delay: ((seed * 0.5) % 8).toFixed(2),
    duration: (((seed * 0.3) % 10) + 8).toFixed(2),
    opacity: (((seed * 0.1) % 0.5) + 0.1).toFixed(2),
  };
});

export default function ParticleField() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      <style>{`
        @keyframes particle-float {
          0% { transform: translateY(0px) translateX(0px); opacity: 0; }
          10% { opacity: 1; }
          90% { opacity: 1; }
          100% { transform: translateY(-120px) translateX(30px); opacity: 0; }
        }
        @keyframes particle-twinkle {
          0%, 100% { opacity: 0.1; transform: scale(1); }
          50% { opacity: 0.8; transform: scale(1.5); }
        }
      `}</style>
      {PARTICLES.map((p) => (
        <div
          key={p.id}
          className="absolute rounded-full"
          style={{
            left: `${p.left}%`,
            top: `${p.top}%`,
            width: `${p.size}px`,
            height: `${p.size}px`,
            background: p.id % 3 === 0
              ? "#3B82F6"
              : p.id % 3 === 1
              ? "#8B5CF6"
              : "#06B6D4",
            opacity: p.opacity,
            animation: p.id % 2 === 0
              ? `particle-float ${p.duration}s ${p.delay}s infinite linear`
              : `particle-twinkle ${p.duration}s ${p.delay}s infinite ease-in-out`,
            filter: `blur(${p.id % 4 === 0 ? "0.5" : "0"}px)`,
          }}
        />
      ))}
    </div>
  );
}
