'use client'
import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Link from 'next/link'
import DashboardFooter from '../../components/DashboardFooter'
import { Space_Grotesk, Inter } from 'next/font/google';

const spaceGrotesk = Space_Grotesk({ subsets: ['latin'] });
const inter = Inter({ subsets: ['latin'] });

const GestaltLogo = () => (
  <div className="metallic-gradient px-4 py-2 skew-x-[-10deg] transform shadow-lg">
    <span className={`text-3xl font-heavy tracking-wider ${spaceGrotesk.className} text-black skew-x-[10deg] inline-block`}>
      <b>gestalt</b>
    </span>
  </div>
);

const NavItem = ({ label, active, onClick }) => (
  <motion.div
    whileHover={{ x: 5 }}
    className={`px-4 py-2 cursor-pointer ${active ? 'text-white border-l-2 border-green-500' : 'text-[#a0a0a0] hover:text-white'}`}
    onClick={onClick}
  >
    <span className="text-sm">{label}</span>
  </motion.div>
);

const GestaltTerminal = ({ onSaveResult }) => {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const terminalRef = useRef(null);

  useEffect(() => {
    loadRepositories();
  }, []);

  const loadRepositories = async () => {
    setOutput([
      { type: 'system', content: 'Initializing Gestalt...' },
      { type: 'system', content: 'Federal repositories loaded successfully.' },
      { type: 'system', content: 'Welcome to Gestalt Terminal. Type "help" for available commands.' }
    ]);
    setIsLoading(false);
  };

  const handleCommand = async (command) => {
    const [cmd, ...args] = command.split(' ');
    switch (cmd.toLowerCase()) {
      case 'help':
        return [
          { type: 'system', content: 'Available commands:' },
          { type: 'system', content: '  search repository <query> - Search repositories' },
          { type: 'system', content: '  search code <repositoryURL> <query> - Search code in a specific repository' },
          { type: 'system', content: '  clear - Clear the terminal' }
        ];
      case 'clear':
        setOutput([]);
        return [];
      case 'search':
        if (args[0] === 'repository') {
          return await handleRepositorySearch(args.slice(1).join(' '));
        } else if (args[0] === 'code') {
          if (args.length < 3) {
            return [{ type: 'error', content: 'Usage: search code <repositoryURL> <query>' }];
          }
          return await handleCodeSearch(args[1], args.slice(2).join(' '));
        } else {
          return [{ type: 'error', content: 'Invalid search type. Use "repository" or "code".' }];
        }
      default:
        return [{ type: 'error', content: `Unknown command: ${cmd}` }];
    }
  };

  // ... (keep handleRepositorySearch and handleCodeSearch functions)

  const handleSubmit = async (e) => {
    e.preventDefault();
    const trimmedInput = input.trim();
    if (!trimmedInput) return;

    setOutput(prev => [...prev, { type: 'input', content: `> ${trimmedInput}` }]);
    setInput('');

    const newOutput = await handleCommand(trimmedInput);
    setOutput(prev => [...prev, ...newOutput]);
  };

  // ... (keep renderResult function)

  useEffect(() => {
    if (terminalRef.current) {
      terminalRef.current.scrollTop = terminalRef.current.scrollHeight;
    }
  }, [output]);

  return (
    <div className="bg-[#1A1A1A] p-6 rounded-lg border border-[#2a2a2a] relative">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-mono text-green-400">Gestalt Terminal</h2>
        <div className="flex space-x-2">
          <div className="w-3 h-3 rounded-full bg-red-500"></div>
          <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
          <div className="w-3 h-3 rounded-full bg-green-500"></div>
        </div>
      </div>
      <div 
        ref={terminalRef}
        className="bg-black p-4 rounded-lg h-96 overflow-y-auto mb-4 font-mono text-sm"
      >
        {output.map((item, index) => (
          <div key={index}>
            {item.type === 'input' && <div className="text-green-400">> {item.content}</div>}
            {item.type === 'system' && <div className="text-blue-400">[SYSTEM] {item.content}</div>}
            {item.type === 'error' && <div className="text-red-400">[ERROR] {item.content}</div>}
            {item.type === 'result' && item.content.map((result, i) => renderResult(result))}
          </div>
        ))}
      </div>
      <form onSubmit={handleSubmit} className="flex items-center">
        <span className="text-green-500 mr-2">></span>
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          className="flex-grow bg-transparent border-none outline-none text-white font-mono"
          placeholder={isLoading ? "Loading repositories..." : "Enter a command..."}
          disabled={isLoading}
        />
      </form>
    </div>
  );
};

const SavedResult = ({ result, onDelete }) => (
  <div className="bg-[#1A1A1A] p-4 rounded-lg mb-4 border-l-2 border-green-500">
    <div className="flex justify-between items-center mb-2">
      <h3 className="text-sm font-light text-green-400">{result.agency}</h3>
      <button 
        onClick={() => onDelete(result)}
        className="text-xs text-[#a0a0a0] hover:text-red-400 transition-colors duration-300"
      >
        Delete
      </button>
    </div>
    <p className="text-sm mb-2 font-light">{result.name}</p>
    <a href={result.repositoryURL} target="_blank" rel="noopener noreferrer" className="text-xs text-blue-400 hover:underline">
      View Repository
    </a>
  </div>
);

export default function Dashboard() {
  const [activeNavItem, setActiveNavItem] = useState('Code Intelligence');
  const [savedResults, setSavedResults] = useState([]);

  const handleSaveResult = (result) => {
    setSavedResults(prev => [...prev, result]);
  };

  const handleDeleteResult = (resultToDelete) => {
    setSavedResults(prev => prev.filter(result => result !== resultToDelete));
  };

  return (
    <div className={`min-h-screen bg-[#0A0A0A] text-[#e0e0e0] font-light flex ${inter.className}`}>
      {/* Sidebar */}
      <nav className="w-64 border-r border-[#1a1a1a] p-6 flex flex-col">
        <GestaltLogo />
        <div className="space-y-2 flex-grow mt-8">
          {['Code Intelligence', 'Collaboration', 'Analytics', 'Resources'].map((item) => (
            <NavItem 
              key={item}
              label={item}
              active={activeNavItem === item}
              onClick={() => setActiveNavItem(item)}
            />
          ))}
        </div>
        <NavItem label="Settings" onClick={() => setActiveNavItem('Settings')} />
      </nav>

      {/* Main Content */}
      <main className="flex-1 p-8 pb-16 overflow-y-auto">
        <header className="flex justify-between items-center mb-12">
          <h1 className="text-3xl font-light">{activeNavItem}</h1>
          <div className="flex items-center space-x-6">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
            </svg>
            <div className="w-8 h-8 bg-white rounded-full"></div>
          </div>
        </header>

        <div className="grid grid-cols-3 gap-8">
          {/* Gestalt Terminal */}
          <div className="col-span-2">
            <GestaltTerminal onSaveResult={handleSaveResult} />
          </div>

          {/* Search Analytics and Saved Results */}
          <div className="space-y-6">
            <div className="bg-[#1A1A1A] p-6 rounded-lg border border-[#2a2a2a]">
              <h2 className="text-2xl font-light mb-4">Search Analytics</h2>
              <p className="text-sm mb-4">Recent searches show increased interest in AI and cybersecurity.</p>
              <Link href="/search-analytics" className="text-sm text-green-400 hover:underline">
                View Detailed Analytics →
              </Link>
            </div>

            <div className="bg-[#1A1A1A] p-6 rounded-lg border border-[#2a2a2a]">
              <h2 className="text-2xl font-light mb-4">Saved Results</h2>
              {savedResults.length === 0 ? (
                <p className="text-sm text-[#a0a0a0]">No saved results yet. Use the "Save to Clipboard" option in search results to save them here.</p>
              ) : (
                savedResults.map((result, index) => (
                  <SavedResult key={index} result={result} onDelete={handleDeleteResult} />
                ))
              )}
            </div>
          </div>
        </div>

        <DashboardFooter />
      </main>
    </div>
  );
}