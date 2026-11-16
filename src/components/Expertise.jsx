import { useState } from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import {
  Sparkles,
  CheckCircle2,
  Film,
  Scissors,
  Camera,
} from 'lucide-react';
import {
  MOTION_TOKENS,
  createStaggerContainer,
  createFadeUpVariant,
  Reveal,
} from '../utils/motion.jsx';
import {
  EXPERTISE_CATEGORIES,
  AI_ENGINEERING_DATA,
  CREATIVE_TOOLS_DATA,
} from '../data/portfolioData.js';

/**
 * Recognizable minimalist vector brand/tool icons for AI & Creative tools.
 */
function ToolIcon({ id }) {
  if (id === 'chatgpt') {
    return (
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="w-4 h-4 text-[#E87935]"
        aria-hidden="true"
      >
        <path d="M12 3a4.5 4.5 0 0 0-3.89 2.25L4.5 11.5a4.5 4.5 0 0 0 0 4.5l2.1 3.64a4.5 4.5 0 0 0 6.15 1.65L19 17.6a4.5 4.5 0 0 0 1.65-6.15l-2.1-3.64A4.5 4.5 0 0 0 12 3Z" />
        <circle cx="12" cy="12" r="2.5" />
      </svg>
    );
  }
  if (id === 'gemini') {
    return (
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="w-4 h-4 text-[#E87935]"
        aria-hidden="true"
      >
        <path d="M12 2c.6 5.2 4.8 9.4 10 10-5.2.6-9.4 4.8-10 10-.6-5.2-4.8-9.4-10-10 5.2-.6 9.4-4.8 10-10Z" />
      </svg>
    );
  }
  if (id === 'claude') {
    return (
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="w-4 h-4 text-[#E87935]"
        aria-hidden="true"
      >
        <path d="M12 3v18M3 12h18M5.6 5.6l12.8 12.8M18.4 5.6 5.6 18.4" />
      </svg>
    );
  }
  if (id === 'davinci-resolve') {
    return <Film className="w-4 h-4 text-[#E87935]" aria-hidden="true" />;
  }
  if (id === 'capcut') {
    return <Scissors className="w-4 h-4 text-[#E87935]" aria-hidden="true" />;
  }
  return <Camera className="w-4 h-4 text-[#E87935]" aria-hidden="true" />;
}

export default function Expertise() {
  const [activeExpertiseTab, setActiveExpertiseTab] = useState('frontend');
  const prefersReducedMotion = useReducedMotion();

  const currentExpertise =
    EXPERTISE_CATEGORIES.find((c) => c.id === activeExpertiseTab) ||
    EXPERTISE_CATEGORIES[0];

  return (
    <section
      id="expertise"
      aria-label="Technical Capabilities"
      className="relative z-10 py-20 sm:py-24 md:py-32 px-4 sm:px-8 max-w-7xl mx-auto border-t border-[#33302D] scroll-mt-16"
    >
      <Reveal className="mb-10 sm:mb-14">
        <div className="font-mono text-xs tracking-[0.2em] text-[#E87935] uppercase mb-3">
          02 // Technical Capabilities
        </div>
        <h2 className="font-heading text-3xl sm:text-5xl md:text-6xl font-bold tracking-tight text-[#E8E4DE]">
          TOOLS OF THE TRADE
        </h2>
        <p className="text-[#A7A19A] mt-3 text-base sm:text-lg max-w-xl">
          Technologies and tools I use to build digital products.
        </p>
      </Reveal>

      {/* CORE 5-DOMAIN TECHNICAL MATRIX */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8 items-start">
        {/* Left Column: Category Selector */}
        <motion.div
          role="tablist"
          aria-label="Technical Expertise Categories"
          variants={createStaggerContainer(0.07)}
          initial={prefersReducedMotion ? 'visible' : 'hidden'}
          whileInView="visible"
          viewport={{ once: true, amount: 0.15 }}
          className="lg:col-span-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-2"
        >
          {EXPERTISE_CATEGORIES.map((category) => {
            const Icon = category.icon;
            const isSelected = activeExpertiseTab === category.id;
            return (
              <motion.button
                key={category.id}
                type="button"
                role="tab"
                id={`expertise-tab-${category.id}`}
                aria-selected={isSelected}
                aria-controls={`expertise-panel-${category.id}`}
                variants={createFadeUpVariant(18, 0.5)}
                whileHover={prefersReducedMotion ? undefined : { x: 3 }}
                transition={{
                  duration: MOTION_TOKENS.fast,
                  ease: MOTION_TOKENS.ease,
                }}
                onClick={() => setActiveExpertiseTab(category.id)}
                className={`w-full text-left p-3.5 sm:p-4 border transition-colors flex items-center justify-between focus:outline-none focus-visible:ring-2 focus-visible:ring-[#E87935] ${
                  isSelected
                    ? 'bg-[#242220] border-[#E87935] text-[#E8E4DE]'
                    : 'bg-[#191919] border-[#33302D] text-[#A7A19A] hover:text-[#E8E4DE] hover:border-[#A7A19A]/40'
                }`}
              >
                <div className="flex items-center gap-3 sm:gap-3.5 min-w-0">
                  <span className="font-mono text-xs text-[#E87935] shrink-0">
                    {category.code}
                  </span>
                  <Icon className="w-4 h-4 text-[#E87935] shrink-0" />
                  <span className="font-heading text-sm sm:text-base font-bold tracking-wide uppercase truncate">
                    {category.label}
                  </span>
                </div>
                <span className="font-mono text-xs pl-2 shrink-0">
                  {category.items.length}
                </span>
              </motion.button>
            );
          })}
        </motion.div>

        {/* Right Column: Selected Domain Specification */}
        <Reveal
          className="lg:col-span-8 bg-[#191919] border border-[#33302D] p-5 sm:p-8"
          delay={0.1}
        >
          <AnimatePresence mode="wait">
            <motion.div
              key={currentExpertise.id}
              role="tabpanel"
              id={`expertise-panel-${currentExpertise.id}`}
              aria-labelledby={`expertise-tab-${currentExpertise.id}`}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.24, ease: MOTION_TOKENS.ease }}
            >
              <div className="border-b border-[#33302D] pb-5 mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <div className="font-mono text-xs text-[#E87935] uppercase">
                    {`DOMAIN // ${currentExpertise.label}`}
                  </div>
                  <p className="text-sm text-[#A7A19A] mt-1">
                    {currentExpertise.summary}
                  </p>
                </div>
                <span className="font-mono text-[11px] px-3 py-1 bg-[#101010] border border-[#33302D] text-[#E8E4DE] self-start shrink-0">
                  {currentExpertise.items.length} TECHNOLOGIES
                </span>
              </div>

              <motion.div
                variants={createStaggerContainer(0.06)}
                initial={prefersReducedMotion ? 'visible' : 'hidden'}
                animate="visible"
                className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 sm:gap-4"
              >
                {currentExpertise.items.map((item) => (
                  <motion.div
                    key={item.name}
                    variants={createFadeUpVariant(14, 0.38)}
                    whileHover={prefersReducedMotion ? undefined : { y: -3 }}
                    transition={{
                      duration: MOTION_TOKENS.fast,
                      ease: MOTION_TOKENS.ease,
                    }}
                    className="p-4 bg-[#101010] border border-[#33302D] hover:border-[#E87935]/60 transition-colors flex flex-col justify-between"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-heading text-lg font-bold text-[#E8E4DE]">
                        {item.name}
                      </span>
                      <span className="w-1.5 h-1.5 bg-[#E87935]" />
                    </div>
                    <p className="text-xs text-[#A7A19A] leading-relaxed">
                      {item.desc}
                    </p>
                  </motion.div>
                ))}
              </motion.div>
            </motion.div>
          </AnimatePresence>
        </Reveal>
      </div>

      {/* PROMINENT SUBSECTION 1: AI-ASSISTED DEVELOPMENT & WORKFLOWS */}
      <Reveal className="mt-12 sm:mt-16 bg-[#191919] border border-[#33302D] p-5 sm:p-8 md:p-10">
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-4 border-b border-[#33302D] pb-6 mb-8">
          <div className="space-y-2 max-w-3xl">
            <div className="inline-flex items-center gap-2 font-mono text-xs text-[#E87935] uppercase tracking-wider">
              <Sparkles className="w-3.5 h-3.5 text-[#E87935]" />
              <span>{AI_ENGINEERING_DATA.tag}</span>
            </div>
            <h3 className="font-heading text-2xl sm:text-3xl font-bold text-[#E8E4DE]">
              {AI_ENGINEERING_DATA.title}
            </h3>
            <p className="text-xs sm:text-sm text-[#A7A19A] leading-relaxed">
              {AI_ENGINEERING_DATA.subtitle}
            </p>
          </div>
          <span className="font-mono text-[11px] px-3 py-1.5 bg-[#101010] border border-[#E87935]/50 text-[#F3A45B] self-start lg:self-end shrink-0 uppercase">
            WORKFLOW MULTIPLIER // FUNDAMENTALS FIRST
          </span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8 items-stretch">
          {/* Left Column (7 cols): AI Tools I Use */}
          <div className="lg:col-span-7 flex flex-col justify-between space-y-3.5">
            <div className="font-mono text-[11px] text-[#E87935] uppercase tracking-wider">
              AI Tools I Use
            </div>
            <div className="grid grid-cols-1 gap-3.5 flex-1">
              {AI_ENGINEERING_DATA.tools.map((tool) => (
                <motion.div
                  key={tool.id}
                  whileHover={prefersReducedMotion ? undefined : { y: -2 }}
                  transition={{
                    duration: MOTION_TOKENS.fast,
                    ease: MOTION_TOKENS.ease,
                  }}
                  className="p-4 bg-[#101010] border border-[#33302D] hover:border-[#E87935]/60 transition-colors flex flex-col justify-between gap-2"
                >
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div className="flex items-center gap-2.5">
                      <span className="w-7 h-7 bg-[#191919] border border-[#33302D] flex items-center justify-center shrink-0">
                        <ToolIcon id={tool.id} />
                      </span>
                      <span className="font-heading text-base sm:text-lg font-bold text-[#E8E4DE]">
                        {tool.name}
                      </span>
                    </div>
                    <span className="font-mono text-[10px] px-2.5 py-0.5 bg-[#191919] border border-[#33302D] text-[#F3A45B] uppercase">
                      {tool.role}
                    </span>
                  </div>
                  <p className="text-xs sm:text-sm text-[#A7A19A] leading-relaxed">
                    {tool.desc}
                  </p>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Right Column (5 cols): Practical Areas of Specialization */}
          <div className="lg:col-span-5 flex flex-col justify-between space-y-3.5">
            <div className="font-mono text-[11px] text-[#E87935] uppercase tracking-wider">
              Areas of Specialization
            </div>
            <div className="p-5 bg-[#101010] border border-[#33302D] flex-1 flex flex-col justify-between space-y-4">
              <ul className="space-y-3">
                {AI_ENGINEERING_DATA.specializations.map((spec) => (
                  <li
                    key={spec}
                    className="flex items-start gap-2.5 text-xs sm:text-sm text-[#E8E4DE]"
                  >
                    <CheckCircle2 className="w-4 h-4 text-[#E87935] shrink-0 mt-0.5" />
                    <span className="leading-snug">{spec}</span>
                  </li>
                ))}
              </ul>

              <div className="pt-3.5 border-t border-[#33302D] font-mono text-[11px] text-[#A7A19A] leading-relaxed">
                Applied practically across daily coding, debugging, system
                planning, and documentation workflows.
              </div>
            </div>
          </div>
        </div>
      </Reveal>

      {/* SECONDARY SUBSECTION 2: VIDEO EDITING & CREATIVE PRODUCTION TOOLS */}
      <Reveal className="mt-6 sm:mt-8 bg-[#191919] border border-[#33302D] p-5 sm:p-7">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#33302D] pb-4 mb-5">
          <div>
            <div className="font-mono text-[11px] text-[#A7A19A] uppercase tracking-wider">
              {CREATIVE_TOOLS_DATA.tag}
            </div>
            <h3 className="font-heading text-lg sm:text-xl font-bold text-[#E8E4DE] mt-0.5">
              {CREATIVE_TOOLS_DATA.title}
            </h3>
          </div>
          <span className="font-mono text-[10px] px-2.5 py-1 bg-[#101010] border border-[#33302D] text-[#A7A19A] self-start sm:self-center shrink-0 uppercase">
            Supporting Media Capabilities
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5">
          {CREATIVE_TOOLS_DATA.tools.map((tool) => (
            <motion.div
              key={tool.id}
              whileHover={prefersReducedMotion ? undefined : { y: -2 }}
              transition={{
                duration: MOTION_TOKENS.fast,
                ease: MOTION_TOKENS.ease,
              }}
              className="p-4 bg-[#101010] border border-[#33302D] hover:border-[#E87935]/50 transition-colors flex flex-col justify-between gap-2"
            >
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <span className="w-6 h-6 bg-[#191919] border border-[#33302D] flex items-center justify-center shrink-0">
                    <ToolIcon id={tool.id} />
                  </span>
                  <span className="font-heading text-sm sm:text-base font-bold text-[#E8E4DE]">
                    {tool.name}
                  </span>
                </div>
                <span
                  className={`font-mono text-[10px] px-2 py-0.5 border shrink-0 ${
                    tool.level === 'Familiar'
                      ? 'bg-[#242220] border-[#E87935]/50 text-[#F3A45B]'
                      : 'bg-[#191919] border-[#33302D] text-[#A7A19A]'
                  }`}
                >
                  {tool.name} — {tool.level}
                </span>
              </div>
              <p className="text-xs text-[#A7A19A] leading-relaxed">
                {tool.desc}
              </p>
            </motion.div>
          ))}
        </div>
      </Reveal>
    </section>
  );
}
