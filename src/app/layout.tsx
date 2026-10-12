import type { Metadata } from 'next';
import { DM_Sans, Newsreader } from 'next/font/google';
import { Providers } from '@/components/providers';
import './globals.css';
const dm = DM_Sans({ subsets: ['latin'], variable: '--font-dm' });
const news = Newsreader({ subsets: ['latin'], variable: '--font-news' });
export const metadata: Metadata = { title: 'One Place | NSUT', description: 'Discussions, official notices, and your timetable — together.' };
export default function RootLayout({ children }: { children: React.ReactNode }) { return <html lang="en"><body className={`${dm.variable} ${news.variable}`}><Providers>{children}</Providers></body></html>; }
