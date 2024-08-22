// src/app/dashboard/components/AETHOSTerminal/index.tsx

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface OutputItem {
  type: 'input' | 'system' | 'error' | 'result';
  content: string | JSX.Element;
}

interface AETHOSTerminalProps {
  isFullScreen: boolean;
  toggleFullScreen: () => void;
}

const AETHOSTerminal: React.FC<AETHOSTerminalProps> = ({ 
  isFullScreen, 
  toggleFullScreen 
}) => {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState<OutputItem[]>([]);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const terminalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setOutput([
      { type: 'system', content: 'AETHOS initialized. Ready for your query.' },
    ]);
  }, []);

  useEffect(() => {
    if (terminalRef.current) {
      terminalRef.current.scrollTop = terminalRef.current.scrollHeight;
    }
  }, [output]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const trimmedInput = input.trim();
    if (!trimmedInput) return;

    setOutput(prev => [...prev, { type: 'input', content: `> ${trimmedInput}` }]);
    setInput('');
    setIsAnalyzing(true);

    // Simulating a delay for analysis
    setTimeout(() => {
      setOutput(prev => [...prev, { type: 'system', content: 'Analysis complete.' }]);
      setIsAnalyzing(false);
    }, 2000);
  };

  return (
    <div className="bg-black rounded-lg border border-black-800 overflow-hidden">
      <div className="flex justify-between items-center px-4 py-2 bg-gray-900">
        <h2 className="text-lg font-mono text-white-400">AETHOS_</h2>
        <div className="flex space-x-2">
          <button className="w-3 h-3 rounded-full bg-red-500" />
          <button className="w-3 h-3 rounded-full bg-yellow-500" />
          <button 
            className="w-3 h-3 rounded-full bg-green-500"
            onClick={toggleFullScreen}
          />
        </div>
      </div>
      <div 
        ref={terminalRef}
        className="h-[calc(100vh-200px)] overflow-y-auto p-4 font-mono text-sm"
      >
        {output.map((item, index) => (
          <div key={index} className={
            item.type === 'input' ? 'text-green-400' :
            item.type === 'system' ? 'text-blue-400' :
            item.type === 'error' ? 'text-red-400' :
            'text-white'
          }>
            {item.content}
          </div>
        ))}
        <AnimatePresence>
          {isAnalyzing && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="text-yellow-400"
            >
              Analyzing...
            </motion.div>
          )}
        </AnimatePresence>
      </div>
      <form onSubmit={handleSubmit} className="flex items-center p-4 bg-gray-900">
        <span className="text-green-500 mr-2">></span>
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          className="flex-grow bg-transparent border-none outline-none text-white font-mono"
          placeholder="Enter your query..."
        />
      </form>
      <div className="px-4 py-2 bg-gray-900">
        <button className="text-gray-400 text-sm hover:text-white">
          ▶ Available Commands
        </button>
      </div>
    </div>
  );
};

export default AETHOSTerminal;