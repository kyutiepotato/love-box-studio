import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { BackButton } from "./ToysScene";

const LETTER = `My dearest,

If words could carry the warmth I feel when I think of you, this letter would glow.

You are the soft pause in my loud days, the song I hum without knowing, the reason I look up at the sky and smile for no reason at all.

Every little thing about you — the way you laugh, the way you care, the way your eyes light up when you talk about the things you love — feels like a quiet kind of magic I didn't know I was waiting for.

If I could gather every gentle moment we've shared and turn it into stars, the night would never be dark again.

Thank you for being you. For being mine. For being the safest, sweetest place my heart has ever known.

Forever yours,
me 💕`;

export function LetterScene({ onBack, onComplete }: { onBack: () => void; onComplete: () => void }) {
  const [opened, setOpened] = useState(false);
  const [typed, setTyped] = useState("");

  useEffect(() => {
    if (!opened) return;
    let i = 0;
    const id = setInterval(() => {
      i++;
      setTyped(LETTER.slice(0, i));
      if (i >= LETTER.length) {
        clearInterval(id);
        onComplete();
      }
    }, 22);
    return () => clearInterval(id);
  }, [opened, onComplete]);

  return (
    <motion.section
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -30 }}
      transition={{ duration: 0.5 }}
      className="relative z-10 mx-auto flex min-h-screen w-full max-w-2xl flex-col items-center justify-center px-4 py-10"
    >
      <BackButton onBack={onBack} />

      <AnimatePresence mode="wait">
        {!opened ? (
          <motion.button
            key="envelope"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 1.4, opacity: 0, rotateX: 180 }}
            whileHover={{ scale: 1.05 }}
            onClick={() => setOpened(true)}
            transition={{ duration: 0.6 }}
            className="relative cursor-pointer"
            aria-label="Open the letter"
          >
            <Envelope />
            <p className="mt-6 text-center font-script text-2xl text-gradient-rose">tap to open</p>
          </motion.button>
        ) : (
          <motion.div
            key="letter"
            initial={{ opacity: 0, y: 40, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.7, ease: "easeOut" }}
            className="w-full"
          >
            <div
              className="relative max-h-[70vh] overflow-y-auto rounded-2xl p-8 sm:p-12"
              style={{
                background:
                  "repeating-linear-gradient(180deg, oklch(0.98 0.02 60) 0 28px, oklch(0.96 0.03 60) 28px 29px)",
                boxShadow: "var(--shadow-glow)",
                border: "1px solid oklch(0.85 0.05 30 / 0.6)",
              }}
            >
              <h3 className="mb-4 text-center font-script text-3xl text-gradient-rose">
                A letter, just for you
              </h3>
              <pre
                className="whitespace-pre-wrap font-display text-lg leading-relaxed text-foreground/85 sm:text-xl"
                style={{ fontFamily: "var(--font-display)" }}
              >
                {typed}
                <span className="animate-pulse">|</span>
              </pre>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.section>
  );
}

function Envelope() {
  return (
    <div className="relative h-52 w-72 sm:h-64 sm:w-96">
      <div
        className="absolute inset-0 rounded-md"
        style={{
          background: "linear-gradient(160deg, oklch(0.94 0.05 25), oklch(0.86 0.08 20))",
          boxShadow: "var(--shadow-glow)",
        }}
      />
      <div
        className="absolute inset-x-0 top-0 h-1/2"
        style={{
          background: "linear-gradient(180deg, oklch(0.90 0.08 20), oklch(0.82 0.10 15))",
          clipPath: "polygon(0 0, 100% 0, 50% 100%)",
        }}
      />
      <div
        className="absolute left-1/2 top-1/2 flex h-12 w-12 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full text-2xl text-white"
        style={{
          background: "radial-gradient(circle at 35% 35%, oklch(0.75 0.20 15), oklch(0.55 0.22 10))",
          boxShadow: "0 6px 20px -4px oklch(0.5 0.2 10 / 0.5)",
        }}
      >
        ♥
      </div>
    </div>
  );
}
