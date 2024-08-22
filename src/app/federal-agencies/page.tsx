'use client';
import Footer from '../../components/Footer';
import { useState, useEffect } from 'react';
import Head from 'next/head';
import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Space_Grotesk, Inter } from 'next/font/google';

const spaceGrotesk = Space_Grotesk({ subsets: ['latin'] });
const inter = Inter({ subsets: ['latin'] });

const P3NT4Logo = () => (
  <svg className="w-8 h-8" viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="100" cy="100" r="96" stroke="currentColor" strokeWidth="2"/>
    <path d="M100 4C100 4 40 60 40 100C40 140 100 198 100 198" stroke="currentColor" strokeWidth="2"/>
    <path d="M100 4C100 4 160 60 160 100C160 140 100 198 100 198" stroke="currentColor" strokeWidth="2"/>
    <path d="M4 100H196" stroke="currentColor" strokeWidth="2"/>
  </svg>
);

const agencies = [
  { name: 'Department of Homeland Security', logo: 'dhs.svg' },
  { name: 'Department of Defense', logo: 'dod.svg' },
  { name: 'Department of State', logo: 'dos.svg' },
  { name: 'Department of Justice', logo: 'doj.svg' },
  { name: 'Department of Agriculture', logo: 'usda.svg' },
  { name: 'Department of Education', logo: 'ed.svg' },
  { name: 'Department of Energy', logo: 'doe.svg' },
  { name: 'Department of Health & Human Services', logo: 'hhs.svg' },
  { name: 'Department of the Interior', logo: 'doi.svg' },
  { name: 'Department of Labor', logo: 'dol.svg' },
  { name: 'Department of Transportation', logo: 'dot.svg' },
  { name: 'Department of the Treasury', logo: 'usdt.svg' },
  { name: 'Department of Veterans Affairs', logo: 'va.svg' },
  { name: 'Environmental Protection Agency', logo: 'epa.svg' },
  { name: 'National Aeronautics and Space Administration', logo: 'nasa.svg' },
  { name: 'United States Agency for International Development', logo: 'usaid.svg' },
  { name: 'General Services Administration', logo: 'gsa.svg' },
  { name: 'National Science Foundation', logo: 'nsf.svg' },
  { name: 'Nuclear Regulatory Commission', logo: 'nrc.svg' },
  { name: 'Office of Personnel Management', logo: 'opm.svg' },
  { name: 'Small Business Administration', logo: 'sba.svg' },
  { name: 'Social Security Administration', logo: 'ssa.png' },
  // Add more agencies as needed
];

export default function FederalAgencies() {
  const [searchTerm, setSearchTerm] = useState('');
  const [scrollPosition, setScrollPosition] = useState(0);

  useEffect(() => {
    const handleScroll = () => setScrollPosition(window.scrollY);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const filteredAgencies = agencies.filter(agency =>
    agency.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className={`min-h-screen bg-[#0a0a0a] text-[#e0e0e0] ${inter.className}`}>
      <Head>
        <title>Federal Agencies | P3NT4</title>
        <meta name="description" content="Discover federal agencies collaborating on AETHOS" />
      </Head>

      <header className={`fixed top-0 left-0 right-0 py-4 px-8 flex justify-between items-center z-10 transition-all duration-300 ${scrollPosition > 50 ? 'bg-[#0a0a0a]/90 backdrop-blur-sm' : 'bg-transparent'}`}>
        <Link href="/" className="flex items-center space-x-2">
          <P3NT4Logo />
          <span className={`text-xl font-light tracking-wider ${spaceGrotesk.className}`}>P3NT4</span>
        </Link>
        <nav className="flex items-center space-x-8">
          <Link href="/platform" className="text-sm hover:text-white transition-colors">Aethos</Link>
          <Link href="/technology" className="text-sm hover:text-white transition-colors">Platform</Link>
          <Link href="/impact" className="text-sm hover:text-white transition-colors">Impact</Link>
          <Link href="/federal-agencies" className="text-sm hover:text-white transition-colors"> Agencies</Link>
          <Link href="/connect" className="text-sm border border-[#e0e0e0] px-4 py-2 hover:bg-white hover:text-[#0a0a0a] transition-colors">
            Connect
          </Link>
        </nav>
      </header>

      <main className="pt-32 px-8">
        <motion.section 
          className="max-w-4xl mx-auto mb-32"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
        >
          <h1 className={`text-5xl font-light leading-tight mb-8 ${spaceGrotesk.className}`}>
          Agencies on AETHOS
          </h1>
          <p className="text-lg font-light leading-relaxed mb-12 opacity-80">
            Explore the growing network of federal agencies harnessing the power of AETHOS for innovative open-source collaboration.
          </p>

          <input
            type="text"
            placeholder="Search agencies..."
            className="w-full p-2 mb-8 bg-[#111] border border-[#333] rounded"
            onChange={(e) => setSearchTerm(e.target.value)}
          />

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-8 mb-16">
            {filteredAgencies.map(({ name, logo }) => (
              <div key={name} className="flex flex-col items-center">
                <Image
                  src={`/${logo}`}
                  alt={`${name} Logo`}
                  width={80}
                  height={80}
                  className="mb-4"
                />
                <span className="text-xs uppercase tracking-wider text-center">{name}</span>
              </div>
            ))}
          </div>

          <div className="bg-[#111] p-8 rounded-lg mb-16">
            <h2 className={`text-2xl font-light mb-4 ${spaceGrotesk.className}`}>Join the AETHOS Network</h2>
            <p className="mb-6 opacity-80">
              Ready to unlock the potential of your agency's code? Join the AETHOS platform and contribute to the future of federal software innovation.
            </p>
            <Link href="https://code.gov" className="text-sm border border-[#e0e0e0] px-6 py-3 hover:bg-white hover:text-[#0a0a0a] transition-colors">
              Learn How to Open Source Your Code
            </Link>
          </div>

          <div className="text-center">
            <Link href="/contact" className="text-sm border border-[#e0e0e0] px-6 py-3 hover:bg-white hover:text-[#0a0a0a] transition-colors">
              Contact Us for Agency Onboarding
            </Link>
          </div>
        </motion.section>
      </main>
      <Footer />
    </div>
  );
}