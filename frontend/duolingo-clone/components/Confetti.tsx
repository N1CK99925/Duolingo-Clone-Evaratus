"use client";

/** Deterministic confetti pieces (no hydration mismatch) for celebration screens. */
const PIECES = Array.from({ length: 28 }, (_, i) => {
  const colors = ["#58CC02", "#1CB0F6", "#FFC800", "#FF9600", "#CE82FF", "#FF4B4B"];
  return {
    left: (i * 37) % 100,
    delay: (i % 7) * 0.18,
    duration: 2.4 + (i % 5) * 0.35,
    color: colors[i % colors.length],
    rotate: (i % 2 ? 1 : -1) * (240 + (i % 4) * 120),
    size: 8 + (i % 3) * 3,
  };
});

export function Confetti() {
  return (
    <div className="pointer-events-none fixed inset-0 z-40 overflow-hidden" aria-hidden>
      {PIECES.map((p, i) => (
        <span
          key={i}
          className="confetti-piece"
          style={{
            left: `${p.left}%`,
            width: p.size,
            height: p.size * 1.4,
            backgroundColor: p.color,
            animationDelay: `${p.delay}s`,
            animationDuration: `${p.duration}s`,
            ["--confetti-rotate" as string]: `${p.rotate}deg`,
          }}
        />
      ))}
    </div>
  );
}
