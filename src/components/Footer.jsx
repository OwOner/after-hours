import { motion, useReducedMotion } from 'framer-motion';
import { Terminal as TerminalIcon } from 'lucide-react';
import { MOTION_TOKENS } from '../utils/motion.jsx';

export default function Footer({ onOpenTerminal }) {
  const prefersReducedMotion = useReducedMotion();

  return (
    <footer className="relative z-10 border-t border-[#33302D] bg-[#101010] pt-10 pb-20 sm:pb-16 px-4 sm:px-8">
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-6">
        <div className="flex items-center gap-3">
          <span className="w-2 h-2 bg-[#E87935] rotate-45" />
          <span className="font-mono text-xs text-[#A7A19A]">
            JP.DEV — SORSOGON, PHILIPPINES
          </span>
        </div>

        {/* Subtle Secret Triggers that do not compete with the main portfolio */}
        <div className="flex items-center gap-2">
          <motion.button
            type="button"
            whileHover={
              prefersReducedMotion ? undefined : { y: -2, scale: 1.04 }
            }
            whileTap={prefersReducedMotion ? undefined : { scale: 0.96 }}
            transition={{
              duration: MOTION_TOKENS.fast,
              ease: MOTION_TOKENS.ease,
            }}
            onClick={onOpenTerminal}
            className="min-w-[40px] min-h-[40px] flex items-center justify-center p-2 bg-[#191919] hover:bg-[#242220] border border-[#33302D] hover:border-[#E87935] text-[#A7A19A] hover:text-[#E87935] transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-[#E87935]"
            title="Open Console"
            aria-label="Open Secret Terminal"
          >
            <TerminalIcon className="w-4 h-4" />
          </motion.button>
        </div>
      </div>
    </footer>
  );
}

