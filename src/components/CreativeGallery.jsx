import { motion, useReducedMotion } from 'framer-motion';
import { Video, Play } from 'lucide-react';
import {
  MOTION_TOKENS,
  createStaggerContainer,
  createFadeUpVariant,
  Reveal,
} from '../utils/motion.jsx';
import { CREATIVE_WORKS } from '../data/portfolioData.js';

export default function CreativeGallery({ onSelectVideo }) {
  const prefersReducedMotion = useReducedMotion();

  return (
    <section
      id="creative"
      aria-label="Creative and Digital Media Work"
      className="relative z-10 py-20 sm:py-24 md:py-32 px-4 sm:px-8 max-w-7xl mx-auto border-t border-[#33302D] scroll-mt-16"
    >
      <Reveal className="bg-[#191919] border border-[#33302D] p-5 sm:p-10 md:p-12">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 sm:mb-12 gap-5 sm:gap-6 border-b border-[#33302D] pb-6 sm:pb-8">
          <div>
            <div className="inline-flex items-center gap-2 font-mono text-xs text-[#F3A45B] uppercase mb-3">
              <Video className="w-3.5 h-3.5 text-[#E87935]" />
              <span>05 // Secondary Discipline</span>
            </div>
            <h2 className="font-heading text-3xl sm:text-5xl font-bold tracking-tight text-[#E8E4DE]">
              BEYOND DEVELOPMENT
            </h2>
            <p className="text-[#A7A19A] mt-2 text-sm sm:text-base">
              A creative perspective on digital experiences.
            </p>
          </div>
          <div className="font-mono text-[11px] sm:text-xs text-[#A7A19A] bg-[#101010] border border-[#33302D] px-3.5 sm:px-4 py-2.5 self-start md:self-end">
            VIDEO EDITING • CONTENT MANAGEMENT • DIGITAL MEDIA
          </div>
        </div>

        <motion.div
          variants={createStaggerContainer(0.08)}
          initial={prefersReducedMotion ? 'visible' : 'hidden'}
          whileInView="visible"
          viewport={{ once: true, amount: 0.15 }}
          className="grid grid-cols-1 md:grid-cols-2 gap-5 sm:gap-6"
        >
          {CREATIVE_WORKS.map((item) => (
            <motion.button
              key={item.id}
              type="button"
              variants={createFadeUpVariant(20, 0.55)}
              whileHover={
                prefersReducedMotion ? undefined : { y: MOTION_TOKENS.hoverY }
              }
              transition={{
                duration: MOTION_TOKENS.standard,
                ease: MOTION_TOKENS.ease,
              }}
              onClick={() => onSelectVideo(item)}
              aria-label={`Open video preview for ${item.title}`}
              className="group w-full text-left cursor-pointer bg-[#101010] border border-[#33302D] hover:border-[#E87935] transition-colors flex flex-col justify-between overflow-hidden focus:outline-none focus-visible:ring-2 focus-visible:ring-[#E87935]"
            >
              {/* Cinematic Screening Frame */}
              <div className="w-full h-44 sm:h-56 bg-[#141312] border-b border-[#33302D] overflow-hidden relative">
                <motion.div
                  whileHover={
                    prefersReducedMotion ? undefined : { scale: 1.025 }
                  }
                  transition={{ duration: 0.4, ease: MOTION_TOKENS.ease }}
                  className="w-full h-full p-4 sm:p-5 flex flex-col justify-between relative"
                >
                  <div className="flex items-center justify-between font-mono text-[10px] text-[#A7A19A]">
                    <span className="text-[#E87935]">REEL {item.id}</span>
                    <span>{item.aspect}</span>
                  </div>

                  {/* Play Trigger */}
                  <div className="my-auto self-center">
                    <motion.div
                      whileHover={
                        prefersReducedMotion ? undefined : { scale: 1.08 }
                      }
                      transition={{
                        duration: MOTION_TOKENS.fast,
                        ease: MOTION_TOKENS.ease,
                      }}
                      className="w-12 h-12 rounded-full bg-[#191919] border border-[#E87935] flex items-center justify-center text-[#E87935] group-hover:bg-[#E87935] group-hover:text-[#101010] transition-colors"
                    >
                      <Play className="w-5 h-5 fill-current ml-0.5" />
                    </motion.div>
                  </div>

                  <div className="flex items-center justify-between font-mono text-[10px] text-[#A7A19A] gap-2">
                    <span className="truncate">{item.category}</span>
                    <span className="text-[#F3A45B] shrink-0">
                      {item.duration}
                    </span>
                  </div>
                </motion.div>
              </div>

              <div className="p-5 sm:p-6">
                <h3 className="font-heading text-lg sm:text-xl font-bold text-[#E8E4DE] group-hover:text-[#E87935] transition-colors">
                  {item.title}
                </h3>
                <p className="text-xs sm:text-sm text-[#A7A19A] mt-2 leading-relaxed">
                  {item.description}
                </p>
              </div>
            </motion.button>
          ))}
        </motion.div>
      </Reveal>
    </section>
  );
}

