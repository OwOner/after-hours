import { useState, useEffect, useRef, useCallback } from 'react';
import { ArrowUpRight, Compass } from 'lucide-react';
import {
  EXPLORATION_LOCATIONS,
  EXPLORATION_PATHWAYS,
  TRANSITION_TIMINGS,
} from './explorationData.js';
import { ExplorationPortalNode } from './ExplorationLocation.jsx';
import { useTheme } from '../../context/ThemeContext.jsx';

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
 * Smooth cinematic easing curve with gentle acceleration and 200ms final settling.
 */
function cinematicEaseInOut(t) {
  const clamped = Math.max(0, Math.min(1, t));
  return clamped < 0.5
    ? 4 * clamped * clamped * clamped
    : 1 - Math.pow(-2 * clamped + 2, 3) / 2;
}

/**
 * Ease-in/ease-out curve with slight forward acceleration for Phase 2 Camera Approach.
 */
function cameraApproachEase(t) {
  const c = Math.max(0, Math.min(1, t));
  return c < 0.55
    ? 2.2 * c * c
    : 1 - Math.pow(-2 * c + 2, 2.4) / 2;
}

/**
 * Compute responsive overview zoom so the expanded 6-sector map fits comfortably
 * across desktop, laptop, tablet, and mobile viewports.
 */
function getOverviewZoomForViewport(width) {
  if (width < 420) return 0.42;
  if (width < 640) return 0.52;
  if (width < 900) return 0.68;
  if (width < 1200) return 0.78;
  return 0.88;
}

/**
 * Projects a 3D world point (x, y, z) into 2D isometric viewport coordinates.
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

  const t0 = projectPoint3D(cx - hw, yTop, cz - hd, cam);
  const t1 = projectPoint3D(cx + hw, yTop, cz - hd, cam);
  const t2 = projectPoint3D(cx + hw, yTop, cz + hd, cam);
  const t3 = projectPoint3D(cx - hw, yTop, cz + hd, cam);

  const b1 = projectPoint3D(cx + hw, yBottom, cz - hd, cam);
  const b2 = projectPoint3D(cx + hw, yBottom, cz + hd, cam);
  const b3 = projectPoint3D(cx - hw, yBottom, cz + hd, cam);

  ctx.lineWidth = palette.lineWidth || 1;
  ctx.strokeStyle = palette.stroke || 'rgba(51, 48, 45, 0.85)';

  // Left-front face
  ctx.fillStyle = palette.leftFace || '#1B1918';
  ctx.beginPath();
  ctx.moveTo(t3.x, t3.y);
  ctx.lineTo(t2.x, t2.y);
  ctx.lineTo(b2.x, b2.y);
  ctx.lineTo(b3.x, b3.y);
  ctx.closePath();
  ctx.fill();
  ctx.stroke();

  // Right-front face
  ctx.fillStyle = palette.rightFace || '#131211';
  ctx.beginPath();
  ctx.moveTo(t2.x, t2.y);
  ctx.lineTo(t1.x, t1.y);
  ctx.lineTo(b1.x, b1.y);
  ctx.lineTo(b2.x, b2.y);
  ctx.closePath();
  ctx.fill();
  ctx.stroke();

  // Top face
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
 * Draws an extruded 3D regular polygon platform.
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
  ctx.fillStyle = palette.shadowFill || 'rgba(0, 0, 0, 0.58)';
  ctx.beginPath();
  for (let i = 0; i < sides; i++) {
    const angle = (i / sides) * Math.PI * 2 + Math.PI / sides;
    const sp = projectPoint3D(
      cx + Math.cos(angle) * (radius * 1.14),
      0,
      cz + Math.sin(angle) * (radius * 1.14),
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

    if (tA.y + tB.y >= topPts[(i + Math.floor(sides / 2)) % sides].y * 1.95) {
      ctx.fillStyle =
        i % 2 === 0
          ? palette.wallEven || '#181715'
          : palette.wallOdd || '#121110';
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
 * Draws a 3D ring in world coordinates.
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
  isTransitionTarget,
  accent,
  time,
) {
  const hw = width / 2;
  const pBL = projectPoint3D(cx - hw, yBase, cz + 30, cam);
  const pBR = projectPoint3D(cx + hw, yBase, cz + 30, cam);
  const pTR = projectPoint3D(cx + hw, yBase + height, cz + 30, cam);
  const pTL = projectPoint3D(cx - hw, yBase + height, cz + 30, cam);

  // Inner portal energy field
  ctx.fillStyle = isTransitionTarget
    ? 'rgba(243, 164, 91, 0.72)'
    : isHighlighted
    ? 'rgba(232, 121, 53, 0.38)'
    : 'rgba(232, 121, 53, 0.14)';
  ctx.beginPath();
  ctx.moveTo(pBL.x, pBL.y);
  ctx.lineTo(pBR.x, pBR.y);
  ctx.lineTo(pTR.x, pTR.y);
  ctx.lineTo(pTL.x, pTL.y);
  ctx.closePath();
  ctx.fill();

  // Animated horizontal portal scan-line
  const scanRatio = (Math.sin(time * (isTransitionTarget ? 8 : 2.5)) + 1) * 0.5;
  const scanY = yBase + 4 + scanRatio * (height - 8);
  const sL = projectPoint3D(cx - hw + 2, scanY, cz + 30, cam);
  const sR = projectPoint3D(cx + hw - 2, scanY, cz + 30, cam);
  ctx.strokeStyle = isTransitionTarget
    ? '#FFFFFF'
    : isHighlighted
    ? '#F3A45B'
    : 'rgba(243, 164, 91, 0.55)';
  ctx.lineWidth = isTransitionTarget ? 2.8 : isHighlighted ? 2 : 1;
  ctx.beginPath();
  ctx.moveTo(sL.x, sL.y);
  ctx.lineTo(sR.x, sR.y);
  ctx.stroke();

  // Portal arch frame
  ctx.strokeStyle = isTransitionTarget
    ? '#FFF'
    : isHighlighted
    ? accent
    : 'rgba(232, 121, 53, 0.72)';
  ctx.lineWidth = isTransitionTarget ? 3.2 : isHighlighted ? 2.5 : 1.5;
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
  isFocused,
  isTransitionTarget,
  time,
  isLight,
) {
  const { x: cx, z: cz } = loc.position;
  const isHighlighted = isHovered || isSelected || isFocused || isTransitionTarget;
  const floatOffset = isHighlighted ? Math.sin(time * 3) * 4 : 0;
  const baseElevation = 13;

  // Outer Territorial Boundary Ring on Ground
  drawRing3D(
    ctx,
    cam,
    cx,
    1,
    cz,
    88,
    0,
    0,
    0,
    isTransitionTarget
      ? '#C65E24'
      : isHighlighted
      ? isLight
        ? 'rgba(198, 94, 36, 0.65)'
        : 'rgba(232, 121, 53, 0.48)'
      : isLight
      ? 'rgba(185, 174, 158, 0.7)'
      : 'rgba(51, 48, 45, 0.45)',
    isHighlighted ? 1.6 : 1,
    8,
  );

  // 1. Base Octagonal Sector Platform
  drawPlatform3D(ctx, cam, cx, 0, cz, 66, baseElevation, 8, {
    topFill: isTransitionTarget
      ? isLight
        ? '#F3E5D5'
        : '#352A20'
      : isHighlighted
      ? isLight
        ? '#FAF8F3'
        : '#24211E'
      : isLight
      ? '#E5E0D6'
      : '#181715',
    topStroke: isTransitionTarget
      ? '#C65E24'
      : isHighlighted
      ? isLight
        ? '#C65E24'
        : loc.accent
      : isLight
      ? '#C4B9A8'
      : '#33302D',
    wallEven: isLight ? '#D8D0C3' : '#181715',
    wallOdd: isLight ? '#C9C0B1' : '#121110',
    wallStroke: isHighlighted
      ? 'rgba(198, 94, 36, 0.65)'
      : isLight
      ? '#BFB5A4'
      : '#282623',
    shadowFill: isLight
      ? 'rgba(70, 58, 46, 0.16)'
      : 'rgba(0, 0, 0, 0.58)',
    strokeWidth: isTransitionTarget ? 2.5 : isHighlighted ? 2 : 1.2,
  });

  // 2. Rotating Base Activation Ring on Platform Deck
  drawRing3D(
    ctx,
    cam,
    cx,
    baseElevation + 1,
    cz,
    52,
    0,
    0,
    time * (isTransitionTarget ? 2.5 : isHighlighted ? 0.95 : 0.35),
    isTransitionTarget
      ? '#C65E24'
      : isHighlighted
      ? isLight
        ? '#C65E24'
        : loc.accent
      : isLight
      ? 'rgba(198, 94, 36, 0.42)'
      : 'rgba(232, 121, 53, 0.32)',
    isTransitionTarget ? 2.6 : isHighlighted ? 2 : 1,
  );

  const pal = isLight
    ? {
        topFace: isTransitionTarget
          ? '#E87935'
          : isHighlighted
          ? '#FAF8F3'
          : '#F4F0E8',
        leftFace: isTransitionTarget
          ? '#D96B2B'
          : isHighlighted
          ? '#E9E3D8'
          : '#E2DCD0',
        rightFace: isTransitionTarget
          ? '#B8521A'
          : isHighlighted
          ? '#D8D0C2'
          : '#D1C8BA',
        stroke: isTransitionTarget
          ? '#8F3D0E'
          : isHighlighted
          ? '#C65E24'
          : 'rgba(113, 104, 94, 0.55)',
        lineWidth: isTransitionTarget ? 2 : isHighlighted ? 1.5 : 1,
      }
    : {
        topFace: isTransitionTarget
          ? '#E87935'
          : isHighlighted
          ? '#322E2A'
          : '#252320',
        leftFace: isTransitionTarget
          ? '#3B2818'
          : isHighlighted
          ? '#25221F'
          : '#1B1A18',
        rightFace: isTransitionTarget
          ? '#24180E'
          : isHighlighted
          ? '#1A1816'
          : '#121110',
        stroke: isTransitionTarget
          ? '#F3A45B'
          : isHighlighted
          ? loc.accent
          : 'rgba(232, 121, 53, 0.4)',
        lineWidth: isTransitionTarget ? 2 : isHighlighted ? 1.5 : 1,
      };

  // 3. Bespoke 3D Structure Silhouette per Archetype
  if (loc.archetype === 'server-complex') {
    drawBox3D(
      ctx,
      cam,
      cx - 19,
      baseElevation,
      cz - 8,
      24,
      82 + floatOffset,
      24,
      pal,
    );
    drawBox3D(
      ctx,
      cam,
      cx + 19,
      baseElevation,
      cz - 8,
      24,
      66 + floatOffset,
      24,
      pal,
    );
    drawBox3D(
      ctx,
      cam,
      cx,
      baseElevation + 40 + floatOffset,
      cz - 8,
      22,
      11,
      15,
      {
        ...pal,
        topFace: '#E87935',
      },
    );
    for (let row = 0; row < 4; row++) {
      const ledY = baseElevation + 18 + row * 14 + floatOffset;
      const pL = projectPoint3D(cx - 25, ledY, cz + 5, cam);
      const pR = projectPoint3D(cx - 13, ledY, cz + 5, cam);
      ctx.strokeStyle = row % 2 === 0 ? '#E87935' : '#F3A45B';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(pL.x, pL.y);
      ctx.lineTo(pR.x, pR.y);
      ctx.stroke();
    }
  } else if (loc.archetype === 'tech-core') {
    const offsets = [
      [-26, -26],
      [26, -26],
      [26, 26],
      [-26, 26],
    ];
    offsets.forEach(([ox, oz]) => {
      drawBox3D(ctx, cam, cx + ox, baseElevation, cz + oz, 11, 46, 11, pal);
    });
    const coreY = baseElevation + 36 + Math.sin(time * 2.2) * 5;
    drawBox3D(ctx, cam, cx, coreY, cz, 24, 24, 24, {
      topFace: '#F3A45B',
      leftFace: '#E87935',
      rightFace: '#B8571B',
      stroke: '#FFF',
      lineWidth: 1.3,
    });
    drawRing3D(
      ctx,
      cam,
      cx,
      coreY + 12,
      cz,
      35,
      0.65,
      0.3,
      time * 1.1,
      isHighlighted ? '#38BDF8' : 'rgba(56, 189, 248, 0.55)',
      1.6,
    );
    drawRing3D(
      ctx,
      cam,
      cx,
      coreY + 12,
      cz,
      28,
      -0.55,
      0.4,
      -time * 0.9,
      '#E87935',
      1.6,
    );
  } else if (loc.archetype === 'developer-terminal') {
    drawBox3D(
      ctx,
      cam,
      cx,
      baseElevation,
      cz - 6,
      46,
      62 + floatOffset,
      25,
      pal,
    );
    drawBox3D(
      ctx,
      cam,
      cx,
      baseElevation + 62 + floatOffset,
      cz - 2,
      58,
      11,
      34,
      {
        ...pal,
        topFace: isHighlighted ? '#E87935' : '#2C2825',
      },
    );
    drawRing3D(
      ctx,
      cam,
      cx,
      baseElevation + 82 + floatOffset,
      cz - 2,
      20,
      0,
      0,
      -time * 1.2,
      '#F3A45B',
      1.8,
    );
  } else if (loc.archetype === 'operations-center') {
    drawBox3D(
      ctx,
      cam,
      cx - 21,
      baseElevation,
      cz - 4,
      19,
      36 + floatOffset,
      25,
      pal,
    );
    drawBox3D(
      ctx,
      cam,
      cx,
      baseElevation,
      cz - 6,
      21,
      56 + floatOffset,
      27,
      pal,
    );
    drawBox3D(
      ctx,
      cam,
      cx + 21,
      baseElevation,
      cz - 8,
      19,
      76 + floatOffset,
      25,
      {
        ...pal,
        topFace: isHighlighted ? '#E87935' : '#2D2926',
      },
    );
  } else if (loc.archetype === 'media-station') {
    drawBox3D(
      ctx,
      cam,
      cx,
      baseElevation,
      cz - 8,
      52,
      54 + floatOffset,
      17,
      pal,
    );
    drawBox3D(
      ctx,
      cam,
      cx - 32,
      baseElevation,
      cz + 2,
      11,
      62 + floatOffset,
      19,
      pal,
    );
    drawBox3D(
      ctx,
      cam,
      cx + 32,
      baseElevation,
      cz + 2,
      11,
      62 + floatOffset,
      19,
      pal,
    );
    drawRing3D(
      ctx,
      cam,
      cx,
      baseElevation + 66 + floatOffset,
      cz - 4,
      28,
      0.25,
      0,
      time * 0.8,
      '#F3A45B',
      1.6,
    );
  } else {
    drawBox3D(
      ctx,
      cam,
      cx,
      baseElevation,
      cz - 4,
      34,
      48 + floatOffset,
      34,
      pal,
    );
    drawBox3D(
      ctx,
      cam,
      cx,
      baseElevation + 48 + floatOffset,
      cz - 4,
      15,
      26,
      15,
      {
        ...pal,
        topFace: '#E87935',
      },
    );
    for (let r = 0; r < 3; r++) {
      const ringY = baseElevation + 78 + r * 13 + floatOffset;
      const ringRadius = 15 + r * 7.5;
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
    28,
    36,
    isHighlighted,
    isTransitionTarget,
    loc.accent,
    time,
  );
}

/**
 * Draws the Central Core Nexus at (0, 0, 0) anchoring the digital world.
 */
function drawCentralCoreNexus3D(ctx, cam, time, isLight) {
  drawPlatform3D(ctx, cam, 0, 0, 0, 82, 15, 8, {
    topFill: isLight ? '#E5E0D6' : '#1B1917',
    topStroke: isLight ? '#C65E24' : '#E87935',
    wallEven: isLight ? '#D8D0C3' : '#181715',
    wallOdd: isLight ? '#C9C0B1' : '#121110',
    wallStroke: 'rgba(198, 94, 36, 0.5)',
    shadowFill: isLight
      ? 'rgba(70, 58, 46, 0.18)'
      : 'rgba(0, 0, 0, 0.58)',
    strokeWidth: 1.8,
  });
  drawPlatform3D(ctx, cam, 0, 15, 0, 50, 13, 8, {
    topFill: isLight ? '#FAF8F3' : '#24211E',
    topStroke: isLight ? '#E87935' : '#F3A45B',
    wallEven: isLight ? '#E2DCD0' : '#181715',
    wallOdd: isLight ? '#D4CCC0' : '#121110',
    wallStroke: isLight ? '#C4B9A8' : '#33302D',
    shadowFill: 'rgba(0, 0, 0, 0)',
    strokeWidth: 1.2,
  });

  // Central Vertical Energy Spire Beam
  const beamBot = projectPoint3D(0, 28, 0, cam);
  const beamTop = projectPoint3D(0, 180, 0, cam);
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
  ctx.lineWidth = 11 * cam.zoom;
  ctx.beginPath();
  ctx.moveTo(beamBot.x, beamBot.y);
  ctx.lineTo(beamTop.x, beamTop.y);
  ctx.stroke();

  // Levitating Central Core Monolith
  const bob = Math.sin(time * 2) * 5;
  drawBox3D(ctx, cam, 0, 44 + bob, 0, 28, 44, 28, {
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
    66 + bob,
    0,
    62,
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
    66 + bob,
    0,
    46,
    -0.4,
    0.25,
    -time * 0.95,
    'rgba(56, 189, 248, 0.65)',
    1.4,
  );
}

/**
 * Draws the Phase 2 Camera Approach Rings, Phase 3 Arrival Impact Frame,
 * and Phase 4 Settling Glow centered on the selected destination structure.
 * Phase 3 Impact ONLY runs after Phase 2 Camera Approach has completed.
 */
function drawCinematicImpactEffect(
  ctx,
  cam,
  loc,
  transitionPhase,
  phaseProgress,
  width,
  height,
) {
  if (
    !loc ||
    (transitionPhase !== 'approach' &&
      transitionPhase !== 'impact' &&
      transitionPhase !== 'reveal')
  ) {
    return;
  }

  const centerPt = projectPoint3D(
    loc.position.x,
    42,
    loc.position.z,
    cam,
  );

  ctx.save();

  if (transitionPhase === 'approach') {
    // Phase 2 (Camera Approach): Subtle converging energy rings drawing focus to the building
    const approachAlpha = Math.min(1, phaseProgress * 1.2) * 0.22;
    const tunnelRadius = Math.max(width, height) * 0.6;
    const radial = ctx.createRadialGradient(
      centerPt.x,
      centerPt.y,
      16,
      centerPt.x,
      centerPt.y,
      tunnelRadius,
    );
    radial.addColorStop(0, `rgba(232, 121, 53, ${approachAlpha})`);
    radial.addColorStop(0.55, 'rgba(232, 121, 53, 0.04)');
    radial.addColorStop(1, 'rgba(10, 10, 10, 0.55)');

    ctx.fillStyle = radial;
    ctx.fillRect(0, 0, width, height);

    for (let ring = 0; ring < 2; ring++) {
      const p = (phaseProgress * 1.4 + ring * 0.5) % 1;
      ctx.strokeStyle = `rgba(243, 164, 91, ${(1 - p) * 0.45})`;
      ctx.lineWidth = 1.6;
      ctx.beginPath();
      ctx.arc(
        centerPt.x,
        centerPt.y,
        (28 + p * 160) * cam.zoom,
        0,
        Math.PI * 2,
      );
      ctx.stroke();
    }
  } else if (transitionPhase === 'impact') {
    // Phase 3 (Arrival Impact — AFTER camera approach completes):
    // Brief high-contrast flash, orange energy pulse, geometric shockwave, and directional streaks
    const flashEnvelope = Math.sin(phaseProgress * Math.PI);
    const burstRadius = Math.max(width, height) * (0.16 + phaseProgress * 0.52);
    const radial = ctx.createRadialGradient(
      centerPt.x,
      centerPt.y,
      4,
      centerPt.x,
      centerPt.y,
      burstRadius,
    );
    radial.addColorStop(0, `rgba(255, 247, 237, ${0.78 * flashEnvelope})`);
    radial.addColorStop(0.2, `rgba(243, 164, 91, ${0.62 * flashEnvelope})`);
    radial.addColorStop(0.48, `rgba(232, 121, 53, ${0.32 * flashEnvelope})`);
    radial.addColorStop(1, 'rgba(16, 16, 16, 0)');

    ctx.fillStyle = radial;
    ctx.fillRect(0, 0, width, height);

    // Geometric impact-frame shockwave rings
    ctx.strokeStyle = `rgba(255, 247, 237, ${0.95 - phaseProgress * 0.5})`;
    ctx.lineWidth = 3.2 * (1 - phaseProgress * 0.35);
    ctx.beginPath();
    ctx.arc(
      centerPt.x,
      centerPt.y,
      (36 + phaseProgress * 175) * cam.zoom,
      0,
      Math.PI * 2,
    );
    ctx.stroke();

    // Inner geometric diamond distortion frame around destination
    const dSize = (46 + phaseProgress * 95) * cam.zoom;
    ctx.strokeStyle = `rgba(232, 121, 53, ${0.85 * (1 - phaseProgress * 0.4)})`;
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(centerPt.x, centerPt.y - dSize * 0.75);
    ctx.lineTo(centerPt.x + dSize, centerPt.y);
    ctx.lineTo(centerPt.x, centerPt.y + dSize * 0.75);
    ctx.lineTo(centerPt.x - dSize, centerPt.y);
    ctx.closePath();
    ctx.stroke();

    // Directional motion streaks
    const rays = 12;
    ctx.strokeStyle = `rgba(243, 164, 91, ${0.85 * flashEnvelope})`;
    ctx.lineWidth = 2;
    for (let i = 0; i < rays; i++) {
      const angle = (i / rays) * Math.PI * 2 + 0.15;
      const rInner = (44 + phaseProgress * 36) * cam.zoom;
      const rOuter = (105 + phaseProgress * 150) * cam.zoom;
      ctx.beginPath();
      ctx.moveTo(
        centerPt.x + Math.cos(angle) * rInner,
        centerPt.y + Math.sin(angle) * rInner,
      );
      ctx.lineTo(
        centerPt.x + Math.cos(angle) * rOuter,
        centerPt.y + Math.sin(angle) * rOuter,
      );
      ctx.stroke();
    }
  } else if (transitionPhase === 'reveal') {
    // Phase 4 (Section Reveal Settle): Impact settles cleanly before portfolio reveal
    const settleAlpha = (1 - phaseProgress) * 0.35;
    const radial = ctx.createRadialGradient(
      centerPt.x,
      centerPt.y,
      8,
      centerPt.x,
      centerPt.y,
      Math.max(width, height) * 0.5,
    );
    radial.addColorStop(0, `rgba(232, 121, 53, ${settleAlpha})`);
    radial.addColorStop(1, 'rgba(16, 16, 16, 0)');
    ctx.fillStyle = radial;
    ctx.fillRect(0, 0, width, height);
  }

  ctx.restore();
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
        <div className="mb-6 flex flex-wrap items-center justify-between gap-2 border-b border-[#33302D] pb-3.5 text-xs sm:text-sm">
          <div className="flex items-center gap-2 font-mono text-[#E87935]">
            <Compass className="w-4 h-4" />
            <span>MAP GRID // PORTFOLIO DESTINATIONS</span>
          </div>
          <span className="text-[#B8B0A6]">
            Select any destination below to open that section
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
          {EXPLORATION_LOCATIONS.map((loc) => {
            const Icon = loc.icon;
            const isSelected = activeLocation?.id === loc.id;
            return (
              <div
                key={loc.id}
                onMouseEnter={() => onHoverLocation(loc)}
                onClick={() => onSelectLocation(loc)}
                className={`p-5 sm:p-6 border transition-colors cursor-pointer flex flex-col justify-between ${
                  isSelected
                    ? 'bg-[#242220] border-[#E87935]'
                    : 'bg-[#141312]/95 border-[#33302D] hover:border-[#E87935]/70'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between font-mono text-[11px] mb-3">
                    <span className="text-[#E87935] uppercase">
                      {loc.categoryLabel}
                    </span>
                    <span className="px-2 py-0.5 bg-[#101010] border border-[#33302D] text-[#B8B0A6]">
                      {loc.code}
                    </span>
                  </div>

                  <div className="flex items-center gap-3 mb-2.5">
                    <div className="w-10 h-10 bg-[#101010] border border-[#E87935]/60 flex items-center justify-center text-[#E87935] shrink-0">
                      <Icon className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="font-heading text-lg sm:text-xl font-bold text-[#E8E4DE]">
                        {loc.name}
                      </h3>
                      <div className="text-xs text-[#B8B0A6]">
                        {loc.sectionLabel}
                      </div>
                    </div>
                  </div>

                  <p className="text-sm text-[#B8B0A6] leading-relaxed mt-2">
                    {loc.summary}
                  </p>
                </div>

                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    onEnterLocation(loc);
                  }}
                  className="mt-5 w-full py-2.5 px-4 bg-[#E87935] hover:bg-[#F3A45B] text-[#101010] font-mono text-xs sm:text-[13px] font-semibold flex items-center justify-center gap-2 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-[#F3A45B]"
                >
                  <span>{loc.actionLabel}</span>
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
  focusedLocationId,
  transitionState,
  visualQuality,
  motionReduced,
  forceFallbackView,
  cameraTarget,
  zoomCommand,
  onHoverLocation,
  onSelectLocation,
  onEnterLocation,
}) {
  const { isLight } = useTheme();
  const canvasRef = useRef(null);
  const [webglAvailable, setWebglAvailable] = useState(true);
  const [portalScreenCoords, setPortalScreenCoords] = useState({});

  const initialOverviewZoom =
    typeof window !== 'undefined'
      ? getOverviewZoomForViewport(window.innerWidth)
      : 0.86;

  // Mutable camera state inside animation loop with explicit keyframe interpolation
  const cameraRef = useRef({
    x: 0,
    z: 0,
    zoom: initialOverviewZoom,
    yaw: Math.PI / 4,
    pitch: 0.54,
    // Keyframe tween state for smooth 650-900ms focus & punch-in transitions
    animFromX: 0,
    animFromZ: 0,
    animFromZoom: initialOverviewZoom,
    animToX: 0,
    animToZ: 0,
    animToZoom: initialOverviewZoom,
    animStartTime: 0,
    animDurationMs: 760,
    isTweening: false,
    mode: 'overview',
    // Manual pointer pan state
    isDragging: false,
    dragStartX: 0,
    dragStartY: 0,
    camStartX: 0,
    camStartZ: 0,
    pointerNormX: 0,
    pointerNormY: 0,
  });

  // Ambient 3D Particles distributed across the expanded 900x900 world
  const particlesRef = useRef(
    Array.from({ length: 44 }, (_, i) => ({
      x: Math.sin(i * 7.3) * 0.5 * 960,
      y: (i % 10) * 15 + 8,
      z: Math.cos(i * 11.7) * 0.5 * 960,
      speed: 8 + (i % 5) * 3,
      size: i % 4 === 0 ? 2.2 : 1.4,
      isCyan: i % 6 === 0,
    })),
  );

  useEffect(() => {
    setWebglAvailable(checkWebGLSupport());
  }, []);

  // Trigger smooth keyframe camera transition when cameraTarget changes
  useEffect(() => {
    if (!cameraTarget) return;
    const cam = cameraRef.current;
    const width = typeof window !== 'undefined' ? window.innerWidth : 1280;
    const baseOverviewZoom = getOverviewZoomForViewport(width);

    cam.animFromX = cam.x;
    cam.animFromZ = cam.z;
    cam.animFromZoom = cam.zoom;
    cam.animStartTime = performance.now();
    cam.isTweening = true;

    if (cameraTarget.mode === 'overview') {
      cam.mode = 'overview';
      cam.animToX = 0;
      cam.animToZ = 0;
      cam.animToZoom = baseOverviewZoom;
      cam.animDurationMs = motionReduced ? 120 : 720;
    } else if (cameraTarget.mode === 'focus' && cameraTarget.position) {
      cam.mode = 'focus';
      // Offset slightly on desktop so the structure sits in the open viewport area beside the right-hand inspector
      const desktopOffset = width >= 768 ? 55 : 0;
      const cos = Math.cos(-cam.yaw);
      const sin = Math.sin(-cam.yaw);
      cam.animToX = cameraTarget.position.x + desktopOffset * cos;
      cam.animToZ = cameraTarget.position.z + desktopOffset * sin;
      // Zoom 1.65x - 1.8x overview scale as specified in Section 2
      cam.animToZoom = Math.min(1.85, baseOverviewZoom * 1.72);
      cam.animDurationMs = motionReduced ? 120 : 780;
    } else if (cameraTarget.mode === 'approach' && cameraTarget.position) {
      cam.mode = 'approach';
      cam.animToX = cameraTarget.position.x;
      cam.animToZ = cameraTarget.position.z;
      // Smoothly approach and zoom in to center the selected building before impact
      cam.animToZoom = Math.min(2.15, baseOverviewZoom * 2.15);
      cam.animDurationMs = motionReduced
        ? 120
        : TRANSITION_TIMINGS.approachDuration;
    }
  }, [cameraTarget, motionReduced]);

  // Respond to external zoom button commands
  useEffect(() => {
    if (!zoomCommand) return;
    const cam = cameraRef.current;
    if (zoomCommand.delta) {
      const nextZoom = Math.min(1.9, Math.max(0.42, cam.zoom + zoomCommand.delta));
      cam.animFromX = cam.x;
      cam.animFromZ = cam.z;
      cam.animFromZoom = cam.zoom;
      cam.animToX = cam.x;
      cam.animToZ = cam.z;
      cam.animToZoom = nextZoom;
      cam.animStartTime = performance.now();
      cam.animDurationMs = 260;
      cam.isTweening = true;
    }
  }, [zoomCommand]);

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
        96,
        loc.position.z,
        projectionCam,
      );
      nextCoords[loc.id] = {
        x: Math.round(pt.x),
        y: Math.round(pt.y),
        visible:
          pt.x >= -150 &&
          pt.x <= width + 150 &&
          pt.y >= -100 &&
          pt.y <= height + 100,
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

      if (cameraRef.current.mode === 'overview' && !cameraRef.current.isTweening) {
        const baseZ = getOverviewZoomForViewport(width);
        cameraRef.current.zoom = baseZ;
        cameraRef.current.animToZoom = baseZ;
      }
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

      // 1. Update Camera Keyframe Tween or Subtle Hover Preview Framing
      if (cam.isTweening) {
        const rawProgress =
          (now - cam.animStartTime) / Math.max(1, cam.animDurationMs);
        if (rawProgress >= 1) {
          cam.x = cam.animToX;
          cam.z = cam.animToZ;
          cam.zoom = cam.animToZoom;
          cam.isTweening = false;
        } else {
          const easeFn =
            cam.mode === 'approach' ? cameraApproachEase : cinematicEaseInOut;
          const eased = easeFn(rawProgress);
          cam.x = cam.animFromX + (cam.animToX - cam.animFromX) * eased;
          cam.z = cam.animFromZ + (cam.animToZ - cam.animFromZ) * eased;
          cam.zoom =
            cam.animFromZoom + (cam.animToZoom - cam.animFromZoom) * eased;
        }
      } else if (
        !cam.isDragging &&
        cam.mode === 'overview' &&
        (!transitionState || transitionState.phase === 'idle')
      ) {
        // Subtle Camera Preview Framing when hovering a destination in Overview mode (Section 5)
        const baseOverviewZoom = getOverviewZoomForViewport(width);
        const hoverTargetX = hoveredLocation
          ? hoveredLocation.position.x * 0.16
          : 0;
        const hoverTargetZ = hoveredLocation
          ? hoveredLocation.position.z * 0.16
          : 0;
        const hoverTargetZoom = hoveredLocation
          ? baseOverviewZoom * 1.06
          : baseOverviewZoom;

        const pullDamping = motionReduced ? 1 : Math.min(1, dt * 4.5);
        cam.x += (hoverTargetX - cam.x) * pullDamping;
        cam.z += (hoverTargetZ - cam.z) * pullDamping;
        cam.zoom += (hoverTargetZoom - cam.zoom) * pullDamping;
      }

      // Subtle pointer yaw parallax + slight viewing angle adjustment during approach
      const approachYawOffset =
        !motionReduced &&
        transitionState &&
        transitionState.phase !== 'idle'
          ? 0.05
          : 0;
      const desiredYaw =
        Math.PI / 4 +
        approachYawOffset +
        (motionReduced ? 0 : cam.pointerNormX * 0.035);
      cam.yaw += (desiredYaw - cam.yaw) * Math.min(1, dt * 6);

      // Sync DOM portal coordinates when camera moves
      const currentHash = `${Math.round(cam.x)},${Math.round(cam.z)},${cam.zoom.toFixed(3)},${cam.yaw.toFixed(3)},${width},${height}`;
      if (currentHash !== lastPortalSyncHash) {
        lastPortalSyncHash = currentHash;
        syncPortalOverlayCoords(width, height);
      }

      // Subtle camera shake ONLY during Phase 3 Arrival Impact (omitted in reduced-motion)
      let impactShakeX = 0;
      let impactShakeY = 0;
      if (
        !motionReduced &&
        transitionState?.phase === 'impact'
      ) {
        const impElapsed = now - (transitionState.phaseStartTime || now);
        const impProgress = Math.min(
          1,
          Math.max(0, impElapsed / Math.max(1, TRANSITION_TIMINGS.impactDuration)),
        );
        const decay = 1 - impProgress;
        impactShakeX = Math.sin(impProgress * Math.PI * 6) * 5 * decay;
        impactShakeY = Math.cos(impProgress * Math.PI * 5) * 3.5 * decay;
      }

      const projectionCam = {
        x: cam.x,
        z: cam.z,
        zoom: cam.zoom,
        yaw: cam.yaw,
        pitch: cam.pitch,
        centerX: width / 2 + impactShakeX,
        centerY: height * 0.52 + impactShakeY,
      };

      ctx.clearRect(0, 0, width, height);

      // 2. Draw Expanded Isometric 3D Floor Grid
      const gridExtent = 760;
      const gridStep = visualQuality === 'LOW' ? 95 : 47.5;
      for (let g = -gridExtent; g <= gridExtent; g += gridStep) {
        const isMajor = Math.abs(g % 190) < 1;
        ctx.strokeStyle = isLight
          ? isMajor
            ? 'rgba(198, 94, 36, 0.22)'
            : 'rgba(180, 169, 154, 0.48)'
          : isMajor
          ? 'rgba(232, 121, 53, 0.14)'
          : 'rgba(51, 48, 45, 0.32)';
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

      // Inner Relay Ring & Outer Territorial Boundary Ring on Floor
      drawRing3D(
        ctx,
        projectionCam,
        0,
        0,
        0,
        245,
        0,
        0,
        0,
        'rgba(56, 189, 248, 0.14)',
        1,
        12,
      );
      drawRing3D(
        ctx,
        projectionCam,
        0,
        0,
        0,
        515,
        0,
        0,
        0,
        'rgba(232, 121, 53, 0.22)',
        1.4,
        8,
      );

      // 3. Draw Connected Illuminated 3D Pathways & Traveling Energy Pulses
      const activePhase = transitionState?.phase || 'idle';
      const isTransitioning = activePhase !== 'idle';
      const activeId = isTransitioning
        ? selectedLocation?.id
        : hoveredLocation?.id || focusedLocationId || selectedLocation?.id;

      EXPLORATION_PATHWAYS.forEach((path, idx) => {
        const isPathActive =
          activeId &&
          (path.targetId === activeId || path.secondaryTargetId === activeId);
        const isCoreTransitionPath =
          isTransitioning &&
          path.kind === 'core' &&
          path.targetId === selectedLocation?.id;

        const pStart = projectPoint3D(
          path.from.x,
          2,
          path.from.z,
          projectionCam,
        );
        const pMid = projectPoint3D(path.mid.x, 2, path.mid.z, projectionCam);
        const pEnd = projectPoint3D(path.to.x, 2, path.to.z, projectionCam);

        // Base conduit line
        ctx.strokeStyle = isCoreTransitionPath
          ? isLight
            ? '#C65E24'
            : '#FFF7ED'
          : isPathActive
          ? path.kind === 'core'
            ? isLight
              ? '#C65E24'
              : '#E87935'
            : isLight
            ? 'rgba(198, 94, 36, 0.78)'
            : 'rgba(243, 164, 91, 0.72)'
          : path.kind === 'core'
          ? isLight
            ? 'rgba(198, 94, 36, 0.42)'
            : 'rgba(232, 121, 53, 0.32)'
          : isLight
          ? 'rgba(140, 128, 114, 0.38)'
          : 'rgba(56, 189, 248, 0.16)';
        ctx.lineWidth = isCoreTransitionPath
          ? 4
          : isPathActive
          ? 2.8
          : path.kind === 'core'
          ? 1.6
          : 1;

        ctx.beginPath();
        ctx.moveTo(pStart.x, pStart.y);
        ctx.lineTo(pMid.x, pMid.y);
        ctx.lineTo(pEnd.x, pEnd.y);
        ctx.stroke();

        // Relay waypoint node on core conduits
        if (path.kind === 'core') {
          ctx.fillStyle = isPathActive ? '#F3A45B' : '#33302D';
          ctx.beginPath();
          ctx.arc(
            pMid.x,
            pMid.y,
            (isPathActive ? 3.2 : 2) * projectionCam.zoom,
            0,
            Math.PI * 2,
          );
          ctx.fill();
        }

        // Traveling energy packets along pathway
        if (!motionReduced) {
          const packetCount = isCoreTransitionPath ? 3 : isPathActive ? 2 : 1;
          const speed = isCoreTransitionPath
            ? 2.8
            : isPathActive
            ? 1.3
            : 0.42;

          for (let pIdx = 0; pIdx < packetCount; pIdx++) {
            const t =
              (elapsed * speed + idx * 0.21 + pIdx / packetCount) % 1;
            const ex = path.from.x + (path.to.x - path.from.x) * t;
            const ez = path.from.z + (path.to.z - path.from.z) * t;
            const ePt = projectPoint3D(ex, 3, ez, projectionCam);

            ctx.fillStyle = isCoreTransitionPath
              ? '#FFFFFF'
              : isPathActive
              ? '#F3A45B'
              : path.kind === 'core'
              ? '#E87935'
              : '#38BDF8';
            ctx.beginPath();
            ctx.arc(
              ePt.x,
              ePt.y,
              (isCoreTransitionPath ? 4.8 : isPathActive ? 3.6 : 2.2) *
                projectionCam.zoom,
              0,
              Math.PI * 2,
            );
            ctx.fill();
          }
        }
      });

      // 4. Depth-Sort & Render Central Core + 6 Sector 3D Architectures
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
          ctx.save();
          if (isTransitioning) ctx.globalAlpha = 0.45;
          drawCentralCoreNexus3D(ctx, projectionCam, elapsed, isLight);
          ctx.restore();
        } else {
          const isHovered = hoveredLocation?.id === item.loc.id;
          const isSelected = selectedLocation?.id === item.loc.id;
          const isFocused = focusedLocationId === item.loc.id;
          const isTransitionTarget = isTransitioning && isSelected;
          ctx.save();
          if (isTransitioning && !isTransitionTarget) {
            // Phase 1+: Slightly dim surrounding non-selected structures
            ctx.globalAlpha = 0.38;
          }
          drawSectorArchitecture3D(
            ctx,
            projectionCam,
            item.loc,
            isHovered,
            isSelected,
            isFocused,
            isTransitionTarget,
            elapsed,
            isLight,
          );
          ctx.restore();
        }
      });

      // 5. Atmospheric 3D Floating Particles
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
          : ((p.y + elapsed * p.speed) % 150) + 6;
        const pt = projectPoint3D(p.x, py, p.z, projectionCam);
        ctx.fillStyle = p.isCyan
          ? 'rgba(56, 189, 248, 0.45)'
          : 'rgba(243, 164, 91, 0.55)';
        ctx.beginPath();
        ctx.arc(pt.x, pt.y, p.size * projectionCam.zoom, 0, Math.PI * 2);
        ctx.fill();
      }

      // 6. Render Phase B Impact Frame & Phase C Radial Portal Vortex
      if (isTransitioning && selectedLocation && !motionReduced) {
        const phaseElapsed = now - (transitionState.phaseStartTime || now);
        const phaseDuration = Math.max(1, transitionState.phaseDuration || 200);
        const phaseProgress = Math.min(1, Math.max(0, phaseElapsed / phaseDuration));
        drawCinematicImpactEffect(
          ctx,
          projectionCam,
          selectedLocation,
          activePhase,
          phaseProgress,
          width,
          height,
        );
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
    focusedLocationId,
    transitionState,
    visualQuality,
    motionReduced,
    isLight,
    syncPortalOverlayCoords,
  ]);

  // Pointer Drag-to-Pan & Wheel Zoom Handlers (preserve internal camera state)
  const handlePointerDown = (e) => {
    if (e.button !== undefined && e.button !== 0) return;
    if (transitionState && transitionState.phase !== 'idle') return;
    const cam = cameraRef.current;
    cam.isTweening = false;
    cam.isDragging = true;
    cam.dragStartX = e.clientX;
    cam.dragStartY = e.clientY;
    cam.camStartX = cam.x;
    cam.camStartZ = cam.z;
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

    cam.x = Math.max(-440, Math.min(440, cam.camStartX - worldDx));
    cam.z = Math.max(-440, Math.min(440, cam.camStartZ - worldDz));
    cam.animToX = cam.x;
    cam.animToZ = cam.z;
  };

  const handlePointerUp = () => {
    cameraRef.current.isDragging = false;
  };

  const handleWheel = (e) => {
    if (transitionState && transitionState.phase !== 'idle') return;
    const cam = cameraRef.current;
    cam.isTweening = false;
    const delta = e.deltaY < 0 ? 0.1 : -0.1;
    cam.zoom = Math.min(1.9, Math.max(0.42, cam.zoom + delta));
    cam.animToZoom = cam.zoom;
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

  const currentPhase = transitionState?.phase || 'idle';

  return (
    <div
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onPointerCancel={handlePointerUp}
      onWheel={handleWheel}
      className={`exploration-viewport relative w-full h-full overflow-hidden cursor-grab active:cursor-grabbing transition-transform duration-150 ${
        currentPhase === 'impact' && !motionReduced ? 'scale-[1.018]' : 'scale-100'
      }`}
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
            isFocused={focusedLocationId === loc.id}
            transitionPhase={currentPhase}
            motionReduced={motionReduced}
            onHoverStart={(l) => onHoverLocation(l)}
            onHoverEnd={() => onHoverLocation(null)}
            onSelect={(l) => {
              if (focusedLocationId === l.id) {
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
