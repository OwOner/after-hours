/* eslint-disable react-refresh/only-export-components */
import {
  createContext,
  useContext,
  useState,
  useEffect,
  useRef,
  useCallback,
} from 'react';
import { useReducedMotion } from 'framer-motion';

const STORAGE_KEY = 'afterhours-theme';

export const LIGHT_SWEEP_TIMINGS = {
  iconDurationMs: 260, // Suggested: 250-300ms
  themeTransitionMs: 240, // Suggested: 200-300ms
  sweepDurationMs: 400, // Suggested: 350-450ms (total perceived ~400ms)
};

const ThemeContext = createContext(null);

function getInitialTheme() {
  if (typeof window === 'undefined') return 'dark';
  try {
    const saved = window.localStorage.getItem(STORAGE_KEY);
    if (saved === 'light' || saved === 'dark') return saved;
  } catch {
    // ignore storage errors
  }
  return 'dark';
}

function applyThemeToDOM(theme) {
  if (typeof document === 'undefined') return;
  const root = document.documentElement;
  root.setAttribute('data-theme', theme);
  root.classList.toggle('dark', theme === 'dark');
  root.classList.toggle('light', theme === 'light');

  const metaThemeColor = document.querySelector('meta[name="theme-color"]');
  if (metaThemeColor) {
    metaThemeColor.setAttribute(
      'content',
      theme === 'light' ? '#F1EEE7' : '#101010',
    );
  }
}

export function ThemeProvider({ children }) {
  const prefersReducedMotion = useReducedMotion();
  const [theme, setTheme] = useState(getInitialTheme);
  // Single lightweight state for the GPU-composited horizontal light sweep
  const [sweepDirection, setSweepDirection] = useState(null); // null | 'to-light' | 'to-dark'

  const isSweepingRef = useRef(false);
  const sweepTimerRef = useRef(null);

  useEffect(() => {
    applyThemeToDOM(theme);
    try {
      window.localStorage.setItem(STORAGE_KEY, theme);
    } catch {
      // ignore storage errors
    }
  }, [theme]);

  useEffect(() => {
    return () => {
      if (sweepTimerRef.current) clearTimeout(sweepTimerRef.current);
    };
  }, []);

  /**
   * Immediately applies the new theme and triggers the lightweight GPU-friendly
   * horizontal LIGHT SWEEP beam (disabled automatically in reduced-motion mode).
   */
  const toggleTheme = useCallback(() => {
    if (isSweepingRef.current) return;

    const nextTheme = theme === 'dark' ? 'light' : 'dark';

    // Immediately apply the new theme with zero pre-delay
    setTheme(nextTheme);
    applyThemeToDOM(nextTheme);

    if (prefersReducedMotion) {
      return;
    }

    isSweepingRef.current = true;
    setSweepDirection(nextTheme === 'light' ? 'to-light' : 'to-dark');

    if (sweepTimerRef.current) clearTimeout(sweepTimerRef.current);
    sweepTimerRef.current = setTimeout(() => {
      setSweepDirection(null);
      isSweepingRef.current = false;
    }, LIGHT_SWEEP_TIMINGS.sweepDurationMs);
  }, [theme, prefersReducedMotion]);

  return (
    <ThemeContext.Provider
      value={{
        theme,
        isDark: theme === 'dark',
        isLight: theme === 'light',
        isTransitioningTheme: Boolean(sweepDirection),
        toggleTheme,
      }}
    >
      {children}
      {/* Single persistent pointer-events: none Light Sweep layer */}
      <div
        aria-hidden="true"
        className="pointer-events-none fixed inset-0 z-[70] overflow-hidden"
      >
        {sweepDirection && !prefersReducedMotion && (
          <div
            className={`ah-light-sweep-beam ${
              sweepDirection === 'to-light'
                ? 'ah-light-sweep-to-light'
                : 'ah-light-sweep-to-dark'
            }`}
          />
        )}
      </div>
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const ctx = useContext(ThemeContext);
  if (!ctx) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return ctx;
}
