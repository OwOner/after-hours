/* eslint-disable react-refresh/only-export-components */
import { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import { CheckCircle2, Loader2, FastForward } from 'lucide-react';
import { useTheme } from '../context/ThemeContext.jsx';
import { MOTION_TOKENS } from '../utils/motion.jsx';

const SESSION_STORAGE_KEY = 'afterhours-system-initialized';

/**
 * 6 Isometric Geometric Node Positions around the Central Core (280, 150)
 * in the SVG coordinate space (560 x 300).
 */
const ISOMETRIC_NODES = [
  { id: 'n1', label: 'PROJECTS', x: 135, y: 82, w: 32, h: 26 },
  { id: 'n2', label: 'SKILLS', x: 350, y: 66, w: 28, h: 24 },
  { id: 'n3', label: 'ABOUT', x: 435, y: 148, w: 30, h: 28 },
  { id: 'n4', label: 'EXPERIENCE', x: 355, y: 226, w: 34, h: 24 },
  { id: 'n5', label: 'SYSTEMS', x: 195, y: 234, w: 30, h: 22 },
  { id: 'n6', label: 'CONTACT', x: 115, y: 162, w: 28, h: 26 },
];

export const LOADER_TIMINGS = {
  awakeningDuration: 300, // Phase 1: 0 - 300ms
  constructionDuration: 620, // Phase 2: 300 - 920ms
  minInitDisplay: 460, // Phase 3 minimum beat: 920 - 1380ms
  deploymentDuration: 360, // Phase 4 exit transition: 360ms
  returningSessionDuration: 320, // Shortened intro for returning reload in session
  maxResourceWaitTimeout: 2200, // Safety timeout so optional resources never block site
};

function hasCompletedSessionIntro() {
  if (typeof window === 'undefined') return false;
  try {
    return window.sessionStorage.getItem(SESSION_STORAGE_KEY) === 'true';
  } catch {
    return false;
  }
}

function markSessionIntroComplete() {
  if (typeof window === 'undefined') return;
  try {
    window.sessionStorage.setItem(SESSION_STORAGE_KEY, 'true');
  } catch {
    // ignore storage restrictions
  }
}

export default function SystemInitialization() {
  const prefersReducedMotion = useReducedMotion();
  const { isLight } = useTheme();
  const isReturningVisitor = useRef(hasCompletedSessionIntro());

  const [isVisible, setIsVisible] = useState(true);
  const [phase, setPhase] = useState('awakening'); // 'awakening' | 'construction' | 'initialization' | 'deployment'

  // Genuine application readiness checks (never fake hardcoded progress)
  const [checks, setChecks] = useState({
    domLayout: false,
    typography: false,
    interfaceModules: false,
  });

  const rafRef = useRef(null);
  const deployTimerRef = useRef(null);
  const safetyTimerRef = useRef(null);
  const skippedRef = useRef(false);

  const cleanupTimers = useCallback(() => {
    if (rafRef.current !== null) {
      window.cancelAnimationFrame(rafRef.current);
      rafRef.current = null;
    }
    if (deployTimerRef.current !== null) {
      clearTimeout(deployTimerRef.current);
      deployTimerRef.current = null;
    }
    if (safetyTimerRef.current !== null) {
      clearTimeout(safetyTimerRef.current);
      safetyTimerRef.current = null;
    }
  }, []);

  // Immediate Skip Intro handler (button or Escape key)
  const handleSkipIntro = useCallback(() => {
    if (skippedRef.current) return;
    skippedRef.current = true;
    cleanupTimers();
    markSessionIntroComplete();
    setIsVisible(false);
  }, [cleanupTimers]);

  // Allow Escape key to skip intro immediately
  useEffect(() => {
    if (!isVisible) return;
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        e.stopPropagation();
        handleSkipIntro();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isVisible, handleSkipIntro]);

  // Lock background scroll while loader is active
  useEffect(() => {
    if (!isVisible) return;
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = prevOverflow;
    };
  }, [isVisible]);

  // 1. Genuine Resource & Application Readiness Probing
  useEffect(() => {
    let isMounted = true;

    // Check 1: DOM & Viewport Architecture
    const markDomReady = () => {
      if (isMounted) {
        setChecks((prev) =>
          prev.domLayout ? prev : { ...prev, domLayout: true },
        );
      }
    };

    if (typeof document !== 'undefined' && document.readyState !== 'loading') {
      markDomReady();
    } else if (typeof window !== 'undefined') {
      window.addEventListener('DOMContentLoaded', markDomReady, { once: true });
    }

    // Check 2: Theme & React Interface Modules Mounted
    const moduleFrame = window.requestAnimationFrame(() => {
      if (isMounted) {
        setChecks((prev) =>
          prev.interfaceModules ? prev : { ...prev, interfaceModules: true },
        );
      }
    });

    // Check 3: Web Fonts & Document Load (with non-blocking safety fallback)
    const markTypographyReady = () => {
      if (isMounted) {
        setChecks((prev) =>
          prev.typography ? prev : { ...prev, typography: true },
        );
      }
    };

    if (typeof document !== 'undefined' && document.fonts?.ready) {
      document.fonts.ready.then(markTypographyReady).catch(markTypographyReady);
    } else {
      markTypographyReady();
    }

    // Safety fallback so slow/offline fonts never block the portfolio indefinitely
    safetyTimerRef.current = setTimeout(() => {
      if (isMounted) {
        setChecks({
          domLayout: true,
          typography: true,
          interfaceModules: true,
        });
      }
    }, LOADER_TIMINGS.maxResourceWaitTimeout);

    return () => {
      isMounted = false;
      window.cancelAnimationFrame(moduleFrame);
      window.removeEventListener('DOMContentLoaded', markDomReady);
    };
  }, []);

  const allResourcesReady =
    checks.domLayout && checks.typography && checks.interfaceModules;

  // 2. Coordinated Phase Timeline (Awakening -> Construction -> Initialization -> Deployment)
  useEffect(() => {
    if (!isVisible || skippedRef.current) return;

    const startTime = performance.now();

    // Shortened path for Reduced Motion or Returning Session Reloads
    if (prefersReducedMotion || isReturningVisitor.current) {
      setPhase('initialization');
      const shortDuration = LOADER_TIMINGS.returningSessionDuration;

      const checkShortReady = (now) => {
        if (now - startTime >= shortDuration && allResourcesReady) {
          markSessionIntroComplete();
          setIsVisible(false);
          return;
        }
        rafRef.current = window.requestAnimationFrame(checkShortReady);
      };
      rafRef.current = window.requestAnimationFrame(checkShortReady);
      return () => cleanupTimers();
    }

    const {
      awakeningDuration,
      constructionDuration,
      minInitDisplay,
      deploymentDuration,
    } = LOADER_TIMINGS;

    const tConstructionStart = awakeningDuration;
    const tInitStart = awakeningDuration + constructionDuration;
    const tMinReady = tInitStart + minInitDisplay;

    let currentPhase = 'awakening';

    const stepLoaderTimeline = (now) => {
      const elapsed = now - startTime;

      if (
        elapsed >= tConstructionStart &&
        elapsed < tInitStart &&
        currentPhase === 'awakening'
      ) {
        currentPhase = 'construction';
        setPhase('construction');
      } else if (elapsed >= tInitStart && currentPhase === 'construction') {
        currentPhase = 'initialization';
        setPhase('initialization');
      }

      // Transition to Phase 4 (Deployment) once BOTH minimum visual sequence AND real readiness complete
      if (
        elapsed >= tMinReady &&
        allResourcesReady &&
        currentPhase !== 'deployment'
      ) {
        currentPhase = 'deployment';
        setPhase('deployment');
        markSessionIntroComplete();
        deployTimerRef.current = setTimeout(() => {
          setIsVisible(false);
        }, deploymentDuration);
        return;
      }

      rafRef.current = window.requestAnimationFrame(stepLoaderTimeline);
    };

    rafRef.current = window.requestAnimationFrame(stepLoaderTimeline);
    return () => cleanupTimers();
  }, [isVisible, allResourcesReady, prefersReducedMotion, cleanupTimers]);

  // Genuine completed readiness ratio (0 -> 100%)
  const completedStagesCount =
    (checks.domLayout ? 1 : 0) +
    (checks.interfaceModules ? 1 : 0) +
    (checks.typography ? 1 : 0);

  const stageProgressPercent =
    phase === 'deployment'
      ? 100
      : phase === 'awakening'
      ? Math.min(25, completedStagesCount * 10)
      : phase === 'construction'
      ? Math.min(68, 25 + completedStagesCount * 14)
      : Math.round((completedStagesCount / 3) * 100);

  const strokeMuted = isLight ? '#C4B9A8' : '#33302D';
  const strokeAccent = isLight ? '#C65E24' : '#E87935';
  const strokeSecondary = isLight ? '#E87935' : '#F3A45B';
  const nodeFill = isLight ? '#FAF8F3' : '#191919';
  const coreFill = isLight ? '#E5E0D6' : '#141312';

  const statusStages = [
    {
      id: 'dom',
      label: 'VIEWPORT & LAYOUT ARCHITECTURE',
      ready: checks.domLayout,
    },
    {
      id: 'modules',
      label: 'THEME & INTERACTIVE MODULES',
      ready: checks.interfaceModules,
    },
    {
      id: 'fonts',
      label: 'TYPOGRAPHY & GRAPHICS ASSETS',
      ready: checks.typography,
    },
  ];

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          key="afterhours-system-initialization"
          role="status"
          aria-live="polite"
          aria-label="Initializing AFTERHOURS Portfolio"
          initial={{ opacity: 1 }}
          exit={
            prefersReducedMotion
              ? { opacity: 0, transition: { duration: 0.2 } }
              : {
                  opacity: 0,
                  scale: 1.12,
                  transition: {
                    duration: LOADER_TIMINGS.deploymentDuration / 1000,
                    ease: MOTION_TOKENS.ease,
                  },
                }
          }
          className="fixed inset-0 z-[65] bg-[#101010] text-[#E8E4DE] flex flex-col justify-between p-5 sm:p-8 select-none overflow-hidden"
        >
          {/* PHASE 1: Subtle Technical Grid & Atmospheric Radial Glow */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
            aria-hidden="true"
            className="pointer-events-none absolute inset-0"
            style={{
              backgroundImage: `
                radial-gradient(circle at 50% 45%, ${
                  isLight
                    ? 'rgba(198, 94, 36, 0.14)'
                    : 'rgba(232, 121, 53, 0.14)'
                } 0%, transparent 60%),
                linear-gradient(to right, ${
                  isLight ? 'rgba(198, 94, 36, 0.08)' : 'rgba(232, 121, 53, 0.06)'
                } 1px, transparent 1px),
                linear-gradient(to bottom, ${
                  isLight ? 'rgba(198, 94, 36, 0.08)' : 'rgba(232, 121, 53, 0.06)'
                } 1px, transparent 1px)
              `,
              backgroundSize: '100% 100%, 48px 48px, 48px 48px',
            }}
          />

          {/* Top Metadata Strip */}
          <div className="relative z-10 max-w-5xl w-full mx-auto flex items-center justify-between border-b border-[#33302D] pb-3.5 font-mono text-[11px]">
            <div className="flex items-center gap-2.5">
              <span className="w-2 h-2 bg-[#E87935] rotate-45" />
              <span className="font-heading font-bold tracking-wider text-sm text-[#E8E4DE]">
                JP<span className="text-[#E87935]">.</span>DEV
              </span>
              <span className="text-[#A7A19A] pl-2 border-l border-[#33302D] uppercase tracking-widest">
                AFTERHOURS
              </span>
            </div>
            <span className="text-[#E87935] uppercase tracking-widest">
              {phase === 'deployment'
                ? 'ENVIRONMENT ONLINE'
                : 'SYSTEM INITIALIZATION'}
            </span>
          </div>

          {/* Centerpiece: Isometric Core, Outward Grid Pathways, Rising Structures & Status Readout */}
          <div className="relative z-10 my-auto max-w-xl w-full mx-auto flex flex-col items-center">
            {/* Isometric Geometric Core & Rising Sector Structures SVG */}
            <div className="w-full max-w-[500px] aspect-[560/300] relative flex items-center justify-center">
              <svg
                viewBox="0 0 560 300"
                className="w-full h-full overflow-visible"
                aria-hidden="true"
              >
                {/* Outer Isometric Reference Diamond */}
                <motion.polygon
                  points="280,32 490,150 280,268 70,150"
                  fill="none"
                  stroke={strokeMuted}
                  strokeWidth="1"
                  strokeDasharray="4 4"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 0.7 }}
                  transition={{ duration: 0.35 }}
                />

                {/* PHASE 2: Outward Grid Connections & Traveling Light Pulses */}
                {phase !== 'awakening' &&
                  ISOMETRIC_NODES.map((node, idx) => (
                    <g key={`path-${node.id}`}>
                      <motion.line
                        x1="280"
                        y1="150"
                        x2={node.x}
                        y2={node.y}
                        stroke={strokeAccent}
                        strokeWidth="1.6"
                        initial={
                          prefersReducedMotion
                            ? { opacity: 0.65 }
                            : { pathLength: 0, opacity: 0.2 }
                        }
                        animate={{ pathLength: 1, opacity: 0.75 }}
                        transition={{
                          duration: 0.42,
                          delay: idx * 0.05,
                          ease: MOTION_TOKENS.ease,
                        }}
                      />

                      {/* Subtle Orange Energy Pulse Traveling Outward */}
                      {!prefersReducedMotion && (
                        <motion.circle
                          r="3"
                          fill={strokeSecondary}
                          initial={{ cx: 280, cy: 150, opacity: 0 }}
                          animate={{
                            cx: [280, node.x],
                            cy: [150, node.y],
                            opacity: [0, 1, 0],
                          }}
                          transition={{
                            duration: 1.1,
                            delay: 0.15 + idx * 0.08,
                            repeat: Infinity,
                            ease: 'easeOut',
                          }}
                        />
                      )}
                    </g>
                  ))}

                {/* PHASE 2: Staggered Isometric Structures Rising into Position */}
                {phase !== 'awakening' &&
                  ISOMETRIC_NODES.map((node, idx) => (
                    <motion.g
                      key={node.id}
                      initial={
                        prefersReducedMotion
                          ? { opacity: 1, y: 0 }
                          : { opacity: 0, y: 18 }
                      }
                      animate={{ opacity: 1, y: 0 }}
                      transition={{
                        duration: 0.42,
                        delay: 0.1 + idx * 0.065,
                        ease: MOTION_TOKENS.ease,
                      }}
                    >
                      {/* Isometric Platform Base */}
                      <polygon
                        points={`${node.x},${node.y - 12} ${node.x + 22},${node.y} ${node.x},${node.y + 12} ${node.x - 22},${node.y}`}
                        fill={nodeFill}
                        stroke={strokeMuted}
                        strokeWidth="1.2"
                      />
                      {/* Rising 3D Structure Block */}
                      <rect
                        x={node.x - node.w / 2}
                        y={node.y - node.h}
                        width={node.w}
                        height={node.h}
                        fill={nodeFill}
                        stroke={strokeAccent}
                        strokeWidth="1.4"
                      />
                      {/* Structure Node Beacon */}
                      <rect
                        x={node.x - 2.5}
                        y={node.y - node.h / 2 - 2.5}
                        width="5"
                        height="5"
                        transform={`rotate(45 ${node.x} ${node.y - node.h / 2})`}
                        fill={strokeAccent}
                      />
                    </motion.g>
                  ))}

                {/* PHASE 1 & 4: Central Geometric Energy Core */}
                <motion.g
                  initial={
                    prefersReducedMotion
                      ? { scale: 1, opacity: 1 }
                      : { scale: 0.65, opacity: 0 }
                  }
                  animate={{
                    scale: phase === 'deployment' ? 1.18 : 1,
                    opacity: 1,
                  }}
                  transition={{ duration: 0.32, ease: MOTION_TOKENS.ease }}
                >
                  {/* Outer Orbital Ring */}
                  <ellipse
                    cx="280"
                    cy="150"
                    rx="58"
                    ry="34"
                    fill="none"
                    stroke={strokeAccent}
                    strokeWidth="1.5"
                    strokeOpacity="0.6"
                  />

                  {/* Central Octagonal Plinth */}
                  <polygon
                    points="280,118 332,150 280,182 228,150"
                    fill={coreFill}
                    stroke={strokeAccent}
                    strokeWidth="2"
                  />

                  {/* Glowing Geometric Core Crystal */}
                  <motion.polygon
                    points="280,124 304,150 280,176 256,150"
                    fill={strokeAccent}
                    animate={
                      prefersReducedMotion
                        ? undefined
                        : { opacity: [0.82, 1, 0.82] }
                    }
                    transition={{
                      duration: 1.6,
                      repeat: Infinity,
                      ease: 'easeInOut',
                    }}
                  />
                  <polygon
                    points="280,136 292,150 280,164 268,150"
                    fill={nodeFill}
                  />
                </motion.g>
              </svg>
            </div>

            {/* PHASE 3: AFTERHOURS Branding, Progress Bar & Genuine Readiness Checklist */}
            <motion.div
              initial={
                prefersReducedMotion ? { opacity: 1 } : { opacity: 0, y: 10 }
              }
              animate={{
                opacity: phase === 'awakening' ? 0.35 : 1,
                y: 0,
              }}
              transition={{ duration: 0.3, ease: MOTION_TOKENS.ease }}
              className="w-full max-w-md bg-[#191919] border border-[#33302D] p-4 sm:p-5 space-y-3.5 shadow-2xl"
            >
              <div className="flex items-center justify-between font-mono text-xs">
                <span className="text-[#E87935] font-semibold tracking-wider uppercase">
                  AFTERHOURS // SYSTEM INITIALIZATION
                </span>
                <span className="text-[#E8E4DE]">{stageProgressPercent}%</span>
              </div>

              {/* Thin Progress Bar */}
              <div className="w-full h-1 bg-[#242220] overflow-hidden">
                <motion.div
                  initial={{ width: '10%' }}
                  animate={{ width: `${stageProgressPercent}%` }}
                  transition={{ duration: 0.25, ease: 'easeOut' }}
                  className="h-full bg-[#E87935]"
                />
              </div>

              {/* Genuine Initialization Stages */}
              <div className="space-y-1.5 pt-1 font-mono text-[11px]">
                {statusStages.map((st) => (
                  <div
                    key={st.id}
                    className="flex items-center justify-between gap-2"
                  >
                    <span className="text-[#B8B0A6] truncate">{st.label}</span>
                    <span
                      className={`inline-flex items-center gap-1 shrink-0 ${
                        st.ready ? 'text-[#E87935]' : 'text-[#A7A19A]'
                      }`}
                    >
                      {st.ready ? (
                        <>
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          <span>READY</span>
                        </>
                      ) : (
                        <>
                          <Loader2 className="w-3.5 h-3.5 animate-spin" />
                          <span>LOADING</span>
                        </>
                      )}
                    </span>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>

          {/* Bottom Bar: Skip Intro Control */}
          <div className="relative z-10 max-w-5xl w-full mx-auto flex items-center justify-between pt-3.5 border-t border-[#33302D] font-mono text-xs">
            <span className="text-[#A7A19A] text-[11px] hidden sm:inline">
              SORSOGON, PHILIPPINES // INTERACTIVE PORTFOLIO ENVIRONMENT
            </span>
            <button
              type="button"
              onClick={handleSkipIntro}
              aria-label="Skip initialization intro and enter portfolio"
              className="ml-auto inline-flex items-center gap-2 px-4 py-2 bg-[#191919] hover:bg-[#242220] border border-[#33302D] hover:border-[#E87935] text-[#E8E4DE] text-xs tracking-wider uppercase transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-[#E87935]"
            >
              <span>Skip Intro</span>
              <FastForward className="w-3.5 h-3.5 text-[#E87935]" />
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
