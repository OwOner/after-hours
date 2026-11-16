import { useState, useRef, useEffect, useCallback } from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import {
  Compass,
  X,
  ChevronLeft,
  ChevronRight,
  ChevronUp,
  ChevronDown,
} from 'lucide-react';
import {
  MOTION_TOKENS,
  MODAL_OVERLAY_VARIANTS,
  MODAL_PANEL_VARIANTS,
} from '../../utils/motion.jsx';
import { useModalAccessibility } from '../../hooks/useModalAccessibility.js';
import {
  DUNGEON_WIDTH,
  DUNGEON_HEIGHT,
  INITIAL_DUNGEON_MAP,
} from '../../data/portfolioData.js';

export default function DungeonModal({ isOpen, onClose }) {
  const prefersReducedMotion = useReducedMotion();
  const closeButtonRef = useRef(null);

  const [playerPos, setPlayerPos] = useState({ x: 1, y: 5 });
  const [stepsCount, setStepsCount] = useState(0);
  const [relicFound, setRelicFound] = useState(false);
  const [dungeonLog, setDungeonLog] = useState(
    'Use WASD or Arrow Keys to navigate the sanctum.',
  );

  const panelRef = useModalAccessibility({
    isOpen,
    onClose,
    initialFocusRef: closeButtonRef,
  });

  const movePlayer = useCallback((dx, dy) => {
    setPlayerPos((prevPos) => {
      const targetX = prevPos.x + dx;
      const targetY = prevPos.y + dy;

      if (
        targetY < 0 ||
        targetY >= DUNGEON_HEIGHT ||
        targetX < 0 ||
        targetX >= DUNGEON_WIDTH
      ) {
        return prevPos;
      }

      const tile = INITIAL_DUNGEON_MAP[targetY][targetX];
      if (tile === 1) {
        setDungeonLog('Stone wall blocks the way.');
        return prevPos;
      }
      if (tile === 3) {
        setDungeonLog(
          'An ancient obelisk inscribed with clean system architecture notes.',
        );
        return prevPos;
      }

      setStepsCount((s) => s + 1);

      if (tile === 2) {
        setRelicFound(true);
        setDungeonLog(
          'DISCOVERY: You found the Ember Relic! Thank you for exploring the hidden sanctum.',
        );
      } else {
        setDungeonLog(`Moved to coordinates [${targetX}, ${targetY}].`);
      }

      return { x: targetX, y: targetY };
    });
  }, []);

  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e) => {
      if (['ArrowUp', 'w', 'W'].includes(e.key)) {
        e.preventDefault();
        movePlayer(0, -1);
      } else if (['ArrowDown', 's', 'S'].includes(e.key)) {
        e.preventDefault();
        movePlayer(0, 1);
      } else if (['ArrowLeft', 'a', 'A'].includes(e.key)) {
        e.preventDefault();
        movePlayer(-1, 0);
      } else if (['ArrowRight', 'd', 'D'].includes(e.key)) {
        e.preventDefault();
        movePlayer(1, 0);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, movePlayer]);

  const resetDungeon = () => {
    setPlayerPos({ x: 1, y: 5 });
    setStepsCount(0);
    setRelicFound(false);
    setDungeonLog('Room reset. Reach the glowing ember artifact.');
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          key="dungeon-modal-overlay"
          variants={MODAL_OVERLAY_VARIANTS}
          initial="hidden"
          animate="visible"
          exit="exit"
          onClick={onClose}
          className="fixed inset-0 z-50 bg-black/85 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 overflow-y-auto"
        >
          <motion.div
            ref={panelRef}
            role="dialog"
            aria-modal="true"
            aria-labelledby="dungeon-modal-title"
            variants={MODAL_PANEL_VARIANTS}
            initial="hidden"
            animate="visible"
            exit="exit"
            onClick={(e) => e.stopPropagation()}
            className="bg-[#191919] border border-[#E87935] max-w-lg w-full max-h-[90vh] overflow-y-auto shadow-2xl my-auto"
          >
            <div className="flex items-center justify-between px-4 sm:px-5 py-3.5 bg-[#101010] border-b border-[#33302D]">
              <div className="flex items-center gap-2 font-mono text-xs text-[#E87935]">
                <Compass className="w-4 h-4 shrink-0" />
                <span id="dungeon-modal-title">
                  HIDDEN SANCTUM // PIXEL ROOM
                </span>
              </div>
              <button
                ref={closeButtonRef}
                type="button"
                onClick={onClose}
                aria-label="Close hidden dungeon modal"
                className="min-w-[32px] min-h-[32px] flex items-center justify-center text-[#A7A19A] hover:text-[#E8E4DE] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#E87935]"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-4 sm:p-6 space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-2 font-mono text-xs bg-[#101010] border border-[#33302D] px-3.5 py-2">
                <span>STEPS: {stepsCount}</span>
                <span
                  className={relicFound ? 'text-emerald-400' : 'text-[#F3A45B]'}
                >
                  {relicFound ? '★ RELIC FOUND' : 'FIND THE EMBER TREASURE'}
                </span>
              </div>

              <div className="bg-[#101010] border border-[#33302D] p-2.5 sm:p-3 flex justify-center">
                <div
                  role="grid"
                  aria-label="Pixel dungeon grid"
                  className="grid grid-cols-9 gap-1 w-full max-w-[340px] aspect-[9/7]"
                >
                  {INITIAL_DUNGEON_MAP.map((row, rIdx) =>
                    row.map((cell, cIdx) => {
                      const isPlayer =
                        playerPos.x === cIdx && playerPos.y === rIdx;
                      const isWall = cell === 1;
                      const isRelic = cell === 2 && !relicFound;
                      const isPillar = cell === 3;

                      return (
                        <div
                          key={`${rIdx}-${cIdx}`}
                          role="gridcell"
                          className={`relative flex items-center justify-center border ${
                            isWall
                              ? 'bg-[#242220] border-[#33302D]'
                              : 'bg-[#141312] border-[#191919]'
                          }`}
                        >
                          {isPillar && (
                            <div className="w-2.5 h-2.5 sm:w-3 sm:h-3 rotate-45 border border-[#A7A19A]/60 bg-[#33302D]" />
                          )}
                          {isRelic && (
                            <motion.div
                              animate={
                                prefersReducedMotion
                                  ? undefined
                                  : {
                                      rotate: [45, 90, 45],
                                      scale: [1, 1.15, 1],
                                    }
                              }
                              transition={{
                                duration: 2.2,
                                repeat: Infinity,
                                ease: 'easeInOut',
                              }}
                              className="w-3 h-3 sm:w-3.5 sm:h-3.5 bg-[#F3A45B] rotate-45 shadow-[0_0_10px_#E87935]"
                            />
                          )}
                          {isPlayer && (
                            <motion.svg
                              layoutId="dungeonPlayerSprite"
                              transition={{
                                duration: 0.12,
                                ease: MOTION_TOKENS.ease,
                              }}
                              viewBox="0 0 16 16"
                              className="w-4/5 h-4/5"
                              aria-label="Player"
                            >
                              <rect
                                x="5"
                                y="2"
                                width="6"
                                height="4"
                                fill="#E87935"
                              />
                              <rect
                                x="6"
                                y="3"
                                width="4"
                                height="3"
                                fill="#101010"
                              />
                              <rect
                                x="6"
                                y="4"
                                width="1"
                                height="1"
                                fill="#F3A45B"
                              />
                              <rect
                                x="9"
                                y="4"
                                width="1"
                                height="1"
                                fill="#F3A45B"
                              />
                              <rect
                                x="4"
                                y="6"
                                width="8"
                                height="6"
                                fill="#E87935"
                              />
                              <rect
                                x="5"
                                y="12"
                                width="2"
                                height="2"
                                fill="#E8E4DE"
                              />
                              <rect
                                x="9"
                                y="12"
                                width="2"
                                height="2"
                                fill="#E8E4DE"
                              />
                            </motion.svg>
                          )}
                        </div>
                      );
                    }),
                  )}
                </div>
              </div>

              <motion.div
                key={dungeonLog}
                role="status"
                aria-live="polite"
                initial={prefersReducedMotion ? false : { opacity: 0.5, y: 3 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.15 }}
                className="p-3 bg-[#101010] border border-[#33302D] font-mono text-xs text-[#E8E4DE]"
              >
                {dungeonLog}
              </motion.div>

              {/* Touch-Friendly Controls (44px+ hit targets for mobile screens) */}
              <div className="flex items-center justify-between pt-1 gap-3">
                <div className="flex items-center gap-1.5">
                  <motion.button
                    type="button"
                    whileTap={prefersReducedMotion ? undefined : { scale: 0.92 }}
                    onClick={() => movePlayer(-1, 0)}
                    className="min-w-[44px] min-h-[44px] flex items-center justify-center bg-[#101010] hover:bg-[#242220] border border-[#33302D] hover:border-[#E87935] text-[#E8E4DE] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#E87935]"
                    aria-label="Move Left"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </motion.button>
                  <div className="flex flex-col gap-1.5">
                    <motion.button
                      type="button"
                      whileTap={
                        prefersReducedMotion ? undefined : { scale: 0.92 }
                      }
                      onClick={() => movePlayer(0, -1)}
                      className="min-w-[44px] min-h-[44px] flex items-center justify-center bg-[#101010] hover:bg-[#242220] border border-[#33302D] hover:border-[#E87935] text-[#E8E4DE] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#E87935]"
                      aria-label="Move Up"
                    >
                      <ChevronUp className="w-4 h-4" />
                    </motion.button>
                    <motion.button
                      type="button"
                      whileTap={
                        prefersReducedMotion ? undefined : { scale: 0.92 }
                      }
                      onClick={() => movePlayer(0, 1)}
                      className="min-w-[44px] min-h-[44px] flex items-center justify-center bg-[#101010] hover:bg-[#242220] border border-[#33302D] hover:border-[#E87935] text-[#E8E4DE] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#E87935]"
                      aria-label="Move Down"
                    >
                      <ChevronDown className="w-4 h-4" />
                    </motion.button>
                  </div>
                  <motion.button
                    type="button"
                    whileTap={prefersReducedMotion ? undefined : { scale: 0.92 }}
                    onClick={() => movePlayer(1, 0)}
                    className="min-w-[44px] min-h-[44px] flex items-center justify-center bg-[#101010] hover:bg-[#242220] border border-[#33302D] hover:border-[#E87935] text-[#E8E4DE] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#E87935]"
                    aria-label="Move Right"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </motion.button>
                </div>

                <motion.button
                  type="button"
                  whileHover={prefersReducedMotion ? undefined : { y: -2 }}
                  whileTap={prefersReducedMotion ? undefined : { scale: 0.97 }}
                  onClick={resetDungeon}
                  className="px-4 py-2.5 bg-[#242220] hover:border-[#E87935] border border-[#33302D] font-mono text-xs text-[#E8E4DE] transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-[#E87935]"
                >
                  Reset Room
                </motion.button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

