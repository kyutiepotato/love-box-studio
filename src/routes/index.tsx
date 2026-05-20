import { useEffect, useRef, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { motion, AnimatePresence } from "framer-motion";
import confetti from "canvas-confetti";
import { Petals, Sparkles } from "@/components/romantic/Particles";
import { GiftBox } from "@/components/romantic/GiftBox";
import { ToysScene } from "@/components/romantic/ToysScene";
import { LetterScene } from "@/components/romantic/LetterScene";
import { FlowersScene } from "@/components/romantic/FlowersScene";
import { MemoriesScene } from "@/components/romantic/MemoriesScene";

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

type Scene = "name" | "intro" | "hub" | "toys" | "letter" | "flowers" | "memories";

const NAME_KEY = "lovebox.name";

function Index() {
  const [name, setName] = useState<string>("");
  const [scene, setScene] = useState<Scene>("name");
  const [visited, setVisited] = useState<Record<string, boolean>>({});
  const [music, setMusic] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const firedConfetti = useRef(false);

  // Restore saved name
  useEffect(() => {
    try {
      const saved = localStorage.getItem(NAME_KEY);
      if (saved) {
        setName(saved);
        setScene("intro");
      }
    } catch {}
  }, []);

  const allSeen = visited.toys && visited.letter && visited.flowers && visited.memories;

  // Confetti finale
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

  const submitName = (n: string) => {
    const trimmed = n.trim().slice(0, 40);
    if (!trimmed) return;
    try { localStorage.setItem(NAME_KEY, trimmed); } catch {}
    setName(trimmed);
    setScene("intro");
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
        {scene === "name" && (
          <NameScene key="name" onSubmit={submitName} />
        )}

        {scene === "intro" && (
          <motion.section
            key="intro"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, scale: 1.1 }}
            transition={{ duration: 0.6 }}
            className="relative z-10 flex min-h-screen flex-col items-center justify-center px-4"
          >
            <motion.h1
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.2, duration: 0.8 }}
              className="mb-2 text-center text-4xl text-gradient-rose sm:text-7xl"
            >
              For {name || "you"}, with all of me
            </motion.h1>
            <motion.p
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.5, duration: 0.8 }}
              className="mb-10 text-center font-script text-2xl text-foreground/70 sm:text-3xl"
            >
              a tiny love box, just a tap away
            </motion.p>
            <GiftBox onOpen={() => setScene("hub")} />
          </motion.section>
        )}

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
              Hi {name || "love"} — pick one
            </motion.h2>
            <p className="mb-10 text-center font-script text-lg text-foreground/70 sm:text-2xl">
              four little surprises, opened in any order
            </p>

            <div className="grid w-full max-w-5xl grid-cols-2 gap-4 sm:grid-cols-4 sm:gap-6">
              <FloatingItem
                emoji="🧸"
                label="Stuff Toys"
                hint="soft hugs"
                anim="animate-float-slow"
                visited={!!visited.toys}
                onClick={() => { markVisited("toys"); setScene("toys"); }}
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
                visited={!!visited.flowers}
                onClick={() => { markVisited("flowers"); setScene("flowers"); }}
              />
              <FloatingItem
                emoji="📸"
                label="Memories"
                hint="our polaroids"
                anim="animate-float-mid"
                visited={!!visited.memories}
                onClick={() => { markVisited("memories"); setScene("memories"); }}
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
                    you found them all, {name || "love"} 💖
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
        {scene === "memories" && <MemoriesScene key="memories" onBack={() => setScene("hub")} />}
      </AnimatePresence>
    </main>
  );
}

function NameScene({ onSubmit }: { onSubmit: (n: string) => void }) {
  const [value, setValue] = useState("");
  return (
    <motion.section
      key="name"
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
        Before we begin…
      </motion.h1>
      <motion.p
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.4, duration: 0.7 }}
        className="mb-8 text-center font-script text-xl text-foreground/70 sm:text-2xl"
      >
        what should I call you, lovely?
      </motion.p>
      <motion.form
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.6, duration: 0.7 }}
        onSubmit={(e) => { e.preventDefault(); onSubmit(value); }}
        className="glass flex w-full max-w-md flex-col gap-3 rounded-3xl p-5 sm:flex-row sm:items-center sm:p-6"
      >
        <input
          autoFocus
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder="your name"
          maxLength={40}
          className="flex-1 rounded-2xl border-0 bg-white/70 px-4 py-3 text-lg text-foreground placeholder:text-foreground/40 focus:outline-none focus:ring-2 focus:ring-primary sm:text-xl"
        />
        <button
          type="submit"
          disabled={!value.trim()}
          className="rounded-2xl px-6 py-3 text-base font-medium text-primary-foreground transition-all active:scale-95 hover:scale-105 disabled:opacity-50 disabled:hover:scale-100"
          style={{ background: "var(--gradient-rose)", boxShadow: "var(--shadow-glow)" }}
        >
          open my gift →
        </button>
      </motion.form>
    </motion.section>
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
