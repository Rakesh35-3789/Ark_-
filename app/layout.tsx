import type { Metadata } from 'next';
import './globals.css';
import { AuthProvider } from '@/components/AuthProvider';
import { Header } from '@/components/Header';

export const metadata: Metadata = {
  title: 'ARK — India’s Innovation Network',
  description: 'Discover and publish startup stories, research, founders and opportunities.',
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en"><body><AuthProvider><Header />{children}<footer className="footer"><div className="shell"><b>ARK</b><span>Built for trustworthy innovation discovery.</span></div></footer></AuthProvider></body></html>;
}
