import {
  Server,
  Terminal,
  Cpu,
  Briefcase,
  Film,
  Radio,
} from 'lucide-react';
import {
  PROJECTS,
  EXPERTISE_CATEGORIES,
  TIMELINE_DATA,
  CREATIVE_WORKS,
} from '../../data/portfolioData.js';

/**
 * Maps each 3D Isometric Sector Structure to an ACTUAL existing portfolio
 * section ID on the page. All counts and summaries derive strictly from the
 * approved portfolio data.
 */
export const EXPLORATION_LOCATIONS = [
  {
    id: 'server-complex',
    sectionId: 'work',
    code: 'SECTOR 01',
    name: 'Server Complex',
    sectionLabel: 'SELECTED WORK',
    navShortLabel: 'PROJECTS',
    archetype: 'server-complex',
    icon: Server,
    // 3D World Coordinates (Isometric X, Y, Z in world units)
    position: { x: -240, y: 0, z: -130 },
    accent: '#E87935',
    secondaryAccent: '#F3A45B',
    portalTitle: 'SELECTED WORK // SYSTEMS',
    summary:
      'Flagship applications and systems built with Next.js, Electron, React, TypeScript, Supabase, and SQLite.',
    highlights: PROJECTS.map((p) => `${p.title} (${p.tier})`),
    metaBadge: `${PROJECTS.length} FEATURED SYSTEMS`,
  },
  {
    id: 'technology-core',
    sectionId: 'expertise',
    code: 'SECTOR 02',
    name: 'Technology Core',
    sectionLabel: 'TOOLS OF THE TRADE',
    navShortLabel: 'EXPERTISE',
    archetype: 'tech-core',
    icon: Cpu,
    position: { x: 40, y: 0, z: -240 },
    accent: '#E87935',
    secondaryAccent: '#38BDF8',
    portalTitle: 'TECHNICAL CAPABILITIES',
    summary:
      'Interactive architectural matrix spanning Frontend, Backend, Database, Programming Languages, and Tools.',
    highlights: EXPERTISE_CATEGORIES.map(
      (c) => `${c.label} (${c.items.length} tools)`,
    ),
    metaBadge: `${EXPERTISE_CATEGORIES.length} CORE DOMAINS`,
  },
  {
    id: 'developer-terminal',
    sectionId: 'about',
    code: 'SECTOR 03',
    name: 'Developer Terminal',
    sectionLabel: 'BEHIND THE CODE',
    navShortLabel: 'ABOUT',
    archetype: 'developer-terminal',
    icon: Terminal,
    position: { x: 250, y: 0, z: -90 },
    accent: '#F3A45B',
    secondaryAccent: '#E87935',
    portalTitle: 'DEVELOPER PROFILE',
    summary:
      'Software & Multimedia Developer based in Sorsogon, Philippines focused on web, desktop, and digital product workflows.',
    highlights: [
      'Location: Sorsogon, Philippines',
      'Field: Software Development',
      'Focus: Software Engineering, UI/UX, Digital Creativity',
    ],
    metaBadge: 'PROFILE // SORSOGON, PH',
  },
  {
    id: 'operations-center',
    sectionId: 'experience',
    code: 'SECTOR 04',
    name: 'Operations Center',
    sectionLabel: 'EXPERIENCE & BACKGROUND',
    navShortLabel: 'EXPERIENCE',
    archetype: 'operations-center',
    icon: Briefcase,
    position: { x: 220, y: 0, z: 165 },
    accent: '#E87935',
    secondaryAccent: '#F3A45B',
    portalTitle: 'EXPERIENCE & BACKGROUND',
    summary:
      'Core software engineering practice, multimedia production capabilities, and computing studies foundation.',
    highlights: TIMELINE_DATA.map((t) => `${t.period}: ${t.role}`),
    metaBadge: `${TIMELINE_DATA.length} BACKGROUND PILLARS`,
  },
  {
    id: 'media-station',
    sectionId: 'creative',
    code: 'SECTOR 05',
    name: 'Media Station',
    sectionLabel: 'BEYOND DEVELOPMENT',
    navShortLabel: 'CREATIVE',
    archetype: 'media-station',
    icon: Film,
    position: { x: -45, y: 0, z: 245 },
    accent: '#F3A45B',
    secondaryAccent: '#38BDF8',
    portalTitle: 'CREATIVE & DIGITAL MEDIA',
    summary:
      'Secondary capability screening room for promotional video editing, digital ad cuts, and content workflows.',
    highlights: CREATIVE_WORKS.map((w) => `Reel ${w.id}: ${w.title}`),
    metaBadge: `${CREATIVE_WORKS.length} MEDIA REEL SLOTS`,
  },
  {
    id: 'communications-hub',
    sectionId: 'contact',
    code: 'SECTOR 06',
    name: 'Communications Hub',
    sectionLabel: 'CONTACT & CHANNELS',
    navShortLabel: 'CONTACT',
    archetype: 'comms-hub',
    icon: Radio,
    position: { x: -255, y: 0, z: 125 },
    accent: '#E87935',
    secondaryAccent: '#38BDF8',
    portalTitle: 'INITIATE CONTACT',
    summary:
      'Direct workspace inquiry form, resume download, and professional GitHub & LinkedIn channels.',
    highlights: [
      'Direct Inquiry Form & Copy Email Action',
      'Downloadable Resume PDF Slot',
      'GitHub & LinkedIn Network Channels',
    ],
    metaBadge: 'OPEN FOR INQUIRIES',
  },
];

/**
 * Pathways connecting the Central Core (0,0,0) to each sector platform
 * and linking adjacent sectors around the perimeter ring.
 */
export const EXPLORATION_PATHWAYS = [
  // Radial core conduits
  ...EXPLORATION_LOCATIONS.map((loc) => ({
    id: `core-to-${loc.id}`,
    from: { x: 0, y: 0, z: 0 },
    to: loc.position,
    targetId: loc.id,
    kind: 'core',
  })),
  // Perimeter ring conduits
  ...EXPLORATION_LOCATIONS.map((loc, idx) => {
    const next = EXPLORATION_LOCATIONS[(idx + 1) % EXPLORATION_LOCATIONS.length];
    return {
      id: `ring-${loc.id}-${next.id}`,
      from: loc.position,
      to: next.position,
      targetId: loc.id,
      secondaryTargetId: next.id,
      kind: 'ring',
    };
  }),
];

/**
 * Optional Web Audio API UI sound synthesizer.
 * Strictly OFF by default. Never autoplays. Only runs on user interaction
 * when the visitor explicitly enables "Sound Effects: ON" in the HUD.
 */
let sharedAudioCtx = null;

export function playExplorationSound(type, enabled) {
  if (!enabled || typeof window === 'undefined') return;
  try {
    const AudioContextClass = window.AudioContext || window.webkitAudioContext;
    if (!AudioContextClass) return;
    if (!sharedAudioCtx) {
      sharedAudioCtx = new AudioContextClass();
    }
    if (sharedAudioCtx.state === 'suspended') {
      sharedAudioCtx.resume();
    }

    const now = sharedAudioCtx.currentTime;
    const osc = sharedAudioCtx.createOscillator();
    const gain = sharedAudioCtx.createGain();

    osc.connect(gain);
    gain.connect(sharedAudioCtx.destination);

    if (type === 'hover') {
      osc.type = 'sine';
      osc.frequency.setValueAtTime(520, now);
      osc.frequency.exponentialRampToValueAtTime(680, now + 0.055);
      gain.gain.setValueAtTime(0.025, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.06);
      osc.start(now);
      osc.stop(now + 0.065);
    } else if (type === 'select') {
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(440, now);
      osc.frequency.exponentialRampToValueAtTime(880, now + 0.18);
      gain.gain.setValueAtTime(0.05, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.22);
      osc.start(now);
      osc.stop(now + 0.23);
    } else if (type === 'toggle') {
      osc.type = 'sine';
      osc.frequency.setValueAtTime(380, now);
      osc.frequency.exponentialRampToValueAtTime(480, now + 0.08);
      gain.gain.setValueAtTime(0.03, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.09);
      osc.start(now);
      osc.stop(now + 0.095);
    }
  } catch {
    // Ignore audio context restrictions silently
  }
}
