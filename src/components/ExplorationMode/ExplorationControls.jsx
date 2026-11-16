import {
  Volume2,
  VolumeX,
  Sparkles,
  Activity,
  ZoomIn,
  ZoomOut,
  RotateCcw,
  Layers,
} from 'lucide-react';
import ThemeToggle from '../ThemeToggle.jsx';

const QUALITY_LABELS = {
  AUTO: 'Auto',
  HIGH: 'High',
  LOW: 'Low',
};

/**
 * Bottom-Left Environment Settings & Camera Controls.
 * Uses clear, visitor-friendly labels (Zoom In, Zoom Out, Full Map, Map Grid,
 * Sound Effects: Off, Visual Quality: Auto, Reduced Motion: Off).
 */
export default function ExplorationControls({
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
}) {
  const qualityDisplay = QUALITY_LABELS[visualQuality] || 'Auto';

  return (
    <div className="pointer-events-auto flex flex-col gap-2">
      {/* Camera & View Mode Controls */}
      <div className="flex flex-wrap items-center gap-1.5">
        {!isFallbackView && (
          <>
            <button
              type="button"
              onClick={onZoomIn}
              title="Zoom In"
              aria-label="Zoom In"
              className="inline-flex items-center gap-1.5 px-3 py-2 bg-[#101010]/92 hover:bg-[#191919] border border-[#33302D] hover:border-[#E87935] font-mono text-xs text-[#B8B0A6] hover:text-[#E8E4DE] transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-[#E87935]"
            >
              <ZoomIn className="w-3.5 h-3.5 text-[#E87935]" />
              <span className="hidden md:inline">Zoom In</span>
            </button>
            <button
              type="button"
              onClick={onZoomOut}
              title="Zoom Out"
              aria-label="Zoom Out"
              className="inline-flex items-center gap-1.5 px-3 py-2 bg-[#101010]/92 hover:bg-[#191919] border border-[#33302D] hover:border-[#E87935] font-mono text-xs text-[#B8B0A6] hover:text-[#E8E4DE] transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-[#E87935]"
            >
              <ZoomOut className="w-3.5 h-3.5 text-[#E87935]" />
              <span className="hidden md:inline">Zoom Out</span>
            </button>
            <button
              type="button"
              onClick={onResetCamera}
              title="Reset to Full Map"
              aria-label="Full Map"
              className="inline-flex items-center gap-1.5 px-3 py-2 bg-[#101010]/92 hover:bg-[#191919] border border-[#33302D] hover:border-[#E87935] font-mono text-xs text-[#B8B0A6] hover:text-[#E8E4DE] transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-[#E87935]"
            >
              <RotateCcw className="w-3.5 h-3.5 text-[#E87935]" />
              <span>Full Map</span>
            </button>
          </>
        )}

        <button
          type="button"
          onClick={onToggleFallbackView}
          aria-pressed={isFallbackView}
          title={
            isFallbackView ? 'Switch to 3D Map View' : 'Switch to Map Grid view'
          }
          className="inline-flex items-center gap-1.5 px-3 py-2 bg-[#101010]/92 hover:bg-[#191919] border border-[#33302D] hover:border-[#E87935] font-mono text-xs text-[#B8B0A6] hover:text-[#E8E4DE] transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-[#E87935]"
        >
          <Layers className="w-3.5 h-3.5 text-[#E87935]" />
          <span>{isFallbackView ? '3D Map View' : 'Map Grid'}</span>
        </button>
      </div>

      {/* Environment Settings Strip */}
      <div className="flex flex-wrap items-center gap-1.5 bg-[#101010]/92 backdrop-blur-md border border-[#33302D] p-1.5">
        <button
          type="button"
          onClick={onToggleSound}
          aria-pressed={soundEnabled}
          title="Toggle interface sound effects"
          className={`inline-flex items-center gap-1.5 px-2.5 py-1.5 font-mono text-[11px] sm:text-xs transition-colors focus:outline-none focus-visible:ring-1 focus-visible:ring-[#E87935] ${
            soundEnabled
              ? 'bg-[#242220] text-[#E8E4DE] border border-[#E87935]/60'
              : 'bg-[#191919] text-[#B8B0A6] hover:text-[#E8E4DE] border border-transparent'
          }`}
        >
          {soundEnabled ? (
            <Volume2 className="w-3.5 h-3.5 text-[#E87935]" />
          ) : (
            <VolumeX className="w-3.5 h-3.5 text-[#A7A19A]" />
          )}
          <span>Sound Effects: {soundEnabled ? 'On' : 'Off'}</span>
        </button>

        <button
          type="button"
          onClick={onCycleQuality}
          title="Cycle visual rendering quality (Auto, High, Low)"
          className="inline-flex items-center gap-1.5 px-2.5 py-1.5 bg-[#191919] hover:bg-[#242220] font-mono text-[11px] sm:text-xs text-[#B8B0A6] hover:text-[#E8E4DE] transition-colors focus:outline-none focus-visible:ring-1 focus-visible:ring-[#E87935]"
        >
          <Sparkles className="w-3.5 h-3.5 text-[#F3A45B]" />
          <span>Visual Quality: {qualityDisplay}</span>
        </button>

        <button
          type="button"
          onClick={onToggleMotion}
          aria-pressed={motionReduced}
          title="Toggle reduced motion mode"
          className="inline-flex items-center gap-1.5 px-2.5 py-1.5 bg-[#191919] hover:bg-[#242220] font-mono text-[11px] sm:text-xs text-[#B8B0A6] hover:text-[#E8E4DE] transition-colors focus:outline-none focus-visible:ring-1 focus-visible:ring-[#E87935]"
        >
          <Activity className="w-3.5 h-3.5 text-[#E87935]" />
          <span>Reduced Motion: {motionReduced ? 'On' : 'Off'}</span>
        </button>

        <ThemeToggle variant="hud" />
      </div>
    </div>
  );
}
