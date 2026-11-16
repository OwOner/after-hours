import { useState } from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import { ArrowUpRight, Layers, Sliders } from 'lucide-react';
import { MOTION_TOKENS } from '../utils/motion.jsx';

const ARCHITECTURE_LAYERS = [
  {
    id: 'ui',
    code: 'LAYER 01',
    title: 'Interface & Experience',
    tech: 'React • Next.js • Tailwind CSS',
    detail:
      'Clean application workspaces, responsive layouts, and intuitive user flows.',
  },
  {
    id: 'logic',
    code: 'LAYER 02',
    title: 'Application & Workflow Logic',
    tech: 'TypeScript • Node.js • Electron',
    detail:
      'Payroll calculation rules, offline POS checkout queues, and payment workflows.',
  },
  {
    id: 'data',
    code: 'LAYER 03',
    title: 'Database & Integrity',
    tech: 'Supabase • PostgreSQL • SQLite',
    detail:
      'Relational schemas, local desktop persistence, and role-based security.',
  },
];

export default function HeroProductStage({ onExploreWork, onExploreCreative }) {
  const [viewMode, setViewMode] = useState('showcase'); // 'showcase' | 'architecture'
  const [activeProduct, setActiveProduct] = useState('nexus'); // 'nexus' | 'pos'
  const [activeLayer, setActiveLayer] = useState('ui');
  const prefersReducedMotion = useReducedMotion();

  return (
    <motion.div
      animate={prefersReducedMotion ? undefined : { y: [0, -5, 0] }}
      transition={{ duration: 7.5, repeat: Infinity, ease: 'easeInOut' }}
      className="relative w-full pt-1 sm:pt-2 pb-2"
    >
      {/* Subtle Atmospheric Backlight */}
      <motion.div
        animate={
          prefersReducedMotion
            ? undefined
            : {
                scale: [1, 1.07, 1],
                opacity: [0.22, 0.32, 0.22],
              }
        }
        transition={{ duration: 9, repeat: Infinity, ease: 'easeInOut' }}
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[85%] h-[85%] rounded-full pointer-events-none blur-[90px] opacity-25"
        style={{
          background:
            'radial-gradient(circle, #E87935 0%, rgba(232,121,53,0) 70%)',
        }}
      />

      <div className="relative z-10 space-y-3">
        {/* Top Mode Switcher: Visual Showcase first, Technical Inspector optional */}
        <div className="flex flex-wrap items-center justify-between gap-2 bg-[#191919] border border-[#33302D] px-3 sm:px-3.5 py-2.5">
          <div className="flex items-center gap-2 min-w-0">
            <span className="w-2 h-2 rounded-full bg-[#E87935] shrink-0" />
            <span className="font-mono text-[10px] tracking-[0.14em] sm:tracking-[0.16em] text-[#E8E4DE] uppercase truncate">
              {viewMode === 'showcase'
                ? 'FEATURED SYSTEMS PREVIEW'
                : 'SYSTEM ARCHITECTURE'}
            </span>
          </div>
          <div className="flex items-center gap-1 w-full xs:w-auto justify-end">
            <button
              type="button"
              onClick={() => setViewMode('showcase')}
              aria-pressed={viewMode === 'showcase'}
              className={`px-2.5 py-1.5 font-mono text-[10px] uppercase transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-[#E87935] ${
                viewMode === 'showcase'
                  ? 'bg-[#E87935] text-[#101010] font-semibold'
                  : 'bg-[#101010] text-[#A7A19A] hover:text-[#E8E4DE] border border-[#33302D]'
              }`}
            >
              Product View
            </button>
            <button
              type="button"
              onClick={() => setViewMode('architecture')}
              aria-pressed={viewMode === 'architecture'}
              className={`px-2.5 py-1.5 font-mono text-[10px] uppercase transition-colors flex items-center gap-1 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#E87935] ${
                viewMode === 'architecture'
                  ? 'bg-[#E87935] text-[#101010] font-semibold'
                  : 'bg-[#101010] text-[#A7A19A] hover:text-[#E8E4DE] border border-[#33302D]'
              }`}
            >
              <Layers className="w-3 h-3 shrink-0" />
              <span>Under the Hood</span>
            </button>
          </div>
        </div>

        {/* Main Stage Container */}
        <div className="bg-[#191919] border border-[#33302D] p-4 sm:p-6 shadow-[0_25px_70px_rgba(0,0,0,0.75)]">
          <AnimatePresence mode="wait">
            {viewMode === 'showcase' ? (
              <motion.div
                key="showcase-mode"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{
                  duration: MOTION_TOKENS.standard,
                  ease: MOTION_TOKENS.ease,
                }}
                className="space-y-4 sm:space-y-5"
              >
                {/* Product Selector Tabs */}
                <div className="grid grid-cols-2 gap-2">
                  <motion.button
                    type="button"
                    whileHover={prefersReducedMotion ? undefined : { y: -2 }}
                    transition={{
                      duration: MOTION_TOKENS.fast,
                      ease: MOTION_TOKENS.ease,
                    }}
                    onClick={() => setActiveProduct('nexus')}
                    aria-pressed={activeProduct === 'nexus'}
                    className={`p-3 text-left border transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-[#E87935] ${
                      activeProduct === 'nexus'
                        ? 'bg-[#242220] border-[#E87935]'
                        : 'bg-[#101010] border-[#33302D] opacity-75 hover:opacity-100'
                    }`}
                  >
                    <div className="font-mono text-[10px] text-[#E87935]">
                      FLAGSHIP 01
                    </div>
                    <div className="font-heading text-xs sm:text-sm font-bold text-[#E8E4DE] mt-0.5">
                      Nexus Payroll
                    </div>
                    <div className="font-mono text-[10px] text-[#A7A19A] mt-0.5">
                      Next.js • Supabase
                    </div>
                  </motion.button>

                  <motion.button
                    type="button"
                    whileHover={prefersReducedMotion ? undefined : { y: -2 }}
                    transition={{
                      duration: MOTION_TOKENS.fast,
                      ease: MOTION_TOKENS.ease,
                    }}
                    onClick={() => setActiveProduct('pos')}
                    aria-pressed={activeProduct === 'pos'}
                    className={`p-3 text-left border transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-[#E87935] ${
                      activeProduct === 'pos'
                        ? 'bg-[#242220] border-[#E87935]'
                        : 'bg-[#101010] border-[#33302D] opacity-75 hover:opacity-100'
                    }`}
                  >
                    <div className="font-mono text-[10px] text-[#E87935]">
                      FLAGSHIP 02
                    </div>
                    <div className="font-heading text-xs sm:text-sm font-bold text-[#E8E4DE] mt-0.5">
                      Universal POS
                    </div>
                    <div className="font-mono text-[10px] text-[#A7A19A] mt-0.5">
                      Electron • SQLite
                    </div>
                  </motion.button>
                </div>

                {/* Visual Application Window */}
                <AnimatePresence mode="wait">
                  {activeProduct === 'nexus' ? (
                    <motion.div
                      key="nexus-panel"
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -6 }}
                      transition={{ duration: 0.22, ease: MOTION_TOKENS.ease }}
                      className="bg-[#101010] border border-[#33302D] p-3.5 sm:p-4 space-y-4"
                    >
                      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[#33302D] pb-2.5">
                        <span className="font-mono text-[11px] text-[#E8E4DE]">
                          Nexus Payroll — Contribution & Security Ledger
                        </span>
                        <span className="font-mono text-[10px] text-[#F3A45B]">
                          WEB SYSTEM
                        </span>
                      </div>

                      <div className="grid grid-cols-1 xs:grid-cols-3 sm:grid-cols-3 gap-2">
                        <div className="p-2.5 sm:p-3 bg-[#191919] border border-[#33302D]">
                          <div className="font-mono text-[9px] text-[#A7A19A]">
                            DEDUCTIONS
                          </div>
                          <div className="font-heading text-xs font-bold text-[#E8E4DE] mt-1">
                            Automated Rules
                          </div>
                        </div>
                        <div className="p-2.5 sm:p-3 bg-[#191919] border border-[#33302D]">
                          <div className="font-mono text-[9px] text-[#A7A19A]">
                            ACCESS
                          </div>
                          <div className="font-heading text-xs font-bold text-[#E87935] mt-1">
                            Role-Gated
                          </div>
                        </div>
                        <div className="p-2.5 sm:p-3 bg-[#191919] border border-[#33302D]">
                          <div className="font-mono text-[9px] text-[#A7A19A]">
                            DATABASE
                          </div>
                          <div className="font-heading text-xs font-bold text-[#E8E4DE] mt-1">
                            Postgres / RLS
                          </div>
                        </div>
                      </div>

                      <p className="text-xs text-[#A7A19A] leading-relaxed">
                        Designed to replace error-prone manual spreadsheets with
                        structured contribution calculations and database
                        integrity.
                      </p>
                    </motion.div>
                  ) : (
                    <motion.div
                      key="pos-panel"
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -6 }}
                      transition={{ duration: 0.22, ease: MOTION_TOKENS.ease }}
                      className="bg-[#101010] border border-[#33302D] p-3.5 sm:p-4 space-y-4"
                    >
                      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[#33302D] pb-2.5">
                        <span className="font-mono text-[11px] text-[#E8E4DE]">
                          Universal POS — Local-First Desktop Checkout
                        </span>
                        <span className="font-mono text-[10px] text-[#F3A45B]">
                          DESKTOP APP
                        </span>
                      </div>

                      <div className="grid grid-cols-1 xs:grid-cols-3 sm:grid-cols-3 gap-2">
                        <div className="p-2.5 sm:p-3 bg-[#191919] border border-[#33302D]">
                          <div className="font-mono text-[9px] text-[#A7A19A]">
                            RUNTIME
                          </div>
                          <div className="font-heading text-xs font-bold text-[#E8E4DE] mt-1">
                            Electron Shell
                          </div>
                        </div>
                        <div className="p-2.5 sm:p-3 bg-[#191919] border border-[#33302D]">
                          <div className="font-mono text-[9px] text-[#A7A19A]">
                            STORAGE
                          </div>
                          <div className="font-heading text-xs font-bold text-[#E87935] mt-1">
                            Local SQLite
                          </div>
                        </div>
                        <div className="p-2.5 sm:p-3 bg-[#191919] border border-[#33302D]">
                          <div className="font-mono text-[9px] text-[#A7A19A]">
                            WORKFLOW
                          </div>
                          <div className="font-heading text-xs font-bold text-[#E8E4DE] mt-1">
                            Sales & Catalog
                          </div>
                        </div>
                      </div>

                      <p className="text-xs text-[#A7A19A] leading-relaxed">
                        Built for dependable counter sales management with an
                        embedded local database that works without relying on
                        constant cloud connectivity.
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>

                <div className="flex flex-wrap items-center justify-between gap-2 pt-1">
                  <button
                    type="button"
                    onClick={onExploreWork}
                    className="group font-mono text-[11px] text-[#E87935] hover:text-[#F3A45B] uppercase tracking-wider flex items-center gap-1.5 py-1 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#E87935]"
                  >
                    <span>View Full Case Studies</span>
                    <ArrowUpRight className="w-3.5 h-3.5 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                  </button>
                  <button
                    type="button"
                    onClick={() => setViewMode('architecture')}
                    className="font-mono text-[10px] text-[#A7A19A] hover:text-[#E8E4DE] underline underline-offset-4 py-1 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#E87935]"
                  >
                    Inspect System Layers →
                  </button>
                </div>
              </motion.div>
            ) : (
              /* Technical Architecture Inspector View */
              <motion.div
                key="architecture-mode"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{
                  duration: MOTION_TOKENS.standard,
                  ease: MOTION_TOKENS.ease,
                }}
                className="space-y-3"
              >
                <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[#33302D] pb-3 mb-2">
                  <span className="font-mono text-xs text-[#E8E4DE]">
                    HOW I STRUCTURE APPLICATIONS
                  </span>
                  <span className="font-mono text-[10px] text-[#F3A45B]">
                    3 CORE LAYERS
                  </span>
                </div>

                {ARCHITECTURE_LAYERS.map((layer) => {
                  const isSelected = activeLayer === layer.id;
                  return (
                    <motion.button
                      key={layer.id}
                      type="button"
                      whileHover={prefersReducedMotion ? undefined : { x: 3 }}
                      transition={{
                        duration: MOTION_TOKENS.fast,
                        ease: MOTION_TOKENS.ease,
                      }}
                      onClick={() => setActiveLayer(layer.id)}
                      aria-pressed={isSelected}
                      className={`w-full text-left cursor-pointer p-3.5 border transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-[#E87935] ${
                        isSelected
                          ? 'bg-[#242220] border-[#E87935]'
                          : 'bg-[#101010] border-[#33302D] opacity-80 hover:opacity-100'
                      }`}
                    >
                      <div className="flex items-center justify-between font-mono text-[10px] mb-1">
                        <span className="text-[#E87935]">
                          {layer.code} — {layer.tech}
                        </span>
                      </div>
                      <div className="font-heading text-sm font-bold text-[#E8E4DE]">
                        {layer.title}
                      </div>
                      <p className="text-xs text-[#A7A19A] mt-1">
                        {layer.detail}
                      </p>
                    </motion.button>
                  );
                })}
              </motion.div>
            )}
          </AnimatePresence>

          {/* Secondary Capability Bar */}
          <div className="mt-5 pt-4 border-t border-[#33302D] flex items-center justify-between gap-3 bg-[#101010] p-3 border">
            <div className="flex items-center gap-3 min-w-0">
              <div className="w-7 h-7 bg-[#242220] border border-[#E87935]/40 flex items-center justify-center text-[#E87935] shrink-0">
                <Sliders className="w-3.5 h-3.5" />
              </div>
              <div className="text-xs text-[#E8E4DE] min-w-0">
                <span className="font-mono text-[10px] text-[#F3A45B] uppercase block">
                  CREATIVE ADVANTAGE
                </span>
                <span className="block truncate sm:whitespace-normal">
                  Video Editing & Digital Media Production
                </span>
              </div>
            </div>
            <button
              type="button"
              onClick={onExploreCreative}
              className="font-mono text-[10px] text-[#E87935] hover:text-[#F3A45B] uppercase tracking-wider shrink-0 py-1 px-1.5 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#E87935]"
            >
              View →
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

