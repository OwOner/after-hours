import { motion, useReducedMotion } from 'framer-motion';
import {
  ArrowUpRight,
  ArrowUp,
  Github,
  Linkedin,
  Terminal as TerminalIcon,
} from 'lucide-react';
import { MOTION_TOKENS } from '../utils/motion.jsx';
import { SITE_CONFIG } from '../data/portfolioData.js';

export default function Footer({
  onOpenTerminal,
  onOpenContactModal,
  scrollToSection,
}) {
  const prefersReducedMotion = useReducedMotion();

  const handleBackToTop = () => {
    if (typeof window !== 'undefined') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const navLinks = [
    { label: 'Projects', sectionId: 'work' },
    { label: 'About', sectionId: 'about' },
    { label: 'Experience', sectionId: 'experience' },
    { label: 'Contact', sectionId: 'contact' },
  ];

  return (
    <footer
      id="site-footer"
      aria-label="Site Footer"
      className="relative z-10 border-t border-[#33302D] bg-[#101010] text-[#E8E4DE] pt-16 sm:pt-20 md:pt-24 pb-12 sm:pb-16 px-4 sm:px-8 overflow-hidden"
    >
      {/* Understated Technical Grid & Coordinate Hairline */}
      <div className="absolute inset-0 pointer-events-none opacity-25">
        <div
          className="w-full h-full"
          style={{
            backgroundImage:
              'linear-gradient(to right, #33302D 1px, transparent 1px), linear-gradient(to bottom, #33302D 1px, transparent 1px)',
            backgroundSize: '48px 48px',
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-[#101010] via-transparent to-[#101010]" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto space-y-16 sm:space-y-20">
        {/* Main Footer Composition */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-start">
          {/* Left Column: Branding & Primary Contact Highlight */}
          <div className="lg:col-span-7 space-y-6 sm:space-y-8">
            {/* Branding Header */}
            <div>
              <div className="flex items-center gap-2 font-mono text-[10px] tracking-[0.25em] text-[#E87935] uppercase mb-2">
                <span className="w-1.5 h-1.5 bg-[#E87935] rotate-45 shrink-0" />
                <span>PORTFOLIO</span>
              </div>
              <h2 className="font-heading text-2xl sm:text-3xl font-bold tracking-wider text-[#E8E4DE]">
                AFTERHOURS<span className="text-[#E87935]">.</span>
              </h2>
            </div>

            {/* Closing Statement (Visual Highlight) */}
            <div className="space-y-3 pt-2">
              <h3 className="font-heading text-3xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-[#E8E4DE] leading-[1.08]">
                Let's build something{' '}
                <span className="text-[#E87935]">meaningful.</span>
              </h3>
              <p className="text-[#A7A19A] text-base sm:text-lg max-w-xl leading-relaxed font-normal">
                Have a project, an opportunity, or an idea worth exploring?
                Let's connect.
              </p>
            </div>

            {/* Primary Action Buttons */}
            <div className="flex flex-wrap items-center gap-3 sm:gap-4 pt-2">
              <motion.button
                type="button"
                whileHover={prefersReducedMotion ? undefined : { y: -2 }}
                whileTap={prefersReducedMotion ? undefined : { scale: 0.98 }}
                transition={{
                  duration: MOTION_TOKENS.fast,
                  ease: MOTION_TOKENS.ease,
                }}
                onClick={onOpenContactModal}
                className="group inline-flex items-center justify-center gap-2.5 px-6 py-3.5 bg-[#E87935] hover:bg-[#F3A45B] text-[#101010] font-mono text-xs font-semibold tracking-wider uppercase transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-[#F3A45B]"
              >
                <span>Get in touch</span>
                <ArrowUpRight className="w-4 h-4 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </motion.button>

              {Boolean(SITE_CONFIG.githubUrl) && (
                <motion.a
                  href={SITE_CONFIG.githubUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  whileHover={prefersReducedMotion ? undefined : { y: -2 }}
                  whileTap={prefersReducedMotion ? undefined : { scale: 0.98 }}
                  transition={{
                    duration: MOTION_TOKENS.fast,
                    ease: MOTION_TOKENS.ease,
                  }}
                  className="group inline-flex items-center justify-center gap-2 px-5 py-3.5 bg-[#191919] hover:bg-[#242220] border border-[#33302D] hover:border-[#E87935] text-[#E8E4DE] font-mono text-xs tracking-wider uppercase transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-[#E87935]"
                >
                  <Github className="w-4 h-4 text-[#E87935]" />
                  <span>View GitHub</span>
                  <ArrowUpRight className="w-3.5 h-3.5 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                </motion.a>
              )}

              {Boolean(SITE_CONFIG.linkedinUrl) && (
                <motion.a
                  href={SITE_CONFIG.linkedinUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  whileHover={prefersReducedMotion ? undefined : { y: -2 }}
                  whileTap={prefersReducedMotion ? undefined : { scale: 0.98 }}
                  transition={{
                    duration: MOTION_TOKENS.fast,
                    ease: MOTION_TOKENS.ease,
                  }}
                  className="group inline-flex items-center justify-center gap-2 px-4 py-3.5 bg-[#191919] hover:bg-[#242220] border border-[#33302D] hover:border-[#E87935] text-[#A7A19A] hover:text-[#E8E4DE] font-mono text-xs tracking-wider uppercase transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-[#E87935]"
                  aria-label="LinkedIn profile"
                >
                  <Linkedin className="w-4 h-4 text-[#E87935]" />
                  <span className="hidden sm:inline">LinkedIn</span>
                  <ArrowUpRight className="w-3.5 h-3.5 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                </motion.a>
              )}
            </div>
          </div>

          {/* Right Column: Identity Ledger & Quick Section Navigation */}
          <div className="lg:col-span-5 flex flex-col justify-between space-y-10 lg:pl-8 lg:border-l lg:border-[#33302D]/60 pt-4 lg:pt-0">
            {/* Developer Identity Block */}
            <div className="space-y-2 border-l-2 border-[#E87935] pl-4 sm:pl-5 py-1">
              <div className="font-mono text-[10px] tracking-[0.2em] text-[#A7A19A] uppercase">
                DEVELOPER
              </div>
              <div className="font-heading text-2xl sm:text-3xl font-bold text-[#E8E4DE] tracking-tight">
                JOHN PAUL ESPAÑO
              </div>
              <div className="font-mono text-xs tracking-widest text-[#E87935] uppercase pt-0.5">
                SOFTWARE DEVELOPER
              </div>
            </div>

            {/* Quick Section Navigation Links */}
            <div className="space-y-3 pt-2">
              <div className="font-mono text-[10px] tracking-widest text-[#A7A19A] uppercase">
                INDEX NAVIGATION
              </div>
              <nav aria-label="Footer Navigation" className="grid grid-cols-2 gap-2.5">
                {navLinks.map((item) => (
                  <button
                    key={item.label}
                    type="button"
                    onClick={() => {
                      if (scrollToSection) {
                        scrollToSection(item.sectionId);
                      }
                    }}
                    className="group flex items-center gap-2 text-left font-mono text-xs tracking-wider uppercase text-[#A7A19A] hover:text-[#E8E4DE] transition-colors py-1 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#E87935]"
                  >
                    <span className="text-[#E87935] font-mono text-[11px] transition-transform duration-200 group-hover:translate-x-0.5">
                      ›
                    </span>
                    <span>{item.label}</span>
                  </button>
                ))}
              </nav>
            </div>
          </div>
        </div>

        {/* Bottom Utility Strip: Copyright, Discrete Terminal Trigger, Back To Top */}
        <div className="pt-8 border-t border-[#33302D] flex flex-col sm:flex-row items-center justify-between gap-4 font-mono text-xs text-[#A7A19A]">
          {/* Copyright Notice */}
          <div className="flex items-center gap-2.5 text-center sm:text-left">
            <span>© 2026 John Paul Españo. All rights reserved.</span>
          </div>

          {/* Center: Discreet Easter Egg Console Trigger */}
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
              className="min-w-[36px] min-h-[36px] flex items-center justify-center p-2 bg-[#191919] hover:bg-[#242220] border border-[#33302D] hover:border-[#E87935] text-[#A7A19A] hover:text-[#E87935] transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-[#E87935]"
              title="Open Developer Console"
              aria-label="Open Secret Terminal"
            >
              <TerminalIcon className="w-3.5 h-3.5" />
            </motion.button>
          </div>

          {/* Right: Back to Top */}
          <button
            type="button"
            onClick={handleBackToTop}
            className="group flex items-center gap-1.5 font-mono text-xs uppercase tracking-wider text-[#A7A19A] hover:text-[#E87935] transition-colors py-1 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#E87935]"
          >
            <span>BACK TO TOP</span>
            <ArrowUp className="w-3.5 h-3.5 transition-transform duration-200 group-hover:-translate-y-0.5" />
          </button>
        </div>
      </div>
    </footer>
  );
}
