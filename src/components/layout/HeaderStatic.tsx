'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Button } from '../ui/button';
import { Icons } from '../../lib/icons';
import GoCoursLogo from '../icons/GoCoursLogo';

export default function HeaderStatic() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navigation = [
    { name: 'Interactive Demo', href: '/demo-static' },
    { name: 'How it Works', href: '/#how-it-works' },
    { name: 'Features', href: '/demo-static' },
  ];

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        {/* Logo */}
        <Link href="/" className="flex items-center space-x-2">
          <GoCoursLogo className="h-8 w-auto" />
          <span className="hidden font-headline text-xl font-bold sm:inline-block">
            GoCours
          </span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-6">
          {navigation.map((item) => (
            <Link
              key={item.name}
              href={item.href}
              className="text-sm font-medium transition-colors hover:text-primary"
            >
              {item.name}
            </Link>
          ))}
        </nav>

        {/* Right side - Demo Actions */}
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <Button variant="ghost" asChild>
              <Link href="/demo-static">Try Demo</Link>
            </Button>
            <Button asChild>
              <Link href="/demo-static">Explore Tutors</Link>
            </Button>
            <div className="hidden sm:flex items-center px-3 py-1 bg-accent/10 text-accent text-xs rounded-full">
              <span className="w-2 h-2 bg-accent rounded-full mr-2 animate-pulse"></span>
              DEMO MODE
            </div>
          </div>

          {/* Mobile menu button */}
          <Button
            variant="ghost"
            size="sm"
            className="md:hidden"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? (
              <Icons.x className="h-5 w-5" />
            ) : (
              <Icons.menu className="h-5 w-5" />
            )}
          </Button>
        </div>
      </div>

      {/* Mobile Navigation */}
      {isMobileMenuOpen && (
        <div className="md:hidden border-t bg-background/95 backdrop-blur">
          <div className="container mx-auto px-4 py-4 space-y-4">
            {/* Main Navigation */}
            <nav className="space-y-2">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className="block py-2 text-sm font-medium transition-colors hover:text-primary"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {item.name}
                </Link>
              ))}
            </nav>

            {/* Demo Actions - Mobile */}
            <div className="flex flex-col space-y-2 border-t pt-4">
              <Button variant="ghost" asChild onClick={() => setIsMobileMenuOpen(false)}>
                <Link href="/demo-static">Try Demo</Link>
              </Button>
              <Button asChild onClick={() => setIsMobileMenuOpen(false)}>
                <Link href="/demo-static">Explore Tutors</Link>
              </Button>
              <div className="flex items-center justify-center px-3 py-2 bg-accent/10 text-accent text-sm rounded-full">
                <span className="w-2 h-2 bg-accent rounded-full mr-2 animate-pulse"></span>
                DEMO MODE - Client Presentation
              </div>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}