'use client';

import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { Space_Grotesk, IBM_Plex_Mono } from 'next/font/google';

const spaceGrotesk = Space_Grotesk({ subsets: ['latin'] });
const ibmPlexMono = IBM_Plex_Mono({ weight: ['400', '700'], subsets: ['latin'] });

const missionScenarios = [
  {
    id: 'ms1',
    title: "FEMA Mobile App Deployment",
    shortTitle: "RAPID RESPONSE TECH",
    description: "P3NT4's AI Code Discovery solution enabled FEMA to deploy a critical mobile app in record time. By identifying and repurposing existing code from the Department of Transportation, P3NT4 reduced development time by 60% and saved an estimated $1.2 million in resources.",
    impact: "Accelerated disaster response times by 40%, potentially saving thousands of lives.",
    techDetails: "Leveraged advanced NLP algorithms to analyze over 1 million lines of government code repositories.",
    relatedCapabilities: ['cap1', 'cap3', 'cap4'],
    svg: (
      <svg viewBox="0 0 100 100" className="w-full h-64">
        <path d="M10 90 Q 50 10 90 90" fill="none" stroke="white" strokeWidth="0.5"/>
        <path d="M30 90 Q 50 30 70 90" fill="none" stroke="white" strokeWidth="0.5"/>
        <circle cx="50" cy="50" r="10" fill="none" stroke="white" strokeWidth="0.5"/>
      </svg>
    )
  },
  {
    id: 'ms2',
    title: "Cybersecurity Threat Response",
    shortTitle: "UNIFIED CYBER DEFENSE",
    description: "P3NT4's secure communication platform facilitated seamless collaboration between the FBI and DHS, enabling a coordinated response to a nationwide cybersecurity threat. The platform's end-to-end encryption and real-time data sharing capabilities allowed for rapid information exchange and decision-making.",
    impact: "Reduced threat mitigation time by 75%, preventing an estimated $50 million in potential damages.",
    techDetails: "Implemented quantum-resistant encryption protocols and AI-driven threat analysis.",
    relatedCapabilities: ['cap2', 'cap3'],
    svg: (
      <svg viewBox="0 0 100 100" className="w-full h-64">
        <path d="M20 80 L 50 20 L 80 80 Z" fill="none" stroke="white" strokeWidth="0.5"/>
        <circle cx="50" cy="50" r="30" fill="none" stroke="white" strokeWidth="0.5"/>
        <path d="M30 70 Q 50 30 70 70" fill="none" stroke="white" strokeWidth="0.5"/>
      </svg>
    )
  },
  {
    id: 'ms3',
    title: "Multi-Agency Disaster Relief",
    shortTitle: "SYNERGIZED CRISIS MANAGEMENT",
    description: "During a major natural disaster, P3NT4's real-time collaboration tools enabled unprecedented coordination between FEMA, the National Guard, and local authorities. The platform's AI-driven resource allocation system optimized the distribution of personnel, supplies, and equipment across affected areas.",
    impact: "Improved resource utilization by 35%, leading to a 20% increase in lives saved and a 15% reduction in recovery costs.",
    techDetails: "Utilized machine learning algorithms for predictive resource allocation and IoT integration for real-time situational awareness.",
    relatedCapabilities: ['cap2', 'cap3', 'cap4'],
    svg: (
      <svg viewBox="0 0 100 100" className="w-full h-64">
        <path d="M10 90 C 30 90 30 10 50 10 S 70 90 90 90" fill="none" stroke="white" strokeWidth="0.5"/>
        <path d="M10 50 L 90 50" fill="none" stroke="white" strokeWidth="0.5"/>
        <circle cx="50" cy="50" r="20" fill="none" stroke="white" strokeWidth="0.5"/>
      </svg>
    )
  }
].map((scenario, index) => ({ ...scenario, index: index + 1 }));


const coreCapabilities = [
  {
    id: 'cap1',
    title: "AI Code Discovery",
    description: "Utilizes advanced machine learning to identify and repurpose existing code across government repositories.",
    svg: (
      <svg viewBox="0 0 100 100" className="w-full h-32">
        <rect x="10" y="10" width="80" height="80" fill="none" stroke="white" strokeWidth="0.5"/>
        <path d="M30 50 L 70 50" fill="none" stroke="white" strokeWidth="0.5"/>
        <path d="M50 30 L 50 70" fill="none" stroke="white" strokeWidth="0.5"/>
      </svg>
    )
  },
  {
    id: 'cap2',
    title: "Secure Inter-Agency Communication",
    description: "End-to-end encrypted platform for real-time collaboration across government agencies.",
    svg: (
      <svg viewBox="0 0 100 100" className="w-full h-32">
        <circle cx="20" cy="50" r="15" fill="none" stroke="white" strokeWidth="0.5"/>
        <circle cx="80" cy="50" r="15" fill="none" stroke="white" strokeWidth="0.5"/>
        <path d="M35 50 L 65 50" fill="none" stroke="white" strokeWidth="0.5"/>
      </svg>
    )
  },
  {
    id: 'cap3',
    title: "Resource Optimization AI",
    description: "AI-driven system for optimal allocation of personnel, supplies, and equipment in crisis situations.",
    svg: (
      <svg viewBox="0 0 100 100" className="w-full h-32">
        <path d="M10 90 L 50 10 L 90 90 Z" fill="none" stroke="white" strokeWidth="0.5"/>
        <circle cx="50" cy="50" r="10" fill="none" stroke="white" strokeWidth="0.5"/>
      </svg>
    )
  },
  {
    id: 'cap4',
    title: "Rapid App Development",
    description: "Accelerated app development framework tailored for government needs and security requirements.",
    svg: (
      <svg viewBox="0 0 100 100" className="w-full h-32">
        <rect x="20" y="20" width="60" height="60" fill="none" stroke="white" strokeWidth="0.5"/>
        <path d="M40 50 L 60 50" fill="none" stroke="white" strokeWidth="0.5"/>
        <path d="M50 40 L 50 60" fill="none" stroke="white" strokeWidth="0.5"/>
      </svg>
    )
  }
].map((capability, index) => ({ ...capability, index: index + 1 }));


const NumberBox = ({ number }) => (
  <motion.div
    initial={{ rotateX: -90 }}
    animate={{ rotateX: 0 }}
    exit={{ rotateX: 90 }}
    transition={{ duration: 0.5 }}
    className="bg-white text-black w-16 h-16 flex items-center justify-center text-2xl font-bold mr-4 border-2 border-white"
    style={{ clipPath: 'polygon(10% 0%, 100% 0%, 100% 90%, 90% 100%, 0% 100%, 0% 10%)' }}
  >
    {number.toString().padStart(2, '0')}
  </motion.div>
);

const MissionScenario = ({ scenario }) => {
  return (
    <motion.div
      key={scenario.id}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.5 }}
      className="grid grid-cols-1 md:grid-cols-3 gap-8 items-start"
    >
      <div className="md:col-span-1 sticky top-8">
        <div className="w-full aspect-square">
          {scenario.svg}
        </div>
      </div>
      <div className="md:col-span-2">
        <div className="flex items-center mb-6">
          <NumberBox number={scenario.index} />
          <h2 className="text-4xl font-bold">{scenario.shortTitle}</h2>
        </div>
        <p className="text-lg mb-6">{scenario.description}</p>
        <h3 className="text-2xl font-bold mb-4">Impact</h3>
        <p className="text-lg mb-6">{scenario.impact}</p>
        <h3 className="text-2xl font-bold mb-4">Technology Highlights</h3>
        <p className="text-lg mb-6">{scenario.techDetails}</p>
      </div>
    </motion.div>
  );
};

const CoreCapability = ({ capability }) => {
  return (
    <motion.div
      key={capability.id}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.5 }}
      className="grid grid-cols-1 md:grid-cols-3 gap-8 items-start"
    >
      <div className="md:col-span-1 sticky top-8">
        <div className="w-full aspect-square">
          {capability.svg}
        </div>
      </div>
      <div className="md:col-span-2">
        <div className="flex items-center mb-6">
          <NumberBox number={capability.index} />
          <h2 className="text-4xl font-bold">{capability.title}</h2>
        </div>
        <p className="text-lg mb-6">{capability.description}</p>
      </div>
    </motion.div>
  );
};

const LineSVG = () => (
  <svg className="absolute top-0 right-0 w-1/3 h-full opacity-10" viewBox="0 0 100 100" preserveAspectRatio="none">
    <path d="M0,0 Q50,50 100,100" stroke="#4A90E2" strokeWidth="0.5" fill="none" />
    <path d="M0,100 Q50,50 100,0" stroke="#4A90E2" strokeWidth="0.5" fill="none" />
  </svg>
);

export default function Features() {
  const [activeScenario, setActiveScenario] = useState(missionScenarios[0].id);
  const [activeCapability, setActiveCapability] = useState(null);

  const handleScenarioClick = (id) => {
    setActiveScenario(id);
    setActiveCapability(null);
  };

  const handleCapabilityClick = (id) => {
    setActiveCapability(id);
    setActiveScenario(null);
  };

  const currentScenario = missionScenarios.find(ms => ms.id === activeScenario);
  const currentCapability = coreCapabilities.find(cap => cap.id === activeCapability);

  return (
    <div className={`min-h-screen bg-[#0A0A0A] text-white ${ibmPlexMono.className}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex justify-between items-center mb-12">
          <Link href="/" className={`text-7xl font-bold mb-2 tracking-widest p3nt4-text-sharp ${spaceGrotesk.className}`}>P3NT4</Link>
          <Link href="/contact" className="neo-brutalism-button-sharp hover:bg-white hover:text-black transition-colors duration-300">
            Contact Us
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
          <div className="md:col-span-1">
            <h2 className="text-lg font-bold mb-6 text-[#888]">MISSION SCENARIOS</h2>
            {missionScenarios.map((scenario) => (
              <motion.button
                key={scenario.id}
                className={`block w-full text-left py-3 px-4 mb-3 ${activeScenario === scenario.id ? 'text-white' : 'text-[#888]'} transition-colors duration-300 ease-in-out`}
                onClick={() => handleScenarioClick(scenario.id)}
                whileHover={{ x: 10 }}
              >
                 <span className="mr-2 font-mono">{scenario.index.toString().padStart(2, '0')}.</span>{scenario.title}
            </motion.button>
            ))}

            <h2 className="text-lg font-bold mb-6 mt-8 text-[#888]">CORE CAPABILITIES</h2>
            {coreCapabilities.map((capability) => (
              <motion.button
                key={capability.id}
                className={`block w-full text-left py-3 px-4 mb-3 ${activeCapability === capability.id ? 'text-white' : 'text-[#888]'} transition-colors duration-300 ease-in-out`}
                onClick={() => handleCapabilityClick(capability.id)}
                whileHover={{ x: 10 }}
              >
                <span className="mr-2 font-mono">{capability.index.toString().padStart(2, '0')}.</span>{capability.title}
            </motion.button>
            ))}
          </div>

          <div className="md:col-span-3">
            <AnimatePresence mode='wait'>
              {activeScenario && (
                <MissionScenario scenario={currentScenario} />
              )}
              {activeCapability && (
                <CoreCapability capability={currentCapability} />
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
<footer className="text-center p-4 text-[#909090] text-xs z-10">
        <p>P3NT4 &copy; 2024 | Authorized Government Use Only | FOUO</p>
      </footer>
    </div>
  );
}