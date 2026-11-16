import { useState, useEffect, useRef, useCallback } from 'react';
import { ArrowUpRight, Compass } from 'lucide-react';
import {
  EXPLORATION_LOCATIONS,
  EXPLORATION_PATHWAYS,
} from './explorationData.js';
import { ExplorationPortalNode } from './ExplorationLocation.jsx';

/**
 * Checks whether the current browser environment supports WebGL rendering.
 */
function checkWebGLSupport() {
  if (typeof window === 'undefined' || typeof document === 'undefined') {
    return false;
  }
  try {
    const testCanvas = document.createElement('canvas');
    const gl =
      testCanvas.getContext('webgl2') ||
      testCanvas.getContext('webgl') ||
      testCanvas.getContext('experimental-webgl');
    return Boolean(gl);
  } catch {
    return false;
  }
}

/**
 * Projects a 3D world point (x, y, z) into 2D isometric viewport coordinates.
 * y is vertical elevation (up), x and z are ground-plane coordinates.
 */
function projectPoint3D(x, y, z, cam) {
  const dx = x - cam.x;
  const dz = z - cam.z;
  const cos = Math.cos(cam.yaw);
  const sin = Math.sin(cam.yaw);

  const rx = dx * cos - dz * sin;
  const rz = dx * sin + dz * cos;

  const screenX = cam.centerX + rx * cam.zoom;
  const screenY = cam.centerY + (rz * cam.pitch - y) * cam.zoom;
  const depth = rz + y * 0.12;

  return { x: screenX, y: screenY, depth };
}

/**
 * Draws an extruded 3D axis-aligned box in isometric space with directional
 * face shading and technical wireframe edges.
 */
function drawBox3D(ctx, cam, cx, yBottom, cz, w, h, d, palette) {
  const hw = w / 2;
  const hd = d / 2;
  const yTop = yBottom + h;

  // Top 4 corners (clockwise from back-left)
  const t0 = projectPoint3D(cx - hw, yTop, cz - hd, cam);
  const t1 = projectPoint3D(cx + hw, yTop, cz - hd, cam);
  const t2 = projectPoint3D(cx + hw, yTop, cz + hd, cam);
  const t3 = projectPoint3D(cx - hw, yTop, cz + hd, cam);

  // Bottom 4 corners
  const b1 = projectPoint3D(cx + hw, yBottom, cz - hd, cam);
  const b2 = projectPoint3D(cx + hw, yBottom, cz + hd, cam);
  const b3 = projectPoint3D(cx - hw, yBottom, cz + hd, cam);

  ctx.lineWidth = palette.lineWidth || 1;
  ctx.strokeStyle = palette.stroke || 'rgba(51, 48, 45, 0.85)';

  // Left-front face (t3 -> t2 -> b2 -> b3)
  ctx.fillStyle = palette.leftFace || '#1B1918';
  ctx.beginPath();
  ctx.moveTo(t3.x, t3.y);
  ctx.lineTo(t2.x, t2.y);
  ctx.lineTo(b2.x, b2.y);
  ctx.lineTo(b3.x, b3.y);
  ctx.closePath();
  ctx.fill();
  ctx.stroke();

  // Right-front face (t2 -> t1 -> b1 -> b2)
  ctx.fillStyle = palette.rightFace || '#131211';
  ctx.beginPath();
  ctx.moveTo(t2.x, t2.y);
  ctx.lineTo(t1.x, t1.y);
  ctx.lineTo(b1.x, b1.y);
  ctx.lineTo(b2.x, b2.y);
  ctx.closePath();
  ctx.fill();
  ctx.stroke();

  // Top face (t0 -> t1 -> t2 -> t3)
  ctx.fillStyle = palette.topFace || '#252321';
  ctx.beginPath();
  ctx.moveTo(t0.x, t0.y);
  ctx.lineTo(t1.x, t1.y);
  ctx.lineTo(t2.x, t2.y);
  ctx.lineTo(t3.x, t3.y);
  ctx.closePath();
  ctx.fill();
  ctx.stroke();
}

/**
 * Draws an extruded 3D regular polygon platform (e.g., hexagonal or octagonal pad).
 */
function drawPlatform3D(
  ctx,
  cam,
  cx,
  yBottom,
  cz,
  radius,
  height,
  sides,
  palette,
) {
  const yTop = yBottom + height;
  const topPts = [];
  const botPts = [];

  for (let i = 0; i < sides; i++) {
    const angle = (i / sides) * Math.PI * 2 + Math.PI / sides;
    const px = cx + Math.cos(angle) * radius;
    const pz = cz + Math.sin(angle) * radius;
    topPts.push(projectPoint3D(px, yTop, pz, cam));
    botPts.push(projectPoint3D(px, yBottom, pz, cam));
  }

  // Ground shadow
  ctx.fillStyle = 'rgba(0, 0, 0, 0.55)';
  ctx.beginPath();
  for (let i = 0; i < sides; i++) {
    const angle = (i / sides) * Math.PI * 2 + Math.PI / sides;
    const sp = projectPoint3D(
      cx + Math.cos(angle) * (radius * 1.12),
      0,
      cz + Math.sin(angle) * (radius * 1.12),
      cam,
    );
    if (i === 0) ctx.moveTo(sp.x, sp.y);
    else ctx.lineTo(sp.x, sp.y);
  }
  ctx.closePath();
  ctx.fill();

  // Front-facing side walls
  for (let i = 0; i < sides; i++) {
    const next = (i + 1) % sides;
    const tA = topPts[i];
    const tB = topPts[next];
    const bB = botPts[next];
    const bA = botPts[i];

    // Draw front-facing walls where screen normal points downward
    if (tA.y + tB.y >= topPts[(i + Math.floor(sides / 2)) % sides].y * 1.95) {
      ctx.fillStyle = i % 2 === 0 ? '#181715' : '#121110';
      ctx.strokeStyle = palette.wallStroke || 'rgba(51, 48, 45, 0.9)';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(tA.x, tA.y);
      ctx.lineTo(tB.x, tB.y);
      ctx.lineTo(bB.x, bB.y);
      ctx.lineTo(bA.x, bA.y);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();
    }
  }

  // Top Deck
  ctx.fillStyle = palette.topFill || '#1D1C1A';
  ctx.strokeStyle = palette.topStroke || '#33302D';
  ctx.lineWidth = palette.strokeWidth || 1.5;
  ctx.beginPath();
  topPts.forEach((pt, idx) => {
    if (idx === 0) ctx.moveTo(pt.x, pt.y);
    else ctx.lineTo(pt.x, pt.y);
  });
  ctx.closePath();
  ctx.fill();
  ctx.stroke();
}

/**
 * Draws a 3D ring in world coordinates (horizontal or tilted gyroscopic ring).
 */
function drawRing3D(
  ctx,
  cam,
  cx,
  cy,
  cz,
  radius,
  tiltX,
  tiltZ,
  rotY,
  strokeStyle,
  lineWidth = 1.5,
  segments = 36,
) {
  ctx.strokeStyle = strokeStyle;
  ctx.lineWidth = lineWidth;
  ctx.beginPath();

  for (let i = 0; i <= segments; i++) {
    const theta = (i / segments) * Math.PI * 2 + rotY;
    let lx = Math.cos(theta) * radius;
    let lz = Math.sin(theta) * radius;
    let ly = 0;

    // Apply tiltX and tiltZ
    if (tiltX) {
      const cosX = Math.cos(tiltX);
      const sinX = Math.sin(tiltX);
      const ny = ly * cosX - lz * sinX;
      const nz = ly * sinX + lz * cosX;
      ly = ny;
      lz = nz;
    }
    if (tiltZ) {
      const cosZ = Math.cos(tiltZ);
      const sinZ = Math.sin(tiltZ);
      const nx = lx * cosZ - ly * sinZ;
      const ny = lx * sinZ + ly * cosZ;
      lx = nx;
      ly = ny;
    }

    const pt = projectPoint3D(cx + lx, cy + ly, cz + lz, cam);
    if (i === 0) ctx.moveTo(pt.x, pt.y);
    else ctx.lineTo(pt.x, pt.y);
  }
  ctx.stroke();
}

/**
 * Draws a glowing 3D Portal Gateway arch on a sector platform.
 */
function drawPortalArch3D(
  ctx,
  cam,
  cx,
  yBase,
  cz,
  width,
  height,
  isHighlighted,
  accent,
  time,
) {
  const hw = width / 2;
  const pBL = projectPoint3D(cx - hw, yBase, cz + 28, cam);
  const pBR = projectPoint3D(cx + hw, yBase, cz + 28, cam);
  const pTR = projectPoint3D(cx + hw, yBase + height, cz + 28, cam);
  const pTL = projectPoint3D(cx - hw, yBase + height, cz + 28, cam);

  // Inner portal energy field
  ctx.fillStyle = isHighlighted
    ? 'rgba(232, 121, 53, 0.34)'
    : 'rgba(232, 121, 53, 0.14)';
  ctx.beginPath();
  ctx.moveTo(pBL.x, pBL.y);
  ctx.lineTo(pBR.x, pBR.y);
  ctx.lineTo(pTR.x, pTR.y);
  ctx.lineTo(pTL.x, pTL.y);
  ctx.closePath();
  ctx.fill();

  // Animated horizontal portal scan-line
  const scanRatio = (Math.sin(time * 2.5) + 1) * 0.5;
  const scanY = yBase + 4 + scanRatio * (height - 8);
  const sL = projectPoint3D(cx - hw + 2, scanY, cz + 28, cam);
  const sR = projectPoint3D(cx + hw - 2, scanY, cz + 28, cam);
  ctx.strokeStyle = isHighlighted ? '#F3A45B' : 'rgba(243, 164, 91, 0.55)';
  ctx.lineWidth = isHighlighted ? 2 : 1;
  ctx.beginPath();
  ctx.moveTo(sL.x, sL.y);
  ctx.lineTo(sR.x, sR.y);
  ctx.stroke();

  // Portal arch frame
  ctx.strokeStyle = isHighlighted ? accent : 'rgba(232, 121, 53, 0.7)';
  ctx.lineWidth = isHighlighted ? 2.5 : 1.5;
  ctx.beginPath();
  ctx.moveTo(pBL.x, pBL.y);
  ctx.lineTo(pTL.x, pTL.y);
  ctx.lineTo(pTR.x, pTR.y);
  ctx.lineTo(pBR.x, pBR.y);
  ctx.stroke();
}

/**
 * Draws the specific 3D architectural structure for each portfolio destination.
 */
function drawSectorArchitecture3D(
  ctx,
  cam,
  loc,
  isHovered,
  isSelected,
  time,
) {
  const { x: cx, z: cz } = loc.position;
  const isHighlighted = isHovered || isSelected;
  const floatOffset = isHighlighted ? Math.sin(time * 3) * 3.5 : 0;
  const baseElevation = 12;

  // 1. Base Hexagonal/Octagonal Sector Platform
  drawPlatform3D(ctx, cam, cx, 0, cz, 62, baseElevation, 8, {
    topFill: isHighlighted ? '#24211E' : '#181715',
    topStroke: isHighlighted ? loc.accent : '#33302D',
    wallStroke: isHighlighted ? 'rgba(232, 121, 53, 0.55)' : '#282623',
    strokeWidth: isHighlighted ? 2 : 1.2,
  });

  // 2. Rotating Base Activation Ring on Platform Deck
  drawRing3D(
    ctx,
    cam,
    cx,
    baseElevation + 1,
    cz,
    48,
    0,
    0,
    time * (isHighlighted ? 0.9 : 0.35),
    isHighlighted ? loc.accent : 'rgba(232, 121, 53, 0.32)',
    isHighlighted ? 2 : 1,
  );

  const pal = {
    topFace: isHighlighted ? '#302C28' : '#252320',
    leftFace: isHighlighted ? '#24211E' : '#1B1A18',
    rightFace: isHighlighted ? '#191715' : '#121110',
    stroke: isHighlighted ? loc.accent : 'rgba(232, 121, 53, 0.38)',
    lineWidth: isHighlighted ? 1.5 : 1,
  };

  // 3. Bespoke 3D Structure Silhouette per Archetype
  if (loc.archetype === 'server-complex') {
    // Twin Server Towers + Skybridge
    drawBox3D(ctx, cam, cx - 18, baseElevation, cz - 8, 22, 76 + floatOffset, 22, pal);
    drawBox3D(ctx, cam, cx + 18, baseElevation, cz - 8, 22, 62 + floatOffset, 22, pal);
    // Data Skybridge
    drawBox3D(ctx, cam, cx, baseElevation + 38 + floatOffset, cz - 8, 20, 10, 14, {
      ...pal,
      topFace: '#E87935',
    });
    // Server Rack Status LEDs
    for (let row = 0; row < 4; row++) {
      const ledY = baseElevation + 16 + row * 13 + floatOffset;
      const pL = projectPoint3D(cx - 24, ledY, cz + 4, cam);
      const pR = projectPoint3D(cx - 12, ledY, cz + 4, cam);
      ctx.strokeStyle = row % 2 === 0 ? '#E87935' : '#F3A45B';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(pL.x, pL.y);
      ctx.lineTo(pR.x, pR.y);
      ctx.stroke();
    }
  } else if (loc.archetype === 'tech-core') {
    // 4 Corner Pylons + Levitating Core + Gyroscopic Rings
    const offsets = [
      [-24, -24],
      [24, -24],
      [24, 24],
      [-24, 24],
    ];
    offsets.forEach(([ox, oz]) => {
      drawBox3D(ctx, cam, cx + ox, baseElevation, cz + oz, 10, 42, 10, pal);
    });
    // Suspended Reactor Cube
    const coreY = baseElevation + 34 + Math.sin(time * 2.2) * 5;
    drawBox3D(ctx, cam, cx, coreY, cz, 22, 22, 22, {
      topFace: '#F3A45B',
      leftFace: '#E87935',
      rightFace: '#B8571B',
      stroke: '#FFF',
      lineWidth: 1.2,
    });
    // Tilted 3D Gyroscopic Rings
    drawRing3D(
      ctx,
      cam,
      cx,
      coreY + 11,
      cz,
      32,
      0.65,
      0.3,
      time * 1.1,
      isHighlighted ? '#38BDF8' : 'rgba(56, 189, 248, 0.55)',
      1.5,
    );
    drawRing3D(
      ctx,
      cam,
      cx,
      coreY + 11,
      cz,
      26,
      -0.55,
      0.4,
      -time * 0.9,
      '#E87935',
      1.5,
    );
  } else if (loc.archetype === 'developer-terminal') {
    // Command Sanctum Monolith + Cantilevered Canopy
    drawBox3D(ctx, cam, cx, baseElevation, cz - 6, 44, 58 + floatOffset, 24, pal);
    drawBox3D(
      ctx,
      cam,
      cx,
      baseElevation + 58 + floatOffset,
      cz - 2,
      54,
      10,
      32,
      {
        ...pal,
        topFace: isHighlighted ? '#E87935' : '#2C2825',
      },
    );
    // Floating Terminal Beacon Ring
    drawRing3D(
      ctx,
      cam,
      cx,
      baseElevation + 78 + floatOffset,
      cz - 2,
      18,
      0,
      0,
      -time * 1.2,
      '#F3A45B',
      1.8,
    );
  } else if (loc.archetype === 'operations-center') {
    // 3-Tier Ascending Citadel (Foundation -> Media -> Core Engineering)
    drawBox3D(ctx, cam, cx - 20, baseElevation, cz - 4, 18, 34 + floatOffset, 24, pal);
    drawBox3D(ctx, cam, cx, baseElevation, cz - 6, 20, 52 + floatOffset, 26, pal);
    drawBox3D(ctx, cam, cx + 20, baseElevation, cz - 8, 18, 72 + floatOffset, 24, {
      ...pal,
      topFace: isHighlighted ? '#E87935' : '#2D2926',
    });
  } else if (loc.archetype === 'media-station') {
    // Widescreen Broadcast Stage + Acoustic Side Wings
    drawBox3D(ctx, cam, cx, baseElevation, cz - 8, 50, 50 + floatOffset, 16, pal);
    drawBox3D(ctx, cam, cx - 30, baseElevation, cz + 2, 10, 58 + floatOffset, 18, pal);
    drawBox3D(ctx, cam, cx + 30, baseElevation, cz + 2, 10, 58 + floatOffset, 18, pal);
    // Studio Halo Ring
    drawRing3D(
      ctx,
      cam,
      cx,
      baseElevation + 62 + floatOffset,
      cz - 4,
      26,
      0.25,
      0,
      time * 0.8,
      '#F3A45B',
      1.5,
    );
  } else {
    // Communications Hub: Transceiver Tower + Parabolic Uplink Rings
    drawBox3D(ctx, cam, cx, baseElevation, cz - 4, 32, 46 + floatOffset, 32, pal);
    drawBox3D(ctx, cam, cx, baseElevation + 46 + floatOffset, cz - 4, 14, 24, 14, {
      ...pal,
      topFace: '#E87935',
    });
    // Expanding Uplink Signal Rings
    for (let r = 0; r < 3; r++) {
      const ringY = baseElevation + 74 + r * 12 + floatOffset;
      const ringRadius = 14 + r * 7;
      drawRing3D(
        ctx,
        cam,
        cx,
        ringY,
        cz - 4,
        ringRadius,
        0,
        0,
        time * (r % 2 === 0 ? 1 : -1),
        r === 1 ? 'rgba(56, 189, 248, 0.7)' : '#E87935',
        1.5,
      );
    }
  }

  // 4. Front-Facing Glowing Portal Gateway Arch
  drawPortalArch3D(
    ctx,
    cam,
    cx,
    baseElevation,
    cz,
    26,
    34,
    isHighlighted,
    loc.accent,
    time,
  );
}

/**
 * Draws the Central Core Nexus at (0, 0, 0) anchoring the digital world.
 */
function drawCentralCoreNexus3D(ctx, cam, time) {
  // Base Octagonal Plinths
  drawPlatform3D(ctx, cam, 0, 0, 0, 74, 14, 8, {
    topFill: '#1B1917',
    topStroke: '#E87935',
    wallStroke: 'rgba(232, 121, 53, 0.5)',
    strokeWidth: 1.8,
  });
  drawPlatform3D(ctx, cam, 0, 14, 0, 46, 12, 8, {
    topFill: '#24211E',
    topStroke: '#F3A45B',
    wallStroke: '#33302D',
    strokeWidth: 1.2,
  });

  // Central Vertical Energy Spire Beam
  const beamBot = projectPoint3D(0, 26, 0, cam);
  const beamTop = projectPoint3D(0, 165, 0, cam);
  const grad = ctx.createLinearGradient(
    beamBot.x,
    beamBot.y,
    beamTop.x,
    beamTop.y,
  );
  grad.addColorStop(0, 'rgba(232, 121, 53, 0.55)');
  grad.addColorStop(0.6, 'rgba(243, 164, 91, 0.22)');
  grad.addColorStop(1, 'rgba(232, 121, 53, 0)');

  ctx.strokeStyle = grad;
  ctx.lineWidth = 10 * cam.zoom;
  ctx.beginPath();
  ctx.moveTo(beamBot.x, beamBot.y);
  ctx.lineTo(beamTop.x, beamTop.y);
  ctx.stroke();

  // Levitating Central Core Monolith
  const bob = Math.sin(time * 2) * 5;
  drawBox3D(ctx, cam, 0, 42 + bob, 0, 26, 42, 26, {
    topFace: '#F3A45B',
    leftFace: '#E87935',
    rightFace: '#9E4713',
    stroke: '#FFF',
    lineWidth: 1.4,
  });

  // Counter-Rotating Orbital Rings around the Central Core
  drawRing3D(
    ctx,
    cam,
    0,
    62 + bob,
    0,
    56,
    0.35,
    -0.2,
    time * 0.65,
    'rgba(232, 121, 53, 0.85)',
    1.8,
  );
  drawRing3D(
    ctx,
    cam,
    0,
    62 + bob,
    0,
    42,
    -0.4,
    0.25,
    -time * 0.95,
    'rgba(56, 189, 248, 0.65)',
    1.4,
  );
}

/**
 * Fallback 2D Tactical Sector Grid (used automatically if WebGL is unavailable
 * or when the visitor toggles "2D Sector Grid" in the HUD).
 */
function FallbackSectorGrid({
  activeLocation,
  onSelectLocation,
  onHoverLocation,
  onEnterLocation,
}) {
  return (
    <div className="w-full h-full flex items-center justify-center p-4 sm:p-8 overflow-y-auto">
      <div className="max-w-5xl w-full my-auto py-16">
        <div className="mb-6 flex flex-wrap items-center justify-between gap-2 border-b border-[#33302D] pb-3 font-mono text-xs">
          <div className="flex items-center gap-2 text-[#E87935]">
            <Compass className="w-4 h-4" />
            <span>TACTICAL SECTOR DIRECTORY // DIRECT PORTAL ACCESS</span>
          </div>
          <span className="text-[#A7A19A]">SELECT ANY DESTINATION TO ENTER</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {EXPLORATION_LOCATIONS.map((loc) => {
            const Icon = loc.icon;
            const isSelected = activeLocation?.id === loc.id;
            return (
              <div
                key={loc.id}
                onMouseEnter={() => onHoverLocation(loc)}
                onClick={() => onSelectLocation(loc)}
                className={`p-5 border transition-colors cursor-pointer flex flex-col justify-between ${
                  isSelected
                    ? 'bg-[#242220] border-[#E87935]'
                    : 'bg-[#141312]/95 border-[#33302D] hover:border-[#E87935]/70'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between font-mono text-[10px] mb-3">
                    <span className="text-[#E87935]">{loc.code}</span>
                    <span className="px-2 py-0.5 bg-[#101010] border border-[#33302D] text-[#F3A45B]">
                      {loc.navShortLabel}
                    </span>
                  </div>

                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-9 h-9 bg-[#101010] border border-[#E87935]/60 flex items-center justify-center text-[#E87935] shrink-0">
                      <Icon className="w-4 h-4" />
                    </div>
                    <div>
                      <h3 className="font-heading text-lg font-bold text-[#E8E4DE]">
                        {loc.name}
                      </h3>
                      <div className="font-mono text-[10px] text-[#A7A19A]">
                        {loc.sectionLabel}
                      </div>
                    </div>
                  </div>

                  <p className="text-xs text-[#A7A19A] leading-relaxed mt-2">
                    {loc.summary}
                  </p>
                </div>

                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    onEnterLocation(loc);
                  }}
                  className="mt-4 w-full py-2.5 px-3 bg-[#E87935] hover:bg-[#F3A45B] text-[#101010] font-mono text-xs font-semibold uppercase flex items-center justify-center gap-2 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-[#F3A45B]"
                >
                  <span>ENTER {loc.navShortLabel}</span>
                  <ArrowUpRight className="w-4 h-4" />
                </button>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default function ExplorationScene({
  hoveredLocation,
  selectedLocation,
  isEntering,
  visualQuality,
  motionReduced,
  forceFallbackView,
  cameraTarget,
  zoomCommand,
  onHoverLocation,
  onSelectLocation,
  onEnterLocation,
}) {
  const canvasRef = useRef(null);
  const [webglAvailable, setWebglAvailable] = useState(true);
  const [portalScreenCoords, setPortalScreenCoords] = useState({});

  // Mutable camera state inside animation loop to avoid per-frame React re-renders
  const cameraRef = useRef({
    x: 0,
    z: 0,
    targetX: 0,
    targetZ: 0,
    zoom: 1,
    targetZoom: 1,
    yaw: Math.PI / 4,
    targetYaw: Math.PI / 4,
    pitch: 0.54,
    isDragging: false,
    dragStartX: 0,
    dragStartY: 0,
    camStartX: 0,
    camStartZ: 0,
    pointerNormX: 0,
    pointerNormY: 0,
  });

  // Ambient 3D Particles
  const particlesRef = useRef(
    Array.from({ length: 42 }, (_, i) => ({
      x: (Math.sin(i * 7.3) * 0.5) * 680,
      y: (i % 10) * 14 + 8,
      z: (Math.cos(i * 11.7) * 0.5) * 680,
      speed: 8 + (i % 5) * 3,
      size: i % 4 === 0 ? 2.2 : 1.4,
      isCyan: i % 6 === 0,
    })),
  );

  // Verify WebGL support on mount
  useEffect(() => {
    setWebglAvailable(checkWebGLSupport());
  }, []);

  // Respond to external camera focus commands (e.g., clicking a location or Reset Overview)
  useEffect(() => {
    if (!cameraTarget) return;
    const cam = cameraRef.current;
    if (cameraTarget.mode === 'overview') {
      cam.targetX = 0;
      cam.targetZ = 0;
      cam.targetZoom = typeof window !== 'undefined' && window.innerWidth < 640 ? 0.72 : 1.0;
      cam.targetYaw = Math.PI / 4;
    } else if (cameraTarget.mode === 'focus' && cameraTarget.position) {
      cam.targetX = cameraTarget.position.x * 0.55;
      cam.targetZ = cameraTarget.position.z * 0.55;
      cam.targetZoom = typeof window !== 'undefined' && window.innerWidth < 640 ? 0.92 : 1.22;
    }
  }, [cameraTarget]);

  // Respond to external zoom commands
  useEffect(() => {
    if (!zoomCommand) return;
    const cam = cameraRef.current;
    if (zoomCommand.delta) {
      cam.targetZoom = Math.min(1.65, Math.max(0.58, cam.targetZoom + zoomCommand.delta));
    }
  }, [zoomCommand]);

  // Set responsive initial zoom on mount
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const cam = cameraRef.current;
    const initialZoom = window.innerWidth < 640 ? 0.68 : window.innerWidth < 1024 ? 0.86 : 1.02;
    cam.zoom = initialZoom;
    cam.targetZoom = initialZoom;
  }, []);

  // Compute screen coordinates for the 6 interactive Portal DOM nodes
  const syncPortalOverlayCoords = useCallback((width, height) => {
    const cam = cameraRef.current;
    const projectionCam = {
      x: cam.x,
      z: cam.z,
      zoom: cam.zoom,
      yaw: cam.yaw,
      pitch: cam.pitch,
      centerX: width / 2,
      centerY: height * 0.52,
    };

    const nextCoords = {};
    EXPLORATION_LOCATIONS.forEach((loc) => {
      const pt = projectPoint3D(
        loc.position.x,
        92,
        loc.position.z,
        projectionCam,
      );
      nextCoords[loc.id] = {
        x: Math.round(pt.x),
        y: Math.round(pt.y),
        visible:
          pt.x >= -120 &&
          pt.x <= width + 120 &&
          pt.y >= -80 &&
          pt.y <= height + 80,
      };
    });
    setPortalScreenCoords(nextCoords);
  }, []);

  // Main 3D Isometric Rendering Loop
  useEffect(() => {
    if (!webglAvailable || forceFallbackView) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId = null;
    let startTime = performance.now();
    let lastTime = startTime;
    let lastPortalSyncHash = '';

    const resizeCanvas = () => {
      const dprLimit =
        visualQuality === 'LOW' ? 1 : visualQuality === 'HIGH' ? 2 : 1.5;
      const dpr = Math.min(window.devicePixelRatio || 1, dprLimit);
      const width = window.innerWidth;
      const height = window.innerHeight;
      canvas.width = Math.floor(width * dpr);
      canvas.height = Math.floor(height * dpr);
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      syncPortalOverlayCoords(width, height);
    };

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    const renderFrame = (now) => {
      animationFrameId = window.requestAnimationFrame(renderFrame);
      if (document.hidden) return;

      const dt = Math.min(0.05, (now - lastTime) / 1000);
      lastTime = now;
      const elapsed = motionReduced ? 0 : (now - startTime) / 1000;

      const width = window.innerWidth;
      const height = window.innerHeight;
      const cam = cameraRef.current;

      // Smoothly interpolate camera position, zoom, and subtle pointer parallax yaw
      const damping = motionReduced ? 1 : Math.min(1, dt * 7.5);
      const desiredYaw =
        Math.PI / 4 + (motionReduced ? 0 : cam.pointerNormX * 0.045);
      cam.x += (cam.targetX - cam.x) * damping;
      cam.z += (cam.targetZ - cam.z) * damping;
      cam.zoom += (cam.targetZoom - cam.zoom) * damping;
      cam.yaw += (desiredYaw - cam.yaw) * damping;

      // Sync DOM portal coordinates only when camera moves noticeably
      const currentHash = `${Math.round(cam.x)},${Math.round(cam.z)},${cam.zoom.toFixed(3)},${cam.yaw.toFixed(3)},${width},${height}`;
      if (currentHash !== lastPortalSyncHash) {
        lastPortalSyncHash = currentHash;
        syncPortalOverlayCoords(width, height);
      }

      const projectionCam = {
        x: cam.x,
        z: cam.z,
        zoom: cam.zoom,
        yaw: cam.yaw,
        pitch: cam.pitch,
        centerX: width / 2,
        centerY: height * 0.52,
      };

      // Clear viewport
      ctx.clearRect(0, 0, width, height);

      // 1. Draw Isometric 3D Floor Grid
      const gridExtent = 520;
      const gridStep = visualQuality === 'LOW' ? 80 : 40;
      for (let g = -gridExtent; g <= gridExtent; g += gridStep) {
        const isMajor = g % 160 === 0;
        ctx.strokeStyle = isMajor
          ? 'rgba(232, 121, 53, 0.14)'
          : 'rgba(51, 48, 45, 0.35)';
        ctx.lineWidth = isMajor ? 1.2 : 0.75;

        const p1 = projectPoint3D(g, 0, -gridExtent, projectionCam);
        const p2 = projectPoint3D(g, 0, gridExtent, projectionCam);
        ctx.beginPath();
        ctx.moveTo(p1.x, p1.y);
        ctx.lineTo(p2.x, p2.y);
        ctx.stroke();

        const q1 = projectPoint3D(-gridExtent, 0, g, projectionCam);
        const q2 = projectPoint3D(gridExtent, 0, g, projectionCam);
        ctx.beginPath();
        ctx.moveTo(q1.x, q1.y);
        ctx.lineTo(q2.x, q2.y);
        ctx.stroke();
      }

      // Outer Perimeter Octagonal Boundary Ring on Floor
      drawRing3D(
        ctx,
        projectionCam,
        0,
        0,
        0,
        360,
        0,
        0,
        0,
        'rgba(232, 121, 53, 0.2)',
        1.2,
        8,
      );

      // 2. Draw Connected Illuminated 3D Pathways & Traveling Energy Pulses
      const activeId = hoveredLocation?.id || selectedLocation?.id;
      EXPLORATION_PATHWAYS.forEach((path, idx) => {
        const isPathActive =
          activeId &&
          (path.targetId === activeId || path.secondaryTargetId === activeId);

        const pStart = projectPoint3D(
          path.from.x,
          2,
          path.from.z,
          projectionCam,
        );
        const pEnd = projectPoint3D(path.to.x, 2, path.to.z, projectionCam);

        // Base conduit line
        ctx.strokeStyle = isPathActive
          ? path.kind === 'core'
            ? '#E87935'
            : 'rgba(243, 164, 91, 0.7)'
          : path.kind === 'core'
          ? 'rgba(232, 121, 53, 0.32)'
          : 'rgba(56, 189, 248, 0.16)';
        ctx.lineWidth = isPathActive ? 2.6 : path.kind === 'core' ? 1.6 : 1;
        ctx.beginPath();
        ctx.moveTo(pStart.x, pStart.y);
        ctx.lineTo(pEnd.x, pEnd.y);
        ctx.stroke();

        // Traveling energy packet along pathway
        if (!motionReduced) {
          const speed = isPathActive ? 1.25 : 0.45;
          const t = (elapsed * speed + idx * 0.23) % 1;
          const ex = path.from.x + (path.to.x - path.from.x) * t;
          const ez = path.from.z + (path.to.z - path.from.z) * t;
          const ePt = projectPoint3D(ex, 3, ez, projectionCam);

          ctx.fillStyle = isPathActive
            ? '#F3A45B'
            : path.kind === 'core'
            ? '#E87935'
            : '#38BDF8';
          ctx.beginPath();
          ctx.arc(
            ePt.x,
            ePt.y,
            (isPathActive ? 3.5 : 2.2) * projectionCam.zoom,
            0,
            Math.PI * 2,
          );
          ctx.fill();
        }
      });

      // 3. Depth-Sort & Render Central Core + 6 Sector 3D Architectures
      const renderables = [
        {
          type: 'core',
          depth: projectPoint3D(0, 0, 0, projectionCam).depth,
        },
        ...EXPLORATION_LOCATIONS.map((loc) => ({
          type: 'sector',
          loc,
          depth: projectPoint3D(
            loc.position.x,
            0,
            loc.position.z,
            projectionCam,
          ).depth,
        })),
      ].sort((a, b) => a.depth - b.depth);

      renderables.forEach((item) => {
        if (item.type === 'core') {
          drawCentralCoreNexus3D(ctx, projectionCam, elapsed);
        } else {
          const isHovered = hoveredLocation?.id === item.loc.id;
          const isSelected = selectedLocation?.id === item.loc.id;
          drawSectorArchitecture3D(
            ctx,
            projectionCam,
            item.loc,
            isHovered,
            isSelected,
            elapsed,
          );
        }
      });

      // 4. Atmospheric 3D Floating Particles
      const particleCount =
        visualQuality === 'LOW'
          ? 14
          : visualQuality === 'HIGH'
          ? particlesRef.current.length
          : 28;

      for (let i = 0; i < particleCount; i++) {
        const p = particlesRef.current[i];
        const py = motionReduced
          ? p.y
          : ((p.y + elapsed * p.speed) % 140) + 6;
        const pt = projectPoint3D(p.x, py, p.z, projectionCam);
        ctx.fillStyle = p.isCyan
          ? 'rgba(56, 189, 248, 0.45)'
          : 'rgba(243, 164, 91, 0.55)';
        ctx.beginPath();
        ctx.arc(pt.x, pt.y, p.size * projectionCam.zoom, 0, Math.PI * 2);
        ctx.fill();
      }
    };

    animationFrameId = window.requestAnimationFrame(renderFrame);

    return () => {
      window.removeEventListener('resize', resizeCanvas);
      if (animationFrameId !== null) {
        window.cancelAnimationFrame(animationFrameId);
      }
    };
  }, [
    webglAvailable,
    forceFallbackView,
    hoveredLocation,
    selectedLocation,
    visualQuality,
    motionReduced,
    syncPortalOverlayCoords,
  ]);

  // Pointer Drag-to-Pan & Wheel Zoom Handlers
  const handlePointerDown = (e) => {
    if (e.button !== undefined && e.button !== 0) return;
    const cam = cameraRef.current;
    cam.isDragging = true;
    cam.dragStartX = e.clientX;
    cam.dragStartY = e.clientY;
    cam.camStartX = cam.targetX;
    cam.camStartZ = cam.targetZ;
  };

  const handlePointerMove = (e) => {
    const cam = cameraRef.current;
    if (typeof window !== 'undefined') {
      cam.pointerNormX = (e.clientX / window.innerWidth - 0.5) * 2;
      cam.pointerNormY = (e.clientY / window.innerHeight - 0.5) * 2;
    }
    if (!cam.isDragging) return;

    const dx = (e.clientX - cam.dragStartX) / cam.zoom;
    const dy = (e.clientY - cam.dragStartY) / (cam.zoom * cam.pitch);
    const cos = Math.cos(-cam.yaw);
    const sin = Math.sin(-cam.yaw);

    const worldDx = dx * cos - dy * sin;
    const worldDz = dx * sin + dy * cos;

    cam.targetX = Math.max(-280, Math.min(280, cam.camStartX - worldDx));
    cam.targetZ = Math.max(-280, Math.min(280, cam.camStartZ - worldDz));
  };

  const handlePointerUp = () => {
    cameraRef.current.isDragging = false;
  };

  const handleWheel = (e) => {
    const cam = cameraRef.current;
    const delta = e.deltaY < 0 ? 0.1 : -0.1;
    cam.targetZoom = Math.min(1.65, Math.max(0.58, cam.targetZoom + delta));
  };

  if (!webglAvailable || forceFallbackView) {
    return (
      <div className="exploration-viewport relative w-full h-full overflow-hidden">
        <FallbackSectorGrid
          activeLocation={hoveredLocation || selectedLocation}
          onHoverLocation={onHoverLocation}
          onSelectLocation={onSelectLocation}
          onEnterLocation={onEnterLocation}
        />
      </div>
    );
  }

  return (
    <div
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onPointerCancel={handlePointerUp}
      onWheel={handleWheel}
      className="exploration-viewport relative w-full h-full overflow-hidden cursor-grab active:cursor-grabbing"
    >
      {/* 3D Isometric World Canvas */}
      <canvas
        ref={canvasRef}
        aria-label="Interactive 3D portfolio exploration map"
        className="block w-full h-full"
      />

      {/* Subtle Atmospheric Vignette */}
      <div
        aria-hidden="true"
        className="exploration-vignette pointer-events-none absolute inset-0 z-10"
      />

      {/* 3D World-Projected Interactive Portal Nodes */}
      <div className="pointer-events-none absolute inset-0 z-20 overflow-hidden">
        {EXPLORATION_LOCATIONS.map((loc) => (
          <ExplorationPortalNode
            key={loc.id}
            location={loc}
            screenPos={portalScreenCoords[loc.id]}
            isHovered={hoveredLocation?.id === loc.id}
            isSelected={selectedLocation?.id === loc.id}
            isEntering={isEntering}
            motionReduced={motionReduced}
            onHoverStart={(l) => onHoverLocation(l)}
            onHoverEnd={() => onHoverLocation(null)}
            onSelect={(l) => {
              if (selectedLocation?.id === l.id) {
                onEnterLocation(l);
              } else {
                onSelectLocation(l);
              }
            }}
          />
        ))}
      </div>
    </div>
  );
}
