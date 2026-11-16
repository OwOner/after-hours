import { motion, useReducedMotion } from 'framer-motion';
import { Mail, FileText, Github, Linkedin, ArrowUpRight } from 'lucide-react';
import {
  MOTION_TOKENS,
  createStaggerContainer,
  createFadeUpVariant,
  Reveal,
} from '../utils/motion.jsx';
import { SITE_CONFIG } from '../data/portfolioData.js';

export default function Contact({
  onOpenContactModal,
  onTriggerResumeDownload,
  onNotifyUnconfiguredLink,
}) {
  const prefersReducedMotion = useReducedMotion();

  const handleSocialChannelClick = (platform, url) => {
    if (url) return; // Handled natively by <a> when configured
    onNotifyUnconfiguredLink?.(platform);
  };

  return (
    <section
      id="contact"
      aria-label="Contact"
      className="relative z-10 py-20 sm:py-24 md:py-32 px-4 sm:px-8 max-w-7xl mx-auto border-t border-[#33302D] scroll-mt-16"
    >
      <Reveal className="bg-[#191919] border border-[#33302D] p-6 sm:p-12 lg:p-16">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center">
          <div className="lg:col-span-7 space-y-5 sm:space-y-6">
            <div className="font-mono text-xs tracking-[0.2em] text-[#E87935] uppercase">
              06 // Contact
            </div>
            <h2 className="font-heading text-3xl xs:text-4xl sm:text-6xl font-bold tracking-tight text-[#E8E4DE] leading-[1.05]">
              LET'S BUILD SOMETHING{' '}
              <span className="text-[#E87935]">USEFUL.</span>
            </h2>
            <p className="text-[#A7A19A] text-base sm:text-lg max-w-xl leading-relaxed">
              Open for software development inquiries, web and desktop
              application projects, and creative collaborations.
            </p>

            <div className="flex flex-col xs:flex-row flex-wrap items-stretch xs:items-center gap-3 sm:gap-4 pt-2">
              <motion.button
                type="button"
                whileHover={prefersReducedMotion ? undefined : { y: -3 }}
                whileTap={prefersReducedMotion ? undefined : { scale: 0.98 }}
                transition={{
                  duration: MOTION_TOKENS.fast,
                  ease: MOTION_TOKENS.ease,
                }}
                onClick={onOpenContactModal}
                className="inline-flex items-center justify-center gap-3 px-6 sm:px-7 py-4 bg-[#E87935] hover:bg-[#F3A45B] text-[#101010] font-mono text-xs font-semibold tracking-wider uppercase transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-[#F3A45B]"
              >
                <Mail className="w-4 h-4 shrink-0" />
                <span>CONTACT ME</span>
              </motion.button>

              <motion.button
                type="button"
                whileHover={prefersReducedMotion ? undefined : { y: -3 }}
                whileTap={prefersReducedMotion ? undefined : { scale: 0.98 }}
                transition={{
                  duration: MOTION_TOKENS.fast,
                  ease: MOTION_TOKENS.ease,
                }}
                onClick={onTriggerResumeDownload}
                className="inline-flex items-center justify-center gap-3 px-6 sm:px-7 py-4 bg-[#101010] hover:bg-[#242220] text-[#E8E4DE] border border-[#33302D] hover:border-[#E87935] font-mono text-xs tracking-wider uppercase transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-[#E87935]"
              >
                <FileText className="w-4 h-4 text-[#E87935] shrink-0" />
                <span>DOWNLOAD RESUME</span>
              </motion.button>
            </div>
          </div>

          {/* Direct Contact Channels */}
          <motion.div
            variants={createStaggerContainer(0.08)}
            initial={prefersReducedMotion ? 'visible' : 'hidden'}
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
            className="lg:col-span-5 space-y-3"
          >
            <motion.button
              type="button"
              variants={createFadeUpVariant(16, 0.45)}
              whileHover={prefersReducedMotion ? undefined : { x: 4 }}
              transition={{
                duration: MOTION_TOKENS.fast,
                ease: MOTION_TOKENS.ease,
              }}
              onClick={onOpenContactModal}
              className="group w-full p-4 bg-[#101010] hover:bg-[#242220] border border-[#33302D] hover:border-[#E87935] flex items-center justify-between gap-3 transition-colors text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-[#E87935]"
            >
              <div className="flex items-center gap-3.5 min-w-0">
                <Mail className="w-4 h-4 text-[#E87935] shrink-0" />
                <div className="min-w-0">
                  <div className="font-mono text-[10px] text-[#A7A19A]">
                    DIRECT INQUIRY
                  </div>
                  <div className="font-mono text-xs sm:text-sm text-[#E8E4DE] truncate">
                    Send a message via workspace form
                  </div>
                </div>
              </div>
              <ArrowUpRight className="w-4 h-4 text-[#E87935] shrink-0 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </motion.button>

            {SITE_CONFIG.githubUrl ? (
              <motion.a
                href={SITE_CONFIG.githubUrl}
                target="_blank"
                rel="noopener noreferrer"
                variants={createFadeUpVariant(16, 0.45)}
                whileHover={prefersReducedMotion ? undefined : { x: 4 }}
                transition={{
                  duration: MOTION_TOKENS.fast,
                  ease: MOTION_TOKENS.ease,
                }}
                className="group w-full p-4 bg-[#101010] hover:bg-[#242220] border border-[#33302D] hover:border-[#E87935] transition-colors flex items-center justify-between gap-3 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#E87935]"
              >
                <div className="flex items-center gap-3.5 min-w-0">
                  <Github className="w-4 h-4 text-[#E87935] shrink-0" />
                  <div className="min-w-0">
                    <div className="font-mono text-[10px] text-[#A7A19A]">
                      GITHUB
                    </div>
                    <div className="font-mono text-xs sm:text-sm text-[#E8E4DE] truncate">
                      Source repositories & code samples
                    </div>
                  </div>
                </div>
                <ArrowUpRight className="w-4 h-4 text-[#E87935] shrink-0 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </motion.a>
            ) : (
              <motion.button
                type="button"
                variants={createFadeUpVariant(16, 0.45)}
                whileHover={prefersReducedMotion ? undefined : { x: 4 }}
                transition={{
                  duration: MOTION_TOKENS.fast,
                  ease: MOTION_TOKENS.ease,
                }}
                onClick={() => handleSocialChannelClick('GitHub', '')}
                className="group w-full p-4 bg-[#101010] hover:bg-[#242220] border border-[#33302D] hover:border-[#E87935]/60 transition-colors flex items-center justify-between gap-3 text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-[#E87935]"
              >
                <div className="flex items-center gap-3.5 min-w-0">
                  <Github className="w-4 h-4 text-[#E87935] shrink-0" />
                  <div className="min-w-0">
                    <div className="font-mono text-[10px] text-[#A7A19A]">
                      GITHUB
                    </div>
                    <div className="font-mono text-xs sm:text-sm text-[#E8E4DE] truncate">
                      Source repositories & code samples
                    </div>
                  </div>
                </div>
                <ArrowUpRight className="w-4 h-4 text-[#A7A19A] group-hover:text-[#E87935] shrink-0 transition-colors" />
              </motion.button>
            )}

            {SITE_CONFIG.linkedinUrl ? (
              <motion.a
                href={SITE_CONFIG.linkedinUrl}
                target="_blank"
                rel="noopener noreferrer"
                variants={createFadeUpVariant(16, 0.45)}
                whileHover={prefersReducedMotion ? undefined : { x: 4 }}
                transition={{
                  duration: MOTION_TOKENS.fast,
                  ease: MOTION_TOKENS.ease,
                }}
                className="group w-full p-4 bg-[#101010] hover:bg-[#242220] border border-[#33302D] hover:border-[#E87935] transition-colors flex items-center justify-between gap-3 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#E87935]"
              >
                <div className="flex items-center gap-3.5 min-w-0">
                  <Linkedin className="w-4 h-4 text-[#E87935] shrink-0" />
                  <div className="min-w-0">
                    <div className="font-mono text-[10px] text-[#A7A19A]">
                      LINKEDIN
                    </div>
                    <div className="font-mono text-xs sm:text-sm text-[#E8E4DE] truncate">
                      Professional network & profile
                    </div>
                  </div>
                </div>
                <ArrowUpRight className="w-4 h-4 text-[#E87935] shrink-0 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </motion.a>
            ) : (
              <motion.button
                type="button"
                variants={createFadeUpVariant(16, 0.45)}
                whileHover={prefersReducedMotion ? undefined : { x: 4 }}
                transition={{
                  duration: MOTION_TOKENS.fast,
                  ease: MOTION_TOKENS.ease,
                }}
                onClick={() => handleSocialChannelClick('LinkedIn', '')}
                className="group w-full p-4 bg-[#101010] hover:bg-[#242220] border border-[#33302D] hover:border-[#E87935]/60 transition-colors flex items-center justify-between gap-3 text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-[#E87935]"
              >
                <div className="flex items-center gap-3.5 min-w-0">
                  <Linkedin className="w-4 h-4 text-[#E87935] shrink-0" />
                  <div className="min-w-0">
                    <div className="font-mono text-[10px] text-[#A7A19A]">
                      LINKEDIN
                    </div>
                    <div className="font-mono text-xs sm:text-sm text-[#E8E4DE] truncate">
                      Professional network & profile
                    </div>
                  </div>
                </div>
                <ArrowUpRight className="w-4 h-4 text-[#A7A19A] group-hover:text-[#E87935] shrink-0 transition-colors" />
              </motion.button>
            )}
          </motion.div>
        </div>
      </Reveal>
    </section>
  );
}

