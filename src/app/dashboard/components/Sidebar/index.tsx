// src/app/dashboard/components/Sidebar/index.tsx

import React from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';

interface SidebarProps {
  activeNavItem: string;
  setActiveNavItem: (item: string) => void;
}

const P3NT4Logo = () => (
  <svg className="w-8 h-8" viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="100" cy="100" r="96" stroke="currentColor" strokeWidth="2"/>
    <path d="M100 4C100 4 40 60 40 100C40 140 100 198 100 198" stroke="currentColor" strokeWidth="2"/>
    <path d="M100 4C100 4 160 60 160 100C160 140 100 198 100 198" stroke="currentColor" strokeWidth="2"/>
    <path d="M4 100H196" stroke="currentColor" strokeWidth="2"/>
  </svg>
);

const NavItem: React.FC<{ label: string; active: boolean; onClick: () => void }> = ({ label, active, onClick }) => (
  <motion.div
    whileHover={{ x: 5 }}
    className={`px-4 py-2 cursor-pointer ${active ? 'text-white border-l-2 border-white' : 'text-[#a0a0a0] hover:text-white'}`}
    onClick={onClick}
  >
    <span className="text-sm">{label}</span>
  </motion.div>
);

const Sidebar: React.FC<SidebarProps> = ({ activeNavItem, setActiveNavItem }) => {
  const navItems = ['AETHOS', 'Code Explorer', 'Resources', 'Analytics'];

  return (
    <nav className="w-64 border-r border-[#1a1a1a] p-6 flex flex-col">
      <Link href="/dashboard" className="flex items-center space-x-3 mb-12">
        <P3NT4Logo />
        <span className="text-xl tracking-wide">P3NT4</span>
      </Link>
      <div className="space-y-2 flex-grow">
        {navItems.map((item) => (
          <NavItem 
            key={item}
            label={item}
            active={activeNavItem === item}
            onClick={() => setActiveNavItem(item)}
          />
        ))}
      </div>
      <NavItem 
        label="Settings" 
        active={activeNavItem === 'Settings'}
        onClick={() => setActiveNavItem('Settings')}
      />
    </nav>
  );
};

export default Sidebar;