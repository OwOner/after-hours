import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  ArrowUpRight,
  Compass,
  RotateCcw,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';
import { MOTION_TOKENS } from '../../utils/motion.jsx';

/**
 * Interactive 3D-Projected Portal Node anchored to each 3D structure in the
 * isometric world. Displays a recognizable icon, clear destination name
 * (14-16px), and optional short category label (10-11px).
 */
export function ExplorationPortalNode({
  location,
  screenPos,
  isHovered,
  isSelected,
  isFocused,
  transitionPhase,
  motionReduced,
  onHoverStart,
  onHoverEnd,
  onSelect,
}) {
  if (!screenPos || !screenPos.visible) return null;

  const Icon = location.icon;
  const isTransitioning = transitionPhase && transitionPhase !== 'idle';
  const isTargetOfTransition = isTransitioning && isSelected;
  const isDimmedByTransition = isTransitioning && !isSelected;
  const isHighlighted = isHovered || isSelected || isFocused;

  return (
    <div
      style={{
        left: `${screenPos.x}px`,
        top: `${screenPos.y}px`,
      }}
      className={`exploration-portal-node absolute z-20 pointer-events-auto select-none transition-opacity duration-200 ${
        isDimmedByTransition ? 'opacity-20 pointer-events-none' : 'opacity-100'
      }`}
    >
      {/* Animated Portal Activation Ring */}
      <div
        aria-hidden="true"
        className={`pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full border transition-all duration-300 ${
          !motionReduced ? 'exploration-pulse-ring' : ''
        } ${
          isTargetOfTransition
            ? 'w-36 h-36 border-2 border-[#F3A45B] bg-[#E87935]/35 shadow-[0_0_60px_#E87935]'
            : isHighlighted
            ? 'w-20 h-20 border-[#E87935]/90 bg-[#E87935]/15 shadow-[0_0_26px_rgba(232,121,53,0.55)]'
            : 'w-14 h-14 border-[#E87935]/35 bg-[#101010]/30'
        }`}
      />

      {/* Interactive Structure Portal Button */}
      <button
        type="button"
        disabled={isTransitioning}
        onMouseEnter={() => onHoverStart(location)}
        onMouseLeave={() => onHoverEnd(location)}
        onFocus={() => onHoverStart(location)}
        onBlur={() => onHoverEnd(location)}
        onClick={(e) => {
          e.stopPropagation();
          onSelect(location);
        }}
        aria-label={`${location.name} — ${location.tagline}`}
        className={`group relative flex flex-col items-center focus:outline-none transition-transform duration-200 ${
          isTargetOfTransition
            ? 'scale-110 z-40'
            : isHighlighted
            ? 'scale-105 z-30'
            : 'hover:scale-105'
        }`}
      >
        {/* Floating Location Label Badge */}
        <div
          className={`px-3 py-2 sm:px-3.5 sm:py-2.5 border backdrop-blur-md transition-all duration-200 flex items-center gap-2.5 shadow-xl ${
            isTargetOfTransition
              ? 'bg-[#E87935] border-[#FFF] text-[#101010] shadow-[0_0_40px_rgba(232,121,53,0.85)]'
              : isHighlighted
              ? 'bg-[#191919]/96 border-[#E87935] text-[#E8E4DE] shadow-[0_8px_28px_rgba(232,121,53,0.38)]'
              : 'bg-[#101010]/92 border-[#33302D] text-[#E8E4DE] hover:border-[#E87935]/80'
          }`}
        >
          <span
            className={`w-7 h-7 sm:w-8 sm:h-8 flex items-center justify-center border transition-colors shrink-0 ${
              isTargetOfTransition
                ? 'bg-[#101010] border-[#101010] text-[#E87935]'
                : isHighlighted
                ? 'bg-[#E87935] border-[#F3A45B] text-[#101010]'
                : 'bg-[#191919] border-[#33302D] text-[#E87935]'
            }`}
          >
            <Icon className="w-4 h-4" />
          </span>

          <div className="text-left">
            <div
              className={`font-mono text-[10px] sm:text-[11px] tracking-wider uppercase leading-none mb-1 ${
                isTargetOfTransition
                  ? 'text-[#101010] font-semibold'
                  : 'text-[#E87935]'
              }`}
            >
              {location.categoryLabel}
            </div>
            <div
              className={`font-heading text-sm sm:text-base font-bold leading-tight whitespace-nowrap ${
                isTargetOfTransition ? 'text-[#101010]' : 'text-[#E8E4DE]'
              }`}
            >
              {location.name}
            </div>
          </div>

          <ArrowUpRight
            className={`w-4 h-4 transition-transform duration-200 shrink-0 ${
              isTargetOfTransition
                ? 'text-[#101010] translate-x-0.5 -translate-y-0.5'
                : isHighlighted
                ? 'text-[#E87935] translate-x-0.5 -translate-y-0.5'
                : 'text-[#B8B0A6]'
            }`}
          />
        </div>

        {/* Vertical Anchor Stem to 3D Structure Crown */}
        <div
          aria-hidden="true"
          className={`w-[1px] transition-all duration-200 ${
            isHighlighted
              ? 'h-5 bg-gradient-to-b from-[#E87935] to-transparent'
              : 'h-3 bg-[#E87935]/45'
          }`}
        />
        <span
          aria-hidden="true"
          className={`w-2 h-2 rotate-45 border transition-colors ${
            isHighlighted
              ? 'bg-[#E87935] border-[#F3A45B] shadow-[0_0_10px_#E87935]'
              : 'bg-[#191919] border-[#E87935]'
          }`}
        />
      </button>
    </div>
  );
}

/**
 * Selected Location Information Panel.
 * Designed for immediate visitor readability with clear visual hierarchy:
 * 1. Small category label (11px)
 * 2. Large destination title (22-26px, never truncated)
 * 3. Conversational description (14-15px, #B8B0A6)
 * 4. Short list of what visitors can expect to find (13-14px, natural wrap)
 * 5. Prominent primary action button + secondary View Location / Back to Map button
 */
export function ExplorationLocationPanel({
  location,
  isEntering,
  isCameraFocused,
  motionReduced,
  onEnterLocation,
  onFocusCamera,
  onResetOverview,
}) {
  const [collapsedMobile, setCollapsedMobile] = useState(false);

  if (!location) return null;
  const Icon = location.icon;

  return (
    <motion.aside
      key={location.id}
      aria-label={`Selected Destination: ${location.name}`}
      initial={motionReduced ? { opacity: 0 } : { opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={motionReduced ? { opacity: 0 } : { opacity: 0, y: 8 }}
      transition={{ duration: 0.22, ease: MOTION_TOKENS.ease }}
      className="pointer-events-auto fixed left-3 right-3 sm:left-auto sm:right-6 md:right-8 bottom-28 sm:bottom-24 z-30 sm:w-[410px] md:w-[440px] bg-[#101010]/96 backdrop-blur-md border border-[#E87935]/80 p-4 sm:p-6 shadow-[0_24px_60px_rgba(0,0,0,0.9)]"
    >
      {/* Header Bar with Category Label & Full Un-Truncated Destination Title */}
      <div className="flex items-start justify-between gap-3 border-b border-[#33302D] pb-3.5">
        <div className="flex items-start gap-3.5 min-w-0">
          <div className="w-10 h-10 bg-[#191919] border border-[#E87935] flex items-center justify-center text-[#E87935] shrink-0 mt-0.5">
            <Icon className="w-5 h-5" />
          </div>
          <div className="min-w-0">
            <div className="font-mono text-[11px] tracking-widest text-[#E87935] uppercase">
              {location.categoryLabel}
            </div>
            <h3 className="font-heading text-[22px] sm:text-[26px] font-bold text-[#E8E4DE] leading-tight mt-0.5 break-words">
              {location.name}
            </h3>
          </div>
        </div>

        <button
          type="button"
          onClick={() => setCollapsedMobile((prev) => !prev)}
          aria-label={
            collapsedMobile
              ? 'Show destination details'
              : 'Hide destination details'
          }
          title={
            collapsedMobile
              ? 'Show destination details'
              : 'Hide destination details'
          }
          className="sm:hidden p-2 bg-[#191919] border border-[#33302D] text-[#B8B0A6] hover:text-[#E8E4DE] shrink-0"
        >
          {collapsedMobile ? (
            <ChevronUp className="w-4 h-4" />
          ) : (
            <ChevronDown className="w-4 h-4" />
          )}
        </button>
      </div>

      {/* Collapsible Body on Mobile, Always Visible on Tablet/Desktop */}
      <div className={`${collapsedMobile ? 'hidden sm:block' : 'block'}`}>
        <p className="text-sm sm:text-[15px] text-[#B8B0A6] leading-relaxed mt-3.5">
          {location.summary}
        </p>

        <div className="mt-3.5 pt-3 border-t border-[#33302D]/80">
          <div className="font-mono text-[11px] text-[#A7A19A] uppercase tracking-wider mb-2">
            What You&apos;ll Find Here
          </div>
          <ul className="space-y-1.5">
            {location.highlights.map((item, i) => (
              <li
                key={i}
                className="text-[13px] sm:text-sm text-[#E8E4DE] leading-snug flex items-start gap-2.5"
              >
                <span className="text-[#E87935] font-mono mt-0.5 shrink-0">
                  ›
                </span>
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Action Buttons: Secondary (View Location / Back to Map) + Primary (Explore ...) */}
      <div className="mt-4 sm:mt-5 pt-3.5 border-t border-[#33302D] flex flex-wrap items-center justify-between gap-2.5">
        {isCameraFocused ? (
          <button
            type="button"
            disabled={isEntering}
            onClick={onResetOverview}
            className="inline-flex items-center justify-center gap-2 px-3.5 py-2.5 bg-[#191919] hover:bg-[#242220] border border-[#E87935]/70 hover:border-[#E87935] font-mono text-xs sm:text-[13px] text-[#E8E4DE] transition-colors shrink-0 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#E87935]"
          >
            <RotateCcw className="w-4 h-4 text-[#E87935] shrink-0" />
            <span>Back to Map</span>
          </button>
        ) : (
          <button
            type="button"
            disabled={isEntering}
            onClick={() => onFocusCamera(location)}
            className="inline-flex items-center justify-center gap-2 px-3.5 py-2.5 bg-[#191919] hover:bg-[#242220] border border-[#33302D] hover:border-[#E87935] font-mono text-xs sm:text-[13px] text-[#B8B0A6] hover:text-[#E8E4DE] transition-colors shrink-0 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#E87935]"
          >
            <Compass className="w-4 h-4 text-[#E87935] shrink-0" />
            <span>View Location</span>
          </button>
        )}

        <button
          type="button"
          disabled={isEntering}
          onClick={() => onEnterLocation(location)}
          className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-[#E87935] hover:bg-[#F3A45B] text-[#101010] font-mono text-xs sm:text-[13px] font-semibold tracking-wide transition-colors shrink-0 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#F3A45B]"
        >
          <span>
            {isEntering ? 'Opening Section...' : location.actionLabel}
          </span>
          <ArrowUpRight className="w-4 h-4 shrink-0" />
        </button>
      </div>
    </motion.aside>
  );
}
