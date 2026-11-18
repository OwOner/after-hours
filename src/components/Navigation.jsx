import { useEffect } from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import { ChevronRight } from 'lucide-react';
import { MOTION_TOKENS } from '../utils/motion.jsx';
import ThemeToggle from './ThemeToggle.jsx';

// Set to true to restore Creative navigation
const SHOW_CREATIVE_NAV = false;

const ALL_NAV_ITEMS = [
  { id: 'work', label: 'Work' },
  { id: 'expertise', label: 'Expertise' },
  { id: 'about', label: 'About' },
  { id: 'creative', label: 'Creative' },
  { id: 'contact', label: 'Contact' },
];

const ALL_MOBILE_NAV_ITEMS = [
  { id: 'work', label: 'Work' },
  { id: 'expertise', label: 'Expertise' },
  { id: 'about', label: 'About & Experience' },
  { id: 'creative', label: 'Creative' },
  { id: 'contact', label: 'Contact' },
];

const NAV_ITEMS = ALL_NAV_ITEMS.filter(
  (item) => item.id !== 'creative' || SHOW_CREATIVE_NAV,
);

const MOBILE_NAV_ITEMS = ALL_MOBILE_NAV_ITEMS.filter(
  (item) => item.id !== 'creative' || SHOW_CREATIVE_NAV,
);

export default function Navigation({
  activeSection,
  mobileMenuOpen,
  setMobileMenuOpen,
  scrollToSection,
}) {
  const prefersReducedMotion = useReducedMotion();

  useEffect(() => {
    if (!mobileMenuOpen) return;
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        setMobileMenuOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [mobileMenuOpen, setMobileMenuOpen]);

  return (
    <header className="fixed top-0 left-0 right-0 z-40 bg-[#101010]/85 backdrop-blur-md border-b border-[#33302D]">
      <div className="max-w-7xl mx-auto px-4 sm:px-8 h-16 flex items-center justify-between gap-2">
        {/* Monogram */}
        <button
          type="button"
          onClick={() => scrollToSection('hero')}
          className="flex items-center gap-2.5 sm:gap-3 text-left group focus:outline-none focus-visible:ring-2 focus-visible:ring-[#E87935] py-1"
          aria-label="JP.DEV — Scroll to top"
        >
          <span className="w-2 h-2 bg-[#E87935] rotate-45 transition-transform duration-300 group-hover:rotate-90 shrink-0" />
          <span className="font-heading font-bold tracking-wider text-base sm:text-lg text-[#E8E4DE]">
            JP<span className="text-[#E87935]">.</span>DEV
          </span>
          <span className="hidden lg:inline-block font-mono text-[10px] tracking-[0.2em] text-[#A7A19A] pl-3 border-l border-[#33302D]">
            AFTERHOURS EDITION
          </span>
        </button>

        {/* Desktop Navigation */}
        <nav
          aria-label="Primary Navigation"
          className="hidden md:flex items-center gap-5 lg:gap-7"
        >
          {NAV_ITEMS.map((item) => {
            const isActive =
              activeSection === item.id ||
              (item.id === 'about' && activeSection === 'experience');
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => scrollToSection(item.id)}
                aria-current={isActive ? 'page' : undefined}
                className={`relative py-5 font-mono text-xs tracking-wider uppercase transition-colors focus:outline-none focus-visible:text-[#E87935] ${
                  isActive
                    ? 'text-[#E8E4DE]'
                    : 'text-[#A7A19A] hover:text-[#E8E4DE]'
                }`}
              >
                {item.label}
                {isActive && (
                  <motion.span
                    layoutId="activeNavIndicator"
                    transition={{
                      duration: MOTION_TOKENS.standard,
                      ease: MOTION_TOKENS.ease,
                    }}
                    className="absolute bottom-0 left-0 right-0 h-[2px] bg-[#E87935]"
                  />
                )}
              </button>
            );
          })}
        </nav>

        {/* Right Action / Theme Toggle / Mobile Trigger */}
        <div className="flex items-center gap-2 sm:gap-2.5">
          <ThemeToggle variant="nav" />

          <motion.button
            type="button"
            whileHover={prefersReducedMotion ? undefined : { y: -2 }}
            whileTap={prefersReducedMotion ? undefined : { scale: 0.98 }}
            transition={{
              duration: MOTION_TOKENS.fast,
              ease: MOTION_TOKENS.ease,
            }}
            onClick={() => scrollToSection('contact')}
            className="hidden sm:inline-flex items-center gap-2 px-3.5 lg:px-4 py-2 bg-[#191919] hover:bg-[#242220] border border-[#33302D] hover:border-[#E87935] font-mono text-[11px] text-[#E8E4DE] tracking-wider uppercase transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-[#E87935]"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-[#E87935]" />
            <span>Initiate Contact</span>
          </motion.button>

          <button
            type="button"
            onClick={() => setMobileMenuOpen((prev) => !prev)}
            className="md:hidden min-w-[44px] min-h-[44px] flex items-center justify-center border border-[#33302D] bg-[#191919] hover:border-[#E87935] text-[#E8E4DE] transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-[#E87935]"
            aria-label={mobileMenuOpen ? 'Close navigation menu' : 'Open navigation menu'}
            aria-expanded={mobileMenuOpen}
            aria-controls="mobile-navigation-drawer"
          >
            <div className="w-4 h-3 flex flex-col justify-between">
              <span
                className={`h-0.5 bg-[#E8E4DE] transition-all ${
                  mobileMenuOpen ? 'rotate-45 translate-y-1' : ''
                }`}
              />
              <span
                className={`h-0.5 bg-[#E87935] transition-all ${
                  mobileMenuOpen ? 'opacity-0' : ''
                }`}
              />
              <span
                className={`h-0.5 bg-[#E8E4DE] transition-all ${
                  mobileMenuOpen ? '-rotate-45 -translate-y-1.5' : ''
                }`}
              />
            </div>
          </button>
        </div>
      </div>

      {/* Mobile Navigation Drawer */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.nav
            id="mobile-navigation-drawer"
            aria-label="Mobile Navigation"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{
              duration: MOTION_TOKENS.standard,
              ease: MOTION_TOKENS.ease,
            }}
            className="md:hidden bg-[#191919] border-b border-[#33302D] overflow-hidden"
          >
            <div className="px-4 py-3 space-y-1">
              {MOBILE_NAV_ITEMS.map((item, idx) => {
                const isActive =
                  activeSection === item.id ||
                  (item.id === 'about' && activeSection === 'experience');
                return (
                  <motion.button
                    key={item.id}
                    type="button"
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{
                      duration: 0.2,
                      delay: idx * 0.04,
                      ease: MOTION_TOKENS.ease,
                    }}
                    onClick={() => scrollToSection(item.id)}
                    className={`w-full min-h-[44px] text-left font-mono text-xs py-3 px-3 border-b border-[#33302D]/60 flex items-center justify-between transition-colors ${
                      isActive
                        ? 'text-[#E87935] bg-[#242220]/50'
                        : 'text-[#E8E4DE] hover:text-[#E87935]'
                    }`}
                  >
                    <span>{item.label}</span>
                    <ChevronRight className="w-4 h-4 text-[#E87935]" />
                  </motion.button>
                );
              })}
            </div>
          </motion.nav>
        )}
      </AnimatePresence>
    </header>
  );
}

