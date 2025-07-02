'use client'

import React from 'react';
import { useTheme } from '../../ThemeContext'
import { useState } from 'react'
import { BellIcon, ChatBubbleLeftRightIcon, DocumentTextIcon, UserGroupIcon, CodeBracketIcon, GlobeAltIcon, MoonIcon, SunIcon } from '@heroicons/react/24/solid'
import { MagnifyingGlassIcon } from '@heroicons/react/24/outline'

type AethosResult = {
  id: number;
  name: string;
  description: string;
  agency: string;
  url: string;
};

export default function Dashboard() {
  const { theme, toggleTheme } = useTheme();
  const [aethosQuery, setAethosQuery] = useState('');
  const [aethosResults, setAethosResults] = useState<AethosResult[]>([]);

  const [userData] = useState({
    firstName: 'Vector',
    lastName: 'Traut',
    email: 'vt@mail.mil',
    position: 'Program Lead',
    agency: 'Department of Justice',
    clearanceLevel: 'TS/SCI',
  });

  const handleAethosSearch = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const mockResults: AethosResult[] = [
      { id: 1, name: 'Security Protocol Alpha', description: 'Advanced encryption method for interagency communication.', agency: 'NSA', url: '#' },
      { id: 2, name: 'Project Firewall', description: 'Next-gen firewall system for government networks.', agency: 'DHS', url: '#' },
    ];
    setAethosResults(mockResults);
  };

  return (
    <div className="min-h-screen bg-[#F0F4F8] dark:bg-[#1A202C] text-[#2D3748] dark:text-[#E2E8F0]">
      {/* Header */}
      <header className="bg-white dark:bg-[#2D3748] shadow-sm p-4 flex justify-between items-center">
        <div className="text-xl font-bold tracking-wide text-[#2D3748] dark:text-white">P3NT4</div>
        <div className="flex-1 max-w-xl mx-4">
          <div className="relative">
            <MagnifyingGlassIcon className="h-5 w-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search agencies, personnel, or resources..."
              className="w-full py-2 pl-10 pr-4 bg-[#EDF2F7] dark:bg-[#4A5568] text-[#2D3748] dark:text-white rounded-full focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
          </div>
        </div>
        <div className="flex items-center space-x-4">
          <button onClick={toggleTheme} className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700">
            {theme === 'light' ? <MoonIcon className="h-5 w-5" /> : <SunIcon className="h-5 w-5" />}
          </button>
          <BellIcon className="h-6 w-6 cursor-pointer text-[#4A5568] dark:text-[#A0AEC0]" />
          <ChatBubbleLeftRightIcon className="h-6 w-6 cursor-pointer text-[#4A5568] dark:text-[#A0AEC0]" />
          <div className="w-8 h-8 bg-[#CBD5E0] dark:bg-[#4A5568] rounded-full"></div>
        </div>
      </header>

      {/* Main content */}
      <div className="container mx-auto px-4 py-8 flex flex-col lg:flex-row space-y-8 lg:space-y-0 lg:space-x-8">
        {/* Left sidebar - Profile summary and Quick Links */}
        <div className="lg:w-1/4">
          {/* ... */}
        </div>

        {/* Main feed - Now includes AETHOS search */}
        <div className="lg:w-1/2">
          <div className="bg-white dark:bg-[#2D3748] rounded-lg p-6 mb-8 shadow-sm">
            <h2 className="text-2xl font-bold mb-4">AETHOS - Federal Code Search</h2>
            <form onSubmit={handleAethosSearch} className="mb-4">
              <div className="flex">
                <input
                  type="text"
                  value={aethosQuery}
                  onChange={(e) => setAethosQuery(e.target.value)}
                  placeholder="Enter your search query"
                  className="flex-grow py-2 px-4 bg-[#EDF2F7] dark:bg-[#4A5568] text-[#2D3748] dark:text-white rounded-l-md focus:outline-none focus:ring-2 focus:ring-blue-400"
                />
                <button
                  type="submit"
                  className="bg-blue-500 text-white px-6 py-2 rounded-r-md hover:bg-blue-600 transition-colors"
                >
                  Search
                </button>
              </div>
            </form>
            {aethosResults.length > 0 && (
              <div>
                <h3 className="text-xl font-semibold mb-2">Search Results:</h3>
                <ul className="space-y-4">
                  {aethosResults.map((result) => (
                    <li key={result.id} className="bg-[#EDF2F7] dark:bg-[#4A5568] p-4 rounded-md">
                      <h4 className="text-lg font-semibold">{result.name}</h4>
                      <p className="text-sm text-gray-600 dark:text-gray-300">{result.description}</p>
                      <p className="text-sm"><strong>Agency:</strong> {result.agency}</p>
                      <a href={result.url} className="text-blue-500 hover:underline text-sm">View Details</a>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          {/* Additional content... */}
        </div>

        <div className="lg:w-1/4">
          {/* ... */}
        </div>
      </div>
    </div>
  );
}
