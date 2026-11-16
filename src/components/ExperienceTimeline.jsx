import { motion, useReducedMotion } from 'framer-motion';
import { MOTION_TOKENS, Reveal } from '../utils/motion.jsx';
import { TIMELINE_DATA } from '../data/portfolioData.js';

export default function ExperienceTimeline() {
  const prefersReducedMotion = useReducedMotion();

  return (
    <section
      id="experience"
      aria-label="Experience and Background"
      className="relative z-10 py-20 sm:py-24 md:py-32 px-4 sm:px-8 max-w-7xl mx-auto border-t border-[#33302D] scroll-mt-16"
    >
      <Reveal className="mb-10 sm:mb-14">
        <div className="font-mono text-xs tracking-[0.2em] text-[#E87935] uppercase mb-3">
          04 // Background
        </div>
        <h2 className="font-heading text-3xl sm:text-5xl font-bold tracking-tight text-[#E8E4DE]">
          EXPERIENCE & BACKGROUND
        </h2>
        <p className="text-[#A7A19A] mt-2 text-sm sm:text-base max-w-2xl">
          Core software engineering responsibilities, multimedia capabilities,
          and technical foundation.
        </p>
      </Reveal>

      <div className="relative divide-y divide-[#33302D] border-y border-[#33302D]">
        {/* Progressive Vertical Accent Connector Line */}
        <motion.div
          initial={prefersReducedMotion ? { scaleY: 1 } : { scaleY: 0 }}
          whileInView={{ scaleY: 1 }}
          viewport={{ once: true, amount: 0.15 }}
          transition={{ duration: 1.1, ease: MOTION_TOKENS.ease }}
          className="hidden lg:block absolute left-0 top-0 bottom-0 w-[2px] bg-gradient-to-b from-[#E87935] via-[#E87935]/40 to-transparent origin-top pointer-events-none"
        />

        {TIMELINE_DATA.map((item, idx) => (
          <Reveal
            key={idx}
            delay={idx * 0.08}
            className="py-8 sm:py-10 lg:pl-6 grid grid-cols-1 lg:grid-cols-12 gap-4 sm:gap-6 items-start"
          >
            <div className="lg:col-span-4 space-y-1">
              <div className="font-mono text-xs text-[#E87935] uppercase">
                {item.category}
              </div>
              <div className="font-mono text-xs text-[#A7A19A]">
                {item.period}
              </div>
            </div>

            <div className="lg:col-span-8 space-y-3.5 sm:space-y-4">
              <div>
                <h3 className="font-heading text-xl sm:text-2xl font-bold text-[#E8E4DE]">
                  {item.role}
                </h3>
                <div className="font-mono text-xs text-[#A7A19A] mt-1">
                  {item.org}
                </div>
              </div>

              <p className="text-sm sm:text-base text-[#E8E4DE]/90 leading-relaxed">
                {item.summary}
              </p>

              <ul className="space-y-2 pt-1">
                {item.highlights.map((bullet, bIdx) => (
                  <li
                    key={bIdx}
                    className="flex items-start gap-3 text-xs sm:text-sm text-[#A7A19A]"
                  >
                    <span className="text-[#E87935] font-mono">›</span>
                    <span>{bullet}</span>
                  </li>
                ))}
              </ul>
            </div>
          </Reveal>
        ))}
      </div>
    </section>
  );
}

