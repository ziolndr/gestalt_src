import Link from 'next/link';
import { FaGithub, FaLinkedin, FaTwitter } from 'react-icons/fa';
import { Space_Grotesk, Inter } from 'next/font/google';

const spaceGrotesk = Space_Grotesk({ subsets: ['latin'] });
const inter = Inter({ subsets: ['latin'] });


const Footer = () => {
  return (
    <footer className={`bg-black text-gray-300 border-t border-gray-800 ${inter.className}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          <div className="col-span-2 md:col-span-1">
            <Link href="/" className="flex items-center space-x-2 mb-4">
              <span className={`text-xl font-light tracking-wider ${spaceGrotesk.className} text-white`}>gestalt</span>
            </Link>
            <p className="text-sm text-gray-400 mb-4">
              Revolutionizing federal software development through AI-driven collaboration.
            </p>
          </div>
          <div>
            <h3 className={`text-sm font-semibold mb-4 ${spaceGrotesk.className} text-white`}>Platform</h3>
            <ul className="space-y-2">
              <li><Link href="/code-explorer" className="text-sm text-gray-400 hover:text-green-500 transition-colors">Code Explorer</Link></li>
              <li><Link href="/analytics" className="text-sm text-gray-400 hover:text-green-500 transition-colors">Analytics Dashboard</Link></li>
              <li><Link href="/ai-assistance" className="text-sm text-gray-400 hover:text-green-500 transition-colors">AI Assistance</Link></li>
            </ul>
          </div>
          <div>
            <h3 className={`text-sm font-semibold mb-4 ${spaceGrotesk.className} text-white`}>Resources</h3>
            <ul className="space-y-2">
              <li><Link href="/federal-agencies" className="text-sm text-gray-400 hover:text-green-500 transition-colors">Federal Agencies</Link></li>
              <li><Link href="/case-studies" className="text-sm text-gray-400 hover:text-green-500 transition-colors">Case Studies</Link></li>
              <li><Link href="/documentation" className="text-sm text-gray-400 hover:text-green-500 transition-colors">Documentation</Link></li>
            </ul>
          </div>
          <div>
            <h3 className={`text-sm font-semibold mb-4 ${spaceGrotesk.className} text-white`}>Connect</h3>
            <ul className="space-y-2">
              <li><Link href="/about" className="text-sm text-gray-400 hover:text-green-500 transition-colors">About Us</Link></li>
              <li><Link href="/contact" className="text-sm text-gray-400 hover:text-green-500 transition-colors">Contact</Link></li>
              <li>
                <div className="flex space-x-4 mt-2">
                  <a href="#" className="text-gray-400 hover:text-green-500 transition-colors">
                    <FaGithub className="w-5 h-5" />
                  </a>
                  <a href="#" className="text-gray-400 hover:text-green-500 transition-colors">
                    <FaLinkedin className="w-5 h-5" />
                  </a>
                  <a href="#" className="text-gray-400 hover:text-green-500 transition-colors">
                    <FaTwitter className="w-5 h-5" />
                  </a>
                </div>
              </li>
            </ul>
          </div>
        </div>
        <div className="mt-12 pt-8 border-t border-gray-800 flex flex-col md:flex-row justify-between items-center">
          <p className="text-xs text-gray-500">&copy; 2024 Gestalt. All rights reserved.</p>
          <div className="flex space-x-4 mt-4 md:mt-0">
            <Link href="/privacy" className="text-xs text-gray-500 hover:text-green-500 transition-colors">Privacy Policy</Link>
            <Link href="/terms" className="text-xs text-gray-500 hover:text-green-500 transition-colors">Terms of Service</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;