/* eslint-disable react-refresh/only-export-components */
import { motion, useReducedMotion } from 'framer-motion';

// --- MOTION DESIGN TOKENS & SHARED ANIMATION SYSTEM ---

export const MOTION_TOKENS = {
  ease: [0.16, 1, 0.3, 1],
  fast: 0.15,
  standard: 0.28,
  reveal: 0.65,
  hero: 0.78,
  stagger: 0.08,
  hoverY: -4,
  revealY: 24,
};

export const createStaggerContainer = (
  stagger = MOTION_TOKENS.stagger,
  delayChildren = 0,
) => ({
  hidden: { opacity: 1 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: stagger,
      delayChildren,
    },
  },
});

export const createFadeUpVariant = (
  distance = MOTION_TOKENS.revealY,
  duration = MOTION_TOKENS.reveal,
) => ({
  hidden: { opacity: 0, y: distance },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration,
      ease: MOTION_TOKENS.ease,
    },
  },
});

export const MODAL_OVERLAY_VARIANTS = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { duration: 0.22, ease: MOTION_TOKENS.ease },
  },
  exit: {
    opacity: 0,
    transition: { duration: 0.18, ease: MOTION_TOKENS.ease },
  },
};

export const MODAL_PANEL_VARIANTS = {
  hidden: { opacity: 0, scale: 0.97, y: 14 },
  visible: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: { duration: MOTION_TOKENS.standard, ease: MOTION_TOKENS.ease },
  },
  exit: {
    opacity: 0,
    scale: 0.97,
    y: 10,
    transition: { duration: 0.2, ease: MOTION_TOKENS.ease },
  },
};

// Reusable Viewport Scroll Reveal Component
export const Reveal = ({
  children,
  className = '',
  delay = 0,
  y = MOTION_TOKENS.revealY,
  duration = MOTION_TOKENS.reveal,
  amount = 0.15,
  once = true,
}) => {
  const prefersReducedMotion = useReducedMotion();

  if (prefersReducedMotion) {
    return <div className={className}>{children}</div>;
  }

  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once, amount }}
      transition={{ duration, delay, ease: MOTION_TOKENS.ease }}
    >
      {children}
    </motion.div>
  );
};
