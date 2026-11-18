import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import { Terminal as TerminalIcon, X } from 'lucide-react';
import {
  MOTION_TOKENS,
  MODAL_OVERLAY_VARIANTS,
  MODAL_PANEL_VARIANTS,
} from '../../utils/motion.jsx';
import { useModalAccessibility } from '../../hooks/useModalAccessibility.js';
import { PROJECTS } from '../../data/portfolioData.js';

const QUICK_COMMANDS = [
  'help',
  'about',
  'projects',
  'status',
  'secret',
  'arcade',
  'dungeon',
  'clear',
];

export default function SecretTerminalModal({
  isOpen,
  onClose,
  onOpenArcade,
  onOpenDungeon,
}) {
  const prefersReducedMotion = useReducedMotion();
  const inputRef = useRef(null);
  const terminalEndRef = useRef(null);

  const [terminalInput, setTerminalInput] = useState('');
  const [terminalHistory, setTerminalHistory] = useState([
    { type: 'system', text: 'JP.DEV // AFTERHOURS WORKSPACE CONSOLE' },
    { type: 'system', text: 'Type "help" to view available commands.' },
  ]);

  const panelRef = useModalAccessibility({
    isOpen,
    onClose,
    initialFocusRef: inputRef,
  });

  useEffect(() => {
    if (isOpen && terminalEndRef.current) {
      terminalEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [terminalHistory, isOpen]);

  const executeCommand = (rawCommand) => {
    const raw = rawCommand.trim();
    if (!raw) return;

    const cmd = raw.toLowerCase();
    const newLogs = [...terminalHistory, { type: 'user', text: `> ${raw}` }];

    switch (cmd) {
      case 'help':
        newLogs.push({
          type: 'output',
          text: [
            'COMMANDS:',
            '  help      — List available console commands',
            '  about     — Developer summary & location',
            '  projects  — List portfolio projects',
            '  status    — Current workspace status',
            '  secret    — Reveal hidden interactive experiences',
            '  arcade    — Launch Reaction-Time Mini-Arcade',
            '  dungeon   — Enter Hidden Pixel Dungeon',
            '  clear     — Clear console history',
          ].join('\n'),
        });
        break;
      case 'about':
        newLogs.push({
          type: 'output',
          text: 'JP.DEV — Software, Web & Application Developer based in Sorsogon, Philippines. Experienced across full-stack development, local/cloud databases, and video editing.',
        });
        break;
      case 'projects': {
        const visibleList = PROJECTS.filter((p) => p.visible !== false)
          .map(
            (p, i) =>
              `0${i + 1}. ${p.title} (${p.technologies.join(', ')}) — ${p.tier}`,
          )
          .join('\n');
        newLogs.push({
          type: 'output',
          text: visibleList,
        });
        break;
      }
      case 'status':
        newLogs.push({
          type: 'output',
          text: 'STATUS: All systems operational. Available for software engineering roles and digital product projects.',
        });
        break;
      case 'secret':
        newLogs.push({
          type: 'highlight',
          text: 'SECRET UNLOCKED: Type "arcade" to test your reaction speed, or type "dungeon" to explore a hidden room.',
        });
        break;
      case 'arcade':
        newLogs.push({ type: 'highlight', text: 'Opening Mini-Arcade...' });
        setTerminalHistory(newLogs);
        setTerminalInput('');
        setTimeout(() => {
          onOpenArcade();
        }, 200);
        return;
      case 'dungeon':
        newLogs.push({ type: 'highlight', text: 'Entering Hidden Dungeon...' });
        setTerminalHistory(newLogs);
        setTerminalInput('');
        setTimeout(() => {
          onOpenDungeon();
        }, 200);
        return;
      case 'clear':
        setTerminalHistory([{ type: 'system', text: 'Console cleared.' }]);
        setTerminalInput('');
        return;
      default:
        newLogs.push({
          type: 'error',
          text: `Unknown command: "${raw}". Type "help" for a list of commands.`,
        });
    }

    setTerminalHistory(newLogs);
    setTerminalInput('');
  };

  const handleTerminalCommand = (e) => {
    e.preventDefault();
    executeCommand(terminalInput);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          key="terminal-modal-overlay"
          variants={MODAL_OVERLAY_VARIANTS}
          initial="hidden"
          animate="visible"
          exit="exit"
          onClick={onClose}
          className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 overflow-y-auto"
        >
          <motion.div
            ref={panelRef}
            role="dialog"
            aria-modal="true"
            aria-labelledby="terminal-modal-title"
            variants={MODAL_PANEL_VARIANTS}
            initial="hidden"
            animate="visible"
            exit="exit"
            onClick={(e) => e.stopPropagation()}
            className="bg-[#101010] border border-[#E87935]/60 max-w-2xl w-full shadow-2xl overflow-hidden flex flex-col h-[440px] max-h-[88vh] my-auto"
          >
            {/* Header */}
            <div className="flex flex-wrap items-center justify-between gap-2 px-3.5 sm:px-4 py-2.5 bg-[#191919] border-b border-[#33302D] shrink-0">
              <div className="flex items-center gap-2 font-mono text-xs text-[#E87935]">
                <TerminalIcon className="w-4 h-4 shrink-0" />
                <span id="terminal-modal-title" className="truncate">
                  AFTERHOURS // SECRET_TERMINAL
                </span>
              </div>
              <div className="flex items-center gap-1.5 sm:gap-2">
                <button
                  type="button"
                  onClick={onOpenArcade}
                  className="font-mono text-[10px] px-2.5 py-1 bg-[#242220] border border-[#33302D] text-[#F3A45B] hover:border-[#E87935] transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-[#E87935]"
                >
                  Arcade
                </button>
                <button
                  type="button"
                  onClick={onOpenDungeon}
                  className="font-mono text-[10px] px-2.5 py-1 bg-[#242220] border border-[#33302D] text-emerald-400 hover:border-emerald-400 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400"
                >
                  Dungeon
                </button>
                <button
                  type="button"
                  onClick={onClose}
                  aria-label="Close secret terminal"
                  className="min-w-[32px] min-h-[32px] flex items-center justify-center text-[#A7A19A] hover:text-[#E8E4DE] p-1 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#E87935]"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Output History */}
            <div
              role="log"
              aria-live="polite"
              className="flex-1 p-3.5 sm:p-4 overflow-y-auto font-mono text-xs space-y-2.5"
            >
              {terminalHistory.map((entry, i) => (
                <motion.div
                  key={i}
                  initial={
                    prefersReducedMotion ? false : { opacity: 0, x: -6 }
                  }
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.18, ease: MOTION_TOKENS.ease }}
                  className={`whitespace-pre-wrap leading-relaxed break-words ${
                    entry.type === 'user'
                      ? 'text-[#E8E4DE]'
                      : entry.type === 'highlight'
                      ? 'text-[#E87935]'
                      : entry.type === 'error'
                      ? 'text-red-400'
                      : 'text-[#7DAF82]'
                  }`}
                >
                  {entry.text}
                </motion.div>
              ))}
              <div ref={terminalEndRef} />
            </div>

            {/* Quick Command Chips */}
            <div className="px-3.5 sm:px-4 py-2 bg-[#141312] border-t border-[#33302D] flex flex-wrap items-center gap-1.5 shrink-0">
              {QUICK_COMMANDS.map((cmd) => (
                <button
                  key={cmd}
                  type="button"
                  onClick={() => executeCommand(cmd)}
                  className="font-mono text-[10px] px-2 py-1 bg-[#191919] border border-[#33302D] text-[#A7A19A] hover:text-[#E87935] hover:border-[#E87935]/50 transition-colors focus:outline-none focus-visible:ring-1 focus-visible:ring-[#E87935]"
                >
                  {cmd}
                </button>
              ))}
            </div>

            {/* Command Input Form */}
            <form
              onSubmit={handleTerminalCommand}
              className="flex items-center px-3.5 sm:px-4 py-3 bg-[#191919] border-t border-[#33302D] font-mono text-xs shrink-0"
            >
              <label htmlFor="terminal-command-input" className="sr-only">
                Terminal command input
              </label>
              <span
                aria-hidden="true"
                className="text-[#E87935] mr-2 flex items-center gap-1"
              >
                <span>&gt;</span>
                <motion.span
                  animate={
                    prefersReducedMotion ? undefined : { opacity: [1, 0, 1] }
                  }
                  transition={{
                    duration: 1,
                    repeat: Infinity,
                    ease: 'linear',
                  }}
                  className="inline-block w-1.5 h-3.5 bg-[#E87935]"
                />
              </span>
              <input
                ref={inputRef}
                id="terminal-command-input"
                type="text"
                value={terminalInput}
                onChange={(e) => setTerminalInput(e.target.value)}
                placeholder="Enter command (help, about, projects, status, secret)..."
                className="w-full bg-transparent text-[#E8E4DE] placeholder:text-[#A7A19A]/50 focus:outline-none"
              />
              <button
                type="submit"
                className="ml-2 px-3 py-1.5 bg-[#E87935] hover:bg-[#F3A45B] text-[#101010] font-semibold text-[11px] shrink-0 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#F3A45B]"
              >
                RUN
              </button>
            </form>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

