import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { BackButton } from "./ToysScene";

export function FlowersScene({ onBack, onComplete }: { onBack: () => void; onComplete: () => void }) {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [playing, setPlaying] = useState(false);

  useEffect(() => {
    onComplete();
  }, [onComplete]);

  const toggle = () => {
    const v = videoRef.current;
    if (!v) return;
    if (playing) {
      v.muted = true;
      setPlaying(false);
    } else {
      v.muted = false;
      v.play().catch(() => {});
      setPlaying(true);
    }
  };

  return (
    <motion.section
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -30 }}
      transition={{ duration: 0.5 }}
      className="relative z-10 mx-auto flex min-h-screen w-full max-w-4xl flex-col items-center justify-center px-4 py-10"
    >
      <BackButton onBack={onBack} />

      <h2 className="mb-2 text-center text-4xl text-gradient-rose sm:text-5xl">
        A bouquet that never wilts
      </h2>
      <p className="mb-8 text-center font-script text-xl text-muted-foreground">
        because you deserve forever flowers
      </p>

      <div className="glass relative w-full overflow-hidden rounded-3xl p-3 sm:p-4">
        <div className="relative aspect-[16/10] w-full overflow-hidden rounded-2xl">
          <video
            ref={videoRef}
            src="/video/ginintuang-tanawin.mp4"
            autoPlay
            muted
            loop
            playsInline
            className="absolute inset-0 h-full w-full object-cover"
          />
          <BloomOverlay />
          <button
            onClick={toggle}
            className="absolute bottom-4 left-1/2 flex -translate-x-1/2 items-center gap-3 rounded-full px-6 py-3 text-sm text-foreground/90 glass transition-all hover:scale-105"
            aria-label={playing ? "Mute music" : "Play music"}
          >
            <span className="text-lg">{playing ? "❚❚" : "▶"}</span>
            <span className="font-script text-lg">
              {playing ? "playing our song" : "play our song"}
            </span>
          </button>
        </div>
      </div>

      <p className="mt-6 max-w-lg text-center font-script text-xl text-foreground/70">
        Every petal here is a small thank you, for every moment you've made bloom in me.
      </p>
    </motion.section>
  );
}

function BloomOverlay() {
  const blooms = Array.from({ length: 14 }).map((_, i) => ({
    id: i,
    left: (i * 37 + 11) % 100,
    top: (i * 53 + 7) % 100,
    delay: (i * 0.47) % 4,
    size: 14 + (i * 13) % 24,
    hue: 340 + (i * 7) % 40,
  }));

  return (
    <div className="pointer-events-none absolute inset-0">
      {blooms.map((b) => (
        <motion.span
          key={b.id}
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: [0, 1, 0.8], opacity: [0, 0.9, 0] }}
          transition={{ duration: 5, delay: b.delay, repeat: Infinity, repeatDelay: 2 }}
          className="absolute rounded-full"
          style={{
            left: `${b.left}%`,
            top: `${b.top}%`,
            width: b.size,
            height: b.size,
            background: `radial-gradient(circle, oklch(0.92 0.10 ${b.hue}), oklch(0.70 0.20 ${b.hue}) 70%, transparent 75%)`,
            filter: "blur(1px)",
          }}
        />
      ))}
    </div>
  );
}