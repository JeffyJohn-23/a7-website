"use client";

import { ReactNode } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { usePathname } from "next/navigation";

interface PageTransitionProps {
  children: ReactNode;
}

export function PageTransition({ children }: PageTransitionProps) {
  const pathname = usePathname();

  return (
    <AnimatePresence mode="wait" initial={false}>
      <motion.div
        variants={{
          initial: { opacity: 0, scale: 0.98 },
          animate: {
            opacity: 1,
            scale: 1,
            transition: { duration: 0.6, ease: "easeInOut" },
          },
          exit: {
            opacity: 0,
            scale: 0.98,
            transition: { duration: 0.4, ease: "easeIn" },
          },
        }}
        initial="initial"
        animate="animate"
        exit="exit"
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
}