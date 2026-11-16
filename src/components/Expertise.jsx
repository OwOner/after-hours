import { useState } from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import {
  MOTION_TOKENS,
  createStaggerContainer,
  createFadeUpVariant,
  Reveal,
} from '../utils/motion.jsx';
import { EXPERTISE_CATEGORIES } from '../data/portfolioData.js';

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

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8 items-start">
        {/* Left Column: Category Selector (Responsive grid on mobile/tablet, vertical list on desktop) */}
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
    </section>
  );
}
