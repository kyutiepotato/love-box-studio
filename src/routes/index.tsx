import { useEffect, useRef, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { motion, AnimatePresence } from "framer-motion";
import confetti from "canvas-confetti";
import { Petals, Sparkles } from "@/components/romantic/Particles";

import { ToysScene } from "@/components/romantic/ToysScene";
import { LetterScene } from "@/components/romantic/LetterScene";
import { FlowersScene } from "@/components/romantic/FlowersScene";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "A Little Love Box — Just For You" },
      { name: "description", content: "An interactive digital gift filled with hugs, words, and forever flowers." },
      { property: "og:title", content: "A Little Love Box — Just For You" },
      { property: "og:description", content: "Open your gift — a heartfelt experience made with love." },
    ],
  }),
  component: Index,
});

type Scene = "teddy" | "pin" | "hub" | "toys" | "letter" | "flowers";

const PIN_KEY = "lovebox.unlocked";
const CORRECT_PIN = "011226";

function Index() {
  const [scene, setScene] = useState<Scene>("teddy");
  const [visited, setVisited] = useState<Record<string, boolean>>({});
  const [music, setMusic] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const firedConfetti = useRef(false);
  const [unlocked, setUnlocked] = useState(false);

  useEffect(() => {
    try {
      if (localStorage.getItem(PIN_KEY) === "1") setUnlocked(true);
    } catch {}
  }, []);

  const allSeen = visited.toys && visited.letter && visited.flowers;

  useEffect(() => {
    if (allSeen && !firedConfetti.current) {
      firedConfetti.current = true;
      const burst = (origin: { x: number; y: number }) =>
        confetti({
          particleCount: 80,
          spread: 70,
          origin,
          colors: ["#a5d8ff", "#74c0fc", "#ffd6e0", "#ffffff", "#b6e0fe"],
          shapes: ["circle"],
          scalar: 1.1,
          ticks: 200,
        });
      burst({ x: 0.2, y: 0.7 });
      burst({ x: 0.8, y: 0.7 });
      setTimeout(() => burst({ x: 0.5, y: 0.4 }), 300);
      setTimeout(() => burst({ x: 0.5, y: 0.6 }), 700);
    }
  }, [allSeen]);

  useEffect(() => {
    const a = audioRef.current;
    if (!a) return;
    if (music) a.play().catch(() => setMusic(false));
    else a.pause();
  }, [music]);

  const markVisited = (k: Scene) => setVisited((v) => ({ ...v, [k]: true }));

  const unlock = () => {
    try { localStorage.setItem(PIN_KEY, "1"); } catch {}
    setScene("hub");
  };

  return (
    <main className="relative min-h-screen overflow-x-hidden">
      <Sparkles />
      <Petals />

      <button
        onClick={() => setMusic((m) => !m)}
        aria-label="Toggle background music"
        className="glass fixed right-4 top-4 z-50 flex h-11 w-11 items-center justify-center rounded-full text-foreground/80 transition-all active:scale-95 hover:scale-110 hover:text-primary"
      >
        {music ? "♫" : "♪"}
      </button>
      <audio
        ref={audioRef}
        src="https://cdn.pixabay.com/audio/2022/03/15/audio_c8c8a73467.mp3"
        loop
        preload="none"
      />

      <AnimatePresence mode="wait">
        {scene === "teddy" && <TeddyIntro key="teddy" onContinue={() => setScene(unlocked ? "hub" : "pin")} />}
        {scene === "pin" && <PinScene key="pin" onUnlock={unlock} />}

        {scene === "hub" && (
          <motion.section
            key="hub"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.6 }}
            className="relative z-10 flex min-h-screen flex-col items-center justify-center px-4 py-10"
          >
            <motion.h2
              initial={{ y: -20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.6 }}
              className="mb-2 text-center text-3xl text-gradient-rose sm:text-6xl"
            >
              Pick one, love
            </motion.h2>
            <p className="mb-10 text-center font-script text-lg text-foreground/70 sm:text-2xl">
              three little surprises, opened in any order
            </p>

            <div className="grid w-full max-w-4xl grid-cols-1 gap-4 sm:grid-cols-3 sm:gap-6">
              <FloatingItem
                emoji="🧸"
                label="Stuff Toys"
                hint="soft hugs"
                anim="animate-float-slow"
                visited={!!visited.flowers}
                onClick={() => { markVisited("flowers"); setScene("flowers"); }}
              />
              <FloatingItem
                emoji="💌"
                label="A Letter"
                hint="from my heart"
                anim="animate-float-mid"
                visited={!!visited.letter}
                onClick={() => { markVisited("letter"); setScene("letter"); }}
              />
              <FloatingItem
                emoji="🌸"
                label="Flowers"
                hint="forever blooms"
                anim="animate-float-fast"
                visited={!!visited.toys}
                onClick={() => { markVisited("toys"); setScene("toys"); }}
              />
            </div>

            <AnimatePresence>
              {allSeen && (
                <motion.div
                  initial={{ opacity: 0, y: 30, scale: 0.9 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  transition={{ duration: 0.8 }}
                  className="glass mt-12 max-w-xl rounded-3xl px-6 py-6 text-center sm:px-8"
                >
                  <p className="font-script text-2xl text-gradient-rose sm:text-3xl">
                    you found them all 💖
                  </p>
                  <p className="mt-2 text-foreground/75">
                    a little secret: every petal, every word, every soft toy in this box —
                    it's really just me, trying to say <em>i love you</em> in as many ways as i know.
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.section>
        )}

        {scene === "toys" && <ToysScene key="toys" onBack={() => setScene("hub")} />}
        {scene === "letter" && (
          <LetterScene key="letter" onBack={() => setScene("hub")} onComplete={() => markVisited("letter")} />
        )}
        {scene === "flowers" && (
          <FlowersScene key="flowers" onBack={() => setScene("hub")} onComplete={() => markVisited("flowers")} />
        )}
      </AnimatePresence>
    </main>
  );
}

function PinScene({ onUnlock }: { onUnlock: () => void }) {
  const [pin, setPin] = useState("");
  const [error, setError] = useState(false);
  const [shake, setShake] = useState(0);

  const press = (d: string) => {
    if (pin.length >= 6) return;
    const next = pin + d;
    setError(false);
    setPin(next);
    if (next.length === 6) {
      setTimeout(() => {
        if (next === CORRECT_PIN) onUnlock();
        else {
          setError(true);
          setShake((s) => s + 1);
          setTimeout(() => setPin(""), 600);
        }
      }, 150);
    }
  };
  const back = () => { setError(false); setPin((p) => p.slice(0, -1)); };

  return (
    <motion.section
      key="pin"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
      className="relative z-10 flex min-h-screen flex-col items-center justify-center px-4"
    >
      <motion.h1
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.2, duration: 0.7 }}
        className="mb-3 text-center text-4xl text-gradient-rose sm:text-6xl"
      >
        Enter our little secret
      </motion.h1>
      <motion.p
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.4, duration: 0.7 }}
        className="mb-8 text-center font-script text-xl text-foreground/70 sm:text-2xl"
      >
        the day my heart said yes 💖
      </motion.p>

      <motion.div
        key={shake}
        animate={error ? { x: [0, -10, 10, -8, 8, 0] } : {}}
        transition={{ duration: 0.4 }}
        className="glass flex flex-col items-center gap-6 rounded-3xl p-6 sm:p-8"
      >
        <div className="flex gap-2 sm:gap-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <div
              key={i}
              className="h-4 w-4 rounded-full border-2 transition-all sm:h-5 sm:w-5"
              style={{
                borderColor: error ? "oklch(0.6 0.2 25)" : "var(--primary)",
                background: i < pin.length ? (error ? "oklch(0.6 0.2 25)" : "var(--primary)") : "transparent",
              }}
            />
          ))}
        </div>

        <div className="grid grid-cols-3 gap-3 sm:gap-4">
          {["1","2","3","4","5","6","7","8","9"].map((d) => (
            <PinKey key={d} onClick={() => press(d)}>{d}</PinKey>
          ))}
          <div />
          <PinKey onClick={() => press("0")}>0</PinKey>
          <PinKey onClick={back} aria-label="Delete">⌫</PinKey>
        </div>

        {error && (
          <p className="text-sm text-[oklch(0.55_0.2_25)]">try again, love</p>
        )}
      </motion.div>
    </motion.section>
  );
}

function TeddyIntro({ onContinue }: { onContinue: () => void }) {
  return (
    <motion.section
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, scale: 1.05 }}
      transition={{ duration: 0.6 }}
      className="relative z-10 flex min-h-screen flex-col items-center justify-center px-4"
    >
      <motion.button
        onClick={onContinue}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.92 }}
        aria-label="Yes, hug me"
        className="group flex flex-col items-center gap-6 outline-none"
      >
        <motion.div
          animate={{ y: [0, -10, 0] }}
          transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
          className="relative flex h-44 w-44 items-center justify-center rounded-full sm:h-56 sm:w-56"
          style={{
            background:
              "radial-gradient(circle at 30% 30%, oklch(1 0 0 / 0.9), oklch(0.88 0.08 225 / 0.5))",
            boxShadow: "0 20px 60px oklch(0.6 0.15 235 / 0.35), inset 0 -8px 24px oklch(0.6 0.15 235 / 0.25)",
          }}
        >
          <span className="text-[7rem] drop-shadow-md sm:text-[9rem]">🧸</span>
          <motion.span
            animate={{ scale: [1, 1.2, 1], opacity: [0.7, 1, 0.7] }}
            transition={{ duration: 1.6, repeat: Infinity }}
            className="absolute -right-2 -top-2 text-3xl sm:text-4xl"
          >
            💗
          </motion.span>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.7 }}
          className="glass relative max-w-xs rounded-3xl px-6 py-4 text-center sm:max-w-md sm:px-8 sm:py-5"
        >
          <p className="font-script text-2xl text-gradient-rose sm:text-3xl">
            can i hug you, hon? 🥺
          </p>
          <p className="mt-1 text-sm text-foreground/70 sm:text-base">tap me, please</p>
          <span
            className="absolute -top-2 left-1/2 h-4 w-4 -translate-x-1/2 rotate-45"
            style={{ background: "inherit" }}
          />
        </motion.div>
      </motion.button>
    </motion.section>
  );
}

function PinKey({ children, onClick, ...rest }: React.ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <motion.button
      whileTap={{ scale: 0.9 }}
      whileHover={{ scale: 1.05 }}
      onClick={onClick}
      {...(rest as any)}
      className="glass flex h-14 w-14 items-center justify-center rounded-full text-2xl font-medium text-foreground/85 transition-shadow hover:shadow-[var(--shadow-glow)] sm:h-16 sm:w-16 sm:text-3xl"
    >
      {children}
    </motion.button>
  );
}

function FloatingItem({
  emoji, label, hint, anim, visited, onClick,
}: {
  emoji: string; label: string; hint: string; anim: string; visited: boolean; onClick: () => void;
}) {
  return (
    <motion.button
      whileHover={{ y: -8, scale: 1.04 }}
      whileTap={{ scale: 0.94 }}
      onClick={onClick}
      className={`glass group relative flex flex-col items-center gap-2 rounded-3xl p-5 text-center transition-shadow hover:shadow-[var(--shadow-glow)] sm:gap-3 sm:p-7 ${anim}`}
    >
      <div
        className="flex h-16 w-16 items-center justify-center rounded-full text-3xl sm:h-20 sm:w-20 sm:text-4xl"
        style={{
          background: "radial-gradient(circle at 30% 30%, oklch(1 0 0 / 0.85), oklch(0.88 0.08 225 / 0.4))",
          boxShadow: "inset 0 -4px 14px oklch(0.6 0.15 235 / 0.2)",
        }}
      >
        <span className="drop-shadow-sm">{emoji}</span>
      </div>
      <span className="text-base text-foreground/90 sm:text-xl">{label}</span>
      <span className="font-script text-sm text-foreground/60 sm:text-base">{hint}</span>
      {visited && (
        <span className="absolute right-3 top-3 text-[10px] text-primary sm:text-xs">♥</span>
      )}
    </motion.button>
  );
}
