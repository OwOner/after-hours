import { Layout, Cpu, Database, Code2, Wrench } from 'lucide-react';

/**
 * External Configuration & Asset Paths
 *
 * Replace the empty strings below or set the corresponding VITE_*
 * environment variables in a `.env` file when deploying.
 * No email addresses, URLs, or backend credentials are invented.
 */
export const SITE_CONFIG = {
  // Verified contact email address
  contactEmail: import.meta.env.VITE_CONTACT_EMAIL || 'espanojohnpaul28@gmail.com',
  contactEmailPlaceholder: 'espanojohnpaul28@gmail.com',
  // Formspree submission endpoint (set VITE_FORMSPREE_ENDPOINT in .env / Vercel)
  formspreeEndpoint: import.meta.env.VITE_FORMSPREE_ENDPOINT || '',
  // Profile photo
  profilePhotoUrl: import.meta.env.VITE_PROFILE_PHOTO_URL || '/images/jp.jpg',
  // Verified social profile links (configure in .env or here when ready)
  githubUrl: import.meta.env.VITE_GITHUB_URL || '',
  linkedinUrl:
    import.meta.env.VITE_LINKEDIN_URL ||
    'https://www.linkedin.com/in/brave-black-bb39143ba/',
  // Set VITE_RESUME_URL="/resume.pdf" in .env once you place resume.pdf inside public/
  resumeUrl: import.meta.env.VITE_RESUME_URL || '',
  resumeSlotPath: 'public/resume.pdf',
  resumeFilename: 'JP_DEV_Resume.pdf',
};

// --- FOCUSED PROJECT DEFINITIONS (DEMONSTRABLE & VISIBLE PROJECTS) ---

export const PROJECTS = [
  {
    id: '01',
    slug: 'universal-pos',
    visible: true,
    tier: 'Desktop Application',
    title: 'Universal POS',
    category: 'Desktop Application / Point of Sale',
    status: 'Completed Application',
    previewLabel: 'Universal POS Desktop Interface',
    description:
      'A standalone, customizable point-of-sale application designed to support different types of businesses.',
    story:
      'Retail and counter businesses require fast, dependable checkout systems that operate seamlessly without relying on continuous internet connectivity. Universal POS pairs a modern desktop interface with an embedded local SQLite database for instant transaction processing and reliable inventory management.',
    overview:
      'A customizable desktop point-of-sale platform built with Electron, React, TypeScript, and SQLite. Features product browsing across customizable categories, real-time cart handling, inventory-aware item states, and offline-first checkout recording.',
    architectureNotes: [
      'Product browsing and categorized item management tailored for diverse business catalogs.',
      'Real-time cart and order queue handling with rapid item addition and checkout flow.',
      'Inventory-aware product states indicating in-stock status and service availability.',
      'Embedded local SQLite database architecture for reliable receipt and transaction recording.',
    ],
    highlights: [
      'Product browsing across item categories',
      'Real-time cart and checkout interface',
      'Inventory-aware product states',
      'Local-first offline SQLite storage',
    ],
    technologies: ['Electron', 'React', 'TypeScript', 'SQLite'],
    previewType: 'pos',
    screenshotUrl: '/images/projects/universal-pos.png',
    screenshotSlotPath: 'public/images/projects/universal-pos.png',
    screenshotAlt:
      'Universal POS desktop application interface showing product grid, categories, cart management, and checkout interface',
    demoUrl: '',
    repoUrl: '',
  },
  {
    id: '02',
    slug: 'gogreen-solar-simulator',
    visible: true,
    tier: 'Web Application',
    title: 'Go Green Solar Simulator',
    category: 'Web Application / Solar Energy',
    status: 'Interactive Tool',
    previewLabel: 'Go Green Solar Simulator Interface',
    description:
      'An interactive solar system proposal and simulation tool for configuring solar components and estimating household power consumption.',
    story:
      'Configuring solar setups often leaves clients confused about how panel counts, inverter capacity, and battery storage align with daily appliance use. The Go Green Solar Simulator visualizes these components dynamically, letting users adjust arrays and simulate live household loads before installation.',
    overview:
      'An interactive solar proposal and simulation tool for modeling hybrid solar systems. Built with confirmed web technologies, it features dynamic solar array sizing, battery storage tracking, inverter data, and real-time household appliance load simulation.',
    architectureNotes: [
      'Solar array configuration supporting panel wattage ratings and dynamic count adjustments.',
      'Battery storage and hybrid inverter status simulation with live grid and backup metrics.',
      'Live home load simulation calculating real-time power consumption across individual appliances.',
      'Interactive electrical flow diagram visualizing generation, storage, and consumption.',
    ],
    highlights: [
      'Solar array configuration & panel count sizing',
      'Battery storage & hybrid inverter simulation',
      'Live household load & appliance power calculation',
      'Dynamic electrical generation & consumption flow diagram',
    ],
    technologies: ['React', 'TypeScript', 'Tailwind CSS'],
    previewType: 'solar',
    screenshotUrl: '/images/projects/go-green-solar.png',
    screenshotSlotPath: 'public/images/projects/go-green-solar.png',
    screenshotAlt:
      'Go Green Solar Simulator web interface showing solar array configuration, inverter metrics, and live home load simulation',
    demoUrl: '',
    repoUrl: '',
  },
  {
    id: '03',
    slug: '151-street-cafe-pos',
    visible: true,
    tier: 'Café Operations Suite',
    title: '151 Street Café POS',
    category: 'Web Application / Point of Sale',
    status: 'Operational System',
    previewLabel: 'Cashier Point-of-Sale System Specimen',
    description:
      'A cashier-facing point-of-sale system for managing café orders and transactions.',
    story:
      'Developed specifically for 151 Street Café as part of their integrated digital suite. Built to streamline counter operations during peak service hours with rapid menu navigation and clear ticket handling.',
    overview:
      'A cashier-facing web point-of-sale system designed for fast café counter workflows. Features organized menu browsing with hot and iced drink variations, multi-channel order creation (dine-in, takeout, pickup, delivery), and active ticket tracking.',
    architectureNotes: [
      'Fast counter menu browsing with categorized beverage and food items.',
      'Order creation supporting multiple order types: dine-in, takeout, pickup, and delivery.',
      'Active ticket management with real-time running totals and open tab tracking.',
      'Cashier workflow optimized for rapid order punching and shift management.',
    ],
    highlights: [
      'Menu browsing & categorized item variations',
      'Order creation across 4 order types (dine-in, takeout, pickup, delivery)',
      'Active ticket queue & running open tabs',
      'Optimized rapid cashier workflow',
      'Part of 151 Street Café digital suite',
    ],
    technologies: ['React', 'TypeScript', 'Tailwind CSS'],
    previewType: 'cafe-pos',
    cafeSuite: '151 Street Café Digital Suite — Component 01: In-Store Cashier POS',
    screenshotUrl: '/images/projects/151-cafe-pos.png',
    screenshotSlotPath: 'public/images/projects/151-cafe-pos.png',
    screenshotAlt:
      '151 Street Café POS cashier counter terminal interface showing beverage menu categories, active ticket queue, and order types',
    demoUrl: '',
    repoUrl: '',
  },
  {
    id: '04',
    slug: '151-street-cafe-website',
    visible: true,
    tier: 'Brand & Public Web',
    title: '151 Street Café Website',
    category: 'Web Development',
    status: 'Public Platform',
    previewLabel: '151 Street Café Public Website',
    description:
      'A public-facing café website presenting its menu, brand, gallery, reservations, and customer information.',
    story:
      'The public counterpart to 151 Street Café’s operational systems. Crafted to showcase the café’s artisanal coffee culture, single-origin roasts, and warm physical space in Sorsogon City while providing customer reservation entry points.',
    overview:
      'A responsive brand website delivering an editorial coffee experience. Presents artisanal coffee tasting notes, culinary menus, customer table reservations, visit details, and online ordering entry points.',
    architectureNotes: [
      'Brand storytelling and coffee origin presentation highlighting artisanal brewing.',
      'Interactive menu showcase featuring specialty coffee, cold drinks, and food selections.',
      'Online customer reservation interface for booking tables and scheduling visits.',
      'Customer guidance with store hours, physical location details, and order-ahead links.',
    ],
    highlights: [
      'Artisanal coffee brand storytelling',
      'Interactive menu & tasting notes showcase',
      'Customer table reservation interface',
      'Visit guidance & order-ahead entry points',
      'Part of 151 Street Café digital suite',
    ],
    technologies: ['React', 'Tailwind CSS'],
    previewType: 'cafe-web',
    cafeSuite: '151 Street Café Digital Suite — Component 02: Public Brand Website',
    screenshotUrl: '/images/projects/151-cafe-website.png',
    screenshotSlotPath: 'public/images/projects/151-cafe-website.png',
    screenshotAlt:
      '151 Street Café public website homepage showing brand presentation, Single Origin Ethiopia Yirgacheffe roast, and menu navigation',
    demoUrl: '',
    repoUrl: '',
  },
  // --- TEMPORARILY HIDDEN PROJECTS (PRESERVED INTACT) ---
  {
    id: '05',
    slug: 'nexus-payroll',
    visible: false, // Hidden from public showcase — restore by changing to true
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
    id: '06',
    slug: 'smartspend',
    visible: false, // Hidden from public showcase — restore by changing to true
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

export const AI_ENGINEERING_DATA = {
  tag: 'AI WORKFLOWS // PRACTICAL DEVELOPMENT INTEGRATION',
  title: 'AI-Assisted Software Development',
  subtitle:
    'I use AI as a practical development tool to improve my workflow across debugging, architecture planning, and documentation—always grounded in software engineering fundamentals rather than as a replacement for understanding them.',
  tools: [
    {
      id: 'chatgpt',
      name: 'ChatGPT',
      role: 'Core Assistant',
      desc: 'Technical problem-solving, code assistance, debugging, architecture discussions, planning, and documentation.',
    },
    {
      id: 'gemini',
      name: 'Google Gemini',
      role: 'Research & Analysis',
      desc: 'Research assistance, brainstorming, analysis, and development support.',
    },
    {
      id: 'claude',
      name: 'Claude',
      role: 'Code & Reasoning',
      desc: 'Coding assistance, reviewing implementations, reasoning through technical problems, and improving development workflows.',
    },
  ],
  specializations: [
    'AI-Assisted Software Development',
    'Prompt Engineering and Context Management',
    'AI-Supported Debugging and Problem Solving',
    'Software Architecture Planning with AI Assistance',
    'Rapid Prototyping and Development Workflows',
    'AI-Assisted Research and Technical Documentation',
  ],
};

export const CREATIVE_TOOLS_DATA = {
  tag: 'SECONDARY SKILL // CREATIVE PRODUCTION',
  title: 'Video Editing & Creative Tools',
  subtitle:
    'Supporting tools used for video editing, social media cuts, and 360-degree footage processing alongside my primary software development work.',
  tools: [
    {
      id: 'davinci-resolve',
      name: 'DaVinci Resolve',
      level: 'Beginner',
      desc: 'Basic familiarity; still developing proficiency.',
    },
    {
      id: 'capcut',
      name: 'CapCut',
      level: 'Beginner',
      desc: 'Basic familiarity; still developing proficiency.',
    },
    {
      id: 'insta360-studio',
      name: 'Insta360 Studio',
      level: 'Familiar',
      desc: 'Experience with editing and processing 360-degree footage.',
    },
  ],
};

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
