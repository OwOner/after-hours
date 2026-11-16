import { useState, useEffect } from 'react';
import { AnimatePresence } from 'framer-motion';
import { X, Maximize2, Minimize2, RotateCcw } from 'lucide-react';
import ExplorationNavigation from './ExplorationNavigation.jsx';
import ExplorationControls from './ExplorationControls.jsx';
import { ExplorationLocationPanel } from './ExplorationLocation.jsx';

export default function ExplorationHUD({
  activeLocation,
  isEntering,
  isCameraFocused,
  quickNavOpen,
  onToggleQuickNav,
  onFocusLocation,
  onEnterLocation,
  onExitExploration,
  soundEnabled,
  onToggleSound,
  visualQuality,
  onCycleQuality,
  motionReduced,
  onToggleMotion,
  isFallbackView,
  onToggleFallbackView,
  onZoomIn,
  onZoomOut,
  onResetCamera,
  closeButtonRef,
}) {
  const [fullscreenSupported, setFullscreenSupported] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);

  useEffect(() => {
    if (typeof document !== 'undefined' && document.fullscreenEnabled) {
      setFullscreenSupported(true);
    }
    const handleFullscreenChange = () => {
      setIsFullscreen(Boolean(document.fullscreenElement));
    };
    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () =>
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
  }, []);

  const toggleFullscreen = async () => {
    try {
      if (!document.fullscreenElement) {
        await document.documentElement.requestFullscreen();
      } else if (document.exitFullscreen) {
        await document.exitFullscreen();
      }
    } catch {
      // Ignore fullscreen permissions errors
    }
  };

  return (
    <div className="fixed inset-0 z-30 pointer-events-none flex flex-col justify-between p-4 sm:p-6 md:p-8 select-none">
      {/* TOP BAR: Brand Status (Top-Left) + Back to Map + Quick Navigation (Top-Right) */}
      <div className="flex items-start justify-between gap-3">
        {/* Top-Left: Brand & Visitor-Friendly Mode Status */}
        <div className="flex flex-wrap items-center gap-2.5">
          <div className="pointer-events-auto bg-[#101010]/92 backdrop-blur-md border border-[#33302D] px-4 py-3 shadow-xl max-w-xs sm:max-w-md">
            <div className="flex items-center gap-2.5">
              <span className="w-2 h-2 bg-[#E87935] rotate-45 shrink-0" />
              <span className="font-heading font-bold tracking-wider text-sm sm:text-base text-[#E8E4DE]">
                AFTERHOURS
              </span>
              <span className="font-mono text-[11px] sm:text-xs tracking-wider text-[#E87935] pl-2.5 border-l border-[#33302D] uppercase">
                EXPLORATION MODE
              </span>
            </div>
            <div className="mt-1.5 flex items-center gap-2 text-[11px] sm:text-xs text-[#B8B0A6]">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 shrink-0" />
              <span>
                {isCameraFocused && activeLocation
                  ? `Viewing ${activeLocation.name} — Click "${activeLocation.actionLabel}" to open`
                  : 'Click any destination on the map to explore the portfolio'}
              </span>
            </div>
          </div>

          {isCameraFocused && !isFallbackView && (
            <button
              type="button"
              disabled={isEntering}
              onClick={onResetCamera}
              title="Return to the full map overview"
              className="pointer-events-auto inline-flex items-center gap-2 px-4 py-2.5 bg-[#191919]/95 hover:bg-[#E87935] text-[#E8E4DE] hover:text-[#101010] border border-[#E87935] font-mono text-xs sm:text-[13px] font-semibold tracking-wide shadow-xl transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-[#F3A45B]"
            >
              <RotateCcw className="w-4 h-4 text-[#E87935] group-hover:text-[#101010]" />
              <span>Back to Map</span>
            </button>
          )}
        </div>

        {/* Top-Right: Quick Navigation Drawer */}
        <ExplorationNavigation
          isOpen={quickNavOpen}
          onToggle={onToggleQuickNav}
          activeLocationId={activeLocation?.id}
          isEntering={isEntering}
          onFocusLocation={onFocusLocation}
          onNavigateToSection={onEnterLocation}
          motionReduced={motionReduced}
        />
      </div>

      {/* STANDALONE FLOATING SELECTED-LOCATION PANEL */}
      <AnimatePresence mode="wait">
        {activeLocation && !isEntering && (
          <ExplorationLocationPanel
            key={activeLocation.id}
            location={activeLocation}
            isEntering={isEntering}
            isCameraFocused={isCameraFocused}
            motionReduced={motionReduced}
            onEnterLocation={onEnterLocation}
            onFocusCamera={onFocusLocation}
            onResetOverview={onResetCamera}
          />
        )}
      </AnimatePresence>

      {/* BOTTOM BAR: Environment Settings (Bottom-Left) + Exit & Fullscreen (Bottom-Right) */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3">
        {/* Bottom-Left: Environment Settings & Camera Controls */}
        <ExplorationControls
          soundEnabled={soundEnabled}
          onToggleSound={onToggleSound}
          visualQuality={visualQuality}
          onCycleQuality={onCycleQuality}
          motionReduced={motionReduced}
          onToggleMotion={onToggleMotion}
          isFallbackView={isFallbackView}
          onToggleFallbackView={onToggleFallbackView}
          onZoomIn={onZoomIn}
          onZoomOut={onZoomOut}
          onResetCamera={onResetCamera}
        />

        {/* Bottom-Right: Fullscreen Toggle & Exit Exploration Mode */}
        <div className="pointer-events-auto flex items-center justify-end gap-2">
          {fullscreenSupported && (
            <button
              type="button"
              onClick={toggleFullscreen}
              title={isFullscreen ? 'Exit Fullscreen' : 'Enter Fullscreen'}
              aria-label={isFullscreen ? 'Exit Fullscreen' : 'Enter Fullscreen'}
              className="p-3 bg-[#101010]/92 hover:bg-[#191919] border border-[#33302D] hover:border-[#E87935] text-[#B8B0A6] hover:text-[#E8E4DE] transition-colors shadow-xl focus:outline-none focus-visible:ring-2 focus-visible:ring-[#E87935]"
            >
              {isFullscreen ? (
                <Minimize2 className="w-4 h-4" />
              ) : (
                <Maximize2 className="w-4 h-4" />
              )}
            </button>
          )}

          <button
            ref={closeButtonRef}
            type="button"
            onClick={onExitExploration}
            title="Close Exploration Mode and return to portfolio"
            className="inline-flex items-center gap-2.5 px-5 py-3 bg-[#191919]/95 hover:bg-[#E87935] text-[#E8E4DE] hover:text-[#101010] border border-[#E87935] font-mono text-xs sm:text-[13px] font-semibold tracking-wide transition-colors shadow-xl focus:outline-none focus-visible:ring-2 focus-visible:ring-[#F3A45B]"
          >
            <X className="w-4 h-4" />
            <span>Exit Exploration Mode</span>
          </button>
        </div>
      </div>
    </div>
  );
}
