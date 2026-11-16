import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import { Sun, Moon } from 'lucide-react';
import { useTheme } from '../context/ThemeContext.jsx';
import { MOTION_TOKENS } from '../utils/motion.jsx';

/**
 * Reusable Theme Toggle Button.
 * - Displays a Moon icon in Dark Mode and a Sun icon in Light Mode.
 * - Animates the icon with a crisp 260ms rotation + scale transition and
 *   immediately triggers the lightweight horizontal LIGHT SWEEP.
 */
export default function ThemeToggle({ variant = 'nav' }) {
  const { theme, isDark, isTransitioningTheme, toggleTheme } = useTheme();
  const prefersReducedMotion = useReducedMotion();

  const label = isDark
    ? 'Dark Mode active — Switch to Light Mode'
    : 'Light Mode active — Switch to Dark Mode';

  if (variant === 'hud') {
    return (
      <button
        type="button"
        disabled={isTransitioningTheme}
        onClick={toggleTheme}
        aria-label={label}
        aria-pressed={!isDark}
        title={label}
        className="inline-flex items-center gap-1.5 px-2.5 py-1.5 bg-[#191919] hover:bg-[#242220] font-mono text-[11px] sm:text-xs text-[#B8B0A6] hover:text-[#E8E4DE] transition-colors focus:outline-none focus-visible:ring-1 focus-visible:ring-[#E87935]"
      >
        <AnimatePresence mode="wait" initial={false}>
          {isDark ? (
            <motion.span
              key="hud-moon"
              initial={
                prefersReducedMotion
                  ? { opacity: 0 }
                  : { opacity: 0, rotate: -75, scale: 0.65 }
              }
              animate={{ opacity: 1, rotate: 0, scale: 1 }}
              exit={
                prefersReducedMotion
                  ? { opacity: 0 }
                  : { opacity: 0, rotate: 75, scale: 0.65 }
              }
              transition={{ duration: 0.26, ease: MOTION_TOKENS.ease }}
              className="flex items-center justify-center"
            >
              <Moon className="w-3.5 h-3.5 text-[#E87935]" />
            </motion.span>
          ) : (
            <motion.span
              key="hud-sun"
              initial={
                prefersReducedMotion
                  ? { opacity: 0 }
                  : { opacity: 0, rotate: 75, scale: 0.65 }
              }
              animate={{ opacity: 1, rotate: 0, scale: 1 }}
              exit={
                prefersReducedMotion
                  ? { opacity: 0 }
                  : { opacity: 0, rotate: -75, scale: 0.65 }
              }
              transition={{ duration: 0.26, ease: MOTION_TOKENS.ease }}
              className="flex items-center justify-center"
            >
              <Sun className="w-3.5 h-3.5 text-[#E87935]" />
            </motion.span>
          )}
        </AnimatePresence>
        <span>Theme: {isDark ? 'Dark' : 'Light'}</span>
      </button>
    );
  }

  return (
    <motion.button
      type="button"
      disabled={isTransitioningTheme}
      onClick={toggleTheme}
      whileHover={prefersReducedMotion ? undefined : { y: -2 }}
      whileTap={prefersReducedMotion ? undefined : { scale: 0.95 }}
      transition={{ duration: MOTION_TOKENS.fast, ease: MOTION_TOKENS.ease }}
      aria-label={label}
      aria-pressed={!isDark}
      title={label}
      className="relative min-w-[40px] min-h-[40px] px-2.5 py-2 flex items-center justify-center gap-2 bg-[#191919] hover:bg-[#242220] border border-[#33302D] hover:border-[#E87935] font-mono text-[11px] text-[#E8E4DE] uppercase tracking-wider transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-[#E87935]"
    >
      <AnimatePresence mode="wait" initial={false}>
        {isDark ? (
          <motion.span
            key="moon-icon"
            initial={
              prefersReducedMotion
                ? { opacity: 0 }
                : { opacity: 0, rotate: -75, scale: 0.65 }
            }
            animate={{ opacity: 1, rotate: 0, scale: 1 }}
            exit={
              prefersReducedMotion
                ? { opacity: 0 }
                : { opacity: 0, rotate: 75, scale: 0.65 }
            }
            transition={{ duration: 0.26, ease: MOTION_TOKENS.ease }}
            className="flex items-center justify-center"
          >
            <Moon className="w-4 h-4 text-[#E87935]" />
          </motion.span>
        ) : (
          <motion.span
            key="sun-icon"
            initial={
              prefersReducedMotion
                ? { opacity: 0 }
                : { opacity: 0, rotate: 75, scale: 0.65 }
            }
            animate={{ opacity: 1, rotate: 0, scale: 1 }}
            exit={
              prefersReducedMotion
                ? { opacity: 0 }
                : { opacity: 0, rotate: -75, scale: 0.65 }
            }
            transition={{ duration: 0.26, ease: MOTION_TOKENS.ease }}
            className="flex items-center justify-center"
          >
            <Sun className="w-4 h-4 text-[#E87935]" />
          </motion.span>
        )}
      </AnimatePresence>
      <span className="hidden xl:inline text-[10px]">
        {theme === 'dark' ? 'Dark' : 'Light'}
      </span>
    </motion.button>
  );
}
