import {
  Server,
  Terminal,
  Cpu,
  Briefcase,
  Film,
  Radio,
} from 'lucide-react';

/**
 * Coordinated 4-Phase Destination Entry Timeline (in milliseconds)
 * - Phase 1 (Destination Lock):  170ms (target: 150-200ms)
 * - Phase 2 (Camera Approach):   740ms (target: 650-900ms)
 * - Phase 3 (Arrival Impact):    160ms (target: 120-200ms — starts ONLY after camera approach completes)
 * - Phase 4 (Section Reveal):    340ms (target: 300-450ms)
 */
export const TRANSITION_TIMINGS = {
  lockDuration: 170,
  approachDuration: 740,
  impactDuration: 160,
  revealDuration: 340,
  reducedMotionTotal: 240,
};

/**
 * Expanded 3D Isometric World Coordinates & Visitor-Friendly Destination Metadata
 *
 * All 6 destinations map to the exact existing portfolio section IDs while
 * using clear, natural language for visitors, clients, and recruiters.
 */
export const EXPLORATION_LOCATIONS = [
  {
    id: 'server-complex',
    sectionId: 'work',
    code: '01',
    categoryLabel: 'FEATURED PROJECTS',
    name: 'My Projects',
    sectionLabel: 'Selected Work',
    navShortLabel: 'My Projects',
    actionLabel: 'Explore Projects',
    tagline: "View the software projects I've worked on.",
    archetype: 'server-complex',
    icon: Server,
    position: { x: -375, y: 0, z: -225 },
    accent: '#E87935',
    secondaryAccent: '#F3A45B',
    summary:
      "Take a closer look at the software applications and digital solutions I've worked on.",
    highlights: [
      'Nexus Payroll — Enterprise payroll management system',
      'Universal POS — Desktop point-of-sale application',
      'SmartSpend — Personal expense tracking application',
    ],
  },
  {
    id: 'technology-core',
    sectionId: 'expertise',
    code: '02',
    categoryLabel: 'SKILLS & TECHNOLOGIES',
    name: 'My Skills',
    sectionLabel: 'Tools of the Trade',
    navShortLabel: 'My Skills',
    actionLabel: 'Explore Skills',
    tagline: 'Explore the technologies and tools I use.',
    archetype: 'tech-core',
    icon: Cpu,
    position: { x: 185, y: 0, z: -385 },
    accent: '#E87935',
    secondaryAccent: '#38BDF8',
    summary:
      'Explore the programming languages, frameworks, databases, and tools I use to build software applications.',
    highlights: [
      'Frontend and backend web development frameworks',
      'Cloud and local relational database systems',
      'Programming languages and development tools',
    ],
  },
  {
    id: 'developer-terminal',
    sectionId: 'about',
    code: '03',
    categoryLabel: 'DEVELOPER PROFILE',
    name: 'About Me',
    sectionLabel: 'Behind the Code',
    navShortLabel: 'About Me',
    actionLabel: 'Explore About Me',
    tagline: 'Learn more about my background.',
    archetype: 'developer-terminal',
    icon: Terminal,
    position: { x: 415, y: 0, z: 20 },
    accent: '#F3A45B',
    secondaryAccent: '#E87935',
    summary:
      'Learn more about my background, interests, and approach to software development.',
    highlights: [
      'Based in Sorsogon, Philippines',
      'Focused on web and desktop software development',
      'Interests in software engineering, UI/UX, and digital creativity',
    ],
  },
  {
    id: 'operations-center',
    sectionId: 'experience',
    code: '04',
    categoryLabel: 'BACKGROUND & TIMELINE',
    name: 'My Experience',
    sectionLabel: 'Experience & Background',
    navShortLabel: 'My Experience',
    actionLabel: 'Explore Experience',
    tagline: 'Discover my professional and creative experience.',
    archetype: 'operations-center',
    icon: Briefcase,
    position: { x: 205, y: 0, z: 345 },
    accent: '#E87935',
    secondaryAccent: '#F3A45B',
    summary:
      'Discover my professional and creative experience across software development, digital media, and computing studies.',
    highlights: [
      'Web and desktop application development practice',
      'Video editing and digital content workflows',
      'Software engineering and computing foundation',
    ],
  },
  {
    id: 'media-station',
    sectionId: 'creative',
    code: '05',
    categoryLabel: 'VIDEO & DIGITAL MEDIA',
    name: 'Creative Work',
    sectionLabel: 'Beyond Development',
    navShortLabel: 'Creative Work',
    actionLabel: 'Explore Creative Work',
    tagline: 'Explore my video editing and multimedia work.',
    archetype: 'media-station',
    icon: Film,
    position: { x: -165, y: 0, z: 385 },
    accent: '#F3A45B',
    secondaryAccent: '#38BDF8',
    summary:
      'Explore my video editing, promotional media, and digital content work alongside my software projects.',
    highlights: [
      'Promotional product and commercial video edits',
      'Digital campaign spots and social media content',
      'Visual pacing and narrative montage samples',
    ],
  },
  {
    id: 'communications-hub',
    sectionId: 'contact',
    code: '06',
    categoryLabel: 'GET IN TOUCH',
    name: 'Contact Me',
    sectionLabel: 'Contact',
    navShortLabel: 'Contact Me',
    actionLabel: 'Explore Contact',
    tagline: 'Get in touch or connect with me.',
    archetype: 'comms-hub',
    icon: Radio,
    position: { x: -415, y: 0, z: 50 },
    accent: '#E87935',
    secondaryAccent: '#38BDF8',
    summary:
      'Get in touch for software development inquiries, project collaborations, or to download my resume.',
    highlights: [
      'Direct message form and copyable email address',
      'Downloadable resume PDF',
      'GitHub and LinkedIn profile channels',
    ],
  },
];

/**
 * Pathways connecting the Central Core (0,0,0) to each sector platform
 * via architectural relay waypoints, plus outer perimeter conduits.
 */
export const EXPLORATION_PATHWAYS = [
  ...EXPLORATION_LOCATIONS.map((loc) => ({
    id: `core-to-${loc.id}`,
    from: { x: 0, y: 0, z: 0 },
    mid: {
      x: Math.round(loc.position.x * 0.48),
      y: 0,
      z: Math.round(loc.position.z * 0.48),
    },
    to: loc.position,
    targetId: loc.id,
    kind: 'core',
  })),
  ...EXPLORATION_LOCATIONS.map((loc, idx) => {
    const next = EXPLORATION_LOCATIONS[(idx + 1) % EXPLORATION_LOCATIONS.length];
    return {
      id: `ring-${loc.id}-${next.id}`,
      from: loc.position,
      mid: {
        x: Math.round((loc.position.x + next.position.x) * 0.5),
        y: 0,
        z: Math.round((loc.position.z + next.position.z) * 0.5),
      },
      to: next.position,
      targetId: loc.id,
      secondaryTargetId: next.id,
      kind: 'ring',
    };
  }),
];

/**
 * Optional Web Audio API UI sound synthesizer.
 * Strictly OFF by default. Never autoplays.
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
      gain.gain.setValueAtTime(0.02, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.06);
      osc.start(now);
      osc.stop(now + 0.065);
    } else if (type === 'focus') {
      osc.type = 'sine';
      osc.frequency.setValueAtTime(340, now);
      osc.frequency.exponentialRampToValueAtTime(580, now + 0.14);
      gain.gain.setValueAtTime(0.035, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.16);
      osc.start(now);
      osc.stop(now + 0.17);
    } else if (type === 'select') {
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(220, now);
      osc.frequency.exponentialRampToValueAtTime(660, now + 0.26);
      gain.gain.setValueAtTime(0.055, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.34);
      osc.start(now);
      osc.stop(now + 0.35);
    } else if (type === 'toggle') {
      osc.type = 'sine';
      osc.frequency.setValueAtTime(380, now);
      osc.frequency.exponentialRampToValueAtTime(480, now + 0.08);
      gain.gain.setValueAtTime(0.025, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.09);
      osc.start(now);
      osc.stop(now + 0.095);
    }
  } catch {
    // Ignore audio context restrictions silently
  }
}
