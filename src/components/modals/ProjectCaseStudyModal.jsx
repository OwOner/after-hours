import { useRef } from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import { X, ExternalLink, Github } from 'lucide-react';
import {
  MODAL_OVERLAY_VARIANTS,
  MODAL_PANEL_VARIANTS,
} from '../../utils/motion.jsx';
import { useModalAccessibility } from '../../hooks/useModalAccessibility.js';
import ProjectStageCanvas from '../ProjectStageCanvas.jsx';

export default function ProjectCaseStudyModal({ project, onClose }) {
  const prefersReducedMotion = useReducedMotion();
  const closeButtonRef = useRef(null);

  const panelRef = useModalAccessibility({
    isOpen: Boolean(project),
    onClose,
    initialFocusRef: closeButtonRef,
  });

  return (
    <AnimatePresence>
      {project && (
        <motion.div
          key="project-modal-overlay"
          variants={MODAL_OVERLAY_VARIANTS}
          initial="hidden"
          animate="visible"
          exit="exit"
          onClick={onClose}
          className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 overflow-y-auto"
        >
          <motion.div
            ref={panelRef}
            role="dialog"
            aria-modal="true"
            aria-labelledby="case-study-modal-title"
            variants={MODAL_PANEL_VARIANTS}
            initial="hidden"
            animate="visible"
            exit="exit"
            onClick={(e) => e.stopPropagation()}
            className="bg-[#191919] border border-[#33302D] max-w-3xl w-full max-h-[90vh] flex flex-col overflow-hidden shadow-2xl my-auto"
          >
            {/* Sticky Header */}
            <div className="flex items-center justify-between gap-2 px-4 sm:px-6 py-3.5 sm:py-4 bg-[#101010] border-b border-[#33302D] shrink-0">
              <div className="flex flex-wrap items-center gap-2 sm:gap-3 font-mono text-xs min-w-0">
                <span className="text-[#E87935]">
                  {`CASE STUDY // ${project.id}`}
                </span>
                <span className="text-[#A7A19A] truncate">
                  {project.category}
                </span>
              </div>
              <button
                ref={closeButtonRef}
                type="button"
                onClick={onClose}
                aria-label="Close case study modal"
                className="min-w-[36px] min-h-[36px] flex items-center justify-center p-1 text-[#A7A19A] hover:text-[#E8E4DE] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#E87935]"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Scrollable Modal Body */}
            <div className="overflow-y-auto flex-1">
              <div className="min-h-[260px] sm:min-h-[320px] border-b border-[#33302D]">
                <ProjectStageCanvas
                  type={project.previewType}
                  interactive
                  previewLabel={project.previewLabel}
                  screenshotUrl={project.screenshotUrl}
                  screenshotAlt={project.screenshotAlt}
                />
              </div>

              <div className="p-5 sm:p-8 space-y-5 sm:space-y-6">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <h3
                    id="case-study-modal-title"
                    className="font-heading text-2xl sm:text-3xl font-bold text-[#E8E4DE]"
                  >
                    {project.title}
                  </h3>
                  <span className="font-mono text-xs px-3 py-1 bg-[#242220] border border-[#33302D] text-[#F3A45B]">
                    Status: {project.status}
                  </span>
                </div>

                <p className="text-[#E8E4DE] text-sm sm:text-base leading-relaxed">
                  {project.story}
                </p>

                <p className="text-[#A7A19A] text-sm leading-relaxed">
                  {project.overview}
                </p>

                <div className="space-y-2">
                  <div className="font-mono text-[10px] text-[#E87935] uppercase tracking-wider">
                    Architecture & Implementation Notes
                  </div>
                  <ul className="space-y-2">
                    {project.architectureNotes.map((note, i) => (
                      <li
                        key={i}
                        className="text-xs sm:text-sm text-[#A7A19A] flex items-start gap-2.5"
                      >
                        <span className="text-[#E87935] font-mono">›</span>
                        <span>{note}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div>
                  <div className="font-mono text-[10px] text-[#A7A19A] uppercase mb-2">
                    Technologies Used
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {project.technologies.map((t) => (
                      <span
                        key={t}
                        className="font-mono text-xs px-3 py-1 bg-[#101010] border border-[#33302D] text-[#E8E4DE]"
                      >
                        {t}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="pt-4 border-t border-[#33302D] flex flex-wrap items-center justify-between gap-3">
                  <div className="flex flex-wrap items-center gap-2">
                    {project.demoUrl && (
                      <a
                        href={project.demoUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 px-4 py-2.5 bg-[#101010] hover:bg-[#242220] border border-[#33302D] hover:border-[#E87935] font-mono text-xs text-[#E8E4DE] uppercase transition-colors"
                      >
                        <ExternalLink className="w-3.5 h-3.5 text-[#E87935]" />
                        <span>Live Demo</span>
                      </a>
                    )}
                    {project.repoUrl && (
                      <a
                        href={project.repoUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 px-4 py-2.5 bg-[#101010] hover:bg-[#242220] border border-[#33302D] hover:border-[#E87935] font-mono text-xs text-[#E8E4DE] uppercase transition-colors"
                      >
                        <Github className="w-3.5 h-3.5 text-[#E87935]" />
                        <span>Repository</span>
                      </a>
                    )}
                  </div>

                  <motion.button
                    type="button"
                    whileHover={prefersReducedMotion ? undefined : { y: -2 }}
                    whileTap={prefersReducedMotion ? undefined : { scale: 0.98 }}
                    onClick={onClose}
                    className="px-6 py-2.5 bg-[#E87935] hover:bg-[#F3A45B] text-[#101010] font-mono text-xs font-semibold uppercase ml-auto focus:outline-none focus-visible:ring-2 focus-visible:ring-[#F3A45B]"
                  >
                    Close Case Study
                  </motion.button>
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
