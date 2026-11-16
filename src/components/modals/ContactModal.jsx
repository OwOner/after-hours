import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import { X, Mail, Copy, Check, ExternalLink, Info } from 'lucide-react';
import {
  MODAL_OVERLAY_VARIANTS,
  MODAL_PANEL_VARIANTS,
} from '../../utils/motion.jsx';
import { useModalAccessibility } from '../../hooks/useModalAccessibility.js';
import { SITE_CONFIG } from '../../data/portfolioData.js';
import { submitContactInquiry } from '../../utils/contactService.js';

export default function ContactModal({ isOpen, onClose }) {
  const prefersReducedMotion = useReducedMotion();
  const nameInputRef = useRef(null);

  const [contactForm, setContactForm] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });
  const [statusMessage, setStatusMessage] = useState(null); // { type: 'mailto' | 'copied' | 'error' | 'endpoint', text: string }
  const [copiedState, setCopiedState] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const panelRef = useModalAccessibility({
    isOpen,
    onClose,
    initialFocusRef: nameInputRef,
  });

  // Reset transient feedback when modal closes
  useEffect(() => {
    if (!isOpen) {
      setStatusMessage(null);
      setCopiedState(false);
      setIsSubmitting(false);
    }
  }, [isOpen]);

  const configuredEmail = SITE_CONFIG.contactEmail;
  const displayEmail = configuredEmail || SITE_CONFIG.contactEmailPlaceholder;

  const handleCopyEmail = async () => {
    const textToCopy = configuredEmail || SITE_CONFIG.contactEmailPlaceholder;
    try {
      await navigator.clipboard.writeText(textToCopy);
      setCopiedState(true);
      setStatusMessage({
        type: 'copied',
        text: configuredEmail
          ? `Copied "${configuredEmail}" to clipboard. Paste it into your email client to send a message.`
          : `Copied placeholder (${SITE_CONFIG.contactEmailPlaceholder}). Configure VITE_CONTACT_EMAIL in .env with your verified email address.`,
      });
      setTimeout(() => setCopiedState(false), 3000);
    } catch {
      setStatusMessage({
        type: 'error',
        text: `Unable to access clipboard automatically. Please copy manually: ${displayEmail}`,
      });
    }
  };

  const handleContactSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const result = await submitContactInquiry(contactForm);

      if (result.mode === 'endpoint') {
        setStatusMessage({
          type: 'endpoint',
          text: 'Your message was submitted to the configured endpoint.',
        });
        setContactForm({ name: '', email: '', subject: '', message: '' });
      } else {
        setStatusMessage({
          type: 'mailto',
          text: configuredEmail
            ? `Your default email application has been opened with your prefilled message to ${configuredEmail}. Please click "Send" inside your email application to complete delivery.`
            : 'Your default email application has been opened with your prefilled subject and message. Note: Configure VITE_CONTACT_EMAIL in .env so the recipient field is populated automatically, then send the email from your mail client.',
        });
      }
    } catch (err) {
      setStatusMessage({
        type: 'error',
        text:
          err?.message ||
          'Could not trigger email action. Please use the Copy Email Address button below.',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          key="contact-modal-overlay"
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
            aria-labelledby="contact-modal-title"
            variants={MODAL_PANEL_VARIANTS}
            initial="hidden"
            animate="visible"
            exit="exit"
            onClick={(e) => e.stopPropagation()}
            className="bg-[#191919] border border-[#33302D] max-w-lg w-full max-h-[90vh] flex flex-col overflow-hidden shadow-2xl my-auto"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-5 sm:px-6 py-4 bg-[#101010] border-b border-[#33302D] font-mono text-xs shrink-0">
              <span id="contact-modal-title" className="text-[#E87935]">
                CONTACT // JP.DEV
              </span>
              <button
                type="button"
                onClick={onClose}
                aria-label="Close contact modal"
                className="min-w-[36px] min-h-[36px] flex items-center justify-center text-[#A7A19A] hover:text-[#E8E4DE] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#E87935]"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Scrollable Body */}
            <div className="overflow-y-auto flex-1 p-5 sm:p-6 space-y-5">
              {/* Direct Email & Copy Fallback Strip */}
              <div className="p-3.5 bg-[#101010] border border-[#33302D] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="min-w-0">
                  <div className="font-mono text-[10px] text-[#A7A19A] uppercase">
                    DIRECT EMAIL ADDRESS
                  </div>
                  <div className="font-mono text-xs text-[#E8E4DE] break-all mt-0.5">
                    {displayEmail}
                  </div>
                </div>
                <button
                  type="button"
                  onClick={handleCopyEmail}
                  className="inline-flex items-center justify-center gap-2 px-3 py-2 bg-[#191919] hover:bg-[#242220] border border-[#33302D] hover:border-[#E87935] font-mono text-[11px] text-[#E8E4DE] uppercase shrink-0 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-[#E87935]"
                >
                  {copiedState ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-[#E87935]" />
                      <span className="text-[#E87935]">Copied</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5 text-[#E87935]" />
                      <span>Copy Email Address</span>
                    </>
                  )}
                </button>
              </div>

              {/* Honest Feedback Banner (Never claims fake delivery) */}
              <AnimatePresence>
                {statusMessage && (
                  <motion.div
                    initial={{ opacity: 0, y: -6 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -6 }}
                    role="status"
                    aria-live="polite"
                    className={`p-3.5 border font-mono text-xs leading-relaxed flex items-start gap-3 ${
                      statusMessage.type === 'error'
                        ? 'bg-red-950/40 border-red-500/60 text-red-200'
                        : 'bg-[#242220] border-[#E87935] text-[#E8E4DE]'
                    }`}
                  >
                    <Info className="w-4 h-4 text-[#E87935] shrink-0 mt-0.5" />
                    <div className="space-y-1">
                      <div className="font-semibold text-[#F3A45B] uppercase text-[10px]">
                        {statusMessage.type === 'mailto'
                          ? 'EMAIL CLIENT LAUNCHED — MANUAL SEND REQUIRED'
                          : statusMessage.type === 'copied'
                          ? 'CLIPBOARD UPDATED'
                          : statusMessage.type === 'endpoint'
                          ? 'SUBMISSION COMPLETE'
                          : 'NOTICE'}
                      </div>
                      <p className="text-[#E8E4DE] text-[11px]">
                        {statusMessage.text}
                      </p>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Contact Form */}
              <form onSubmit={handleContactSubmit} className="space-y-4">
                <div>
                  <label
                    htmlFor="contact-name"
                    className="block font-mono text-[11px] text-[#A7A19A] mb-1"
                  >
                    NAME
                  </label>
                  <input
                    ref={nameInputRef}
                    id="contact-name"
                    name="name"
                    type="text"
                    required
                    value={contactForm.name}
                    onChange={(e) =>
                      setContactForm((prev) => ({
                        ...prev,
                        name: e.target.value,
                      }))
                    }
                    placeholder="Your name"
                    className="w-full bg-[#101010] border border-[#33302D] focus:border-[#E87935] px-3.5 py-2.5 text-sm text-[#E8E4DE] placeholder:text-[#A7A19A]/40 focus:outline-none"
                  />
                </div>

                <div>
                  <label
                    htmlFor="contact-email"
                    className="block font-mono text-[11px] text-[#A7A19A] mb-1"
                  >
                    EMAIL
                  </label>
                  <input
                    id="contact-email"
                    name="email"
                    type="email"
                    required
                    value={contactForm.email}
                    onChange={(e) =>
                      setContactForm((prev) => ({
                        ...prev,
                        email: e.target.value,
                      }))
                    }
                    placeholder="your.email@example.com"
                    className="w-full bg-[#101010] border border-[#33302D] focus:border-[#E87935] px-3.5 py-2.5 text-sm text-[#E8E4DE] placeholder:text-[#A7A19A]/40 focus:outline-none"
                  />
                </div>

                <div>
                  <label
                    htmlFor="contact-subject"
                    className="block font-mono text-[11px] text-[#A7A19A] mb-1"
                  >
                    SUBJECT <span className="text-[#A7A19A]/60">(OPTIONAL)</span>
                  </label>
                  <input
                    id="contact-subject"
                    name="subject"
                    type="text"
                    value={contactForm.subject}
                    onChange={(e) =>
                      setContactForm((prev) => ({
                        ...prev,
                        subject: e.target.value,
                      }))
                    }
                    placeholder="Project inquiry or collaboration"
                    className="w-full bg-[#101010] border border-[#33302D] focus:border-[#E87935] px-3.5 py-2.5 text-sm text-[#E8E4DE] placeholder:text-[#A7A19A]/40 focus:outline-none"
                  />
                </div>

                <div>
                  <label
                    htmlFor="contact-message"
                    className="block font-mono text-[11px] text-[#A7A19A] mb-1"
                  >
                    MESSAGE
                  </label>
                  <textarea
                    id="contact-message"
                    name="message"
                    rows={4}
                    required
                    value={contactForm.message}
                    onChange={(e) =>
                      setContactForm((prev) => ({
                        ...prev,
                        message: e.target.value,
                      }))
                    }
                    placeholder="Tell me about your project, timeline, or role..."
                    className="w-full bg-[#101010] border border-[#33302D] focus:border-[#E87935] px-3.5 py-2.5 text-sm text-[#E8E4DE] placeholder:text-[#A7A19A]/40 focus:outline-none"
                  />
                </div>

                <p className="font-mono text-[10px] text-[#A7A19A] leading-relaxed">
                  Clicking <span className="text-[#E8E4DE]">Open in Email App</span>{' '}
                  launches your default mail client with your subject and message
                  prefilled so you can review and send it directly.
                </p>

                <div className="pt-2 flex flex-wrap items-center justify-end gap-3">
                  <button
                    type="button"
                    onClick={onClose}
                    className="px-4 py-2.5 border border-[#33302D] font-mono text-xs text-[#A7A19A] hover:text-[#E8E4DE] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#E87935]"
                  >
                    Cancel
                  </button>
                  <motion.button
                    whileHover={prefersReducedMotion ? undefined : { y: -2 }}
                    whileTap={prefersReducedMotion ? undefined : { scale: 0.98 }}
                    type="submit"
                    disabled={isSubmitting}
                    className="inline-flex items-center gap-2 px-6 py-2.5 bg-[#E87935] hover:bg-[#F3A45B] text-[#101010] font-mono text-xs font-semibold uppercase focus:outline-none focus-visible:ring-2 focus-visible:ring-[#F3A45B]"
                  >
                    <Mail className="w-3.5 h-3.5" />
                    <span>Open in Email App</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </motion.button>
                </div>
              </form>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

