import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import { X } from 'lucide-react';
import {
  MOTION_TOKENS,
  MODAL_OVERLAY_VARIANTS,
  MODAL_PANEL_VARIANTS,
} from '../../utils/motion.jsx';
import { useModalAccessibility } from '../../hooks/useModalAccessibility.js';

export default function VideoPreviewModal({ video, onClose }) {
  const prefersReducedMotion = useReducedMotion();
  const closeButtonRef = useRef(null);
  const [videoAvailable, setVideoAvailable] = useState(false);

  useEffect(() => {
    setVideoAvailable(Boolean(video?.videoUrl));
  }, [video]);

  const panelRef = useModalAccessibility({
    isOpen: Boolean(video),
    onClose,
    initialFocusRef: closeButtonRef,
  });

  return (
    <AnimatePresence>
      {video && (
        <motion.div
          key="video-modal-overlay"
          variants={MODAL_OVERLAY_VARIANTS}
          initial="hidden"
          animate="visible"
          exit="exit"
          onClick={onClose}
          className="fixed inset-0 z-50 bg-black/85 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 overflow-y-auto"
        >
          <motion.div
            ref={panelRef}
            role="dialog"
            aria-modal="true"
            aria-labelledby="video-modal-title"
            variants={MODAL_PANEL_VARIANTS}
            initial="hidden"
            animate="visible"
            exit="exit"
            onClick={(e) => e.stopPropagation()}
            className="bg-[#191919] border border-[#33302D] max-w-2xl w-full max-h-[90vh] flex flex-col overflow-hidden shadow-2xl my-auto"
          >
            <div className="flex items-center justify-between gap-2 px-4 sm:px-5 py-3.5 bg-[#101010] border-b border-[#33302D] font-mono text-xs shrink-0">
              <span className="text-[#E87935] truncate">
                {`REEL ${video.id} // ${video.category}`}
              </span>
              <button
                ref={closeButtonRef}
                type="button"
                onClick={onClose}
                aria-label="Close video preview modal"
                className="min-w-[36px] min-h-[36px] flex items-center justify-center text-[#A7A19A] hover:text-[#E8E4DE] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#E87935]"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="overflow-y-auto flex-1">
              <div className="aspect-video bg-[#101010] flex flex-col justify-between border-b border-[#33302D] relative overflow-hidden">
                {videoAvailable ? (
                  <video
                    src={video.videoUrl}
                    controls
                    preload="metadata"
                    onError={() => setVideoAvailable(false)}
                    className="w-full h-full object-contain bg-black"
                  >
                    Your browser does not support HTML5 video playback.
                  </video>
                ) : (
                  <div className="w-full h-full flex flex-col justify-between p-4 sm:p-6">
                    <div className="flex justify-between font-mono text-[10px] sm:text-[11px] text-[#A7A19A]">
                      <span>VIDEO PLACEHOLDER</span>
                      <span>{video.aspect}</span>
                    </div>

                    <div className="text-center space-y-2 my-auto px-2">
                      <h3
                        id="video-modal-title"
                        className="font-heading text-xl sm:text-2xl font-bold text-[#E8E4DE]"
                      >
                        {video.title}
                      </h3>
                      <p className="font-mono text-xs text-[#E87935]">
                        {video.notes}
                      </p>
                      <p className="font-mono text-[10px] text-[#A7A19A]">
                        Asset slot ready: {video.videoSlotPath || 'public/assets/creative/'}
                      </p>
                    </div>

                    <div className="w-full h-1 bg-[#242220] overflow-hidden">
                      <motion.div
                        initial={{ width: '0%' }}
                        animate={{ width: '33%' }}
                        transition={{ duration: 0.6, ease: MOTION_TOKENS.ease }}
                        className="h-full bg-[#E87935]"
                      />
                    </div>
                  </div>
                )}
              </div>

              <div className="p-5 sm:p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="space-y-1">
                  {videoAvailable && (
                    <h3
                      id="video-modal-title"
                      className="font-heading text-lg font-bold text-[#E8E4DE]"
                    >
                      {video.title}
                    </h3>
                  )}
                  <p className="text-xs sm:text-sm text-[#A7A19A]">
                    {video.description}
                  </p>
                </div>
                <motion.button
                  type="button"
                  whileHover={prefersReducedMotion ? undefined : { y: -2 }}
                  whileTap={prefersReducedMotion ? undefined : { scale: 0.98 }}
                  onClick={onClose}
                  className="px-4 py-2.5 bg-[#242220] hover:bg-[#E87935] hover:text-[#101010] text-[#E8E4DE] font-mono text-xs shrink-0 self-end sm:self-center transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-[#E87935]"
                >
                  Close
                </motion.button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
