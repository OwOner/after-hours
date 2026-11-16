import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import { CheckCircle2, Info, X } from 'lucide-react';
import { MOTION_TOKENS } from './utils/motion.jsx';
import { SITE_CONFIG } from './data/portfolioData.js';
import { ThemeProvider } from './context/ThemeContext.jsx';

import Navigation from './components/Navigation.jsx';
import Hero from './components/Hero.jsx';
import ProjectShowcase from './components/ProjectShowcase.jsx';
import Expertise from './components/Expertise.jsx';
import About from './components/About.jsx';
import ExperienceTimeline from './components/ExperienceTimeline.jsx';
import CreativeGallery from './components/CreativeGallery.jsx';
import Contact from './components/Contact.jsx';
import Footer from './components/Footer.jsx';
import ExplorationMode from './components/ExplorationMode/ExplorationMode.jsx';
import SystemInitialization from './components/SystemInitialization.jsx';

import ProjectCaseStudyModal from './components/modals/ProjectCaseStudyModal.jsx';
import VideoPreviewModal from './components/modals/VideoPreviewModal.jsx';
import ContactModal from './components/modals/ContactModal.jsx';
import SecretTerminalModal from './components/modals/SecretTerminalModal.jsx';
import ArcadeModal from './components/modals/ArcadeModal.jsx';
import DungeonModal from './components/modals/DungeonModal.jsx';

const SECTION_IDS = [
  'hero',
  'work',
  'expertise',
  'about',
  'experience',
  'creative',
  'contact',
];

export default function App() {
  const prefersReducedMotion = useReducedMotion();

  // Navigation & Scroll State
  const [activeSection, setActiveSection] = useState('hero');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [explorationOpen, setExplorationOpen] = useState(false);

  // Modals & Interactive States
  const [selectedProject, setSelectedProject] = useState(null);
  const [selectedVideo, setSelectedVideo] = useState(null);
  const [contactModalOpen, setContactModalOpen] = useState(false);
  const [toastNotification, setToastNotification] = useState(null); // { title: string, message: string, tone: 'info' | 'success' }
  const toastTimerRef = useRef(null);
  const arrivalTimerRef = useRef(null);

  // Easter Egg Modal States (Mutually exclusive to prevent backdrop stacking)
  const [terminalOpen, setTerminalOpen] = useState(false);
  const [arcadeOpen, setArcadeOpen] = useState(false);
  const [dungeonOpen, setDungeonOpen] = useState(false);

  const showToast = (title, message, tone = 'info') => {
    if (toastTimerRef.current) clearTimeout(toastTimerRef.current);
    setToastNotification({ title, message, tone });
    toastTimerRef.current = setTimeout(() => {
      setToastNotification(null);
    }, 5000);
  };

  useEffect(() => {
    return () => {
      if (toastTimerRef.current) clearTimeout(toastTimerRef.current);
      if (arrivalTimerRef.current) clearTimeout(arrivalTimerRef.current);
    };
  }, []);

  // Throttled Scroll Spy for Navigation
  useEffect(() => {
    let ticking = false;

    const updateActiveSection = () => {
      const scrollPosition = window.scrollY + 260;
      for (const sectionId of SECTION_IDS) {
        const el = document.getElementById(sectionId);
        if (el) {
          const top = el.offsetTop;
          const height = el.offsetHeight;
          if (scrollPosition >= top && scrollPosition < top + height) {
            setActiveSection((prev) =>
              prev === sectionId ? prev : sectionId,
            );
            break;
          }
        }
      }
      ticking = false;
    };

    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(updateActiveSection);
        ticking = true;
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    updateActiveSection();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Prevent background scrolling when any modal is active
  const anyModalOpen = Boolean(
    selectedProject ||
      selectedVideo ||
      contactModalOpen ||
      terminalOpen ||
      arcadeOpen ||
      dungeonOpen ||
      explorationOpen,
  );

  useEffect(() => {
    if (!anyModalOpen) return;
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = originalOverflow;
    };
  }, [anyModalOpen]);

  const scrollToSection = (id, fromExploration = false) => {
    setMobileMenuOpen(false);
    const element = document.getElementById(id);
    if (element) {
      if (fromExploration && !prefersReducedMotion) {
        if (arrivalTimerRef.current) clearTimeout(arrivalTimerRef.current);
        SECTION_IDS.forEach((secId) => {
          const secEl = document.getElementById(secId);
          if (secEl) secEl.removeAttribute('data-arrival-section');
        });
        element.setAttribute('data-arrival-section', 'true');
        arrivalTimerRef.current = setTimeout(() => {
          element.removeAttribute('data-arrival-section');
        }, 1600);
      }

      element.scrollIntoView({
        behavior: prefersReducedMotion ? 'auto' : 'smooth',
      });
    }
  };

  // Real Resume PDF Download Check & Trigger
  const triggerResumeDownload = async () => {
    const resumeUrl = SITE_CONFIG.resumeUrl;
    if (!resumeUrl) {
      showToast(
        'RESUME CONFIGURATION REQUIRED',
        'Place your resume PDF at public/resume.pdf or set VITE_RESUME_URL in .env.',
      );
      return;
    }

    try {
      const response = await fetch(resumeUrl, { method: 'HEAD' });
      const contentType = response.headers.get('content-type') || '';
      // Vite dev server returns text/html for missing files due to SPA fallback
      if (response.ok && !contentType.includes('text/html')) {
        const link = document.createElement('a');
        link.href = resumeUrl;
        link.download = SITE_CONFIG.resumeFilename || 'Resume.pdf';
        link.target = '_blank';
        link.rel = 'noopener noreferrer';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        showToast(
          'DOWNLOADING RESUME',
          `Starting download for ${SITE_CONFIG.resumeFilename}.`,
          'success',
        );
      } else {
        showToast(
          'RESUME PDF SLOT READY',
          'Add your PDF file at public/resume.pdf (or set VITE_RESUME_URL in .env) to enable direct download.',
        );
      }
    } catch {
      showToast(
        'RESUME PDF SLOT READY',
        'Add your PDF file at public/resume.pdf (or set VITE_RESUME_URL in .env) to enable direct download.',
      );
    }
  };

  const handleNotifyUnconfiguredLink = (platform) => {
    const envVar =
      platform === 'GitHub' ? 'VITE_GITHUB_URL' : 'VITE_LINKEDIN_URL';
    showToast(
      `${platform.toUpperCase()} LINK CONFIGURATION`,
      `Configure ${envVar} in .env or src/data/portfolioData.js with your verified ${platform} profile URL.`,
    );
  };

  return (
    <ThemeProvider>
      <SystemInitialization />
      <div className="min-h-screen bg-[#101010] text-[#E8E4DE] font-sans selection:bg-[#E87935] selection:text-[#101010] relative overflow-x-hidden">
      {/* Keyboard Skip Link for Accessibility */}
      <a
        href="#work"
        className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-50 focus:px-4 focus:py-2 focus:bg-[#E87935] focus:text-[#101010] focus:font-mono focus:text-xs focus:font-semibold"
      >
        Skip to main content
      </a>

      {/* Subtle Ambient Atmospheric Background Glow */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        <motion.div
          animate={
            prefersReducedMotion
              ? undefined
              : {
                  x: [0, 28, -16, 0],
                  y: [0, -22, 14, 0],
                  opacity: [0.05, 0.085, 0.05],
                }
          }
          transition={{ duration: 18, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute -top-40 left-1/4 w-[520px] h-[520px] rounded-full blur-[130px]"
          style={{
            background:
              'radial-gradient(circle, #E87935 0%, rgba(232,121,53,0) 70%)',
          }}
        />
      </div>

      {/* Subtle Editorial Vertical Guide Lines */}
      <div className="fixed inset-0 pointer-events-none z-0 max-w-7xl mx-auto border-x border-[#33302D]/35" />

      {/* A. NAVIGATION */}
      <Navigation
        activeSection={activeSection}
        mobileMenuOpen={mobileMenuOpen}
        setMobileMenuOpen={setMobileMenuOpen}
        scrollToSection={scrollToSection}
      />

      {/* MAIN CONTENT */}
      <main id="main-content">
        {/* B. HERO SECTION */}
        <Hero scrollToSection={scrollToSection} />

        {/* C. SELECTED PROJECTS */}
        <ProjectShowcase onSelectProject={setSelectedProject} />

        {/* D. TECHNICAL EXPERTISE */}
        <Expertise />

        {/* E. ABOUT ME */}
        <About />

        {/* F. EXPERIENCE & BACKGROUND */}
        <ExperienceTimeline />

        {/* G. CREATIVE WORK */}
        <CreativeGallery onSelectVideo={setSelectedVideo} />

        {/* H. CONTACT SECTION */}
        <Contact
          onOpenContactModal={() => setContactModalOpen(true)}
          onTriggerResumeDownload={triggerResumeDownload}
          onNotifyUnconfiguredLink={handleNotifyUnconfiguredLink}
        />
      </main>

      {/* FOOTER WITH SUBTLE SECRET TERMINAL TRIGGER */}
      <Footer onOpenTerminal={() => setTerminalOpen(true)} />

      {/* AFTERHOURS // EXPLORATION MODE (3D ISOMETRIC WORLD + PORTAL NAVIGATION) */}
      <ExplorationMode
        isOpen={explorationOpen}
        onOpen={() => setExplorationOpen(true)}
        onClose={() => setExplorationOpen(false)}
        onNavigateToSection={scrollToSection}
      />

      {/* TOAST NOTIFICATION (RESUME / UNCONFIGURED PROFILE NOTICE) */}
      <AnimatePresence>
        {toastNotification && (
          <motion.div
            role="status"
            aria-live="polite"
            initial={{ opacity: 0, y: 20, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 12, scale: 0.97 }}
            transition={{
              duration: MOTION_TOKENS.standard,
              ease: MOTION_TOKENS.ease,
            }}
            className="fixed bottom-16 right-4 left-4 sm:left-auto sm:bottom-20 sm:right-6 z-50 bg-[#191919] border border-[#E87935] p-4 shadow-2xl sm:max-w-sm flex items-start justify-between gap-3"
          >
            <div className="flex items-start gap-3">
              {toastNotification.tone === 'success' ? (
                <CheckCircle2 className="w-5 h-5 text-[#E87935] shrink-0 mt-0.5" />
              ) : (
                <Info className="w-5 h-5 text-[#E87935] shrink-0 mt-0.5" />
              )}
              <div className="font-mono text-xs">
                <div className="text-[#E8E4DE] font-semibold">
                  {toastNotification.title}
                </div>
                <p className="text-[#A7A19A] mt-1 leading-relaxed">
                  {toastNotification.message}
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => setToastNotification(null)}
              aria-label="Dismiss notification"
              className="text-[#A7A19A] hover:text-[#E8E4DE] p-1 shrink-0"
            >
              <X className="w-4 h-4" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* MODALS */}
      <ProjectCaseStudyModal
        project={selectedProject}
        onClose={() => setSelectedProject(null)}
      />

      <VideoPreviewModal
        video={selectedVideo}
        onClose={() => setSelectedVideo(null)}
      />

      <ContactModal
        isOpen={contactModalOpen}
        onClose={() => setContactModalOpen(false)}
      />

      <SecretTerminalModal
        isOpen={terminalOpen}
        onClose={() => setTerminalOpen(false)}
        onOpenArcade={() => {
          setTerminalOpen(false);
          setArcadeOpen(true);
        }}
        onOpenDungeon={() => {
          setTerminalOpen(false);
          setDungeonOpen(true);
        }}
      />

      <ArcadeModal
        isOpen={arcadeOpen}
        onClose={() => setArcadeOpen(false)}
        onSwitchToDungeon={() => {
          setArcadeOpen(false);
          setDungeonOpen(true);
        }}
      />

      <DungeonModal
        isOpen={dungeonOpen}
        onClose={() => setDungeonOpen(false)}
      />
      </div>
    </ThemeProvider>
  );
}

