import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import { Gamepad2, X } from 'lucide-react';
import {
  MOTION_TOKENS,
  MODAL_OVERLAY_VARIANTS,
  MODAL_PANEL_VARIANTS,
} from '../../utils/motion.jsx';
import { useModalAccessibility } from '../../hooks/useModalAccessibility.js';

export default function ArcadeModal({ isOpen, onClose, onSwitchToDungeon }) {
  const prefersReducedMotion = useReducedMotion();
  const startButtonRef = useRef(null);

  // Reaction Timer State — strictly independent of animation frame timing
  const [arcadeState, setArcadeState] = useState('idle'); // 'idle' | 'waiting' | 'ready' | 'early' | 'result'
  const [reactionTime, setReactionTime] = useState(null);
  const [bestTime, setBestTime] = useState(null);
  const [attemptHistory, setAttemptHistory] = useState([]);
  const arcadeTimerRef = useRef(null);
  const arcadeStartRef = useRef(0);

  const panelRef = useModalAccessibility({
    isOpen,
    onClose,
    initialFocusRef: startButtonRef,
  });

  useEffect(() => {
    return () => {
      if (arcadeTimerRef.current) clearTimeout(arcadeTimerRef.current);
    };
  }, []);

  useEffect(() => {
    if (!isOpen && arcadeTimerRef.current) {
      clearTimeout(arcadeTimerRef.current);
      setArcadeState('idle');
    }
  }, [isOpen]);

  const startArcadeRound = () => {
    if (arcadeTimerRef.current) clearTimeout(arcadeTimerRef.current);
    setArcadeState('waiting');
    setReactionTime(null);
    const randomDelay = Math.floor(Math.random() * 2000) + 1200;
    arcadeTimerRef.current = setTimeout(() => {
      arcadeStartRef.current = performance.now();
      setArcadeState('ready');
    }, randomDelay);
  };

  const handleArcadePadTrigger = () => {
    if (arcadeState === 'waiting') {
      if (arcadeTimerRef.current) clearTimeout(arcadeTimerRef.current);
      setArcadeState('early');
    } else if (arcadeState === 'ready') {
      const elapsed = Math.round(performance.now() - arcadeStartRef.current);
      setReactionTime(elapsed);
      setAttemptHistory((prev) => [elapsed, ...prev.slice(0, 4)]);
      setBestTime((prevBest) =>
        !prevBest || elapsed < prevBest ? elapsed : prevBest,
      );
      setArcadeState('result');
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          key="arcade-modal-overlay"
          variants={MODAL_OVERLAY_VARIANTS}
          initial="hidden"
          animate="visible"
          exit="exit"
          onClick={onClose}
          className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 overflow-y-auto"
        >
          <motion.div
            ref={panelRef}
            role="dialog"
            aria-modal="true"
            aria-labelledby="arcade-modal-title"
            variants={MODAL_PANEL_VARIANTS}
            initial="hidden"
            animate="visible"
            exit="exit"
            onClick={(e) => e.stopPropagation()}
            className="bg-[#191919] border border-[#E87935] max-w-lg w-full max-h-[90vh] overflow-y-auto shadow-2xl my-auto"
          >
            <div className="flex flex-wrap items-center justify-between gap-2 px-4 sm:px-5 py-3.5 bg-[#101010] border-b border-[#33302D]">
              <div className="flex items-center gap-2 font-mono text-xs text-[#E87935]">
                <Gamepad2 className="w-4 h-4 shrink-0" />
                <span id="arcade-modal-title">
                  MINI ARCADE // REACTION TIMER
                </span>
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={onSwitchToDungeon}
                  className="font-mono text-[10px] px-2.5 py-1 bg-[#242220] border border-[#33302D] hover:border-[#E87935] text-[#F3A45B] transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-[#E87935]"
                >
                  Hidden Dungeon →
                </button>
                <button
                  type="button"
                  onClick={onClose}
                  aria-label="Close reaction arcade modal"
                  className="min-w-[32px] min-h-[32px] flex items-center justify-center text-[#A7A19A] hover:text-[#E8E4DE] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#E87935]"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            <div className="p-5 sm:p-6 space-y-5">
              <div className="grid grid-cols-2 gap-3 font-mono">
                <div className="p-3 bg-[#101010] border border-[#33302D]">
                  <span className="text-[10px] text-[#A7A19A] block">
                    LAST REACTION
                  </span>
                  <motion.span
                    key={reactionTime || 'none'}
                    initial={
                      prefersReducedMotion ? false : { opacity: 0.4, y: 4 }
                    }
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.15 }}
                    className="text-lg font-bold text-[#E8E4DE] block"
                  >
                    {reactionTime !== null ? `${reactionTime} ms` : '— ms'}
                  </motion.span>
                </div>
                <div className="p-3 bg-[#101010] border border-[#33302D]">
                  <span className="text-[10px] text-[#A7A19A] block">
                    BEST SCORE
                  </span>
                  <motion.span
                    key={bestTime || 'none'}
                    initial={prefersReducedMotion ? false : { scale: 0.94 }}
                    animate={{ scale: 1 }}
                    transition={{ duration: 0.18 }}
                    className="text-lg font-bold text-[#E87935] block"
                  >
                    {bestTime !== null ? `${bestTime} ms` : '— ms'}
                  </motion.span>
                </div>
              </div>

              {/* Reaction Pad — Immediate pointer/keyboard handler preserved for accurate timing */}
              <div
                role="button"
                tabIndex={0}
                aria-label="Reaction Pad"
                onClick={handleArcadePadTrigger}
                onKeyDown={(e) => {
                  if (e.key === ' ' || e.key === 'Enter') {
                    e.preventDefault();
                    handleArcadePadTrigger();
                  }
                }}
                className={`h-44 sm:h-48 border flex flex-col items-center justify-center p-5 sm:p-6 text-center select-none transition-colors cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-[#E87935] ${
                  arcadeState === 'idle'
                    ? 'bg-[#101010] border-[#33302D]'
                    : arcadeState === 'waiting'
                    ? 'bg-[#242220] border-[#F3A45B]/60'
                    : arcadeState === 'ready'
                    ? 'bg-[#E87935] border-[#F3A45B] text-[#101010]'
                    : arcadeState === 'early'
                    ? 'bg-red-950/60 border-red-500/60'
                    : 'bg-[#101010] border-[#E87935]'
                }`}
              >
                {arcadeState === 'idle' && (
                  <p className="font-mono text-xs text-[#A7A19A] max-w-xs">
                    Press Start, wait for the panel to turn{' '}
                    <span className="text-[#E87935]">ORANGE</span>, then click
                    as fast as you can.
                  </p>
                )}
                {arcadeState === 'waiting' && (
                  <motion.div
                    animate={
                      prefersReducedMotion
                        ? undefined
                        : { opacity: [0.5, 1, 0.5] }
                    }
                    transition={{ duration: 1.2, repeat: Infinity }}
                    className="font-mono text-xs tracking-widest text-[#F3A45B]"
                  >
                    WAIT FOR SIGNAL...
                  </motion.div>
                )}
                {arcadeState === 'ready' && (
                  <div className="font-heading text-2xl sm:text-3xl font-bold text-[#101010]">
                    CLICK NOW!
                  </div>
                )}
                {arcadeState === 'early' && (
                  <motion.div
                    initial={prefersReducedMotion ? false : { x: -6 }}
                    animate={{ x: 0 }}
                    className="font-mono text-xs text-red-400"
                  >
                    Too early! Click Restart to try again.
                  </motion.div>
                )}
                {arcadeState === 'result' && (
                  <motion.div
                    initial={
                      prefersReducedMotion
                        ? false
                        : { scale: 0.9, opacity: 0 }
                    }
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ duration: 0.2, ease: MOTION_TOKENS.ease }}
                    className="space-y-1"
                  >
                    <div className="font-heading text-3xl font-bold text-[#E8E4DE]">
                      {reactionTime} ms
                    </div>
                  </motion.div>
                )}
              </div>

              <div className="flex flex-wrap items-center justify-between gap-3">
                <div className="font-mono text-[11px] text-[#A7A19A]">
                  {attemptHistory.length > 0 &&
                    `History: ${attemptHistory.map((t) => `${t}ms`).join(', ')}`}
                </div>
                <motion.button
                  ref={startButtonRef}
                  type="button"
                  whileHover={prefersReducedMotion ? undefined : { y: -2 }}
                  whileTap={prefersReducedMotion ? undefined : { scale: 0.97 }}
                  onClick={startArcadeRound}
                  className="px-5 py-2.5 bg-[#E87935] hover:bg-[#F3A45B] text-[#101010] font-mono text-xs font-semibold uppercase ml-auto focus:outline-none focus-visible:ring-2 focus-visible:ring-[#F3A45B]"
                >
                  {arcadeState === 'idle' ? 'Start' : 'Restart'}
                </motion.button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

