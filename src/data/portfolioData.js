import { Layout, Cpu, Database, Code2, Wrench } from 'lucide-react';

/**
 * External Configuration & Asset Paths
 *
 * Replace the empty strings below or set the corresponding VITE_*
 * environment variables in a `.env` file when deploying.
 * No email addresses, URLs, or backend credentials are invented.
 */
export const SITE_CONFIG = {
  // Set VITE_CONTACT_EMAIL in .env or replace '' with your verified email address (e.g., "you@example.com")
  contactEmail: import.meta.env.VITE_CONTACT_EMAIL || '',
  contactEmailPlaceholder: 'YOUR_EMAIL_HERE (Configure VITE_CONTACT_EMAIL in .env)',
  // Optional future backend endpoint (e.g., Web3Forms / Formspree URL)
  contactEndpoint: import.meta.env.VITE_CONTACT_ENDPOINT || '',
  // Verified social profile links (configure in .env or here when ready)
  githubUrl: import.meta.env.VITE_GITHUB_URL || '',
  linkedinUrl: import.meta.env.VITE_LINKEDIN_URL || '',
  // Set VITE_RESUME_URL="/resume.pdf" in .env once you place resume.pdf inside public/
  resumeUrl: import.meta.env.VITE_RESUME_URL || '',
  resumeSlotPath: 'public/resume.pdf',
  resumeFilename: 'JP_DEV_Resume.pdf',
};

// --- FOCUSED PROJECT DEFINITIONS (FLAGSHIP + SUPPORTING) ---

export const PROJECTS = [
  {
    id: '01',
    slug: 'nexus-payroll',
    tier: 'Flagship System',
    title: 'Nexus Payroll',
    category: 'Enterprise Payroll System',
    status: 'In Development / Prototype',
    previewLabel: 'Conceptual Product Preview — Replace with Application Screenshot',
    description:
      'Enterprise-oriented payroll management system with contribution calculations, security controls, and database integrity.',
    story:
      'Payroll workflows often break down when statutory deductions, employee classifications, and access permissions are handled across disconnected spreadsheets. Nexus Payroll structures these operations into a unified system with predictable calculation logic and strict database integrity.',
    overview:
      'A structured payroll management architecture focused on handling multi-tier contribution calculations, access controls, and relational ledger consistency.',
    architectureNotes: [
      'Relational schema design for employee records, pay periods, and statutory contribution tables.',
      'Role-based access boundaries separating administrative approval from standard payroll entry.',
      'Automated computation workflow for gross-to-net pay and statutory deductions.',
    ],
    technologies: ['Next.js', 'TypeScript', 'Supabase'],
    previewType: 'payroll',
    // Set VITE_NEXUS_SCREENSHOT_URL="/assets/projects/nexus-payroll.png" in .env once image is placed in public/
    screenshotUrl: import.meta.env.VITE_NEXUS_SCREENSHOT_URL || '',
    screenshotSlotPath: 'public/assets/projects/nexus-payroll.png',
    screenshotAlt:
      'Nexus Payroll application interface showing employee disbursement ledger and statutory deductions',
    demoUrl: import.meta.env.VITE_NEXUS_DEMO_URL || '',
    repoUrl: import.meta.env.VITE_NEXUS_REPO_URL || '',
  },
  {
    id: '02',
    slug: 'universal-pos',
    tier: 'Flagship Application',
    title: 'Universal POS',
    category: 'Desktop Point-of-Sale',
    status: 'Functional Prototype',
    previewLabel: 'Conceptual Product Preview — Replace with Desktop Screenshot',
    description:
      'Customizable desktop point-of-sale application focused on sales management and local database architecture.',
    story:
      'Retail and counter environments require fast, dependable checkout operations that do not stall when internet connectivity fluctuates. Universal POS pairs an Electron desktop interface with an embedded SQLite database for immediate local transaction processing.',
    overview:
      'A desktop point-of-sale application built around an embedded local SQLite database for reliable transaction recording and customizable catalog workflows.',
    architectureNotes: [
      'Cross-platform desktop shell powered by Electron with a responsive React interface.',
      'Local-first SQLite persistence layer designed for direct product lookup and transaction logging.',
      'Modular item catalog and order queue tailored for rapid counter operations.',
    ],
    technologies: ['Electron', 'React', 'SQLite', 'TypeScript'],
    previewType: 'pos',
    // Set VITE_POS_SCREENSHOT_URL="/assets/projects/universal-pos.png" in .env once image is placed in public/
    screenshotUrl: import.meta.env.VITE_POS_SCREENSHOT_URL || '',
    screenshotSlotPath: 'public/assets/projects/universal-pos.png',
    screenshotAlt:
      'Universal POS desktop counter terminal interface with item grid and SQLite receipt ledger',
    demoUrl: import.meta.env.VITE_POS_DEMO_URL || '',
    repoUrl: import.meta.env.VITE_POS_REPO_URL || '',
  },
  {
    id: '03',
    slug: 'smartspend',
    tier: 'Supporting Application',
    title: 'SmartSpend',
    category: 'Personal Finance Application',
    status: 'Application Prototype',
    previewLabel: 'Conceptual Interface Preview — Replace with App Screenshot',
    description:
      'Personal expense management application for tracking income, expenses, and financial activity.',
    story:
      'Designed as a streamlined personal ledger for recording daily cash flow, categorizing recurring expenses, and maintaining clear visibility over personal budgets.',
    overview:
      'A clean financial ledger application designed to give individuals clear visibility into their income streams, categorized expenses, and balance history.',
    architectureNotes: [
      'Component-driven React and TypeScript interface for rapid transaction entry and filtering.',
      'Supabase backend integration for authenticated user data persistence.',
      'Structured category breakdowns for comparing income against recurring expenses.',
    ],
    technologies: ['React', 'TypeScript', 'Supabase'],
    previewType: 'smartspend',
    // Set VITE_SMARTSPEND_SCREENSHOT_URL="/assets/projects/smartspend.png" in .env once image is placed in public/
    screenshotUrl: import.meta.env.VITE_SMARTSPEND_SCREENSHOT_URL || '',
    screenshotSlotPath: 'public/assets/projects/smartspend.png',
    screenshotAlt:
      'SmartSpend personal expense ledger showing monthly cashflow breakdown',
    demoUrl: import.meta.env.VITE_SMARTSPEND_DEMO_URL || '',
    repoUrl: import.meta.env.VITE_SMARTSPEND_REPO_URL || '',
  },
];

export const ADDITIONAL_CONTRIBUTIONS = [
  {
    title: 'Payment Workflow Contribution',
    context: 'Web-Based Construction Platform',
    description:
      'Contributed to the payment process of a web-based construction platform, focusing on the payment-related workflow.',
  },
];

export const EXPERTISE_CATEGORIES = [
  {
    id: 'frontend',
    label: 'Frontend',
    code: '01',
    icon: Layout,
    summary:
      'Building responsive, accessible user interfaces and structured component systems.',
    items: [
      {
        name: 'React',
        desc: 'Component-driven user interfaces and interactive state management.',
      },
      {
        name: 'Next.js',
        desc: 'Full-stack React framework for modern web applications.',
      },
      {
        name: 'HTML',
        desc: 'Semantic document structure and accessible markup.',
      },
      {
        name: 'CSS',
        desc: 'Layout composition, responsive styling, and visual polish.',
      },
      {
        name: 'Tailwind CSS',
        desc: 'Utility-first styling for consistent design systems.',
      },
    ],
  },
  {
    id: 'backend',
    label: 'Backend',
    code: '02',
    icon: Cpu,
    summary:
      'Designing server-side application logic, routing, and type-safe APIs.',
    items: [
      {
        name: 'Node.js',
        desc: 'JavaScript runtime for server-side workflows and tooling.',
      },
      {
        name: 'Express',
        desc: 'Web application routing and middleware architecture.',
      },
      {
        name: 'TypeScript',
        desc: 'Static typing for maintainable backend and frontend codebases.',
      },
    ],
  },
  {
    id: 'database',
    label: 'Database',
    code: '03',
    icon: Database,
    summary:
      'Modeling data schemas, relational integrity, and local or cloud persistence.',
    items: [
      {
        name: 'Supabase',
        desc: 'Backend-as-a-service with Postgres database and authentication.',
      },
      {
        name: 'PostgreSQL',
        desc: 'Relational database management and structured queries.',
      },
      {
        name: 'MongoDB',
        desc: 'Document-oriented NoSQL data storage.',
      },
      {
        name: 'SQLite',
        desc: 'Embedded local relational database for desktop applications.',
      },
    ],
  },
  {
    id: 'programming',
    label: 'Programming',
    code: '04',
    icon: Code2,
    summary:
      'Core programming languages used across web, desktop, and interactive projects.',
    items: [
      {
        name: 'JavaScript',
        desc: 'Core language for interactive web and application logic.',
      },
      {
        name: 'TypeScript',
        desc: 'Type-safe superset of JavaScript for structured applications.',
      },
      {
        name: 'Java',
        desc: 'Object-oriented programming and software fundamentals.',
      },
      {
        name: 'C#',
        desc: 'Application development and Unity scripting.',
      },
      {
        name: 'C++',
        desc: 'Foundational systems and structured programming.',
      },
    ],
  },
  {
    id: 'tools',
    label: 'Tools',
    code: '05',
    icon: Wrench,
    summary:
      'Development environments, version control, and interactive engines.',
    items: [
      {
        name: 'Git',
        desc: 'Version control and source code history management.',
      },
      {
        name: 'GitHub',
        desc: 'Repository hosting and collaborative workflows.',
      },
      {
        name: 'VS Code',
        desc: 'Primary code editor and development environment.',
      },
      {
        name: 'Android Studio',
        desc: 'Integrated environment for Android application development.',
      },
      {
        name: 'Unity',
        desc: 'Engine for interactive 2D/3D experiences and game development.',
      },
    ],
  },
];

export const TIMELINE_DATA = [
  {
    period: 'CORE DISCIPLINE',
    category: 'SOFTWARE & APPLICATION DEVELOPMENT',
    role: 'Web & Desktop Application Development',
    org: 'Independent & Project-Based Practice — Sorsogon, Philippines',
    summary:
      'Designing and building functional web platforms and desktop applications with a focus on clean workflows, type safety, and reliable database architecture.',
    highlights: [
      'Building full-stack web applications and desktop software using React, Next.js, Electron, and TypeScript.',
      'Structuring relational data schemas, authentication flows, and local persistence across Supabase, PostgreSQL, and SQLite.',
      'Developing focused operational modules, including payroll calculation engines, point-of-sale interfaces, and payment workflows.',
    ],
  },
  {
    period: 'SECONDARY CAPABILITY',
    category: 'CREATIVE & DIGITAL MEDIA',
    role: 'Video Editing & Content Management',
    org: 'Digital Media Production',
    summary:
      'Combining technical development with visual storytelling through video editing, promotional media assembly, and structured content workflows.',
    highlights: [
      'Editing promotional videos, digital advertisements, and short-form social media content with attention to pacing and clarity.',
      'Managing digital media assets, publishing workflows, and presentation layouts.',
      'Bridging software engineering and multimedia production to present digital products cohesively.',
    ],
  },
  {
    period: 'FOUNDATION',
    category: 'EDUCATION & TECHNICAL TRAINING',
    role: 'Software Development & Computing Studies',
    org: 'Sorsogon, Philippines',
    summary:
      'Academic and practical foundation in software engineering, database management, and application architecture.',
    highlights: [
      'Focused on object-oriented programming, relational database design, and system analysis.',
      'Built functional software prototypes addressing real-world operational workflows.',
    ],
  },
];

export const CREATIVE_WORKS = [
  {
    id: '01',
    title: 'Promotional Product Overview',
    category: 'Promotional Videos',
    aspect: '16:9 Widescreen',
    duration: 'Format: Commercial Cut',
    description:
      'Structured promotional editing focused on clear product messaging, motion pacing, and clean visual transitions.',
    notes: 'Video Reel Slot — Ready for showreel or promotional video file.',
    videoUrl: import.meta.env.VITE_REEL_01_URL || '',
    videoSlotPath: 'public/assets/creative/reel-01.mp4',
  },
  {
    id: '02',
    title: 'Digital Campaign & Ad Edit',
    category: 'Digital Advertisements',
    aspect: '16:9 / 1:1',
    duration: 'Format: Campaign Spot',
    description:
      'Pacing-driven advertisement cuts combining typography, audio synchronization, and concise visual hooks.',
    notes: 'Video Reel Slot — Ready for digital advertisement sample.',
    videoUrl: import.meta.env.VITE_REEL_02_URL || '',
    videoSlotPath: 'public/assets/creative/reel-02.mp4',
  },
  {
    id: '03',
    title: 'Short-Form Media & Content Management',
    category: 'Social Media Content',
    aspect: '9:16 Vertical',
    duration: 'Format: Vertical Reel',
    description:
      'End-to-end editing, caption structuring, and asset organization for digital publishing workflows.',
    notes: 'Video Reel Slot — Ready for short-form social media reel.',
    videoUrl: import.meta.env.VITE_REEL_03_URL || '',
    videoSlotPath: 'public/assets/creative/reel-03.mp4',
  },
  {
    id: '04',
    title: 'Visual Pacing & Narrative Montage',
    category: 'Video Editing Samples',
    aspect: '2.39:1 Widescreen',
    duration: 'Format: Editorial Cut',
    description:
      'Timeline assembly demonstrating rhythm, sound design alignment, and atmospheric color grading.',
    notes: 'Video Reel Slot — Ready for narrative or motion editing breakdown.',
    videoUrl: import.meta.env.VITE_REEL_04_URL || '',
    videoSlotPath: 'public/assets/creative/reel-04.mp4',
  },
];

export const DUNGEON_WIDTH = 9;
export const DUNGEON_HEIGHT = 7;
export const INITIAL_DUNGEON_MAP = [
  [1, 1, 1, 1, 1, 1, 1, 1, 1],
  [1, 0, 0, 0, 1, 0, 0, 2, 1],
  [1, 0, 3, 0, 1, 0, 3, 0, 1],
  [1, 0, 0, 0, 0, 0, 0, 0, 1],
  [1, 1, 0, 1, 1, 1, 0, 1, 1],
  [1, 0, 0, 0, 0, 0, 0, 3, 1],
  [1, 1, 1, 1, 1, 1, 1, 1, 1],
];
