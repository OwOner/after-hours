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

/**
 * Bottom-Left Environment Settings & Camera Controls.
 * Every control genuinely modifies the live Exploration Mode behavior:
 * - Sound Effects: OFF by default; enables subtle Web Audio portal synthesis when ON.
 * - Visual Quality: AUTO -> HIGH -> LOW (adjusts canvas DPR, particle count, and grid detail).
 * - Motion: ON / REDUCED (toggles ambient rotation, particle drift, and pulse animations).
 * - Camera Zoom / Reset / 2D Tactical Fallback toggle.
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
              aria-label="Zoom camera in"
              className="p-2 bg-[#101010]/90 hover:bg-[#191919] border border-[#33302D] hover:border-[#E87935] text-[#A7A19A] hover:text-[#E8E4DE] transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-[#E87935]"
            >
              <ZoomIn className="w-3.5 h-3.5" />
            </button>
            <button
              type="button"
              onClick={onZoomOut}
              title="Zoom Out"
              aria-label="Zoom camera out"
              className="p-2 bg-[#101010]/90 hover:bg-[#191919] border border-[#33302D] hover:border-[#E87935] text-[#A7A19A] hover:text-[#E8E4DE] transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-[#E87935]"
            >
              <ZoomOut className="w-3.5 h-3.5" />
            </button>
            <button
              type="button"
              onClick={onResetCamera}
              title="Reset Camera Overview"
              aria-label="Reset camera overview"
              className="inline-flex items-center gap-1.5 px-2.5 py-2 bg-[#101010]/90 hover:bg-[#191919] border border-[#33302D] hover:border-[#E87935] font-mono text-[10px] text-[#A7A19A] hover:text-[#E8E4DE] uppercase transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-[#E87935]"
            >
              <RotateCcw className="w-3 h-3 text-[#E87935]" />
              <span className="hidden sm:inline">Overview</span>
            </button>
          </>
        )}

        <button
          type="button"
          onClick={onToggleFallbackView}
          aria-pressed={isFallbackView}
          className="inline-flex items-center gap-1.5 px-2.5 py-2 bg-[#101010]/90 hover:bg-[#191919] border border-[#33302D] hover:border-[#E87935] font-mono text-[10px] text-[#A7A19A] hover:text-[#E8E4DE] uppercase transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-[#E87935]"
        >
          <Layers className="w-3 h-3 text-[#E87935]" />
          <span>{isFallbackView ? '3D Isometric View' : '2D Sector Grid'}</span>
        </button>
      </div>

      {/* Environment Diagnostic Settings Strip */}
      <div className="flex flex-wrap items-center gap-1.5 bg-[#101010]/90 backdrop-blur-md border border-[#33302D] p-1.5">
        <button
          type="button"
          onClick={onToggleSound}
          aria-pressed={soundEnabled}
          className={`inline-flex items-center gap-1.5 px-2.5 py-1 font-mono text-[10px] uppercase transition-colors focus:outline-none focus-visible:ring-1 focus-visible:ring-[#E87935] ${
            soundEnabled
              ? 'bg-[#242220] text-[#E8E4DE] border border-[#E87935]/60'
              : 'bg-[#191919] text-[#A7A19A] hover:text-[#E8E4DE] border border-transparent'
          }`}
        >
          {soundEnabled ? (
            <Volume2 className="w-3 h-3 text-[#E87935]" />
          ) : (
            <VolumeX className="w-3 h-3 text-[#A7A19A]" />
          )}
          <span>Sound: {soundEnabled ? 'ON' : 'OFF'}</span>
        </button>

        <button
          type="button"
          onClick={onCycleQuality}
          className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-[#191919] hover:bg-[#242220] font-mono text-[10px] text-[#A7A19A] hover:text-[#E8E4DE] uppercase transition-colors focus:outline-none focus-visible:ring-1 focus-visible:ring-[#E87935]"
        >
          <Sparkles className="w-3 h-3 text-[#F3A45B]" />
          <span>Quality: {visualQuality}</span>
        </button>

        <button
          type="button"
          onClick={onToggleMotion}
          aria-pressed={!motionReduced}
          className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-[#191919] hover:bg-[#242220] font-mono text-[10px] text-[#A7A19A] hover:text-[#E8E4DE] uppercase transition-colors focus:outline-none focus-visible:ring-1 focus-visible:ring-[#E87935]"
        >
          <Activity className="w-3 h-3 text-[#E87935]" />
          <span>Motion: {motionReduced ? 'REDUCED' : 'ON'}</span>
        </button>
      </div>
    </div>
  );
}
