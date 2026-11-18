import { motion, useReducedMotion } from 'framer-motion';
import { ArrowUpRight, Eye, Github, ExternalLink } from 'lucide-react';
import { MOTION_TOKENS, Reveal } from '../utils/motion.jsx';
import { PROJECTS } from '../data/portfolioData.js';
import ProjectStageCanvas from './ProjectStageCanvas.jsx';

export default function ProjectShowcase({ onSelectProject }) {
  const prefersReducedMotion = useReducedMotion();
  const visibleProjects = PROJECTS.filter((project) => project.visible !== false);

  return (
    <section
      id="work"
      aria-label="Selected Work"
      className="relative z-10 py-20 sm:py-28 md:py-36 px-4 sm:px-8 max-w-7xl mx-auto border-t border-[#33302D] scroll-mt-16"
    >
      {/* Section Header */}
      <Reveal className="flex flex-col md:flex-row md:items-end justify-between mb-14 sm:mb-20 gap-4 sm:gap-6">
        <div>
          <div className="font-mono text-xs tracking-[0.2em] text-[#E87935] uppercase mb-3">
            01 // Selected Work
          </div>
          <h2 className="font-heading text-3xl sm:text-5xl md:text-6xl font-bold tracking-tight text-[#E8E4DE]">
            SELECTED WORK
          </h2>
        </div>
        <p className="text-[#A7A19A] text-base sm:text-lg max-w-md">
          Completed applications and digital platforms I've built, presented with
          application screenshots, architecture breakdowns, and system specifications.
        </p>
      </Reveal>

      {/* Full-Width Editorial Showcases with Generous Breathing Room */}
      <div className="space-y-20 sm:space-y-28 md:space-y-36">
        {visibleProjects.map((project, index) => {
          const isScreenshotProject = Boolean(project.screenshotUrl);
          const isEven = index % 2 === 1;
          const displayId = String(index + 1).padStart(2, '0');
          return (
            <Reveal key={project.id} amount={0.12}>
              <motion.article
                whileHover={
                  prefersReducedMotion ? undefined : { y: MOTION_TOKENS.hoverY }
                }
                transition={{
                  duration: MOTION_TOKENS.standard,
                  ease: MOTION_TOKENS.ease,
                }}
                className="group relative border-t border-[#33302D] pt-10 sm:pt-14 md:pt-16"
              >
                {/* Top Project Metadata Bar */}
                <div className="flex flex-wrap items-center justify-between gap-3 sm:gap-4 mb-6 sm:mb-8">
                  <div className="flex flex-wrap items-center gap-2.5 sm:gap-3">
                    <span className="font-mono text-xs px-3 py-1 bg-[#E87935] text-[#101010] font-bold tracking-wider uppercase">
                      PROJECT {displayId}
                    </span>
                    <span className="font-mono text-xs text-[#F3A45B] uppercase tracking-wider">
                      {project.tier}
                    </span>
                    {project.cafeSuite && (
                      <span className="font-mono text-[10px] px-2.5 py-0.5 bg-[#161514] border border-[#33302D] text-[#A7A19A] uppercase tracking-wider">
                        151 STREET CAFÉ SUITE
                      </span>
                    )}
                  </div>
                  <span className="font-mono text-[11px] sm:text-xs px-3 py-1 bg-[#191919] border border-[#33302D] group-hover:border-[#E87935]/40 transition-colors text-[#A7A19A]">
                    Status: {project.status}
                  </span>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 sm:gap-10 lg:gap-14 items-start">
                  {/* Project Narrative & Storytelling Column */}
                  <div
                    className={`lg:col-span-5 space-y-5 sm:space-y-6 ${isEven ? 'lg:order-2' : 'lg:order-1'
                      }`}
                  >
                    <div>
                      <div className="font-mono text-xs tracking-widest text-[#A7A19A] uppercase mb-2">
                        {project.category}
                      </div>
                      <h3 className="font-heading text-3xl sm:text-5xl font-bold text-[#E8E4DE] group-hover:text-[#E87935] transition-colors">
                        {project.title}
                      </h3>
                    </div>

                    <p className="text-[#E8E4DE] text-base sm:text-lg leading-relaxed font-medium">
                      {project.description}
                    </p>

                    <p className="text-[#A7A19A] text-sm sm:text-base leading-relaxed">
                      {project.story}
                    </p>

                    {/* Key Implementation Highlights */}
                    <div className="space-y-2 pt-2 border-t border-[#33302D]/80">
                      <div className="font-mono text-[10px] tracking-widest text-[#E87935] uppercase">
                        System Highlights
                      </div>
                      <ul className="space-y-1.5">
                        {(project.highlights || project.architectureNotes).map(
                          (highlight, hIdx) => (
                            <li
                              key={hIdx}
                              className="text-xs sm:text-sm text-[#A7A19A] flex items-start gap-2"
                            >
                              <span className="text-[#E87935] font-mono">›</span>
                              <span>{highlight}</span>
                            </li>
                          ),
                        )}
                      </ul>
                    </div>

                    {/* Technology Stack */}
                    <div className="space-y-2 pt-2">
                      <div className="font-mono text-[10px] tracking-widest text-[#A7A19A] uppercase">
                        Technology Stack
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {project.technologies.map((tech) => (
                          <span
                            key={tech}
                            className="font-mono text-xs px-3 py-1.5 bg-[#191919] border border-[#33302D] group-hover:border-[#E87935]/40 transition-colors text-[#E8E4DE]"
                          >
                            {tech}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Case Study Trigger & Confirmed External Links */}
                    <div className="pt-3 sm:pt-4 flex flex-wrap items-center gap-3">
                      <motion.button
                        type="button"
                        whileHover={prefersReducedMotion ? undefined : { y: -2 }}
                        whileTap={
                          prefersReducedMotion ? undefined : { scale: 0.98 }
                        }
                        transition={{
                          duration: MOTION_TOKENS.fast,
                          ease: MOTION_TOKENS.ease,
                        }}
                        onClick={() => onSelectProject(project)}
                        className="group/btn inline-flex items-center gap-3 px-6 py-3.5 bg-[#191919] hover:bg-[#E87935] text-[#E8E4DE] hover:text-[#101010] border border-[#33302D] hover:border-[#E87935] font-mono text-xs font-semibold tracking-wider uppercase transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-[#E87935]"
                      >
                        <Eye className="w-4 h-4" />
                        <span>Inspect Case Study</span>
                        <ArrowUpRight className="w-4 h-4 transition-transform duration-200 group-hover/btn:translate-x-0.5 group-hover/btn:-translate-y-0.5" />
                      </motion.button>

                      {Boolean(project.demoUrl) && (
                        <a
                          href={project.demoUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-2 px-4 py-3.5 bg-[#101010] hover:bg-[#242220] text-[#E8E4DE] border border-[#33302D] hover:border-[#E87935] font-mono text-xs uppercase transition-colors"
                        >
                          <ExternalLink className="w-3.5 h-3.5 text-[#E87935]" />
                          <span>Live Demo</span>
                        </a>
                      )}

                      {Boolean(project.repoUrl) && (
                        <a
                          href={project.repoUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-2 px-4 py-3.5 bg-[#101010] hover:bg-[#242220] text-[#E8E4DE] border border-[#33302D] hover:border-[#E87935] font-mono text-xs uppercase transition-colors"
                        >
                          <Github className="w-3.5 h-3.5 text-[#E87935]" />
                          <span>Source</span>
                        </a>
                      )}
                    </div>
                  </div>

                  {/* Large Visual Composition Column */}
                  <div
                    role="button"
                    tabIndex={0}
                    aria-label={`Open case study for ${project.title}`}
                    onClick={() => onSelectProject(project)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault();
                        onSelectProject(project);
                      }
                    }}
                    className={`lg:col-span-7 cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-[#E87935] ${isEven ? 'lg:order-1' : 'lg:order-2'
                      }`}
                  >
                    <div className="relative bg-[#191919] border border-[#33302D] group-hover:border-[#E87935]/70 p-2.5 sm:p-4 transition-colors duration-300 shadow-2xl">
                      {/* Subtle Corner Accents */}
                      <span className="pointer-events-none absolute top-0 left-0 w-2.5 h-2.5 border-t-2 border-l-2 border-[#E87935] opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                      <span className="pointer-events-none absolute top-0 right-0 w-2.5 h-2.5 border-t-2 border-r-2 border-[#E87935] opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                      <span className="pointer-events-none absolute bottom-0 left-0 w-2.5 h-2.5 border-b-2 border-l-2 border-[#E87935] opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                      <span className="pointer-events-none absolute bottom-0 right-0 w-2.5 h-2.5 border-b-2 border-r-2 border-[#E87935] opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                      <div
                        className={`${isScreenshotProject
                          ? 'min-h-[340px] sm:min-h-[420px]'
                          : 'min-h-[300px] sm:min-h-[380px]'
                          } w-full border border-[#33302D] overflow-hidden flex flex-col`}
                      >
                        <motion.div
                          whileHover={
                            prefersReducedMotion ? undefined : { scale: 1.015 }
                          }
                          transition={{
                            duration: 0.45,
                            ease: MOTION_TOKENS.ease,
                          }}
                          className="w-full h-full flex-1 flex flex-col"
                        >
                          <ProjectStageCanvas
                            type={project.previewType}
                            interactive
                            previewLabel={project.previewLabel}
                            screenshotUrl={project.screenshotUrl}
                            screenshotAlt={project.screenshotAlt}
                          />
                        </motion.div>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.article>
            </Reveal>
          );
        })}
      </div>
    </section>
  );
}

