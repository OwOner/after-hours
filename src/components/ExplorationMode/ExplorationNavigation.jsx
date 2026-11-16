import { motion, AnimatePresence } from 'framer-motion';
import { Compass, ChevronDown, ArrowUpRight, Eye } from 'lucide-react';
import { MOTION_TOKENS } from '../../utils/motion.jsx';
import { EXPLORATION_LOCATIONS } from './explorationData.js';

/**
 * Top-Right Quick-Navigation Menu for Exploration Mode.
 * Provides direct, reliable access to all 6 portfolio sections even if a
 * visitor prefers a menu over interacting directly with the 3D canvas.
 */
export default function ExplorationNavigation({
  isOpen,
  onToggle,
  activeLocationId,
  onFocusLocation,
  onNavigateToSection,
  motionReduced,
}) {
  return (
    <div className="relative pointer-events-auto">
      <button
        type="button"
        onClick={onToggle}
        aria-expanded={isOpen}
        aria-controls="exploration-quick-nav-panel"
        className={`inline-flex items-center gap-2.5 px-3.5 py-2.5 bg-[#101010]/92 hover:bg-[#191919] backdrop-blur-md border font-mono text-xs tracking-wider uppercase transition-colors shadow-xl focus:outline-none focus-visible:ring-2 focus-visible:ring-[#E87935] ${
          isOpen
            ? 'border-[#E87935] text-[#E8E4DE]'
            : 'border-[#33302D] hover:border-[#E87935] text-[#E8E4DE]'
        }`}
      >
        <Compass className="w-4 h-4 text-[#E87935] shrink-0" />
        <span>QUICK NAV</span>
        <span className="font-mono text-[10px] px-1.5 py-0.5 bg-[#191919] border border-[#33302D] text-[#F3A45B]">
          {EXPLORATION_LOCATIONS.length}
        </span>
        <ChevronDown
          className={`w-3.5 h-3.5 text-[#A7A19A] transition-transform duration-200 ${
            isOpen ? 'rotate-180 text-[#E87935]' : ''
          }`}
        />
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            id="exploration-quick-nav-panel"
            role="region"
            aria-label="Portfolio Sector Quick Navigation"
            initial={
              motionReduced ? { opacity: 0 } : { opacity: 0, y: -8, scale: 0.98 }
            }
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={
              motionReduced ? { opacity: 0 } : { opacity: 0, y: -6, scale: 0.98 }
            }
            transition={{ duration: 0.2, ease: MOTION_TOKENS.ease }}
            className="absolute right-0 mt-2 w-72 sm:w-80 bg-[#101010]/95 backdrop-blur-md border border-[#33302D] shadow-[0_24px_60px_rgba(0,0,0,0.85)] p-3 z-50"
          >
            <div className="flex items-center justify-between border-b border-[#33302D] pb-2 mb-2 px-1 font-mono text-[10px] text-[#A7A19A]">
              <span>SELECT DESTINATION PORTAL</span>
              <span className="text-[#E87935]">6 SECTORS</span>
            </div>

            <div className="space-y-1.5 max-h-[60vh] overflow-y-auto">
              {EXPLORATION_LOCATIONS.map((loc) => {
                const Icon = loc.icon;
                const isFocused = activeLocationId === loc.id;
                return (
                  <div
                    key={loc.id}
                    className={`flex items-center justify-between gap-1.5 p-2 border transition-colors ${
                      isFocused
                        ? 'bg-[#242220] border-[#E87935]'
                        : 'bg-[#191919]/90 border-[#33302D] hover:border-[#E87935]/60'
                    }`}
                  >
                    <button
                      type="button"
                      onClick={() => onNavigateToSection(loc)}
                      className="flex-1 flex items-center gap-2.5 text-left min-w-0 focus:outline-none focus-visible:ring-1 focus-visible:ring-[#E87935]"
                    >
                      <span className="w-7 h-7 bg-[#101010] border border-[#33302D] flex items-center justify-center text-[#E87935] shrink-0">
                        <Icon className="w-3.5 h-3.5" />
                      </span>
                      <div className="min-w-0">
                        <div className="font-mono text-[9px] text-[#E87935] uppercase tracking-wider">
                          {`${loc.navShortLabel} // ${loc.code}`}
                        </div>
                        <div className="font-heading text-xs font-bold text-[#E8E4DE] truncate">
                          {loc.name}
                        </div>
                      </div>
                    </button>

                    <div className="flex items-center gap-1 shrink-0">
                      <button
                        type="button"
                        onClick={() => onFocusLocation(loc)}
                        title={`Focus camera on ${loc.name}`}
                        aria-label={`Focus camera on ${loc.name}`}
                        className="p-1.5 bg-[#101010] hover:bg-[#242220] border border-[#33302D] hover:border-[#E87935] text-[#A7A19A] hover:text-[#E8E4DE] transition-colors focus:outline-none focus-visible:ring-1 focus-visible:ring-[#E87935]"
                      >
                        <Eye className="w-3.5 h-3.5" />
                      </button>
                      <button
                        type="button"
                        onClick={() => onNavigateToSection(loc)}
                        title={`Enter ${loc.sectionLabel}`}
                        aria-label={`Enter ${loc.sectionLabel}`}
                        className="px-2 py-1.5 bg-[#E87935] hover:bg-[#F3A45B] text-[#101010] font-mono text-[10px] font-semibold uppercase flex items-center gap-0.5 transition-colors focus:outline-none focus-visible:ring-1 focus-visible:ring-[#F3A45B]"
                      >
                        <span>GO</span>
                        <ArrowUpRight className="w-3 h-3" />
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
