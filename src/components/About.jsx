import { useState } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import {
  MOTION_TOKENS,
  createStaggerContainer,
  createFadeUpVariant,
  Reveal,
} from '../utils/motion.jsx';
import { SITE_CONFIG } from '../data/portfolioData.js';

export default function About() {
  const prefersReducedMotion = useReducedMotion();
  const [photoError, setPhotoError] = useState(false);
  const photoUrl = SITE_CONFIG.profilePhotoUrl || '/images/jp.jpg';

  return (
    <section
      id="about"
      aria-label="About Me"
      className="relative z-10 py-20 sm:py-24 md:py-32 px-4 sm:px-8 max-w-7xl mx-auto border-t border-[#33302D] scroll-mt-16"
    >
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-start">
        {/* Left Column: Title & Personal Visual Composition */}
        <Reveal className="lg:col-span-5 space-y-6">
          <div>
            <div className="font-mono text-xs tracking-[0.2em] text-[#E87935] uppercase mb-3">
              03 // Profile
            </div>
            <h2 className="font-heading text-3xl sm:text-5xl font-bold tracking-tight text-[#E8E4DE]">
              BEHIND THE CODE
            </h2>
          </div>

          {/* Restrained Dark Editorial Portrait */}
          <motion.div
            whileHover={prefersReducedMotion ? undefined : { y: -3 }}
            transition={{
              duration: MOTION_TOKENS.standard,
              ease: MOTION_TOKENS.ease,
            }}
            className="group relative bg-[#191919] border border-[#33302D] hover:border-[#E87935]/50 transition-colors p-3.5 sm:p-4 shadow-2xl"
          >
            {/* Subtle Technical Corner Accents */}
            <span className="pointer-events-none absolute top-0 left-0 w-2.5 h-2.5 border-t-2 border-l-2 border-[#E87935] opacity-60 group-hover:opacity-100 transition-opacity" />
            <span className="pointer-events-none absolute top-0 right-0 w-2.5 h-2.5 border-t-2 border-r-2 border-[#E87935] opacity-60 group-hover:opacity-100 transition-opacity" />
            <span className="pointer-events-none absolute bottom-0 left-0 w-2.5 h-2.5 border-b-2 border-l-2 border-[#E87935] opacity-60 group-hover:opacity-100 transition-opacity" />
            <span className="pointer-events-none absolute bottom-0 right-0 w-2.5 h-2.5 border-b-2 border-r-2 border-[#E87935] opacity-60 group-hover:opacity-100 transition-opacity" />

            {/* Top Specification Strip */}
            <div className="flex items-center justify-between font-mono text-[10px] text-[#A7A19A] border-b border-[#33302D] pb-2.5 mb-3">
              <span className="tracking-wider text-[#E87935]">PROFILE // PORTRAIT</span>
              <span className="text-[#A7A19A]">JP.DEV</span>
            </div>

            {/* Portrait Photo Container */}
            {!photoError ? (
              <div className="relative aspect-[4/5] w-full bg-[#101010] border border-[#33302D] overflow-hidden">
                <img
                  src={photoUrl}
                  alt="John Paul - Software Developer"
                  loading="lazy"
                  decoding="async"
                  onError={() => setPhotoError(true)}
                  className="w-full h-full object-cover object-top transition-transform duration-500 group-hover:scale-[1.02]"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#101010]/85 via-transparent to-transparent pointer-events-none" />

                {/* In-Frame Status Tag */}
                <div className="absolute bottom-2.5 left-2.5 right-2.5 flex items-center justify-between font-mono text-[9px] text-[#E8E4DE] bg-[#101010]/85 backdrop-blur-sm border border-[#33302D] px-2.5 py-1.5">
                  <span className="text-[#F3A45B] tracking-wider uppercase">JOHN PAUL</span>
                  <span className="text-[#A7A19A]">BSCS • SORSOGON</span>
                </div>
              </div>
            ) : (
              <div className="aspect-[4/3] bg-[#101010] border border-[#33302D] p-5 sm:p-6 flex flex-col justify-between relative overflow-hidden">
                <div className="flex justify-between items-center font-mono text-[10px] text-[#A7A19A]">
                  <span>DEVELOPER MONOGRAM</span>
                  <span className="text-[#E87935]">JP.DEV</span>
                </div>

                {/* Minimalist Monogram Emblem */}
                <div className="my-auto flex flex-col items-center justify-center text-center py-4">
                  <motion.div
                    whileHover={prefersReducedMotion ? undefined : { rotate: 135 }}
                    transition={{ duration: 0.45, ease: MOTION_TOKENS.ease }}
                    className="w-14 h-14 sm:w-16 sm:h-16 border border-[#E87935]/60 bg-[#191919] flex items-center justify-center rotate-45 mb-4"
                  >
                    <span className="font-heading text-base sm:text-lg font-bold text-[#E8E4DE] -rotate-45">
                      JP
                    </span>
                  </motion.div>
                  <span className="font-mono text-[10px] sm:text-[11px] text-[#E8E4DE] tracking-widest uppercase">
                    Software & Multimedia Developer
                  </span>
                </div>

                <div className="flex justify-between font-mono text-[10px] text-[#A7A19A] border-t border-[#33302D] pt-3">
                  <span>SORSOGON, PH</span>
                  <span className="text-[#F3A45B]">WEB • DESKTOP • MEDIA</span>
                </div>
              </div>
            )}

            {/* Bottom Metadata Ledger */}
            <div className="flex justify-between items-center font-mono text-[10px] text-[#A7A19A] pt-3 mt-3 border-t border-[#33302D]">
              <span className="text-[#E8E4DE]">SOFTWARE & MULTIMEDIA</span>
              <span className="text-[#E87935]">AFTERHOURS</span>
            </div>
          </motion.div>
        </Reveal>

        {/* Right Column: Editorial Statement & Metadata */}
        <Reveal
          className="lg:col-span-7 space-y-6 sm:space-y-8 lg:pt-10"
          delay={0.1}
        >
          <blockquote className="font-heading text-lg sm:text-2xl text-[#E8E4DE] leading-relaxed border-l-2 border-[#E87935] pl-4 sm:pl-6">
            "I'm interested in building software that solves real problems. My
            experience spans web and desktop application development, database
            design, and digital product workflows. I also enjoy the creative
            side of technology, particularly video editing and digital content."
          </blockquote>

          <motion.div
            variants={createStaggerContainer(0.08)}
            initial={prefersReducedMotion ? 'visible' : 'hidden'}
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
            className="grid grid-cols-1 sm:grid-cols-3 gap-3.5 sm:gap-4 pt-2 sm:pt-4"
          >
            <motion.div
              variants={createFadeUpVariant(18, 0.5)}
              whileHover={prefersReducedMotion ? undefined : { y: -3 }}
              className="p-4 sm:p-5 bg-[#191919] border border-[#33302D] hover:border-[#E87935]/50 transition-colors"
            >
              <div className="font-mono text-[10px] tracking-widest text-[#A7A19A] uppercase">
                Location
              </div>
              <div className="font-heading text-base font-bold text-[#E8E4DE] mt-1.5">
                Sorsogon, Philippines
              </div>
            </motion.div>

            <motion.div
              variants={createFadeUpVariant(18, 0.5)}
              whileHover={prefersReducedMotion ? undefined : { y: -3 }}
              className="p-4 sm:p-5 bg-[#191919] border border-[#33302D] hover:border-[#E87935]/50 transition-colors"
            >
              <div className="font-mono text-[10px] tracking-widest text-[#A7A19A] uppercase">
                Field
              </div>
              <div className="font-heading text-base font-bold text-[#E87935] mt-1.5">
                Software Development
              </div>
            </motion.div>

            <motion.div
              variants={createFadeUpVariant(18, 0.5)}
              whileHover={prefersReducedMotion ? undefined : { y: -3 }}
              className="p-4 sm:p-5 bg-[#191919] border border-[#33302D] hover:border-[#E87935]/50 transition-colors"
            >
              <div className="font-mono text-[10px] tracking-widest text-[#A7A19A] uppercase">
                Interests
              </div>
              <div className="font-heading text-sm font-bold text-[#E8E4DE] mt-1.5">
                Software Engineering, UI/UX, Digital Creativity
              </div>
            </motion.div>
          </motion.div>
        </Reveal>
      </div>
    </section>
  );
}

