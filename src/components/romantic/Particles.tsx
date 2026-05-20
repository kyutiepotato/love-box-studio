import { useMemo } from "react";

export function Petals({ count = 18 }: { count?: number }) {
  const petals = useMemo(
    () =>
      Array.from({ length: count }).map((_, i) => ({
        id: i,
        left: Math.random() * 100,
        delay: Math.random() * 10,
        duration: 10 + Math.random() * 12,
        size: 10 + Math.random() * 18,
        hue: 340 + Math.random() * 40,
      })),
    [count],
  );
  return (
    <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
      {petals.map((p) => (
        <span
          key={p.id}
          className="absolute block rounded-full"
          style={{
            left: `${p.left}%`,
            top: "-5vh",
            width: p.size,
            height: p.size * 0.7,
            background: `radial-gradient(circle at 30% 30%, oklch(0.92 0.10 ${p.hue}), oklch(0.75 0.18 ${p.hue}))`,
            filter: "blur(0.5px)",
            opacity: 0.7,
            animation: `petal-fall ${p.duration}s linear ${p.delay}s infinite`,
            borderRadius: "60% 40% 60% 40%",
          }}
        />
      ))}
    </div>
  );
}

export function Sparkles({ count = 30 }: { count?: number }) {
  const dots = useMemo(
    () =>
      Array.from({ length: count }).map((_, i) => ({
        id: i,
        left: Math.random() * 100,
        top: Math.random() * 100,
        delay: Math.random() * 4,
        size: 2 + Math.random() * 4,
      })),
    [count],
  );
  return (
    <div className="pointer-events-none fixed inset-0 z-0">
      {dots.map((d) => (
        <span
          key={d.id}
          className="absolute rounded-full bg-white"
          style={{
            left: `${d.left}%`,
            top: `${d.top}%`,
            width: d.size,
            height: d.size,
            boxShadow: "0 0 8px 2px oklch(1 0 0 / 0.7)",
            animation: `sparkle 3s ease-in-out ${d.delay}s infinite`,
          }}
        />
      ))}
    </div>
  );
}
