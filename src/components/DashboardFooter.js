import Link from 'next/link';
import { Inter } from 'next/font/google';

const inter = Inter({ subsets: ['latin'] });

const DashboardFooter = () => {
  return (
    <footer className={`fixed right-10 bottom-0 bg-[#0a0a0a] text-[#e0e0e0] border-t border-[#222] py-4 ${inter.className}`}>
      <div className="flex items-center text-xs space-x-4">
        <p className="opacity-50 whitespace-nowrap">&copy; 2024 P3NT4. All rights reserved.</p>
        <Link href="/help" className="opacity-50 hover:opacity-70 transition-opacity">Help</Link>
        <Link href="/privacy" className="opacity-50 hover:opacity-70 transition-opacity">Privacy</Link>
        <Link href="/terms" className="opacity-50 hover:opacity-70 transition-opacity">Terms</Link>
      </div>
    </footer>
  );
};

export default DashboardFooter;