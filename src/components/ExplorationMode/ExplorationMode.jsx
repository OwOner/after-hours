import { useState, useEffect, useRef, lazy, Suspense } from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import { Compass, ArrowUpRight } from 'lucide-react';
import { MOTION_TOKENS } from '../../utils/motion.jsx';
import { useModalAccessibility } from '../../hooks/useModalAccessibility.js';
import {
  EXPLORATION_LOCATIONS,
  TRANSITION_TIMINGS,
  playExplorationSound,
} from './explorationData.js';
import ExplorationHUD from './ExplorationHUD.jsx';
import './exploration.css';

// Lazy-load the 3D Isometric Scene so it is never downloaded on initial page load
const LazyExplorationScene = lazy(() => import('./ExplorationScene.jsx'));

const QUALITY_LEVELS = ['AUTO', 'HIGH', 'LOW'];

export default function ExplorationMode({
  isOpen,
  onOpen,
  onClose,
  onNavigateToSection,
}) {
  const systemReducedMotion = useReducedMotion();
  const closeButtonRef = useRef(null);
  const savedScrollYRef = useRef(0);
  const timelineRafRef = useRef(null);

  // Environment & HUD State
  const [hoveredLocation, setHoveredLocation] = useState(null);
  const [selectedLocation, setSelectedLocation] = useState(
    EXPLORATION_LOCATIONS[0],
  );
  const [focusedLocationId, setFocusedLocationId] = useState(null);
  const [transitionState, setTransitionState] = useState({
    phase: 'idle', // 'idle' | 'lock' | 'approach' | 'impact' | 'reveal'
    phaseStartTime: 0,
    phaseDuration: 0,
  });
  const [quickNavOpen, setQuickNavOpen] = useState(false);

  // Bottom-Left Settings (Sound OFF by default, Quality AUTO, Motion synced with OS preference)
  const [soundEnabled, setSoundEnabled] = useState(false);
  const [visualQuality, setVisualQuality] = useState('AUTO');
  const [motionReduced, setMotionReduced] = useState(
    Boolean(systemReducedMotion),
  );
  const [isFallbackView, setIsFallbackView] = useState(false);

  // Camera Command State
  const [cameraTarget, setCameraTarget] = useState({ mode: 'overview' });
  const [zoomCommand, setZoomCommand] = useState(null);

  useEffect(() => {
    setMotionReduced(Boolean(systemReducedMotion));
  }, [systemReducedMotion]);

  const cancelTransitionTimeline = () => {
    if (timelineRafRef.current !== null) {
      window.cancelAnimationFrame(timelineRafRef.current);
      timelineRafRef.current = null;
    }
  };

  useEffect(() => {
    return () => cancelTransitionTimeline();
  }, []);

  const isEntering = transitionState.phase !== 'idle';

  // Save scroll position on open; restore on manual exit
  const handleOpenExploration = () => {
    if (typeof window !== 'undefined') {
      savedScrollYRef.current = window.scrollY;
    }
    cancelTransitionTimeline();
    setTransitionState({ phase: 'idle', phaseStartTime: 0, phaseDuration: 0 });
    setFocusedLocationId(null);
    setQuickNavOpen(false);
    setCameraTarget({ mode: 'overview', ts: Date.now() });
    onOpen();
  };

  const handleExitExploration = () => {
    cancelTransitionTimeline();
    setTransitionState({ phase: 'idle', phaseStartTime: 0, phaseDuration: 0 });
    setFocusedLocationId(null);
    setQuickNavOpen(false);
    onClose();
    if (typeof window !== 'undefined') {
      const targetY = savedScrollYRef.current;
      requestAnimationFrame(() => {
        window.scrollTo({ top: targetY, behavior: 'auto' });
      });
    }
  };

  const panelRef = useModalAccessibility({
    isOpen,
    onClose: handleExitExploration,
    initialFocusRef: closeButtonRef,
  });

  const handleHoverLocation = (loc) => {
    if (isEntering) return;
    if (loc && loc.id !== hoveredLocation?.id) {
      playExplorationSound('hover', soundEnabled);
    }
    setHoveredLocation(loc);
  };

  const handleFocusLocation = (loc) => {
    if (!loc || isEntering) return;
    playExplorationSound('focus', soundEnabled);
    setSelectedLocation(loc);
    setFocusedLocationId(loc.id);
    setCameraTarget({
      mode: 'focus',
      position: loc.position,
      ts: Date.now(),
    });
  };

  const handleResetOverview = () => {
    if (isEntering) return;
    playExplorationSound('toggle', soundEnabled);
    setFocusedLocationId(null);
    setCameraTarget({ mode: 'overview', ts: Date.now() });
  };

  /**
   * Executes the Coordinated 4-Phase Destination Entry Timeline:
   * - Phase 1 (Destination Lock, 0–170ms): Highlight building, dim surrounding map, prepare camera.
   * - Phase 2 (Camera Approach, 170–910ms): Smoothly zoom in and move camera toward destination FIRST.
   * - Phase 3 (Arrival Impact, 910–1070ms): Trigger impact frames & subtle shake ONLY after camera approach completes.
   * - Phase 4 (Section Reveal, 1070–1410ms): Settle impact and transition into the portfolio section.
   */
  const handleEnterPortal = (loc) => {
    if (!loc || isEntering) return;
    cancelTransitionTimeline();
    playExplorationSound('select', soundEnabled);
    setSelectedLocation(loc);
    setFocusedLocationId(loc.id);
    setQuickNavOpen(false);

    const startTime = performance.now();

    if (motionReduced) {
      const total = TRANSITION_TIMINGS.reducedMotionTotal;
      setTransitionState({
        phase: 'reveal',
        phaseStartTime: startTime,
        phaseDuration: total,
      });
      setCameraTarget({
        mode: 'focus',
        position: loc.position,
        ts: Date.now(),
      });

      const stepReduced = (now) => {
        if (now - startTime >= total) {
          timelineRafRef.current = null;
          setTransitionState({
            phase: 'idle',
            phaseStartTime: 0,
            phaseDuration: 0,
          });
          setFocusedLocationId(null);
          onClose();
          onNavigateToSection(loc.sectionId, true);
          return;
        }
        timelineRafRef.current = window.requestAnimationFrame(stepReduced);
      };
      timelineRafRef.current = window.requestAnimationFrame(stepReduced);
      return;
    }

    const { lockDuration, approachDuration, impactDuration, revealDuration } =
      TRANSITION_TIMINGS;
    const tApproachStart = lockDuration;
    const tImpactStart = lockDuration + approachDuration;
    const tRevealStart = tImpactStart + impactDuration;
    const tComplete = tRevealStart + revealDuration;

    let activePhase = 'lock';
    setTransitionState({
      phase: 'lock',
      phaseStartTime: startTime,
      phaseDuration: lockDuration,
    });

    const stepTimeline = (now) => {
      const elapsed = now - startTime;

      if (elapsed >= tComplete) {
        timelineRafRef.current = null;
        setTransitionState({
          phase: 'idle',
          phaseStartTime: 0,
          phaseDuration: 0,
        });
        setFocusedLocationId(null);
        onClose();
        onNavigateToSection(loc.sectionId, true);
        return;
      }

      if (elapsed >= tRevealStart && activePhase !== 'reveal') {
        activePhase = 'reveal';
        setTransitionState({
          phase: 'reveal',
          phaseStartTime: now,
          phaseDuration: revealDuration,
        });
      } else if (
        elapsed >= tImpactStart &&
        elapsed < tRevealStart &&
        activePhase !== 'impact'
      ) {
        activePhase = 'impact';
        setTransitionState({
          phase: 'impact',
          phaseStartTime: now,
          phaseDuration: impactDuration,
        });
      } else if (
        elapsed >= tApproachStart &&
        elapsed < tImpactStart &&
        activePhase !== 'approach'
      ) {
        activePhase = 'approach';
        setTransitionState({
          phase: 'approach',
          phaseStartTime: now,
          phaseDuration: approachDuration,
        });
        setCameraTarget({
          mode: 'approach',
          position: loc.position,
          ts: Date.now(),
        });
      }

      timelineRafRef.current = window.requestAnimationFrame(stepTimeline);
    };

    timelineRafRef.current = window.requestAnimationFrame(stepTimeline);
  };

  const handleCycleQuality = () => {
    playExplorationSound('toggle', soundEnabled);
    setVisualQuality((prev) => {
      const nextIdx =
        (QUALITY_LEVELS.indexOf(prev) + 1) % QUALITY_LEVELS.length;
      return QUALITY_LEVELS[nextIdx];
    });
  };

  const activeLocation = hoveredLocation || selectedLocation;

  return (
    <>
      {/* FLOATING ACTIVATION BUTTON IN NORMAL PORTFOLIO VIEW */}
      {!isOpen && (
        <div className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-40">
          <motion.button
            type="button"
            onClick={handleOpenExploration}
            whileHover={motionReduced ? undefined : { y: -3 }}
            whileTap={motionReduced ? undefined : { scale: 0.97 }}
            transition={{
              duration: MOTION_TOKENS.fast,
              ease: MOTION_TOKENS.ease,
            }}
            aria-label="Enter Exploration Mode — Interactive 3D Portfolio World"
            className="group inline-flex items-center gap-2.5 px-4 py-3 sm:px-5 sm:py-3.5 bg-[#101010]/92 hover:bg-[#191919] backdrop-blur-md border border-[#E87935]/80 hover:border-[#E87935] text-[#E8E4DE] font-mono text-xs font-semibold tracking-wider uppercase shadow-[0_12px_35px_rgba(0,0,0,0.85)] transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-[#E87935]"
          >
            <span className="w-2 h-2 rounded-full bg-[#E87935] group-hover:scale-125 transition-transform shrink-0" />
            <Compass className="w-4 h-4 text-[#E87935] transition-transform duration-300 group-hover:rotate-45 shrink-0" />
            <span className="hidden sm:inline">ENTER EXPLORATION MODE</span>
            <span className="sm:hidden">EXPLORE WORLD</span>
            <ArrowUpRight className="w-3.5 h-3.5 text-[#E87935] transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 shrink-0" />
          </motion.button>
        </div>
      )}

      {/* FULL-SCREEN IMMERSIVE EXPLORATION ENVIRONMENT */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            ref={panelRef}
            key="afterhours-exploration-mode"
            role="dialog"
            aria-modal="true"
            aria-label="AFTERHOURS Exploration Mode — Interactive 3D Portfolio World"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{
              duration: motionReduced ? 0.05 : 0.3,
              ease: MOTION_TOKENS.ease,
            }}
            className="fixed inset-0 z-50 bg-[#0b0b0b] overflow-hidden"
          >
            {/* Lazy-Loaded 3D Isometric World Scene */}
            <Suspense
              fallback={
                <div className="w-full h-full flex flex-col items-center justify-center bg-[#101010] font-mono text-xs text-[#A7A19A] gap-3">
                  <Compass className="w-6 h-6 text-[#E87935] animate-spin" />
                  <span className="tracking-widest text-[#E8E4DE] uppercase">
                    INITIALIZING AFTERHOURS WORLD...
                  </span>
                </div>
              }
            >
              <LazyExplorationScene
                hoveredLocation={hoveredLocation}
                selectedLocation={selectedLocation}
                focusedLocationId={focusedLocationId}
                transitionState={transitionState}
                visualQuality={visualQuality}
                motionReduced={motionReduced}
                forceFallbackView={isFallbackView}
                cameraTarget={cameraTarget}
                zoomCommand={zoomCommand}
                onHoverLocation={handleHoverLocation}
                onSelectLocation={handleFocusLocation}
                onEnterLocation={handleEnterPortal}
              />
            </Suspense>

            {/* Phase 4 (Section Reveal): Impact settles into clean section transition */}
            <AnimatePresence>
              {transitionState.phase === 'reveal' && selectedLocation && (
                <motion.div
                  key="portal-transition-reveal"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: motionReduced ? 0.1 : 0.25 }}
                  style={{
                    background:
                      'radial-gradient(circle at 50% 50%, rgba(232,121,53,0.28) 0%, rgba(16,16,16,0.96) 68%)',
                  }}
                  className="pointer-events-none fixed inset-0 z-40 backdrop-blur-md flex flex-col items-center justify-center p-6 text-center"
                >
                  <div className="border border-[#E87935] bg-[#101010]/96 px-8 py-6 max-w-md w-full shadow-[0_0_60px_rgba(232,121,53,0.4)] space-y-2.5">
                    <div className="font-mono text-xs tracking-widest text-[#E87935] uppercase">
                      {selectedLocation.categoryLabel}
                    </div>
                    <div className="font-heading text-2xl sm:text-3xl font-bold text-[#E8E4DE] tracking-wide">
                      {selectedLocation.name}
                    </div>
                    <div className="text-xs sm:text-sm text-[#B8B0A6] pt-1">
                      Opening {selectedLocation.name}...
                    </div>
                    <div className="w-full h-1 bg-[#242220] overflow-hidden mt-3">
                      <motion.div
                        initial={{ width: '0%' }}
                        animate={{ width: '100%' }}
                        transition={{
                          duration: motionReduced ? 0.12 : 0.28,
                          ease: 'easeOut',
                        }}
                        className="h-full bg-[#E87935]"
                      />
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Game-Style Navigation HUD */}
            <ExplorationHUD
              activeLocation={activeLocation}
              isEntering={isEntering}
              isCameraFocused={Boolean(focusedLocationId)}
              quickNavOpen={quickNavOpen}
              onToggleQuickNav={() => {
                playExplorationSound('toggle', soundEnabled);
                setQuickNavOpen((prev) => !prev);
              }}
              onFocusLocation={handleFocusLocation}
              onEnterLocation={handleEnterPortal}
              onExitExploration={handleExitExploration}
              soundEnabled={soundEnabled}
              onToggleSound={() => {
                const next = !soundEnabled;
                setSoundEnabled(next);
                if (next) playExplorationSound('toggle', true);
              }}
              visualQuality={visualQuality}
              onCycleQuality={handleCycleQuality}
              motionReduced={motionReduced}
              onToggleMotion={() => {
                playExplorationSound('toggle', soundEnabled);
                setMotionReduced((prev) => !prev);
              }}
              isFallbackView={isFallbackView}
              onToggleFallbackView={() => {
                playExplorationSound('toggle', soundEnabled);
                setIsFallbackView((prev) => !prev);
              }}
              onZoomIn={() =>
                setZoomCommand({ delta: 0.16, ts: Date.now() })
              }
              onZoomOut={() =>
                setZoomCommand({ delta: -0.16, ts: Date.now() })
              }
              onResetCamera={handleResetOverview}
              closeButtonRef={closeButtonRef}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
