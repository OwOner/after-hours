import { motion, AnimatePresence } from 'framer-motion';
import { Compass, ChevronDown, ArrowUpRight, Eye } from 'lucide-react';
import { MOTION_TOKENS } from '../../utils/motion.jsx';
import { EXPLORATION_LOCATIONS } from './explorationData.js';

/**
 * Top-Right Quick Navigation Menu for Exploration Mode.
 * Uses clear, visitor-friendly labels (14-15px items) and lets visitors choose
 * between "View Location" (camera focus) and "Explore" (open portfolio section).
 */
export default function ExplorationNavigation({
  isOpen,
  onToggle,
  activeLocationId,
  isEntering,
  onFocusLocation,
  onNavigateToSection,
  motionReduced,
}) {
  return (
    <div className="relative pointer-events-auto">
      <button
        type="button"
        disabled={isEntering}
        onClick={onToggle}
        aria-expanded={isOpen}
        aria-controls="exploration-quick-nav-panel"
        title="Open Quick Navigation menu"
        className={`inline-flex items-center gap-2.5 px-4 py-2.5 bg-[#101010]/94 hover:bg-[#191919] backdrop-blur-md border font-mono text-xs sm:text-[13px] font-medium tracking-wide transition-colors shadow-xl focus:outline-none focus-visible:ring-2 focus-visible:ring-[#E87935] ${
          isOpen
            ? 'border-[#E87935] text-[#E8E4DE]'
            : 'border-[#33302D] hover:border-[#E87935] text-[#E8E4DE]'
        }`}
      >
        <Compass className="w-4 h-4 text-[#E87935] shrink-0" />
        <span>Quick Navigation</span>
        <ChevronDown
          className={`w-4 h-4 text-[#B8B0A6] transition-transform duration-200 ${
            isOpen ? 'rotate-180 text-[#E87935]' : ''
          }`}
        />
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            id="exploration-quick-nav-panel"
            role="region"
            aria-label="Quick Navigation Menu"
            initial={
              motionReduced
                ? { opacity: 0 }
                : { opacity: 0, y: -8, scale: 0.98 }
            }
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={
              motionReduced
                ? { opacity: 0 }
                : { opacity: 0, y: -6, scale: 0.98 }
            }
            transition={{ duration: 0.2, ease: MOTION_TOKENS.ease }}
            className="absolute right-0 mt-2 w-[330px] sm:w-[410px] bg-[#101010]/96 backdrop-blur-md border border-[#33302D] shadow-[0_24px_60px_rgba(0,0,0,0.9)] p-3.5 sm:p-4 z-50"
          >
            <div className="flex items-center justify-between border-b border-[#33302D] pb-2.5 mb-2.5 px-1 text-xs text-[#B8B0A6]">
              <span className="font-medium text-[#E8E4DE]">
                Jump to a Portfolio Section
              </span>
              <span className="font-mono text-[11px] text-[#E87935]">
                6 Destinations
              </span>
            </div>

            <div className="space-y-2 max-h-[64vh] overflow-y-auto pr-0.5">
              {EXPLORATION_LOCATIONS.map((loc) => {
                const Icon = loc.icon;
                const isFocused = activeLocationId === loc.id;
                return (
                  <div
                    key={loc.id}
                    className={`flex flex-col xs:flex-row xs:items-center justify-between gap-2.5 p-2.5 sm:p-3 border transition-colors ${
                      isFocused
                        ? 'bg-[#242220] border-[#E87935]'
                        : 'bg-[#191919]/90 border-[#33302D] hover:border-[#E87935]/60'
                    }`}
                  >
                    <button
                      type="button"
                      disabled={isEntering}
                      onClick={() => onFocusLocation(loc)}
                      className="flex-1 flex items-start gap-3 text-left min-w-0 focus:outline-none focus-visible:ring-1 focus-visible:ring-[#E87935]"
                    >
                      <span className="w-8 h-8 bg-[#101010] border border-[#33302D] flex items-center justify-center text-[#E87935] shrink-0 mt-0.5">
                        <Icon className="w-4 h-4" />
                      </span>
                      <div className="min-w-0">
                        <div className="font-heading text-sm sm:text-[15px] font-bold text-[#E8E4DE] leading-snug">
                          {loc.name}
                        </div>
                        <div className="text-xs text-[#B8B0A6] leading-snug mt-0.5">
                          {loc.tagline}
                        </div>
                      </div>
                    </button>

                    <div className="flex items-center justify-end gap-1.5 shrink-0">
                      <button
                        type="button"
                        disabled={isEntering}
                        onClick={() => onFocusLocation(loc)}
                        title={`View ${loc.name} on the map`}
                        aria-label={`View ${loc.name} on the map`}
                        className="px-2.5 py-1.5 bg-[#101010] hover:bg-[#242220] border border-[#33302D] hover:border-[#E87935] font-mono text-xs text-[#B8B0A6] hover:text-[#E8E4DE] flex items-center gap-1.5 transition-colors focus:outline-none focus-visible:ring-1 focus-visible:ring-[#E87935]"
                      >
                        <Eye className="w-3.5 h-3.5 text-[#E87935]" />
                        <span>View Location</span>
                      </button>
                      <button
                        type="button"
                        disabled={isEntering}
                        onClick={() => onNavigateToSection(loc)}
                        title={`${loc.actionLabel}`}
                        aria-label={`${loc.actionLabel}`}
                        className="px-3 py-1.5 bg-[#E87935] hover:bg-[#F3A45B] text-[#101010] font-mono text-xs font-semibold flex items-center gap-1 transition-colors focus:outline-none focus-visible:ring-1 focus-visible:ring-[#F3A45B]"
                      >
                        <span>Open</span>
                        <ArrowUpRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
