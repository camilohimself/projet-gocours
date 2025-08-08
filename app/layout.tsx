import './globals.css';
import HeaderStatic from '@/src/components/layout/HeaderStatic';
import Footer from '@/src/components/layout/Footer';
import { Toaster } from '@/src/components/ui/toaster';
import { Poppins, PT_Sans } from 'next/font/google';

const poppins = Poppins({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-poppins',
  weight: ['300', '400', '500', '600', '700', '800', '900'],
});

const ptSans = PT_Sans({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-pt-sans', 
  weight: ['400', '700'],
});

export const metadata = {
  title: 'GoCours - Demo Presentation',
  description: 'Professional tutoring platform demo with advanced search, AI recommendations, and modern UI/UX. Built with Next.js, TypeScript, and Tailwind CSS.',
};

export default function RootLayoutStatic({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${poppins.variable} ${ptSans.variable}`}>
      <body className="min-h-screen bg-background font-body antialiased">
        {/* Demo Banner */}
        <div className="bg-gradient-to-r from-accent/20 to-primary/20 border-b border-accent/30">
          <div className="container mx-auto px-4 py-2">
            <div className="flex items-center justify-center text-sm">
              <div className="flex items-center space-x-2">
                <span className="w-2 h-2 bg-accent rounded-full animate-pulse"></span>
                <span className="font-medium text-accent">LIVE DEMO</span>
                <span className="text-muted-foreground">|</span>
                <span className="text-muted-foreground">Client Presentation - All Features Functional</span>
              </div>
            </div>
          </div>
        </div>
        
        <div className="relative flex min-h-screen flex-col">
          <HeaderStatic />
          <main className="flex-1">
            {children}
          </main>
          <Footer />
        </div>
        
        <Toaster />
      </body>
    </html>
  );
}