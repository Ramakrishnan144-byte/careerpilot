import './globals.css';
import type { Metadata } from 'next';
import { DemoSwitcher } from '@/components/layout/DemoSwitcher';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';

export const metadata: Metadata = {
  title: 'CareerPilot — AI-Powered Student Career & Placement Intelligence Platform',
  description:
    'Comprehensive career readiness, deterministic eligibility verification, opportunity priority scoring, AI mock interviews, and university placement analytics platform.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="min-h-screen flex flex-col bg-slate-50 text-slate-900 antialiased selection:bg-sky-500 selection:text-white">
        <DemoSwitcher />
        <Navbar />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
