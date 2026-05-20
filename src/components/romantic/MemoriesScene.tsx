import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { BackButton } from "./ToysScene";
import m1 from "@/assets/memory1.jpg";
import m2 from "@/assets/memory2.jpg";
import m3 from "@/assets/memory3.jpg";
import m4 from "@/assets/memory4.jpg";

const MEMORIES = [
  { src: m1, caption: "the walk that felt like forever", date: "golden hour" },
  { src: m2, caption: "two hearts, two coffees", date: "lazy mornings" },
  { src: m3, caption: "all the little lights of us", date: "warm nights" },
  { src: m4, caption: "words I keep tucked away", date: "always" },
];

export function MemoriesScene({ onBack }: { onBack: () => void }) {
  const [open, setOpen] = useState<number | null>(null);

  return (
    <motion.section
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -30 }}
      transition={{ duration: 0.5 }}
      className="relative z-10 mx-auto flex min-h-screen w-full max-w-4xl flex-col items-center px-4 py-10"
    >
      <BackButton onBack={onBack} />
      <h2 className="mb-2 text-center text-4xl text-gradient-rose sm:text-5xl">Our little polaroids</h2>
      <p className="mb-10 text-center font-script text-xl text-foreground/70">tap a memory to hold it</p>

      <div className="grid w-full grid-cols-2 gap-5 sm:grid-cols-2 sm:gap-8">
        {MEMORIES.map((m, i) => (
          <motion.button
            key={i}
            onClick={() => setOpen(i)}
            whileHover={{ rotate: 0, y: -6, scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            initial={{ opacity: 0, y: 30, rotate: i % 2 === 0 ? -4 : 4 }}
            animate={{ opacity: 1, y: 0, rotate: i % 2 === 0 ? -4 : 4 }}
            transition={{ duration: 0.6, delay: i * 0.1 }}
            className="group relative cursor-pointer rounded-sm bg-white p-3 pb-10 shadow-[0_10px_30px_-10px_oklch(0.4_0.1_230/0.35)] sm:p-4 sm:pb-14"
            style={{ transformOrigin: "center" }}
          >
            <div className="aspect-square w-full overflow-hidden bg-muted">
              <img
                src={m.src}
                alt={m.caption}
                loading="lazy"
                width={400}
                height={400}
                className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
              />
            </div>
            <p className="absolute bottom-2 left-0 right-0 text-center font-script text-base text-foreground/70 sm:text-lg">
              {m.date}
            </p>
          </motion.button>
        ))}
      </div>

      <AnimatePresence>
        {open !== null && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setOpen(null)}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 backdrop-blur-md"
          >
            <motion.div
              initial={{ scale: 0.8, rotate: -3 }}
              animate={{ scale: 1, rotate: 0 }}
              exit={{ scale: 0.8 }}
              className="max-w-md rounded-sm bg-white p-4 pb-12 shadow-2xl sm:p-5 sm:pb-16"
            >
              <img
                src={MEMORIES[open].src}
                alt={MEMORIES[open].caption}
                className="aspect-square w-full object-cover"
              />
              <p className="mt-4 text-center font-script text-2xl text-foreground/80">
                {MEMORIES[open].caption}
              </p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.section>
  );
}
