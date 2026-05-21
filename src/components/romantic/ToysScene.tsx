import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import toy1 from "@/assets/1.jpg";
import toy2 from "@/assets/5.jpg";
import toy3 from "@/assets/3.jpg";
import toy4 from "@/assets/toy4.jpg";

const TOYS = [
  { src: toy1, caption: "Pakyut pana HAHAHHA" },
  { src: toy2, caption: "Ari cutie ayy" },
  { src: toy3, caption: "You shine everyday, hon" },
  { src: toy4, caption: "Hehehehe" },
];

export function ToysScene({ onBack }: { onBack: () => void }) {
  const [index, setIndex] = useState(0);
  const [zoom, setZoom] = useState(false);

  const next = () => setIndex((i) => (i + 1) % TOYS.length);
  const prev = () => setIndex((i) => (i - 1 + TOYS.length) % TOYS.length);

  return (
    <motion.section
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -30 }}
      transition={{ duration: 0.5 }}
      className="relative z-10 mx-auto flex min-h-screen w-full max-w-4xl flex-col items-center justify-center px-4 py-10"
    >
      <BackButton onBack={onBack} />
      <h2 className="mb-2 text-center text-4xl text-gradient-rose sm:text-5xl">A little hug collection</h2>
      <p className="mb-8 text-center font-script text-xl text-muted-foreground">for the softest person I know</p>

      <div className="glass relative w-full overflow-hidden rounded-3xl p-4 sm:p-6">
        <div className="relative aspect-square w-full overflow-hidden rounded-2xl sm:aspect-[4/3]">
          <AnimatePresence mode="wait">
            <motion.img
              key={index}
              src={TOYS[index].src}
              alt={TOYS[index].caption}
              loading="lazy"
              width={800}
              height={800}
              onClick={() => setZoom(true)}
              initial={{ opacity: 0, scale: 1.05 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.98 }}
              transition={{ duration: 0.5 }}
              className="absolute inset-0 h-full w-full cursor-zoom-in object-cover"
            />
          </AnimatePresence>
        </div>
        <p className="mt-4 text-center font-script text-2xl text-foreground/80">
          {TOYS[index].caption}
        </p>

        <div className="mt-4 flex items-center justify-between">
          <NavButton onClick={prev} label="‹" />
          <div className="flex gap-2">
            {TOYS.map((_, i) => (
              <button
                key={i}
                onClick={() => setIndex(i)}
                aria-label={`Go to image ${i + 1}`}
                className="h-2.5 w-2.5 rounded-full transition-all"
                style={{
                  background: i === index ? "var(--primary)" : "oklch(0.85 0.05 20 / 0.6)",
                  transform: i === index ? "scale(1.3)" : "scale(1)",
                }}
              />
            ))}
          </div>
          <NavButton onClick={next} label="›" />
        </div>
      </div>

      {/* Thumbnails */}
      <div className="mt-6 grid w-full grid-cols-4 gap-3">
        {TOYS.map((t, i) => (
          <button
            key={i}
            onClick={() => setIndex(i)}
            className="group relative aspect-square overflow-hidden rounded-xl transition-all"
            style={{
              outline: i === index ? "2px solid var(--primary)" : "2px solid transparent",
              outlineOffset: 2,
            }}
          >
            <img src={t.src} alt="" loading="lazy" width={200} height={200} className="h-full w-full object-cover transition-transform group-hover:scale-110" />
          </button>
        ))}
      </div>

      <AnimatePresence>
        {zoom && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setZoom(false)}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 backdrop-blur-md"
          >
            <motion.img
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.8 }}
              src={TOYS[index].src}
              alt={TOYS[index].caption}
              className="max-h-[90vh] max-w-[90vw] rounded-2xl object-contain shadow-2xl"
            />
          </motion.div>
        )}
      </AnimatePresence>
    </motion.section>
  );
}

function NavButton({ onClick, label }: { onClick: () => void; label: string }) {
  return (
    <button
      onClick={onClick}
      className="glass flex h-12 w-12 items-center justify-center rounded-full text-2xl text-foreground/80 transition-all hover:scale-110 hover:text-primary"
    >
      {label}
    </button>
  );
}

export function BackButton({ onBack }: { onBack: () => void }) {
  return (
    <button
      onClick={onBack}
      className="glass mb-6 self-start rounded-full px-5 py-2 text-sm text-foreground/80 transition-all hover:scale-105 hover:text-primary"
    >
      ← back
    </button>
  );
}
