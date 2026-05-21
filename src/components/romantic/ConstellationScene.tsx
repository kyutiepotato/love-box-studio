import { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { BackButton } from "./ToysScene";

/* ── Named stars – the ones that matter ── */
const NAMED_STARS = [
  { id: 0, x: 175, y: 115, r: 5.5, label: "the night we stayed up talking" },
  { id: 1, x: 390, y: 68,  r: 4.5, label: "the laugh I keep replaying" },
  { id: 2, x: 598, y: 128, r: 5.5, label: "your voice when you're sleepy" },
  { id: 3, x: 282, y: 242, r: 5,   label: "the way you say my name" },
  { id: 4, x: 512, y: 218, r: 5.5, label: "how you make everything feel safe" },
  { id: 5, x: 148, y: 368, r: 4.5, label: "lazy sundays and nowhere to be" },
  { id: 6, x: 648, y: 352, r: 5,   label: "every ordinary day with you" },
  { id: 7, x: 398, y: 428, r: 7.5, label: "the moment I knew it was you" },
];

/* ── Constellation lines ── */
const LINES: [number, number][] = [
  [0, 1], [1, 2], [1, 3], [2, 4],
  [3, 4], [3, 5], [4, 6], [5, 7], [6, 7],
];

/* ── Background dust stars (stable, hardcoded) ── */
const BG_STARS = [
  [28,18,0.9,0.4],[68,44,1.3,0.55],[118,28,0.7,0.3],[158,62,1.1,0.45],
  [202,14,0.8,0.35],[248,40,1.2,0.5],[302,22,0.7,0.28],[342,50,1.0,0.4],
  [422,18,1.3,0.55],[468,46,0.8,0.3],[518,28,1.0,0.42],[562,52,0.7,0.25],
  [612,18,1.2,0.5],[658,44,0.9,0.38],[702,22,1.1,0.45],[742,50,0.8,0.3],
  [778,30,1.3,0.52],[48,92,1.0,0.38],[102,118,0.8,0.3],[228,98,1.2,0.48],
  [318,108,0.7,0.28],[438,92,1.1,0.42],[558,102,0.9,0.35],[668,88,1.3,0.5],
  [748,112,0.7,0.3],[788,94,1.0,0.4],[60,182,1.1,0.45],[108,202,0.8,0.3],
  [202,168,1.3,0.52],[338,178,0.9,0.38],[438,188,1.0,0.4],[558,172,0.8,0.3],
  [608,198,1.2,0.48],[698,182,0.7,0.28],[748,168,1.1,0.45],[782,198,0.9,0.35],
  [42,288,1.2,0.5],[92,308,0.8,0.3],[202,278,1.0,0.42],[348,298,0.7,0.25],
  [448,282,1.3,0.52],[552,292,0.9,0.38],[618,278,1.1,0.45],[698,298,0.8,0.3],
  [758,282,1.2,0.48],[788,308,0.7,0.28],[30,398,0.9,0.38],[88,418,1.2,0.5],
  [198,408,0.7,0.3],[308,398,1.1,0.45],[458,418,0.8,0.3],[558,402,1.3,0.52],
  [618,418,0.9,0.38],[698,402,1.0,0.42],[752,418,0.7,0.28],[788,398,1.2,0.48],
  [20,462,1.1,0.45],[82,478,0.8,0.3],[178,468,1.0,0.4],[268,478,0.7,0.25],
  [358,462,1.3,0.52],[468,478,0.9,0.38],[558,468,1.1,0.45],[648,478,0.8,0.3],
  [728,462,1.2,0.5],[780,478,0.7,0.28],[58,148,1.0,0.4],[152,148,0.8,0.3],
];

/* tooltip placement: flip below if star is in upper 30%, shift x if near edges */
function tooltipStyle(star: (typeof NAMED_STARS)[number]) {
  const flipY = star.y < 150;
  const shiftX =
    star.x < 120 ? "translate(-10%, calc(-100% - 18px))" :
    star.x > 680 ? "translate(-90%, calc(-100% - 18px))" :
    "translate(-50%, calc(-100% - 18px))";
  const belowShift =
    star.x < 120 ? "translate(-10%, 18px)" :
    star.x > 680 ? "translate(-90%, 18px)" :
    "translate(-50%, 18px)";
  return {
    left: `${(star.x / 800) * 100}%`,
    top:  `${(star.y / 500) * 100}%`,
    transform: flipY ? belowShift : shiftX,
  };
}

export function ConstellationScene({ onBack }: { onBack: () => void }) {
  const [active, setActive] = useState<number | null>(null);
  const [seen,   setSeen]   = useState<Set<number>>(new Set());
  const svgRef = useRef<SVGSVGElement>(null);

  const handleStar = (id: number) => {
    setActive((prev) => (prev === id ? null : id));
    setSeen((prev) => new Set(prev).add(id));
  };

  const allSeen    = seen.size === NAMED_STARS.length;
  const activeStar = active !== null ? NAMED_STARS[active] : null;

  return (
    <motion.section
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 1 }}
      className="relative z-10 flex min-h-screen w-full flex-col items-center"
      style={{
        background: "radial-gradient(ellipse at 40% 30%, #0e1535 0%, #080c1a 55%, #04060f 100%)",
      }}
    >
      {/* ── CSS keyframes ── */}
      <style>{`
        @keyframes twinkle {
          0%   { opacity: var(--tw-from); transform: scale(1); }
          50%  { opacity: var(--tw-to);   transform: scale(1.15); }
          100% { opacity: var(--tw-from); transform: scale(1); }
        }
        @keyframes pulse-ring {
          0%   { r: 14; opacity: 0.5; }
          100% { r: 28; opacity: 0; }
        }
        @keyframes drift-in {
          from { opacity: 0; transform: translateY(6px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes shoot {
          0%   { stroke-dashoffset: 0; opacity: 1; }
          100% { stroke-dashoffset: -120; opacity: 0; }
        }
      `}</style>

      {/* Back button */}
      <div className="absolute left-4 top-4 z-20">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          style={{
            background: "rgba(255,255,255,0.06)",
            borderRadius: "999px",
            padding: "2px",
          }}
        >
          <BackButton onBack={onBack} />
        </motion.div>
      </div>

      {/* Header */}
      <motion.div
        className="z-10 pt-16 text-center"
        initial={{ opacity: 0, y: -12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4, duration: 0.8 }}
      >
        <h2
          className="mb-1 font-script text-4xl sm:text-5xl"
          style={{ color: "#d8c8ff" }}
        >
          Our little constellation
        </h2>
        <p
          className="font-script text-lg"
          style={{ color: "rgba(180,160,230,0.55)" }}
        >
          tap each star to read it
        </p>
      </motion.div>

      {/* SVG starmap container */}
      <div className="relative mt-4 w-full max-w-4xl flex-1 px-2 sm:px-6">
        <svg
          ref={svgRef}
          viewBox="0 0 800 500"
          className="w-full"
          aria-label="Interactive constellation map with named stars"
          role="img"
          style={{ overflow: "visible" }}
        >
          <defs>
            <radialGradient id="bgGlow" cx="50%" cy="50%" r="50%">
              <stop offset="0%"   stopColor="#4020a0" stopOpacity="0.12" />
              <stop offset="100%" stopColor="#4020a0" stopOpacity="0" />
            </radialGradient>
            <radialGradient id="starHalo" cx="50%" cy="50%" r="50%">
              <stop offset="0%"   stopColor="#ffffff"  stopOpacity="0.9" />
              <stop offset="35%"  stopColor="#c8b0ff"  stopOpacity="0.5" />
              <stop offset="100%" stopColor="#8060ff"  stopOpacity="0" />
            </radialGradient>
            <radialGradient id="activeHalo" cx="50%" cy="50%" r="50%">
              <stop offset="0%"   stopColor="#ffffff"  stopOpacity="1" />
              <stop offset="25%"  stopColor="#ffc8ff"  stopOpacity="0.8" />
              <stop offset="100%" stopColor="#ff80ff"  stopOpacity="0" />
            </radialGradient>
            <filter id="softGlow" x="-50%" y="-50%" width="200%" height="200%">
              <feGaussianBlur stdDeviation="2.5" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
            <filter id="brightGlow" x="-80%" y="-80%" width="260%" height="260%">
              <feGaussianBlur stdDeviation="5" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>

          {/* Nebula blobs */}
          <ellipse cx="200" cy="200" rx="180" ry="120" fill="url(#bgGlow)" />
          <ellipse cx="580" cy="300" rx="150" ry="100" fill="url(#bgGlow)" />

          {/* Background dust stars */}
          {BG_STARS.map(([x, y, r, op], i) => (
            <circle
              key={i}
              cx={x}
              cy={y}
              r={r}
              fill="white"
              style={{
                // @ts-ignore
                "--tw-from": op * 0.5,
                "--tw-to":   op,
                animation: `twinkle ${2.2 + (i % 5) * 0.6}s ease-in-out ${(i % 7) * 0.35}s infinite`,
              } as React.CSSProperties}
            />
          ))}

          {/* Shooting star */}
          <line
            x1="680" y1="80" x2="760" y2="140"
            stroke="white" strokeWidth="0.8"
            strokeDasharray="80"
            strokeLinecap="round"
            style={{
              animation: "shoot 2.8s ease-in 3.5s infinite",
              opacity: 0,
            }}
          />
          <line
            x1="100" y1="380" x2="160" y2="420"
            stroke="white" strokeWidth="0.6"
            strokeDasharray="60"
            strokeLinecap="round"
            style={{
              animation: "shoot 2.4s ease-in 9s infinite",
              opacity: 0,
            }}
          />

          {/* Constellation lines */}
          {LINES.map(([a, b], i) => (
            <motion.line
              key={i}
              x1={NAMED_STARS[a].x} y1={NAMED_STARS[a].y}
              x2={NAMED_STARS[b].x} y2={NAMED_STARS[b].y}
              stroke="rgba(160,130,255,0.22)"
              strokeWidth="0.9"
              strokeDasharray="5 7"
              initial={{ pathLength: 0, opacity: 0 }}
              animate={{ pathLength: 1, opacity: 1 }}
              transition={{ duration: 1.2, delay: 0.6 + i * 0.08 }}
            />
          ))}

          {/* Named stars */}
          {NAMED_STARS.map((star) => {
            const isActive = active === star.id;
            const isSeen   = seen.has(star.id);

            return (
              <g
                key={star.id}
                onClick={() => handleStar(star.id)}
                style={{ cursor: "pointer" }}
                role="button"
                aria-label={star.label}
              >
                {/* Pulse ring when active */}
                {isActive && (
                  <circle
                    cx={star.x}
                    cy={star.y}
                    r={14}
                    fill="none"
                    stroke="rgba(220,180,255,0.4)"
                    strokeWidth="1"
                    style={{ animation: "pulse-ring 1.4s ease-out infinite" }}
                  />
                )}

                {/* Outer halo */}
                <motion.circle
                  cx={star.x}
                  cy={star.y}
                  r={isActive ? star.r * 4.5 : star.r * 2.8}
                  fill={isActive ? "url(#activeHalo)" : "url(#starHalo)"}
                  animate={{ r: isActive ? star.r * 4.5 : isSeen ? star.r * 3.2 : star.r * 2.8 }}
                  transition={{ type: "spring", stiffness: 200, damping: 18 }}
                />

                {/* Star core */}
                <motion.circle
                  cx={star.x}
                  cy={star.y}
                  fill={isActive ? "#ffffff" : isSeen ? "#e0d0ff" : "#b8a8f0"}
                  filter={isActive ? "url(#brightGlow)" : "url(#softGlow)"}
                  animate={{ r: isActive ? star.r * 1.6 : star.r }}
                  transition={{ type: "spring", stiffness: 300, damping: 20 }}
                  style={{
                    // @ts-ignore
                    "--tw-from": 0.7,
                    "--tw-to": 1,
                    animation: isActive ? "none" : `twinkle ${2.8 + star.id * 0.5}s ease-in-out ${star.id * 0.3}s infinite`,
                  } as React.CSSProperties}
                />

                {/* Seen heart dot */}
                {isSeen && !isActive && (
                  <text
                    x={star.x + star.r + 3}
                    y={star.y - star.r - 1}
                    fontSize="6"
                    fill="#ff90cc"
                    textAnchor="middle"
                  >♥</text>
                )}
              </g>
            );
          })}
        </svg>

        {/* Floating tooltip */}
        <AnimatePresence>
          {activeStar && (
            <motion.div
              key={activeStar.id}
              initial={{ opacity: 0, scale: 0.88 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.88 }}
              transition={{ duration: 0.25, type: "spring", stiffness: 320, damping: 24 }}
              className="pointer-events-none absolute z-30"
              style={tooltipStyle(activeStar)}
            >
              <div
                style={{
                  background: "rgba(12, 8, 28, 0.94)",
                  border: "1px solid rgba(180,140,255,0.35)",
                  borderRadius: "16px",
                  padding: "10px 16px",
                  backdropFilter: "blur(16px)",
                  color: "#e0d0ff",
                  fontFamily: "var(--font-script, 'Georgia', serif)",
                  fontSize: "1.05rem",
                  lineHeight: "1.45",
                  maxWidth: "200px",
                  textAlign: "center",
                  whiteSpace: "normal",
                  boxShadow: "0 8px 32px rgba(100,60,200,0.3)",
                }}
              >
                {activeStar.label}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Footer */}
      <motion.div
        className="z-10 pb-10 text-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1 }}
      >
        <p
          className="font-script text-sm"
          style={{ color: "rgba(160,140,210,0.45)" }}
        >
          {seen.size} of {NAMED_STARS.length} stars discovered
        </p>
        <AnimatePresence>
          {allSeen && (
            <motion.p
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="mt-3 font-script text-xl"
              style={{ color: "#d8aaff" }}
            >
              you've read every star that makes up us ✦
            </motion.p>
          )}
        </AnimatePresence>
      </motion.div>
    </motion.section>
  );
}