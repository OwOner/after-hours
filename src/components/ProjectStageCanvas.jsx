import { useState } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { Image as ImageIcon, Coffee, Store, Laptop } from 'lucide-react';

/**
 * Renders either:
 * 1. A verified application screenshot (for Universal POS and Go Green Solar Simulator)
 *    with clean framing, aspect-ratio preservation, and no obscuring overlays.
 * 2. A bespoke text-based architectural specimen (for 151 Street Café POS and Website)
 *    that clearly conveys their distinct roles within the shared 151 Street Café digital suite.
 * 3. Preserved conceptual fallbacks for legacy/hidden projects (Nexus Payroll and SmartSpend).
 */
export default function ProjectStageCanvas({
  type,
  previewLabel,
  screenshotUrl,
  screenshotAlt,
}) {
  const [imageStatus, setImageStatus] = useState(
    screenshotUrl ? 'loading' : 'missing',
  );
  const prefersReducedMotion = useReducedMotion();

  // 1. Screenshot-driven view (Universal POS & Go Green Solar Simulator)
  if (screenshotUrl && imageStatus !== 'missing') {
    return (
      <div className="w-full h-full bg-[#101010] relative overflow-hidden flex flex-col justify-between">
        <div className="flex flex-wrap items-center justify-between gap-2 px-4 sm:px-6 py-2.5 bg-[#141312] border-b border-[#33302D] z-10 shrink-0">
          <div className="flex items-center gap-2">
            <ImageIcon className="w-3.5 h-3.5 text-[#E87935]" />
            <span className="font-mono text-[10px] tracking-widest text-[#E8E4DE] uppercase truncate">
              {previewLabel || 'APPLICATION PREVIEW'}
            </span>
          </div>
          <span className="font-mono text-[9px] px-2 py-0.5 bg-[#191919] border border-[#33302D] text-[#F3A45B] uppercase tracking-wider">
            VERIFIED APPLICATION CAPTURE
          </span>
        </div>

        <div className="relative flex-1 w-full min-h-[260px] sm:min-h-[320px] bg-[#0c0c0c] flex items-center justify-center p-2 sm:p-3 overflow-hidden">
          <img
            src={screenshotUrl}
            alt={screenshotAlt || previewLabel || 'Project screenshot'}
            loading="lazy"
            decoding="async"
            onError={() => setImageStatus('missing')}
            className="max-w-full max-h-[460px] w-auto h-auto object-contain rounded border border-[#242220] shadow-2xl transition-opacity duration-300 opacity-100"
          />
        </div>

        <div className="flex flex-wrap items-center justify-between gap-2 px-4 sm:px-6 py-2 bg-[#141312] border-t border-[#33302D] font-mono text-[10px] text-[#A7A19A] shrink-0">
          <span className="text-[#E87935]">
            ASPECT RATIO PRESERVED // HIGH-CONTRAST SCREENSHOT
          </span>
          <span className="text-[#E8E4DE]">AFTERHOURS PREVIEW</span>
        </div>
      </div>
    );
  }

  // 2. 151 Street Café POS: Polished Text-Based Card
  if (type === 'cafe-pos') {
    return (
      <div className="w-full h-full bg-[#101010] p-4 sm:p-6 md:p-7 flex flex-col justify-between relative overflow-hidden select-none">
        {/* Subtle Warm Amber Glow */}
        <div className="absolute -top-24 -right-24 w-72 h-72 rounded-full bg-[#E87935]/10 blur-3xl pointer-events-none" />

        {/* Top Header */}
        <div className="relative z-10 flex flex-wrap items-center justify-between gap-2 border-b border-[#33302D] pb-3">
          <div className="flex items-center gap-2 min-w-0">
            <Store className="w-4 h-4 text-[#E87935] shrink-0" />
            <span className="font-mono text-[10px] sm:text-[11px] tracking-wider text-[#E8E4DE] uppercase truncate">
              151 STREET CAFÉ // CASHIER COUNTER OPERATIONS
            </span>
          </div>
          <span className="font-mono text-[9px] px-2 py-0.5 bg-[#191919] text-[#F3A45B] border border-[#33302D] uppercase tracking-wider">
            OPERATIONAL POINT OF SALE
          </span>
        </div>

        {/* Shared Suite Badge */}
        <div className="relative z-10 my-3 p-2.5 sm:p-3 bg-[#161514] border border-[#33302D] flex items-center justify-between gap-2">
          <div className="flex items-center gap-2 min-w-0">
            <Coffee className="w-3.5 h-3.5 text-[#E87935] shrink-0" />
            <div className="min-w-0">
              <span className="font-mono text-[9px] text-[#A7A19A] uppercase block">
                SHARED DIGITAL SUITE • SORSOGON CITY
              </span>
              <span className="font-heading text-xs font-bold text-[#E8E4DE] truncate block">
                Component 01 of 02: In-Store Cashier POS System
              </span>
            </div>
          </div>
          <span className="hidden sm:inline-block font-mono text-[10px] text-[#E87935] uppercase shrink-0">
            STAFF / CASHIER
          </span>
        </div>

        {/* Architectural Scope Grid */}
        <div className="relative z-10 grid grid-cols-1 sm:grid-cols-2 gap-2.5 sm:gap-3 my-2">
          <div className="p-3 bg-[#191919] border border-[#33302D]">
            <div className="font-mono text-[9px] text-[#E87935] uppercase">
              ORDER CHANNELS
            </div>
            <div className="font-heading text-xs font-bold text-[#E8E4DE] mt-1">
              4 Order Types Supported
            </div>
            <p className="font-mono text-[10px] text-[#A7A19A] mt-1">
              Dine-In • Takeout • Pickup • Delivery
            </p>
          </div>

          <div className="p-3 bg-[#191919] border border-[#33302D]">
            <div className="font-mono text-[9px] text-[#E87935] uppercase">
              MENU BROWSING
            </div>
            <div className="font-heading text-xs font-bold text-[#E8E4DE] mt-1">
              Categorized Drink Catalog
            </div>
            <p className="font-mono text-[10px] text-[#A7A19A] mt-1">
              Espresso, iced refreshers, artisan lattes
            </p>
          </div>

          <div className="p-3 bg-[#191919] border border-[#33302D]">
            <div className="font-mono text-[9px] text-[#E87935] uppercase">
              TICKET QUEUE
            </div>
            <div className="font-heading text-xs font-bold text-[#E8E4DE] mt-1">
              Active Shift Tickets & Tabs
            </div>
            <p className="font-mono text-[10px] text-[#A7A19A] mt-1">
              Live order totals & item modifiers
            </p>
          </div>

          <div className="p-3 bg-[#191919] border border-[#33302D]">
            <div className="font-mono text-[9px] text-[#E87935] uppercase">
              COUNTER WORKFLOW
            </div>
            <div className="font-heading text-xs font-bold text-[#E8E4DE] mt-1">
              Rapid Cashier Punching
            </div>
            <p className="font-mono text-[10px] text-[#A7A19A] mt-1">
              Optimized for high-volume shift speed
            </p>
          </div>
        </div>

        {/* Bottom Technical Readout */}
        <div className="relative z-10 flex flex-wrap items-center justify-between gap-2 border-t border-[#33302D] pt-3 font-mono text-[10px] text-[#A7A19A]">
          <span>TEXT-FIRST SYSTEM SPECIFICATION // NO SCREENSHOT</span>
          <span className="text-[#E87935]">REACT • TYPESCRIPT • TAILWIND CSS</span>
        </div>
      </div>
    );
  }

  // 3. 151 Street Café Website: Polished Text-Based Card
  if (type === 'cafe-web') {
    return (
      <div className="w-full h-full bg-[#101010] p-4 sm:p-6 md:p-7 flex flex-col justify-between relative overflow-hidden select-none">
        {/* Subtle Cool Green-Amber Glow */}
        <div className="absolute -top-24 -right-24 w-72 h-72 rounded-full bg-[#E87935]/10 blur-3xl pointer-events-none" />

        {/* Top Header */}
        <div className="relative z-10 flex flex-wrap items-center justify-between gap-2 border-b border-[#33302D] pb-3">
          <div className="flex items-center gap-2 min-w-0">
            <Laptop className="w-4 h-4 text-[#E87935] shrink-0" />
            <span className="font-mono text-[10px] sm:text-[11px] tracking-wider text-[#E8E4DE] uppercase truncate">
              151 STREET CAFÉ // PUBLIC BRAND & WEB EXPERIENCE
            </span>
          </div>
          <span className="font-mono text-[9px] px-2 py-0.5 bg-[#191919] text-[#F3A45B] border border-[#33302D] uppercase tracking-wider">
            PUBLIC WEB PLATFORM
          </span>
        </div>

        {/* Shared Suite Badge */}
        <div className="relative z-10 my-3 p-2.5 sm:p-3 bg-[#161514] border border-[#33302D] flex items-center justify-between gap-2">
          <div className="flex items-center gap-2 min-w-0">
            <Coffee className="w-3.5 h-3.5 text-[#E87935] shrink-0" />
            <div className="min-w-0">
              <span className="font-mono text-[9px] text-[#A7A19A] uppercase block">
                SHARED DIGITAL SUITE • SORSOGON CITY
              </span>
              <span className="font-heading text-xs font-bold text-[#E8E4DE] truncate block">
                Component 02 of 02: Public Brand Website & Customer Portal
              </span>
            </div>
          </div>
          <span className="hidden sm:inline-block font-mono text-[10px] text-[#E87935] uppercase shrink-0">
            PUBLIC / CUSTOMER
          </span>
        </div>

        {/* Architectural Scope Grid */}
        <div className="relative z-10 grid grid-cols-1 sm:grid-cols-2 gap-2.5 sm:gap-3 my-2">
          <div className="p-3 bg-[#191919] border border-[#33302D]">
            <div className="font-mono text-[9px] text-[#E87935] uppercase">
              BRAND EXPERIENCE
            </div>
            <div className="font-heading text-xs font-bold text-[#E8E4DE] mt-1">
              Elevate Your Morning Ritual
            </div>
            <p className="font-mono text-[10px] text-[#A7A19A] mt-1">
              Coffee roasting storytelling & space aesthetics
            </p>
          </div>

          <div className="p-3 bg-[#191919] border border-[#33302D]">
            <div className="font-mono text-[9px] text-[#E87935] uppercase">
              ARTISANAL MENU
            </div>
            <div className="font-heading text-xs font-bold text-[#E8E4DE] mt-1">
              Specialty Single Origins
            </div>
            <p className="font-mono text-[10px] text-[#A7A19A] mt-1">
              Ethiopia Yirgacheffe, tasting notes & food
            </p>
          </div>

          <div className="p-3 bg-[#191919] border border-[#33302D]">
            <div className="font-mono text-[9px] text-[#E87935] uppercase">
              RESERVATIONS
            </div>
            <div className="font-heading text-xs font-bold text-[#E8E4DE] mt-1">
              Customer Table Booking
            </div>
            <p className="font-mono text-[10px] text-[#A7A19A] mt-1">
              Online table scheduling & visit inquiries
            </p>
          </div>

          <div className="p-3 bg-[#191919] border border-[#33302D]">
            <div className="font-mono text-[9px] text-[#E87935] uppercase">
              CUSTOMER GUIDANCE
            </div>
            <div className="font-heading text-xs font-bold text-[#E8E4DE] mt-1">
              Location & Order Ahead
            </div>
            <p className="font-mono text-[10px] text-[#A7A19A] mt-1">
              Sorsogon City hours, map & digital links
            </p>
          </div>
        </div>

        {/* Bottom Technical Readout */}
        <div className="relative z-10 flex flex-wrap items-center justify-between gap-2 border-t border-[#33302D] pt-3 font-mono text-[10px] text-[#A7A19A]">
          <span>TEXT-FIRST SYSTEM SPECIFICATION // NO SCREENSHOT</span>
          <span className="text-[#E87935]">REACT • TAILWIND CSS</span>
        </div>
      </div>
    );
  }

  // 4. Preserved Conceptual Fallback: Nexus Payroll (Hidden from public showcase)
  if (type === 'payroll') {
    return (
      <div className="w-full h-full bg-[#101010] p-4 sm:p-7 flex flex-col justify-between relative overflow-hidden select-none">
        <motion.div
          animate={
            prefersReducedMotion
              ? undefined
              : { scale: [1, 1.08, 1], opacity: [0.1, 0.16, 0.1] }
          }
          transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute -top-24 -right-24 w-72 h-72 rounded-full bg-[#E87935]/10 blur-3xl pointer-events-none"
        />

        <div className="relative z-10 flex flex-wrap items-center justify-between gap-2 border-b border-[#33302D] pb-3.5">
          <div className="flex items-center gap-2.5 min-w-0">
            <span className="w-2 h-2 rounded-full bg-[#E87935]" />
            <span className="font-mono text-[10px] sm:text-[11px] tracking-wider text-[#E8E4DE] uppercase truncate">
              Nexus Payroll — Pay Period Run #2026-04
            </span>
          </div>
          <span className="font-mono text-[9px] px-2 py-0.5 bg-[#191919] text-[#F3A45B] border border-[#33302D]">
            CONCEPTUAL PREVIEW
          </span>
        </div>

        <div className="relative z-10 my-4 sm:my-6 grid grid-cols-1 sm:grid-cols-12 gap-3.5 sm:gap-4 items-stretch">
          <div className="sm:col-span-8 bg-[#191919] border border-[#33302D] p-3.5 sm:p-5 flex flex-col justify-between">
            <div className="flex justify-between font-mono text-[10px] text-[#A7A19A] border-b border-[#33302D] pb-2 mb-3">
              <span>DISBURSEMENT LEDGER</span>
              <span className="text-[#E87935]">3 RECORDS</span>
            </div>
            <div className="space-y-2 font-mono text-[11px]">
              <div className="flex justify-between text-[#E8E4DE]">
                <span>E-104 // Senior Eng</span>
                <span className="text-[#E87935]">₱84,200.00</span>
              </div>
              <div className="flex justify-between text-[#E8E4DE]">
                <span>E-105 // Product Lead</span>
                <span className="text-[#E87935]">₱92,500.00</span>
              </div>
            </div>
          </div>
          <div className="sm:col-span-4 bg-[#242220] border border-[#33302D] p-3.5 sm:p-5 font-mono text-xs space-y-2">
            <div className="text-[#F3A45B] text-[10px]">DEDUCTIONS</div>
            <div className="text-[#E8E4DE]">SSS, PhilHealth, Pag-IBIG</div>
          </div>
        </div>

        <div className="flex flex-wrap items-center justify-between gap-2 border-t border-[#33302D] pt-3 font-mono text-[10px] text-[#A7A19A]">
          <span>STACK: NEXT.JS • TYPESCRIPT • SUPABASE</span>
          <span className="text-[#E8E4DE]">PRESERVED PROJECT MOCKUP</span>
        </div>
      </div>
    );
  }

  // 5. Preserved Conceptual Fallback: SmartSpend (Hidden from public showcase)
  return (
    <div className="w-full h-full bg-[#101010] p-4 sm:p-7 flex flex-col justify-between relative overflow-hidden select-none">
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[#33302D] pb-3.5">
        <span className="font-mono text-[10px] sm:text-[11px] tracking-wider text-[#E8E4DE] uppercase">
          SmartSpend — Personal Expense Ledger
        </span>
        <span className="font-mono text-[9px] px-2 py-0.5 bg-[#191919] border border-[#33302D] text-[#F3A45B]">
          CONCEPTUAL PREVIEW
        </span>
      </div>

      <div className="my-4 sm:my-6 p-4 bg-[#191919] border border-[#33302D] space-y-2 font-mono text-xs">
        <div className="text-[#E87935] text-[10px]">MONTHLY CASHFLOW</div>
        <div className="text-[#E8E4DE]">Income vs. Recurring Expense Ledger</div>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-2 border-t border-[#33302D] pt-3 font-mono text-[10px] text-[#A7A19A]">
        <span>STACK: REACT • TYPESCRIPT • SUPABASE</span>
        <span className="text-[#E8E4DE]">PRESERVED PROJECT MOCKUP</span>
      </div>
    </div>
  );
}
