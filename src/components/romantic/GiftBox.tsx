import { motion } from "framer-motion";

export function GiftBox({ onOpen }: { onOpen: () => void }) {
  return (
    <motion.button
      onClick={onOpen}
      initial={{ scale: 0.8, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
      className="group relative cursor-pointer"
      aria-label="Open your gift"
    >
      <div className="relative animate-heartbeat">
        {/* box body */}
        <div
          className="relative h-44 w-44 rounded-2xl sm:h-56 sm:w-56"
          style={{
            background: "linear-gradient(160deg, oklch(0.78 0.18 15), oklch(0.62 0.22 10))",
            boxShadow: "var(--shadow-glow)",
          }}
        >
          {/* ribbon vertical */}
          <div
            className="absolute left-1/2 top-0 h-full w-6 -translate-x-1/2 sm:w-8"
            style={{ background: "linear-gradient(180deg, oklch(0.92 0.10 75), oklch(0.78 0.16 70))" }}
          />
          {/* ribbon horizontal */}
          <div
            className="absolute left-0 top-1/2 h-6 w-full -translate-y-1/2 sm:h-8"
            style={{ background: "linear-gradient(90deg, oklch(0.92 0.10 75), oklch(0.78 0.16 70))" }}
          />
        </div>
        {/* lid */}
        <div
          className="absolute -top-5 left-1/2 h-10 w-48 -translate-x-1/2 rounded-xl sm:-top-6 sm:h-12 sm:w-60"
          style={{
            background: "linear-gradient(160deg, oklch(0.82 0.18 15), oklch(0.68 0.22 10))",
            boxShadow: "0 8px 20px -8px oklch(0.5 0.2 10 / 0.4)",
          }}
        >
          <div
            className="absolute left-1/2 top-0 h-full w-6 -translate-x-1/2 sm:w-8"
            style={{ background: "linear-gradient(180deg, oklch(0.95 0.10 75), oklch(0.82 0.16 70))" }}
          />
        </div>
        {/* bow */}
        <div className="absolute -top-12 left-1/2 -translate-x-1/2 sm:-top-14">
          <div className="relative">
            <div
              className="absolute -left-7 top-0 h-9 w-9 rotate-[-25deg] rounded-full sm:-left-8 sm:h-11 sm:w-11"
              style={{ background: "radial-gradient(circle at 40% 40%, oklch(0.95 0.10 75), oklch(0.75 0.18 65))" }}
            />
            <div
              className="absolute -right-7 top-0 h-9 w-9 rotate-[25deg] rounded-full sm:-right-8 sm:h-11 sm:w-11"
              style={{ background: "radial-gradient(circle at 60% 40%, oklch(0.95 0.10 75), oklch(0.75 0.18 65))" }}
            />
            <div
              className="absolute left-1/2 top-2 h-5 w-5 -translate-x-1/2 rounded-full sm:h-6 sm:w-6"
              style={{ background: "oklch(0.85 0.16 65)" }}
            />
          </div>
        </div>
      </div>
      <div className="mt-10 text-center">
        <span className="font-script text-2xl text-gradient-rose sm:text-3xl">tap to open</span>
      </div>
    </motion.button>
  );
}
