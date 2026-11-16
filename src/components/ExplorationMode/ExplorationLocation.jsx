import { motion } from 'framer-motion';
import { ArrowUpRight, Compass } from 'lucide-react';
import { MOTION_TOKENS } from '../../utils/motion.jsx';

/**
 * Interactive 3D-Projected Portal Node anchored to each 3D structure in the
 * isometric world. Combines a glowing portal activation ring, architectural
 * badge, and keyboard-accessible trigger.
 */
export function ExplorationPortalNode({
  location,
  screenPos,
  isHovered,
  isSelected,
  isEntering,
  motionReduced,
  onHoverStart,
  onHoverEnd,
  onSelect,
}) {
  if (!screenPos || !screenPos.visible) return null;

  const Icon = location.icon;
  const isHighlighted = isHovered || isSelected;

  return (
    <div
      style={{
        left: `${screenPos.x}px`,
        top: `${screenPos.y}px`,
      }}
      className="exploration-portal-node absolute z-20 pointer-events-auto select-none"
    >
      {/* Animated Portal Activation Ring */}
      <div
        aria-hidden="true"
        className={`pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full border transition-all duration-300 ${
          !motionReduced ? 'exploration-pulse-ring' : ''
        } ${
          isEntering && isSelected
            ? 'w-28 h-28 border-[#E87935] bg-[#E87935]/25 shadow-[0_0_40px_#E87935]'
            : isHighlighted
            ? 'w-20 h-20 border-[#E87935]/90 bg-[#E87935]/15 shadow-[0_0_24px_rgba(232,121,53,0.5)]'
            : 'w-14 h-14 border-[#E87935]/35 bg-[#101010]/30'
        }`}
      />

      {/* Interactive Structure Portal Button */}
      <button
        type="button"
        onMouseEnter={() => onHoverStart(location)}
        onMouseLeave={() => onHoverEnd(location)}
        onFocus={() => onHoverStart(location)}
        onBlur={() => onHoverEnd(location)}
        onClick={(e) => {
          e.stopPropagation();
          onSelect(location);
        }}
        aria-label={`${location.name} — Navigate to ${location.sectionLabel} section`}
        className={`group relative flex flex-col items-center focus:outline-none transition-transform duration-200 ${
          isHighlighted ? 'scale-105 z-30' : 'hover:scale-105'
        }`}
      >
        {/* Floating Portal Title Tag */}
        <div
          className={`px-2.5 py-1.5 sm:px-3 sm:py-1.5 border backdrop-blur-md transition-all duration-200 flex items-center gap-2 shadow-xl ${
            isHighlighted
              ? 'bg-[#191919]/95 border-[#E87935] text-[#E8E4DE] shadow-[0_8px_28px_rgba(232,121,53,0.35)]'
              : 'bg-[#101010]/90 border-[#33302D] text-[#E8E4DE]/90 hover:border-[#E87935]/70'
          }`}
        >
          <span
            className={`w-6 h-6 flex items-center justify-center border transition-colors shrink-0 ${
              isHighlighted
                ? 'bg-[#E87935] border-[#F3A45B] text-[#101010]'
                : 'bg-[#191919] border-[#33302D] text-[#E87935]'
            }`}
          >
            <Icon className="w-3.5 h-3.5" />
          </span>

          <div className="text-left">
            <div className="flex items-center gap-1.5 font-mono text-[9px] tracking-widest uppercase">
              <span className="text-[#E87935]">{location.code}</span>
              <span className="text-[#A7A19A]">•</span>
              <span className="text-[#F3A45B]">{location.navShortLabel}</span>
            </div>
            <div className="font-heading text-xs sm:text-sm font-bold text-[#E8E4DE] leading-tight whitespace-nowrap">
              {location.name}
            </div>
          </div>

          <ArrowUpRight
            className={`w-3.5 h-3.5 transition-transform duration-200 shrink-0 ${
              isHighlighted
                ? 'text-[#E87935] translate-x-0.5 -translate-y-0.5'
                : 'text-[#A7A19A]'
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
 * Compact Holographic Information Panel displayed when a visitor hovers,
 * focuses, or inspects a portfolio structure in the 3D world.
 */
export function ExplorationLocationPanel({
  location,
  isEntering,
  motionReduced,
  onEnterLocation,
  onFocusCamera,
}) {
  if (!location) return null;
  const Icon = location.icon;

  return (
    <motion.div
      key={location.id}
      initial={motionReduced ? { opacity: 0 } : { opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={motionReduced ? { opacity: 0 } : { opacity: 0, y: 8 }}
      transition={{ duration: 0.22, ease: MOTION_TOKENS.ease }}
      className="pointer-events-auto w-full max-w-md bg-[#101010]/95 backdrop-blur-md border border-[#E87935]/80 p-4 sm:p-5 shadow-[0_20px_50px_rgba(0,0,0,0.85)]"
    >
      <div className="flex items-start justify-between gap-3 border-b border-[#33302D] pb-3">
        <div className="flex items-center gap-3 min-w-0">
          <div className="w-9 h-9 bg-[#191919] border border-[#E87935] flex items-center justify-center text-[#E87935] shrink-0">
            <Icon className="w-4 h-4" />
          </div>
          <div className="min-w-0">
            <div className="font-mono text-[10px] tracking-widest text-[#E87935] uppercase">
              {`${location.code} // ${location.portalTitle}`}
            </div>
            <h3 className="font-heading text-lg sm:text-xl font-bold text-[#E8E4DE] truncate">
              {location.name}
            </h3>
          </div>
        </div>
        <span className="font-mono text-[9px] px-2 py-1 bg-[#191919] border border-[#33302D] text-[#F3A45B] shrink-0 uppercase">
          {location.metaBadge}
        </span>
      </div>

      <p className="text-xs text-[#A7A19A] leading-relaxed mt-3">
        {location.summary}
      </p>

      <ul className="mt-3 space-y-1 border-t border-[#33302D]/70 pt-2.5">
        {location.highlights.slice(0, 3).map((item, i) => (
          <li
            key={i}
            className="font-mono text-[10px] text-[#E8E4DE]/90 flex items-start gap-2 truncate"
          >
            <span className="text-[#E87935]">›</span>
            <span className="truncate">{item}</span>
          </li>
        ))}
      </ul>

      <div className="mt-4 pt-3 border-t border-[#33302D] flex items-center justify-between gap-2">
        <button
          type="button"
          onClick={() => onFocusCamera(location)}
          className="inline-flex items-center gap-1.5 px-3 py-2 bg-[#191919] hover:bg-[#242220] border border-[#33302D] hover:border-[#E87935] font-mono text-[10px] text-[#A7A19A] hover:text-[#E8E4DE] uppercase transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-[#E87935]"
        >
          <Compass className="w-3.5 h-3.5 text-[#E87935]" />
          <span>Focus Camera</span>
        </button>

        <button
          type="button"
          disabled={isEntering}
          onClick={() => onEnterLocation(location)}
          className="inline-flex items-center gap-2 px-4 py-2 bg-[#E87935] hover:bg-[#F3A45B] text-[#101010] font-mono text-[11px] font-semibold tracking-wider uppercase transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-[#F3A45B]"
        >
          <span>
            {isEntering
              ? 'ENTERING PORTAL...'
              : `ENTER ${location.navShortLabel}`}
          </span>
          <ArrowUpRight className="w-3.5 h-3.5" />
        </button>
      </div>
    </motion.div>
  );
}
