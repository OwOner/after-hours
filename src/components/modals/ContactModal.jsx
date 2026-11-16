import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import {
  X,
  Send,
  Loader2,
  Copy,
  Check,
  CheckCircle2,
  AlertCircle,
  Info,
} from 'lucide-react';
import {
  MODAL_OVERLAY_VARIANTS,
  MODAL_PANEL_VARIANTS,
} from '../../utils/motion.jsx';
import { useModalAccessibility } from '../../hooks/useModalAccessibility.js';
import { SITE_CONFIG } from '../../data/portfolioData.js';
import { submitContactInquiry } from '../../utils/contactService.js';

const INITIAL_FORM_STATE = {
  name: '',
  email: '',
  subject: '',
  message: '',
  _gotcha: '', // Hidden honeypot field for spam protection
};

export default function ContactModal({ isOpen, onClose }) {
  const prefersReducedMotion = useReducedMotion();
  const nameInputRef = useRef(null);
  const submittingLockRef = useRef(false);

  const [contactForm, setContactForm] = useState(INITIAL_FORM_STATE);
  // submissionState: 'idle' | 'loading' | 'success' | 'error'
  const [submissionState, setSubmissionState] = useState('idle');
  const [feedbackMessage, setFeedbackMessage] = useState('');
  const [copiedState, setCopiedState] = useState(false);

  const panelRef = useModalAccessibility({
    isOpen,
    onClose,
    initialFocusRef: nameInputRef,
  });

  // Reset transient status banners when modal closes (preserve unsent draft text if not sent)
  useEffect(() => {
    if (!isOpen) {
      setCopiedState(false);
      submittingLockRef.current = false;
      setSubmissionState((prev) => (prev === 'loading' ? 'idle' : prev));
    }
  }, [isOpen]);

  const configuredEmail = SITE_CONFIG.contactEmail;
  const displayEmail = configuredEmail || SITE_CONFIG.contactEmailPlaceholder;

  const handleCopyEmail = async () => {
    const textToCopy = configuredEmail || SITE_CONFIG.contactEmailPlaceholder;
    try {
      await navigator.clipboard.writeText(textToCopy);
      setCopiedState(true);
      setTimeout(() => setCopiedState(false), 3000);
    } catch {
      setSubmissionState('error');
      setFeedbackMessage(
        `Unable to access clipboard automatically. Please copy manually: ${displayEmail}`,
      );
    }
  };

  const handleFieldChange = (field, value) => {
    setContactForm((prev) => ({
      ...prev,
      [field]: value,
    }));
    if (submissionState === 'error' || submissionState === 'success') {
      setSubmissionState('idle');
      setFeedbackMessage('');
    }
  };

  const handleContactSubmit = async (e) => {
    e.preventDefault();
    if (submittingLockRef.current || submissionState === 'loading') {
      return;
    }

    submittingLockRef.current = true;
    setSubmissionState('loading');
    setFeedbackMessage('');

    try {
      await submitContactInquiry(contactForm);
      setSubmissionState('success');
      setFeedbackMessage(
        'Your message has been sent directly to my inbox. Thank you for reaching out—I will get back to you soon.',
      );
      // Clear the form only after confirmed successful submission
      setContactForm(INITIAL_FORM_STATE);
    } catch (err) {
      // Preserve visitor's entered form values on failure so they can retry
      setSubmissionState('error');
      setFeedbackMessage(
        err?.message ||
          'Something went wrong while sending your message. Please try again.',
      );
    } finally {
      submittingLockRef.current = false;
    }
  };

  const isSubmitting = submissionState === 'loading';

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
                {'CONTACT // JP.DEV'}
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
              {/* Direct Email & Copy Strip */}
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

              {/* Submission Status Banner (Success / Error / Copied Notice) */}
              <AnimatePresence mode="wait">
                {submissionState === 'success' && (
                  <motion.div
                    key="status-success"
                    initial={{ opacity: 0, y: -6 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -6 }}
                    role="status"
                    aria-live="polite"
                    className="p-4 bg-[#242220] border border-[#E87935] font-mono text-xs leading-relaxed flex items-start gap-3"
                  >
                    <CheckCircle2 className="w-4 h-4 text-[#E87935] shrink-0 mt-0.5" />
                    <div className="space-y-1">
                      <div className="font-semibold text-[#E87935] uppercase text-[10px] tracking-wider">
                        MESSAGE SENT
                      </div>
                      <p className="text-[#E8E4DE] text-[11px]">
                        {feedbackMessage}
                      </p>
                    </div>
                  </motion.div>
                )}

                {submissionState === 'error' && feedbackMessage && (
                  <motion.div
                    key="status-error"
                    initial={{ opacity: 0, y: -6 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -6 }}
                    role="alert"
                    aria-live="assertive"
                    className="p-4 bg-[#242220] border border-red-500/70 font-mono text-xs leading-relaxed flex items-start gap-3"
                  >
                    <AlertCircle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
                    <div className="space-y-1">
                      <div className="font-semibold text-red-400 uppercase text-[10px] tracking-wider">
                        SUBMISSION ERROR
                      </div>
                      <p className="text-[#E8E4DE] text-[11px]">
                        {feedbackMessage}
                      </p>
                    </div>
                  </motion.div>
                )}

                {copiedState && submissionState === 'idle' && (
                  <motion.div
                    key="status-copied"
                    initial={{ opacity: 0, y: -6 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -6 }}
                    role="status"
                    aria-live="polite"
                    className="p-3.5 bg-[#242220] border border-[#E87935] font-mono text-xs leading-relaxed flex items-start gap-3"
                  >
                    <Info className="w-4 h-4 text-[#E87935] shrink-0 mt-0.5" />
                    <div className="space-y-1">
                      <div className="font-semibold text-[#F3A45B] uppercase text-[10px]">
                        EMAIL COPIED TO CLIPBOARD
                      </div>
                      <p className="text-[#E8E4DE] text-[11px]">
                        {`Copied "${displayEmail}" to your clipboard.`}
                      </p>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Contact Form */}
              <form
                onSubmit={handleContactSubmit}
                noValidate
                className="space-y-4"
              >
                {/* Hidden Honeypot Field for Spam Protection */}
                <div
                  aria-hidden="true"
                  className="hidden"
                  style={{ display: 'none' }}
                >
                  <label htmlFor="contact-gotcha">
                    Do not fill this field if you are human
                  </label>
                  <input
                    id="contact-gotcha"
                    name="_gotcha"
                    type="text"
                    tabIndex={-1}
                    autoComplete="off"
                    value={contactForm._gotcha}
                    onChange={(e) =>
                      handleFieldChange('_gotcha', e.target.value)
                    }
                  />
                </div>

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
                    disabled={isSubmitting}
                    value={contactForm.name}
                    onChange={(e) => handleFieldChange('name', e.target.value)}
                    placeholder="Your name"
                    className="w-full bg-[#101010] border border-[#33302D] focus:border-[#E87935] disabled:opacity-60 px-3.5 py-2.5 text-sm text-[#E8E4DE] placeholder:text-[#A7A19A]/40 focus:outline-none"
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
                    disabled={isSubmitting}
                    value={contactForm.email}
                    onChange={(e) => handleFieldChange('email', e.target.value)}
                    placeholder="your.email@example.com"
                    className="w-full bg-[#101010] border border-[#33302D] focus:border-[#E87935] disabled:opacity-60 px-3.5 py-2.5 text-sm text-[#E8E4DE] placeholder:text-[#A7A19A]/40 focus:outline-none"
                  />
                </div>

                <div>
                  <label
                    htmlFor="contact-subject"
                    className="block font-mono text-[11px] text-[#A7A19A] mb-1"
                  >
                    SUBJECT{' '}
                    <span className="text-[#A7A19A]/60">(OPTIONAL)</span>
                  </label>
                  <input
                    id="contact-subject"
                    name="subject"
                    type="text"
                    disabled={isSubmitting}
                    value={contactForm.subject}
                    onChange={(e) =>
                      handleFieldChange('subject', e.target.value)
                    }
                    placeholder="Project inquiry or collaboration"
                    className="w-full bg-[#101010] border border-[#33302D] focus:border-[#E87935] disabled:opacity-60 px-3.5 py-2.5 text-sm text-[#E8E4DE] placeholder:text-[#A7A19A]/40 focus:outline-none"
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
                    disabled={isSubmitting}
                    value={contactForm.message}
                    onChange={(e) =>
                      handleFieldChange('message', e.target.value)
                    }
                    placeholder="Tell me about your project, timeline, or role..."
                    className="w-full bg-[#101010] border border-[#33302D] focus:border-[#E87935] disabled:opacity-60 px-3.5 py-2.5 text-sm text-[#E8E4DE] placeholder:text-[#A7A19A]/40 focus:outline-none"
                  />
                </div>

                <div className="pt-2 flex flex-wrap items-center justify-end gap-3">
                  <button
                    type="button"
                    disabled={isSubmitting}
                    onClick={onClose}
                    className="px-4 py-2.5 border border-[#33302D] font-mono text-xs text-[#A7A19A] hover:text-[#E8E4DE] disabled:opacity-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#E87935]"
                  >
                    Cancel
                  </button>
                  <motion.button
                    whileHover={
                      prefersReducedMotion || isSubmitting
                        ? undefined
                        : { y: -2 }
                    }
                    whileTap={
                      prefersReducedMotion || isSubmitting
                        ? undefined
                        : { scale: 0.98 }
                    }
                    type="submit"
                    disabled={isSubmitting}
                    className="inline-flex items-center gap-2 px-6 py-2.5 bg-[#E87935] hover:bg-[#F3A45B] disabled:opacity-70 disabled:cursor-not-allowed text-[#101010] font-mono text-xs font-semibold uppercase focus:outline-none focus-visible:ring-2 focus-visible:ring-[#F3A45B]"
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="w-3.5 h-3.5 animate-spin" />
                        <span>SENDING...</span>
                      </>
                    ) : (
                      <>
                        <Send className="w-3.5 h-3.5" />
                        <span>SEND MESSAGE</span>
                      </>
                    )}
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
