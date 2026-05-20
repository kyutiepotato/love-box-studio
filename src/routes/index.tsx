import { useEffect, useRef, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { motion, AnimatePresence } from "framer-motion";
import { Petals, Sparkles } from "@/components/romantic/Particles";
import { GiftBox } from "@/components/romantic/GiftBox";
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

type Scene = "intro" | "hub" | "toys" | "letter" | "flowers";

function Index() {
  const [scene, setScene] = useState<Scene>("intro");
  const [visited, setVisited] = useState<Record<string, boolean>>({});
  const [music, setMusic] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const allSeen = visited.toys && visited.letter && visited.flowers;

  useEffect(() => {
    const a = audioRef.current;
    if (!a) return;
    if (music) a.play().catch(() => setMusic(false));
    else a.pause();
  }, [music]);

  const markVisited = (k: Scene) => setVisited((v) => ({ ...v, [k]: true }));

  return (
    <main className="relative min-h-screen overflow-x-hidden">
      <Sparkles />
      <Petals />

      {/* Music toggle */}
      <button
        onClick={() => setMusic((m) => !m)}
        aria-label="Toggle background music"
        className="glass fixed right-4 top-4 z-50 flex h-11 w-11 items-center justify-center rounded-full text-foreground/80 transition-all hover:scale-110 hover:text-primary"
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
              className="mb-2 text-center text-5xl text-gradient-rose sm:text-7xl"
            >
              For you, with all of me
            </motion.h1>
            <motion.p
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.5, duration: 0.8 }}
              className="mb-12 text-center font-script text-2xl text-foreground/70 sm:text-3xl"
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
              className="mb-2 text-center text-4xl text-gradient-rose sm:text-6xl"
            >
              Three little surprises
            </motion.h2>
            <p className="mb-12 text-center font-script text-xl text-foreground/70 sm:text-2xl">
              pick what you'd like to open first
            </p>

            <div className="grid w-full max-w-5xl grid-cols-1 gap-8 sm:grid-cols-3">
              <FloatingItem
                emoji="🧸"
                label="Stuff Toys"
                hint="soft little hugs"
                anim="animate-float-slow"
                visited={!!visited.toys}
                onClick={() => {
                  markVisited("toys");
                  setScene("toys");
                }}
              />
              <FloatingItem
                emoji="💌"
                label="A Letter"
                hint="words from my heart"
                anim="animate-float-mid"
                visited={!!visited.letter}
                onClick={() => {
                  markVisited("letter");
                  setScene("letter");
                }}
              />
              <FloatingItem
                emoji="🌸"
                label="Flowers"
                hint="a bouquet for you"
                anim="animate-float-fast"
                visited={!!visited.flowers}
                onClick={() => {
                  markVisited("flowers");
                  setScene("flowers");
                }}
              />
            </div>

            <AnimatePresence>
              {allSeen && (
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8 }}
                  className="glass mt-14 max-w-xl rounded-3xl px-8 py-6 text-center"
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
          <LetterScene
            key="letter"
            onBack={() => setScene("hub")}
            onComplete={() => markVisited("letter")}
          />
        )}
        {scene === "flowers" && (
          <FlowersScene
            key="flowers"
            onBack={() => setScene("hub")}
            onComplete={() => markVisited("flowers")}
          />
        )}
      </AnimatePresence>
    </main>
  );
}

function FloatingItem({
  emoji,
  label,
  hint,
  anim,
  visited,
  onClick,
}: {
  emoji: string;
  label: string;
  hint: string;
  anim: string;
  visited: boolean;
  onClick: () => void;
}) {
  return (
    <motion.button
      whileHover={{ y: -8, scale: 1.04 }}
      whileTap={{ scale: 0.96 }}
      onClick={onClick}
      className={`glass group relative flex flex-col items-center gap-3 rounded-3xl p-8 text-center transition-shadow hover:shadow-[var(--shadow-glow)] ${anim}`}
    >
      <div
        className="flex h-24 w-24 items-center justify-center rounded-full text-5xl"
        style={{
          background: "radial-gradient(circle at 30% 30%, oklch(1 0 0 / 0.8), oklch(0.92 0.08 25 / 0.4))",
          boxShadow: "inset 0 -4px 14px oklch(0.7 0.15 15 / 0.2)",
        }}
      >
        <span className="drop-shadow-sm">{emoji}</span>
      </div>
      <span className="text-2xl text-foreground/90">{label}</span>
      <span className="font-script text-lg text-foreground/60">{hint}</span>
      {visited && (
        <span className="absolute right-4 top-4 text-xs text-primary">♥ opened</span>
      )}
    </motion.button>
  );
}
