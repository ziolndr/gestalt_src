'use client';

import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion, useScroll, useTransform } from 'framer-motion';
import { FileText, BookOpen, Info, MessageSquare, BarChart2, Brain, Github, Code, Linkedin, Twitter, GitBranch, Users, Terminal, Database, Network, Shield, Zap, Lightbulb, FileCheck, Server, Lock } from 'lucide-react';
import { Space_Grotesk, Inter, Roboto_Mono, Orbitron, Audiowide, Rajdhani, Chakra_Petch  } from 'next/font/google';

const robotoMono = Roboto_Mono({ subsets: ['latin'] });
const orbitron = Orbitron({ subsets: ['latin'] });
const audiowide = Audiowide({ weight: '400', subsets: ['latin'] });
const rajdhani = Rajdhani({ weight: '700', subsets: ['latin'] });
const chakraPetch = Chakra_Petch({ weight: '700', subsets: ['latin'] });
const spaceGrotesk = Space_Grotesk({ subsets: ['latin'] });
const inter = Inter({ subsets: ['latin'] });

const SevenSegmentDigit = ({ value }) => {
  const segments = [
    { id: 'a', on: [0,2,3,5,6,7,8,9] },
    { id: 'b', on: [0,1,2,3,4,7,8,9] },
    { id: 'c', on: [0,1,3,4,5,6,7,8,9] },
    { id: 'd', on: [0,2,3,5,6,8,9] },
    { id: 'e', on: [0,2,6,8] },
    { id: 'f', on: [0,4,5,6,8,9] },
    { id: 'g', on: [2,3,4,5,6,8,9] },
  ];

  return (
    <svg viewBox="0 0 57 80" className="w-8 h-12 mr-2">
      {segments.map(segment => (
        <polygon
          key={segment.id}
          points={{
            a: "6,10 10,6 47,6 51,10 47,14 10,14",
            b: "51,10 55,14 55,41 51,45 47,41 47,14",
            c: "51,45 55,49 55,76 51,80 47,76 47,49",
            d: "6,80 10,76 47,76 51,80 47,84 10,84",
            e: "2,49 6,45 6,76 2,80 -2,76 -2,49",
            f: "2,10 6,6 6,41 2,45 -2,41 -2,14",
            g: "6,45 10,41 47,41 51,45 47,49 10,49"
          }[segment.id]}
          fill={segment.on.includes(value) ? "#4ECDC4" : "#333333"}
        />
      ))}
    </svg>
  );
};

const useActiveSection = (sectionIds, options) => {
  const [activeSection, setActiveSection] = useState('');

  useEffect(() => {
    const observers = [];
    const observerOptions = { rootMargin: '-50% 0px -50% 0px', ...options };

    sectionIds.forEach((sectionId) => {
      const element = document.getElementById(sectionId);
      if (element) {
        const observer = new IntersectionObserver(
          ([entry]) => {
            if (entry.isIntersecting) {
              setActiveSection(sectionId);
            }
          },
          observerOptions
        );

        observer.observe(element);
        observers.push(observer);
      }
    });

    return () => {
      observers.forEach((observer) => observer.disconnect());
    };
  }, [sectionIds, options]);

  return activeSection;
};

const AnimatedGrid = () => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    let animationFrameId;

    const resizeCanvas = () => {
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
    };

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    const gridSize = 40;
    const lines = [];

    class Line {
      constructor() {
        this.reset();
      }

      reset() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.length = 0;
        this.direction = Math.floor(Math.random() * 4);
        this.life = 100;
      }

      update() {
        switch (this.direction) {
          case 0: this.y -= 2; break; // Up
          case 1: this.x += 2; break; // Right
          case 2: this.y += 2; break; // Down
          case 3: this.x -= 2; break; // Left
        }
        this.length += 2;
        this.life--;

        if (this.x < 0 || this.x > canvas.width || this.y < 0 || this.y > canvas.height || this.life <= 0) {
          this.reset();
        }
      }

      draw() {
        ctx.strokeStyle = `rgba(0, 191, 255, ${this.life / 100})`;
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(this.x, this.y);
        switch (this.direction) {
          case 0: ctx.lineTo(this.x, this.y + this.length); break;
          case 1: ctx.lineTo(this.x - this.length, this.y); break;
          case 2: ctx.lineTo(this.x, this.y - this.length); break;
          case 3: ctx.lineTo(this.x + this.length, this.y); break;
        }
        ctx.stroke();
      }
    }

    for (let i = 0; i < 5; i++) {
      lines.push(new Line());
    }

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Draw grid
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.1)';
      ctx.lineWidth = 1;
      for (let x = 0; x < canvas.width; x += gridSize) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, canvas.height);
        ctx.stroke();
      }
      for (let y = 0; y < canvas.height; y += gridSize) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(canvas.width, y);
        ctx.stroke();
      }

      // Update and draw lines
      lines.forEach(line => {
        line.update();
        line.draw();
      });

      animationFrameId = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener('resize', resizeCanvas);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" />;
};

const HeroSection = () => (
  <section className="flex items-stretch h-screen relative">
    <div className="w-1/2 bg-[#F5F5F0] relative overflow-hidden">
      <AnimatedGrid />
      <div className="relative z-10 h-full flex flex-col justify-center p-12">
        <h1 className={`text-7xl font-bold mb-6 ${chakraPetch.className} gradient-text`}>
          Gestalt
        </h1>

        <h2 className={`text-3xl font-light mb-4 ${spaceGrotesk.className} text-[#4F4F4F]`}>
          Federal Code Intelligence Platform
        </h2>
        <p className="text-lg font-light leading-relaxed mb-8 text-[#4F4F4F]">
          Empowering federal agencies with AI-driven collaboration, SHARE IT Act compliance, and secure cross-government code sharing. Ready for the June 2025 mandate.
        </p>
        <div className="flex space-x-4">
          <a 
            href="#demo"
            className="bg-gray-800 text-white px-6 py-2 text-sm transition-colors hover:bg-black"
          >
            Request Demo
          </a>
          <a 
            href="#features"
            className="border border-gray-800 text-gray-800 px-6 py-2 text-sm transition-colors hover:bg-black hover:text-white"
          >
            Explore Features
          </a>
        </div>
      </div>
    </div>
    <div className="w-1/2 bg-black flex items-center justify-center">
      <GestaltTerminalDemo />
    </div>
  </section>
);

const GestaltTerminalDemo = () => {
  const [output, setOutput] = useState('');
  const [activeCommand, setActiveCommand] = useState('share-it-compliance');
  const [isTyping, setIsTyping] = useState(true);

  const commands = {
    compare: {
      title: "Compare",
      command: "gestalt compare DHS/secure-auth-library NASA/auth-module",
      output: `Comparing codebases...

Similarity: 78%
Key differences:
- DHS version includes biometric authentication
- NASA version has enhanced encryption for space communications

Shared components:
- Core authentication flow
- Token management system
- Password hashing algorithms

Recommendation:
Consider merging the biometric features from DHS with NASA's enhanced encryption to create a more robust, unified authentication system.`
    },
    "trace-dep": {
      title: "Trace Deps",
      command: "gestalt trace-dep DHS/secure-auth-library",
      output: `Tracing dependencies...

Direct dependencies:
1. NIST/cryptography-standards (v3.2.1)
2. GSA/identity-management-core (v1.5.0)
3. DOD/secure-token-service (v2.0.3)

Indirect dependencies:
1. NSA/encryption-toolkit (v4.1.2)
2. CISA/threat-detection-module (v2.3.0)

Used by:
- USGS/geospatial-auth (v2.1.0)
- DOE/energy-portal-login (v1.3.2)
- FBI/access-control-system (v1.0.1)

Recommendation:
Update NIST/cryptography-standards to v3.3.0 to patch known vulnerabilities.`
    },
    "share-it-compliance": {
      title: "SHARE IT",
      command: "gestalt share-it-compliance DOD/tactical-comms",
      output: `Analyzing SHARE IT Act compliance...

✅ Contract awarded after June 21, 2025: YES
✅ Custom-developed with government funds: YES  
✅ Unlimited rights determination: CONFIRMED

Compliance Status: 100% READY

Repository Classification:
- Source code type: Custom military communications
- Security level: CONTROLLED UNCLASSIFIED
- Recommended repository: PRIVATE (authorized users only)
- Rationale: Contains operational security considerations

SHARE IT Act Requirements Met:
✅ Source code stored in accessible repository
✅ Metadata tags for discoverability  
✅ Government unlimited rights documented
✅ Inter-agency sharing enabled

Next Actions:
1. Code automatically indexed for agency discovery
2. Access controls configured for authorized personnel
3. FOIA exemption status: PROTECTED (national security)

Ready for cross-government collaboration while maintaining security protocols.`
    },
    generate: {
      title: "Generate",
      command: 'gestalt generate "Python function for secure JWT creation"',
      output: `Generating code...

import jwt
from datetime import datetime, timedelta
from cryptography.hazmat.primitives import serialization
from cryptography.hazmat.primitives.asymmetric import rsa

def generate_key_pair():
    private_key = rsa.generate_private_key(
        public_exponent=65537,
        key_size=2048
    )
    public_key = private_key.public_key()
    return private_key, public_key

def create_secure_jwt(payload, private_key, expiration_minutes=30):
    expiration_time = datetime.utcnow() + timedelta(minutes=expiration_minutes)
    payload['exp'] = expiration_time
    token = jwt.encode(payload, private_key, algorithm='RS256')
    return token

# Usage
private_key, public_key = generate_key_pair()
payload = {"user_id": 123, "role": "admin"}
token = create_secure_jwt(payload, private_key)`
    }
  };

  useEffect(() => {
    const typeEffect = async () => {
      setIsTyping(true);
      const command = commands[activeCommand];
      let commandOutput = '> ';
      for (let char of command.command) {
        commandOutput += char;
        setOutput(commandOutput);
        await new Promise(resolve => setTimeout(resolve, 20));
      }
      setOutput(prev => prev + '\n\n');
      
      setOutput(prev => prev + "Processing...\n");
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      for (let line of command.output.split('\n')) {
        setOutput(prev => prev + line + '\n');
        await new Promise(resolve => setTimeout(resolve, 30));
      }
      
      setIsTyping(false);
    };
    typeEffect();
  }, [activeCommand]);

  return (
    <div className="bg-black font-mono h-full flex flex-col">
      <div className="flex border-b border-[#F5F5F0]">
        {Object.entries(commands).map(([key, command]) => (
          <button
            key={key}
            onClick={() => !isTyping && setActiveCommand(key)}
            className={`px-4 py-2 text-sm ${
              activeCommand === key ? 'bg-[#F5F5F0] text-black' : 'bg-black text-[#F5F5F0]'
            } hover:bg-[#F5F5F0] hover:text-black transition-colors`}
          >
            {command.title}
          </button>
        ))}
      </div>
      <div className="flex-grow overflow-auto p-4">
        <pre className="text-[#F5F5F0] text-sm whitespace-pre-wrap">{output}</pre>
      </div>
    </div>
  );
};

const FeaturedAgencies = () => (
  <section className="py-20 bg-[#F5F5F0] border-t border-black">
    <div className="container mx-auto px-4">
      <h2 className={`text-3xl font-light text-center text-black mb-12 ${spaceGrotesk.className}`}>
        Trusted by Leading Federal Agencies
      </h2>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-8 items-center">
        {agencies.map((agency) => (
          <div key={agency.name} className="flex flex-col items-center">
            <div className="w-24 h-24 relative mb-4">
              <Image 
                src={agency.logo} 
                alt={agency.name} 
                layout="fill" 
                objectFit="contain"
                className="filter grayscale hover:grayscale-0 transition-all duration-300"
              />
            </div>
            <span className="text-sm text-gray-600">{agency.name}</span>
          </div>
        ))}
      </div>
    </div>
  </section>
);

const agencies = [
  { name: "Department of Health and Human Services", logo: "/hhs.svg" },
  { name: "Department of Homeland Security", logo: "/dhs.svg" },
  { name: "Department of Defense", logo: "/dod.svg" },
  { name: "Department of Energy", logo: "/doe.svg" },
  { name: "NASA", logo: "/nasa.svg" },
];

const FeatureItem = ({ title, description, icon: Icon }) => (
  <motion.div
    className="mb-6"
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5 }}
  >
    <div className="flex items-center mb-2">
      <Icon size={20} className="text-[#4ECDC4] mr-3" />
      <h3 className="text-lg font-semibold text-[#F5F5F0]">{title}</h3>
    </div>
    <p className="text-sm text-[#A0A0A0] ml-8">{description}</p>
  </motion.div>
);

const PlatformFeatures = () => {
  const features = [
    { title: "SHARE IT Act Ready", description: "Fully compliant with the December 2024 SHARE IT Act mandate. Automated repository management for June 2025 deadline.", icon: Shield },
    { title: "Cross-Government Code Sharing", description: "Seamless source code sharing across federal agencies through public and private repositories as mandated by law.", icon: Network },
    { title: "AI-Powered Code Intelligence", description: "Understand, catalog, and optimize government-developed source code with advanced AI analysis and unlimited rights tracking.", icon: Brain },
    { title: "Federal Compliance Dashboard", description: "Real-time tracking of SHARE IT Act compliance, unlimited rights determination, and repository classification.", icon: BarChart2 },
    { title: "Automated Repository Management", description: "Smart classification between public and private repositories based on security requirements and agency guidance.", icon: Database },
    { title: "Government Rights Analytics", description: "Track unlimited rights in custom-developed software and ensure proper code sharing across agencies.", icon: Zap },
  ];

  return (
    <section id="features" className="py-20 bg-black relative">
      <div className="max-w-7xl mx-auto px-6">
        <motion.h2
          className="text-3xl font-light mb-8 text-[#F5F5F0] flex items-center"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <SevenSegmentDigit value={0} />
          <SevenSegmentDigit value={1} />
          Platform Capabilities
        </motion.h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-12">
          {features.map((feature, index) => (
            <FeatureItem key={index} {...feature} />
          ))}
        </div>
      </div>
    </section>
  );
};

const IntegratedUseCasesProjects = () => {
  const repositories = [
    {
      agency: 'Department of Homeland Security',
      logo: '/dhs.svg',
      repoName: 'cyber.dhs.gov',
      description: 'An open-source site for cybersecurity directives, enhancing transparency in federal cybersecurity guidance.',
      tags: ['github', 'us-federal-government', 'jekyll'],
      url: 'https://github.com/cisagov/cyber.dhs.gov'
    },
    {
      agency: 'Department of Veterans Affairs',
      logo: '/va.svg',
      repoName: 'vets-website',
      description: 'A collaborative development environment for the VA\'s website, focusing on veteran services and resources.',
      tags: ['javascript', 'html', 'css'],
      url: 'https://github.com/department-of-veterans-affairs/vets-website'
    },
    {
      agency: 'Department of Defense',
      logo: '/dod.svg',
      repoName: 'GameChanger',
      description: 'A platform for evidence-based, data-driven decision-making across the Department of Defense.',
      tags: ['policy', 'defense', 'policy-as-code'],
      url: 'https://github.com/dod-advana/gamechanger'
    }
  ];

  return (
    <section id="projects" className="py-20 bg-black relative">
      <div className="max-w-7xl mx-auto px-6">
        <motion.h2
          className="text-3xl font-light mb-8 text-[#F5F5F0] flex items-center"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <SevenSegmentDigit value={0} />
          <SevenSegmentDigit value={2} />
          Featured Federal Projects
        </motion.h2>
        <motion.p
          className="text-[#A0A0A0] mb-12 max-w-3xl"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          Explore federal projects already leveraging Gestalt for SHARE IT Act compliance and cross-government collaboration.
        </motion.p>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-12">
          {repositories.map((repo, index) => (
            <RepositoryCard key={index} {...repo} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
};

const RepositoryCard = ({ agency, logo, repoName, description, tags, url, index }) => (
  <motion.div
    className="border border-gray-800 p-6 group relative overflow-hidden"
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5, delay: index * 0.1 }}
  >
    <div className="flex items-center mb-4">
      <Image src={logo} alt={agency} width={40} height={40} className="w-10 h-10 mr-3"/>
      <div>
        <h3 className="text-lg font-semibold text-[#F5F5F0]">{agency}</h3>
        <p className="text-sm text-[#4ECDC4]">{repoName}</p>
      </div>
    </div>
    <p className="text-sm text-[#A0A0A0] mb-4">{description}</p>
    <div className="flex flex-wrap gap-2 mb-4">
      {tags.map((tag, index) => (
        <span key={index} className="text-xs bg-gray-800 text-[#F5F5F0] px-2 py-1">{tag}</span>
      ))}
    </div>
    <Link href={url} className="text-sm text-[#4ECDC4] hover:underline inline-flex items-center" target="_blank">
      View Repository
      <span className="ml-1 transition-transform duration-300 ease-in-out group-hover:translate-x-1">→</span>
    </Link>
  </motion.div>
);

const SecurityComplianceSection = () => {
  const features = [
    {
      icon: Shield,
      title: "End-to-End Encryption",
      description: "All data in transit and at rest is protected using state-of-the-art encryption protocols, ensuring the confidentiality of sensitive government information."
    },
    {
      icon: Lock,
      title: "Multi-Factor Authentication",
      description: "Robust MFA implementation compliant with NIST 800-63 guidelines, providing an additional layer of security for user accounts."
    },
    {
      icon: FileCheck,
      title: "FISMA Compliance",
      description: "Fully compliant with the Federal Information Security Management Act, ensuring adherence to federal cybersecurity standards."
    },
    {
      icon: Server,
      title: "FedRAMP Authorization",
      description: "In process for FedRAMP authorization, demonstrating our commitment to meeting the highest cloud security standards for federal agencies."
    }
  ];

  return (
    <section id="security-compliance" className="py-20 bg-black relative">
      <div className="max-w-7xl mx-auto px-6">
        <motion.h2
          className="text-3xl font-light mb-8 text-[#F5F5F0] flex items-center"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <SevenSegmentDigit value={0} />
          <SevenSegmentDigit value={3} />
          Security & Compliance
        </motion.h2>
        <motion.p
          className="text-[#A0A0A0] mb-12 max-w-3xl"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          Gestalt prioritizes the security and compliance needs of federal agencies, implementing robust measures to protect sensitive data and adhere to stringent government standards.
        </motion.p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {features.map((feature, index) => (
            <SecurityFeatureCard key={index} feature={feature} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
};

const SecurityFeatureCard = ({ feature, index }) => {
  const { icon: Icon, title, description } = feature;
  
  return (
    <motion.div
      className="border border-gray-800 p-6 rounded-lg"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
    >
      <div className="flex items-center mb-4">
        <Icon className="w-6 h-6 text-[#4ECDC4] mr-3" />
        <h3 className="text-lg font-semibold text-[#F5F5F0]">{title}</h3>
      </div>
      <p className="text-sm text-[#A0A0A0]">{description}</p>
    </motion.div>
  );
};

const CallToAction = () => (
  <section id="demo" className="py-20 bg-black border-t border-gray-800">
    <div className="container mx-auto px-4 text-center">
      <h2 className={`text-3xl font-light text-[#F5F5F0] mb-8 ${spaceGrotesk.className}`}>
        Ready for the Future of Federal Software Development?
      </h2>
      <div className="inline-flex items-center bg-[#1A1A1A] border border-gray-800 p-2 mb-8">
        <span className="font-mono text-[#F5F5F0] mr-2">$</span>
        <span className="font-mono text-[#F5F5F0]">gestalt --schedule-demo</span>
      </div>
      <div>
        <Link 
          href="#contact"
          className="bg-gray-800 text-white px-8 py-3 text-sm font-bold hover:bg-black transition-colors inline-flex items-center"
        >
          <Terminal className="w-4 h-4 mr-2" />
          Schedule Demo
        </Link>
      </div>
    </div>
  </section>
);

const Footer = () => {
  return (
    <footer className={`bg-black text-[#A0A0A0] border-t border-gray-800 ${inter.className}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          <div className="col-span-2 md:col-span-1">
            <Link href="/" className="flex items-center space-x-2 mb-4">
              <span className={`text-xl font-light tracking-wider ${spaceGrotesk.className} text-[#F5F5F0]`}>gestalt</span>
            </Link>
            <p className="text-sm text-[#A0A0A0] mb-4">
              Elevating federal software development through AI-driven collaboration.
            </p>
          </div>
          <div>
            <h3 className={`text-sm font-semibold mb-4 ${spaceGrotesk.className} text-[#F5F5F0]`}>Platform</h3>
            <ul className="space-y-2">
              <li><Link href="/code-explorer" className="text-sm text-[#A0A0A0] hover:text-[#F5F5F0] transition-colors flex items-center"><Terminal className="w-4 h-4 mr-2" /> Code Explorer</Link></li>
              <li><Link href="/analytics" className="text-sm text-[#A0A0A0] hover:text-[#F5F5F0] transition-colors flex items-center"><BarChart2 className="w-4 h-4 mr-2" /> Analytics Dashboard</Link></li>
              <li><Link href="/ai-assistance" className="text-sm text-[#A0A0A0] hover:text-[#F5F5F0] transition-colors flex items-center"><Brain className="w-4 h-4 mr-2" /> AI Assistance</Link></li>
            </ul>
          </div>
          <div>
            <h3 className={`text-sm font-semibold mb-4 ${spaceGrotesk.className} text-[#F5F5F0]`}>Resources</h3>
            <ul className="space-y-2">
              <li><Link href="/federal-agencies" className="text-sm text-[#A0A0A0] hover:text-[#F5F5F0] transition-colors flex items-center"><Users className="w-4 h-4 mr-2" /> Federal Agencies</Link></li>
              <li><Link href="/case-studies" className="text-sm text-[#A0A0A0] hover:text-[#F5F5F0] transition-colors flex items-center"><FileText className="w-4 h-4 mr-2" /> Case Studies</Link></li>
              <li><Link href="/documentation" className="text-sm text-[#A0A0A0] hover:text-[#F5F5F0] transition-colors flex items-center"><BookOpen className="w-4 h-4 mr-2" /> Documentation</Link></li>
            </ul>
          </div>
          <div>
            <h3 className={`text-sm font-semibold mb-4 ${spaceGrotesk.className} text-[#F5F5F0]`}>Connect</h3>
            <ul className="space-y-2">
              <li><Link href="/about" className="text-sm text-[#A0A0A0] hover:text-[#F5F5F0] transition-colors flex items-center"><Info className="w-4 h-4 mr-2" /> About Us</Link></li>
              <li><Link href="/contact" className="text-sm text-[#A0A0A0] hover:text-[#F5F5F0] transition-colors flex items-center"><MessageSquare className="w-4 h-4 mr-2" /> Contact</Link></li>
              <li>
                <div className="flex space-x-4 mt-2">
                  <a href="#" className="text-[#A0A0A0] hover:text-[#F5F5F0] transition-colors">
                    <Github className="w-5 h-5" />
                  </a>
                  <a href="#" className="text-[#A0A0A0] hover:text-[#F5F5F0] transition-colors">
                    <Linkedin className="w-5 h-5" />
                  </a>
                  <a href="#" className="text-[#A0A0A0] hover:text-[#F5F5F0] transition-colors">
                    <Twitter className="w-5 h-5" />
                  </a>
                </div>
              </li>
            </ul>
          </div>
        </div>
        <div className="mt-12 pt-8 border-t border-gray-800 flex flex-col md:flex-row justify-between items-center">
          <p className="text-xs text-[#A0A0A0]">&copy; 2024 Gestalt. All rights reserved.</p>
          <div className="flex space-x-4 mt-4 md:mt-0">
            <Link href="/privacy" className="text-xs text-[#A0A0A0] hover:text-[#F5F5F0] transition-colors">Privacy Policy</Link>
            <Link href="/terms" className="text-xs text-[#A0A0A0] hover:text-[#F5F5F0] transition-colors">Terms of Service</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default function Home() {
  return (
    <div className={`min-h-screen bg-black text-[#F5F5F0] ${inter.className}`}>
      <style jsx global>{`
        .gradient-text {
          background: linear-gradient(135deg, #4ECDC4 0%, #44A08D 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }
      `}</style>
      <main>
        <HeroSection />
        <FeaturedAgencies />
        <PlatformFeatures />
        <IntegratedUseCasesProjects />
        <SecurityComplianceSection />
        <CallToAction />
        <Footer />
      </main>
    </div>
  );
}
