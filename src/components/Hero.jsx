import { motion, useReducedMotion } from 'framer-motion';
import { ArrowUpRight, MapPin } from 'lucide-react';
import {
  MOTION_TOKENS,
  createStaggerContainer,
  createFadeUpVariant,
} from '../utils/motion.jsx';
import HeroProductStage from './HeroProductStage.jsx';

export default function Hero({ scrollToSection }) {
  const prefersReducedMotion = useReducedMotion();
  const heroStaggerVariants = createStaggerContainer(0.085, 0.05);
  const heroItemVariants = createFadeUpVariant(24, MOTION_TOKENS.hero);

  return (
    <section
      id="hero"
      aria-label="Hero Introduction"
      className="relative z-10 pt-24 pb-16 sm:pt-28 sm:pb-20 md:pt-36 md:pb-28 px-4 sm:px-8 max-w-7xl mx-auto scroll-mt-16"
    >
      <motion.div
        variants={heroStaggerVariants}
        initial={prefersReducedMotion ? 'visible' : 'hidden'}
        animate="visible"
      >
        {/* Top Editorial Metadata Strip */}
        <motion.div
          variants={heroItemVariants}
          className="flex flex-wrap items-center justify-between gap-3 sm:gap-4 pb-6 sm:pb-8 mb-8 sm:mb-10 border-b border-[#33302D] font-mono text-[11px] text-[#A7A19A]"
        >
          <div className="flex items-center gap-2.5">
            <span className="w-2 h-2 bg-[#E87935] rotate-45 shrink-0" />
            <span className="tracking-[0.15em] sm:tracking-[0.2em] text-[#E8E4DE] uppercase">
              SOFTWARE DEVELOPER / PHILIPPINES
            </span>
          </div>
          <div className="flex flex-wrap items-center gap-4 sm:gap-6">
            <span className="hidden sm:inline">
              DISCIPLINE: WEB & APPLICATION SYSTEMS
            </span>
            <span className="flex items-center gap-1.5 text-[#E8E4DE]">
              <MapPin className="w-3.5 h-3.5 text-[#E87935] shrink-0" />
              <span>SORSOGON, PHILIPPINES</span>
            </span>
          </div>
        </motion.div>

        {/* Main Hero Asymmetrical Composition */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-10 items-start">
          {/* Left Column: Bold Editorial Statement */}
          <div className="lg:col-span-7 space-y-6 sm:space-y-8">
            <motion.h1
              variants={heroItemVariants}
              className="font-heading text-3xl xs:text-4xl sm:text-6xl xl:text-[68px] font-bold tracking-tight text-[#E8E4DE] leading-[1.04] sm:leading-[1.02]"
            >
              I BUILD THE SYSTEMS BEHIND THE{' '}
              <span className="text-[#E87935]">EXPERIENCE.</span>
            </motion.h1>

            <motion.p
              variants={heroItemVariants}
              className="text-[#A7A19A] text-base sm:text-xl max-w-2xl leading-relaxed font-normal"
            >
              I'm a software developer focused on turning complex workflows into
              functional, reliable digital products. I also work across video
              editing and digital media.
            </motion.p>

            {/* Primary & Secondary Identity Ledger */}
            <motion.div
              variants={heroItemVariants}
              className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1 sm:pt-2 max-w-xl"
            >
              <div className="border-l-2 border-[#E87935] pl-4 py-1">
                <div className="font-mono text-[10px] tracking-widest text-[#E87935] uppercase">
                  Primary Focus
                </div>
                <div className="font-heading text-sm font-semibold text-[#E8E4DE] mt-0.5">
                  Software, Web & Desktop Applications
                </div>
              </div>
              <div className="border-l-2 border-[#33302D] pl-4 py-1">
                <div className="font-mono text-[10px] tracking-widest text-[#A7A19A] uppercase">
                  Creative Advantage
                </div>
                <div className="font-heading text-sm font-semibold text-[#E8E4DE] mt-0.5">
                  Video Editing & Digital Media Production
                </div>
              </div>
            </motion.div>

            {/* CTAs */}
            <motion.div
              variants={heroItemVariants}
              className="flex flex-col xs:flex-row flex-wrap items-stretch xs:items-center gap-3 sm:gap-4 pt-2"
            >
              <motion.button
                type="button"
                whileHover={prefersReducedMotion ? undefined : { y: -3 }}
                whileTap={prefersReducedMotion ? undefined : { scale: 0.98 }}
                transition={{
                  duration: MOTION_TOKENS.fast,
                  ease: MOTION_TOKENS.ease,
                }}
                onClick={() => scrollToSection('work')}
                className="group inline-flex items-center justify-center gap-3 px-6 sm:px-7 py-4 bg-[#E87935] hover:bg-[#F3A45B] text-[#101010] font-mono text-xs font-semibold tracking-wider uppercase transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-[#F3A45B]"
              >
                <span>EXPLORE MY WORK</span>
                <ArrowUpRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </motion.button>

              <motion.button
                type="button"
                whileHover={prefersReducedMotion ? undefined : { y: -3 }}
                whileTap={prefersReducedMotion ? undefined : { scale: 0.98 }}
                transition={{
                  duration: MOTION_TOKENS.fast,
                  ease: MOTION_TOKENS.ease,
                }}
                onClick={() => scrollToSection('contact')}
                className="inline-flex items-center justify-center gap-3 px-6 sm:px-7 py-4 bg-[#191919] hover:bg-[#242220] text-[#E8E4DE] border border-[#33302D] hover:border-[#E87935] font-mono text-xs tracking-wider uppercase transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-[#E87935]"
              >
                <span>CONTACT ME</span>
              </motion.button>
            </motion.div>
          </div>

          {/* Right Column: Visual Product Showcase + Optional Technical Inspector */}
          <motion.div variants={heroItemVariants} className="lg:col-span-5">
            <HeroProductStage
              onExploreWork={() => scrollToSection('work')}
            />
          </motion.div>
        </div>
      </motion.div>
    </section>
  );
}

