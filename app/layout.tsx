import './globals.css';
import { ClerkProvider, SignedIn } from '@clerk/nextjs';
import InitializeUserProfile from './components/InitializeUserProfile';
import Header from '@/src/components/layout/Header';
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
  title: 'GoCours - Find Expert Tutors',
  description: 'Find expert tutors in any subject with GoCours. AI-powered recommendations and advanced search make learning simpler and more effective.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <ClerkProvider>
      <html lang="en" className={`${poppins.variable} ${ptSans.variable}`}>
        <body className="min-h-screen bg-background font-body antialiased">
          <SignedIn>
            <InitializeUserProfile />
          </SignedIn>
          
          <div className="relative flex min-h-screen flex-col">
            <Header />
            <main className="flex-1">
              {children}
            </main>
            <Footer />
          </div>
          
          <Toaster />
        </body>
      </html>
    </ClerkProvider>
  );
}