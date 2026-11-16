import { useState } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { Image as ImageIcon, Layers } from 'lucide-react';
import { MOTION_TOKENS } from '../utils/motion.jsx';

/**
 * Renders either a real application screenshot (when available at screenshotUrl)
 * with smooth lazy-loading and aspect-ratio framing, OR the bespoke interactive
 * conceptual interface preview when the screenshot asset hasn't been supplied yet.
 * If a screenshot is available, visitors can also toggle between the Screenshot
 * and the Interactive Conceptual Preview.
 */
export default function ProjectStageCanvas({
  type,
  interactive = false,
  previewLabel,
  screenshotUrl,
  screenshotAlt,
}) {
  const [activeTab, setActiveTab] = useState(0);
  const [imageStatus, setImageStatus] = useState(screenshotUrl ? 'loading' : 'missing'); // 'loading' | 'loaded' | 'missing'
  const [displayMode, setDisplayMode] = useState('auto'); // 'auto' | 'screenshot' | 'interactive'
  const prefersReducedMotion = useReducedMotion();

  const showScreenshot =
    imageStatus === 'loaded' && displayMode !== 'interactive';

  return (
    <div className="w-full h-full bg-[#101010] relative overflow-hidden flex flex-col justify-between">
      {/* Hidden or Active Screenshot Probe / Renderer */}
      {screenshotUrl && imageStatus !== 'missing' && (
        <div
          className={`${
            showScreenshot
              ? 'relative w-full h-full flex flex-col justify-between bg-[#101010]'
              : 'sr-only pointer-events-none'
          }`}
        >
          <div className="flex flex-wrap items-center justify-between gap-2 px-4 sm:px-6 py-3 bg-[#141312] border-b border-[#33302D] z-10">
            <div className="flex items-center gap-2">
              <ImageIcon className="w-3.5 h-3.5 text-[#E87935]" />
              <span className="font-mono text-[10px] tracking-widest text-[#E8E4DE] uppercase">
                APPLICATION SCREENSHOT
              </span>
            </div>
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                setDisplayMode('interactive');
              }}
              className="font-mono text-[10px] px-2.5 py-1 bg-[#191919] hover:bg-[#242220] text-[#F3A45B] border border-[#33302D] hover:border-[#E87935] transition-colors"
            >
              Switch to Interactive Preview
            </button>
          </div>

          <div className="relative flex-1 w-full overflow-hidden bg-[#101010] flex items-center justify-center">
            <img
              src={screenshotUrl}
              alt={screenshotAlt || previewLabel || 'Project screenshot'}
              loading="lazy"
              decoding="async"
              onLoad={() => setImageStatus('loaded')}
              onError={() => setImageStatus('missing')}
              className={`w-full h-full object-cover object-top transition-opacity duration-500 ${
                imageStatus === 'loaded' ? 'opacity-100' : 'opacity-0'
              }`}
            />
          </div>
        </div>
      )}

      {/* Bespoke Conceptual Interface Preview (Default fallback or toggled mode) */}
      {!showScreenshot && (
        <>
          {imageStatus === 'loaded' && (
            <div className="absolute top-3 right-3 z-20">
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setDisplayMode('screenshot');
                }}
                className="inline-flex items-center gap-1.5 font-mono text-[10px] px-2.5 py-1 bg-[#191919] hover:bg-[#242220] text-[#E87935] border border-[#E87935]/50 transition-colors"
              >
                <Layers className="w-3 h-3" />
                <span>View Screenshot</span>
              </button>
            </div>
          )}

          {type === 'payroll' && (
            <div className="w-full h-full bg-[#101010] p-4 sm:p-7 flex flex-col justify-between relative overflow-hidden select-none">
              {/* Subtle Warm Atmospheric Glow */}
              <motion.div
                animate={
                  prefersReducedMotion
                    ? undefined
                    : { scale: [1, 1.08, 1], opacity: [0.1, 0.16, 0.1] }
                }
                transition={{
                  duration: 8,
                  repeat: Infinity,
                  ease: 'easeInOut',
                }}
                className="absolute -top-24 -right-24 w-72 h-72 rounded-full bg-[#E87935]/10 blur-3xl pointer-events-none"
              />

              {/* Top Application Frame */}
              <div className="relative z-10 flex flex-wrap items-center justify-between gap-2 border-b border-[#33302D] pb-3.5">
                <div className="flex items-center gap-2.5 min-w-0">
                  <div className="flex gap-1.5 shrink-0">
                    <span className="w-2 h-2 rounded-full bg-[#33302D]" />
                    <span className="w-2 h-2 rounded-full bg-[#33302D]" />
                    <span className="w-2 h-2 rounded-full bg-[#E87935]" />
                  </div>
                  <span className="font-mono text-[10px] sm:text-[11px] tracking-wider sm:tracking-widest text-[#E8E4DE] uppercase truncate">
                    Nexus Payroll — Pay Period Run #2026-04
                  </span>
                </div>
                <span className="font-mono text-[9px] sm:text-[10px] px-2 py-0.5 sm:px-2.5 sm:py-1 bg-[#191919] text-[#F3A45B] border border-[#33302D]">
                  CONCEPTUAL INTERFACE PREVIEW
                </span>
              </div>

              {/* Realistic Application Workspace Mockup */}
              <div className="relative z-10 my-4 sm:my-6 grid grid-cols-1 sm:grid-cols-12 gap-3.5 sm:gap-4 items-stretch">
                {/* Left: Payroll Ledger Table */}
                <div className="sm:col-span-8 bg-[#191919] border border-[#33302D] p-3.5 sm:p-5 flex flex-col justify-between">
                  <div>
                    <div className="flex flex-wrap items-center justify-between gap-1 border-b border-[#33302D] pb-2.5 mb-3">
                      <span className="font-mono text-[10px] text-[#A7A19A] uppercase">
                        EMPLOYEE DISBURSEMENT LEDGER
                      </span>
                      <span className="font-mono text-[10px] text-[#E87935]">
                        3 RECORDS SELECTED
                      </span>
                    </div>
                    <div className="space-y-2 font-mono text-[11px] sm:text-xs">
                      {[
                        {
                          id: 'EMP-104',
                          dept: 'Engineering',
                          gross: '₱48,000',
                          deduct: '-₱3,420',
                          net: '₱44,580',
                        },
                        {
                          id: 'EMP-109',
                          dept: 'Operations',
                          gross: '₱36,000',
                          deduct: '-₱2,690',
                          net: '₱33,310',
                        },
                        {
                          id: 'EMP-112',
                          dept: 'Finance',
                          gross: '₱42,500',
                          deduct: '-₱3,110',
                          net: '₱39,390',
                        },
                      ].map((row, i) => (
                        <motion.div
                          key={row.id}
                          role={interactive ? 'button' : undefined}
                          tabIndex={interactive ? 0 : undefined}
                          whileHover={
                            interactive && !prefersReducedMotion
                              ? { x: 3 }
                              : undefined
                          }
                          transition={{
                            duration: MOTION_TOKENS.fast,
                            ease: MOTION_TOKENS.ease,
                          }}
                          onClick={(e) => {
                            if (interactive) {
                              e.stopPropagation();
                              setActiveTab(i);
                            }
                          }}
                          onKeyDown={(e) => {
                            if (
                              interactive &&
                              (e.key === 'Enter' || e.key === ' ')
                            ) {
                              e.preventDefault();
                              e.stopPropagation();
                              setActiveTab(i);
                            }
                          }}
                          className={`grid grid-cols-3 sm:grid-cols-4 gap-2 items-center p-2.5 border transition-colors ${
                            activeTab === i
                              ? 'bg-[#242220] border-[#E87935]/60 text-[#E8E4DE]'
                              : 'bg-[#101010] border-[#33302D] text-[#A7A19A]'
                          }`}
                        >
                          <span className="text-[#E8E4DE] font-medium truncate">
                            {row.id}
                          </span>
                          <span className="hidden sm:inline text-[11px] truncate">
                            {row.dept}
                          </span>
                          <span className="text-[#F3A45B] text-right sm:text-left truncate">
                            {row.deduct}
                          </span>
                          <span className="text-[#E87935] font-semibold text-right truncate">
                            {row.net}
                          </span>
                        </motion.div>
                      ))}
                    </div>
                  </div>

                  <div className="mt-4 pt-3 border-t border-[#33302D] flex flex-wrap items-center justify-between gap-2 font-mono text-[10px] text-[#A7A19A]">
                    <span>DEDUCTIONS: SSS • PHILHEALTH • PAG-IBIG</span>
                    <span className="text-[#E8E4DE]">RLS VERIFIED</span>
                  </div>
                </div>

                {/* Right: Security & Database Integrity Card */}
                <div className="sm:col-span-4 bg-[#242220] border border-[#33302D] p-3.5 sm:p-5 flex flex-col justify-between">
                  <div className="space-y-3">
                    <div className="font-mono text-[10px] text-[#E87935] uppercase tracking-wider">
                      Integrity Controls
                    </div>
                    <div className="grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-1 gap-2 font-mono text-[11px] text-[#E8E4DE]">
                      <div className="p-2.5 bg-[#101010]/90 border border-[#33302D]">
                        <div className="text-[10px] text-[#A7A19A]">
                          ACCESS GUARD
                        </div>
                        <div className="mt-0.5">Role-Based Admin Lock</div>
                      </div>
                      <div className="p-2.5 bg-[#101010]/90 border border-[#33302D]">
                        <div className="text-[10px] text-[#A7A19A]">
                          DATABASE
                        </div>
                        <div className="mt-0.5">
                          Supabase Relational Constraints
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="mt-3 sm:mt-4 p-2.5 bg-[#101010] border border-[#E87935]/30 font-mono text-[10px] text-[#F3A45B]">
                    Slot: public/assets/projects/nexus-payroll.png
                  </div>
                </div>
              </div>

              {/* Bottom Status Bar */}
              <div className="relative z-10 flex flex-wrap items-center justify-between gap-2 border-t border-[#33302D] pt-3 font-mono text-[10px] text-[#A7A19A]">
                <span>STACK: NEXT.JS • TYPESCRIPT • SUPABASE</span>
                <span className="text-[#E8E4DE]">
                  {previewLabel || 'CONCEPTUAL PRODUCT PREVIEW'}
                </span>
              </div>
            </div>
          )}

          {type === 'pos' && (
            <div className="w-full h-full bg-[#101010] p-4 sm:p-7 flex flex-col justify-between relative overflow-hidden select-none">
              <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[#33302D] pb-3.5">
                <div className="flex items-center gap-2.5">
                  <span className="w-2 h-2 bg-[#E87935] shrink-0" />
                  <span className="font-mono text-[10px] sm:text-[11px] tracking-wider sm:tracking-widest text-[#E8E4DE] uppercase">
                    Universal POS — Counter Terminal
                  </span>
                </div>
                <span className="font-mono text-[9px] sm:text-[10px] px-2 py-0.5 sm:px-2.5 sm:py-1 bg-[#191919] border border-[#33302D] text-[#F3A45B]">
                  CONCEPTUAL INTERFACE PREVIEW
                </span>
              </div>

              <div className="my-4 sm:my-6 grid grid-cols-1 sm:grid-cols-12 gap-3.5 sm:gap-4 flex-1 items-stretch">
                {/* Item Grid */}
                <div className="sm:col-span-7 grid grid-cols-2 gap-2.5">
                  {[
                    {
                      code: 'SKU-101',
                      label: 'Counter Item A',
                      price: '₱240.00',
                    },
                    {
                      code: 'SKU-102',
                      label: 'Counter Item B',
                      price: '₱185.00',
                    },
                    {
                      code: 'SKU-103',
                      label: 'Bundle Package',
                      price: '₱520.00',
                    },
                    {
                      code: 'SKU-104',
                      label: 'Custom Entry',
                      price: 'Variable',
                    },
                  ].map((item, i) => (
                    <motion.div
                      key={item.code}
                      role={interactive ? 'button' : undefined}
                      tabIndex={interactive ? 0 : undefined}
                      whileHover={
                        interactive && !prefersReducedMotion
                          ? { y: -2 }
                          : undefined
                      }
                      transition={{
                        duration: MOTION_TOKENS.fast,
                        ease: MOTION_TOKENS.ease,
                      }}
                      onClick={(e) => {
                        if (interactive) {
                          e.stopPropagation();
                          setActiveTab(i);
                        }
                      }}
                      onKeyDown={(e) => {
                        if (
                          interactive &&
                          (e.key === 'Enter' || e.key === ' ')
                        ) {
                          e.preventDefault();
                          e.stopPropagation();
                          setActiveTab(i);
                        }
                      }}
                      className={`p-3 sm:p-3.5 border flex flex-col justify-between transition-colors ${
                        i === activeTab
                          ? 'bg-[#242220] border-[#E87935]'
                          : 'bg-[#191919] border-[#33302D]'
                      }`}
                    >
                      <div className="flex flex-wrap justify-between gap-1 font-mono text-[10px]">
                        <span className="text-[#A7A19A]">{item.code}</span>
                        <span className="text-[#E87935]">{item.price}</span>
                      </div>
                      <div className="font-heading text-xs sm:text-sm font-medium text-[#E8E4DE] mt-2.5 sm:mt-3">
                        {item.label}
                      </div>
                    </motion.div>
                  ))}
                </div>

                {/* Local Transaction Ledger */}
                <div className="sm:col-span-5 bg-[#191919] border border-[#33302D] p-3.5 sm:p-4 flex flex-col justify-between">
                  <div>
                    <div className="font-mono text-[10px] text-[#A7A19A] border-b border-[#33302D] pb-2">
                      ACTIVE RECEIPT // SQLITE
                    </div>
                    <div className="space-y-2 mt-3 font-mono text-[11px]">
                      <div className="flex justify-between text-[#E8E4DE]">
                        <span>1x Counter Item A</span>
                        <span>₱240.00</span>
                      </div>
                      <div className="flex justify-between text-[#E8E4DE]">
                        <span>1x Bundle Package</span>
                        <span>₱520.00</span>
                      </div>
                      <div className="flex justify-between text-[#A7A19A] pt-2 border-t border-[#33302D]">
                        <span>Persistence</span>
                        <span className="text-[#F3A45B]">Local SQLite DB</span>
                      </div>
                    </div>
                  </div>
                  <div className="mt-3 pt-3 border-t border-[#33302D] flex justify-between items-center font-mono text-xs">
                    <span className="text-[#A7A19A]">TOTAL</span>
                    <span className="text-[#E87935] font-bold">₱760.00</span>
                  </div>
                </div>
              </div>

              <div className="flex flex-wrap items-center justify-between gap-2 border-t border-[#33302D] pt-3 font-mono text-[10px] text-[#A7A19A]">
                <span>STACK: ELECTRON • REACT • SQLITE • TYPESCRIPT</span>
                <span className="text-[#E8E4DE]">
                  {previewLabel || 'CONCEPTUAL PRODUCT PREVIEW'}
                </span>
              </div>
            </div>
          )}

          {type !== 'payroll' && type !== 'pos' && (
            /* smartspend */
            <div className="w-full h-full bg-[#101010] p-4 sm:p-7 flex flex-col justify-between relative overflow-hidden select-none">
              <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[#33302D] pb-3.5">
                <span className="font-mono text-[10px] sm:text-[11px] tracking-wider sm:tracking-widest text-[#E8E4DE] uppercase">
                  SmartSpend — Personal Expense Ledger
                </span>
                <span className="font-mono text-[9px] sm:text-[10px] px-2 py-0.5 sm:px-2.5 sm:py-1 bg-[#191919] border border-[#33302D] text-[#F3A45B]">
                  CONCEPTUAL INTERFACE PREVIEW
                </span>
              </div>

              <div className="my-4 sm:my-6 grid grid-cols-1 sm:grid-cols-12 gap-3.5 sm:gap-4 items-center">
                <div className="sm:col-span-7 bg-[#191919] border border-[#33302D] p-3.5 sm:p-4 space-y-2.5">
                  <div className="font-mono text-[10px] text-[#A7A19A]">
                    MONTHLY CASHFLOW BREAKDOWN
                  </div>
                  <div className="space-y-2.5 font-mono text-[11px] sm:text-xs">
                    <div className="flex justify-between items-center gap-3">
                      <span className="text-[#E8E4DE]">Logged Income</span>
                      <span className="w-20 sm:w-24 h-2 bg-[#242220] overflow-hidden shrink-0">
                        <span className="block h-full w-4/5 bg-[#E87935]" />
                      </span>
                    </div>
                    <div className="flex justify-between items-center gap-3">
                      <span className="text-[#E8E4DE]">
                        Fixed & Utility Expenses
                      </span>
                      <span className="w-20 sm:w-24 h-2 bg-[#242220] overflow-hidden shrink-0">
                        <span className="block h-full w-1/2 bg-[#F3A45B]" />
                      </span>
                    </div>
                    <div className="flex justify-between items-center gap-3">
                      <span className="text-[#E8E4DE]">
                        Net Balance Tracked
                      </span>
                      <span className="w-20 sm:w-24 h-2 bg-[#242220] overflow-hidden shrink-0">
                        <span className="block h-full w-2/3 bg-[#A7A19A]" />
                      </span>
                    </div>
                  </div>
                </div>

                <div className="sm:col-span-5 bg-[#242220] border border-[#33302D] p-3.5 sm:p-4 space-y-2">
                  <div className="font-mono text-[10px] text-[#F3A45B]">
                    LEDGER SUMMARY
                  </div>
                  <p className="text-xs text-[#E8E4DE] leading-relaxed">
                    Tracks personal income, categorized expenses, and ongoing
                    financial activity with cloud-synced records.
                  </p>
                </div>
              </div>

              <div className="flex flex-wrap items-center justify-between gap-2 border-t border-[#33302D] pt-3 font-mono text-[10px] text-[#A7A19A]">
                <span>STACK: REACT • TYPESCRIPT • SUPABASE</span>
                <span className="text-[#E8E4DE]">
                  {previewLabel || 'CONCEPTUAL INTERFACE PREVIEW'}
                </span>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}

