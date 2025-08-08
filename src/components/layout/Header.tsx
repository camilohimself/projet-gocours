'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useAuth, UserButton } from '@clerk/nextjs';
import { Button } from '@/src/components/ui/button';
import { Icons } from '@/src/lib/icons';
import GoCoursLogo from '@/src/components/icons/GoCoursLogo';

export default function Header() {
  const { isLoaded, userId } = useAuth();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navigation = [
    { name: 'Find Tutors', href: '/tutors' },
    { name: 'AI Recommendations', href: '/ai-recommender' },
    { name: 'How it Works', href: '/#how-it-works' },
  ];

  const userNavigation = [
    { name: 'Dashboard', href: '/dashboard', icon: Icons.user },
    { name: 'My Bookings', href: '/bookings', icon: Icons.calendar },
    { name: 'Favorites', href: '/favorites', icon: Icons.heart },
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

        {/* Right side - Auth */}
        <div className="flex items-center space-x-4">
          {isLoaded ? (
            userId ? (
              <>
                {/* User Navigation - Desktop */}
                <nav className="hidden md:flex items-center space-x-2">
                  {userNavigation.map((item) => (
                    <Button
                      key={item.name}
                      variant="ghost"
                      size="sm"
                      asChild
                    >
                      <Link href={item.href} className="flex items-center space-x-1">
                        <item.icon className="h-4 w-4" />
                        <span>{item.name}</span>
                      </Link>
                    </Button>
                  ))}
                </nav>
                
                {/* User Button */}
                <UserButton 
                  afterSignOutUrl="/"
                  appearance={{
                    elements: {
                      avatarBox: "h-8 w-8"
                    }
                  }}
                />
              </>
            ) : (
              <div className="flex items-center space-x-2">
                <Button variant="ghost" asChild>
                  <Link href="/signin">Sign In</Link>
                </Button>
                <Button asChild>
                  <Link href="/signup">Sign Up</Link>
                </Button>
              </div>
            )
          ) : (
            <div className="flex space-x-2">
              <div className="h-8 w-16 animate-pulse bg-muted rounded" />
              <div className="h-8 w-16 animate-pulse bg-muted rounded" />
            </div>
          )}

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

            {/* User Navigation - Mobile */}
            {userId && (
              <div className="border-t pt-4">
                <nav className="space-y-2">
                  {userNavigation.map((item) => (
                    <Link
                      key={item.name}
                      href={item.href}
                      className="flex items-center space-x-2 py-2 text-sm font-medium transition-colors hover:text-primary"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      <item.icon className="h-4 w-4" />
                      <span>{item.name}</span>
                    </Link>
                  ))}
                </nav>
              </div>
            )}

            {/* Auth Buttons - Mobile */}
            {!userId && (
              <div className="flex flex-col space-y-2 border-t pt-4">
                <Button variant="ghost" asChild onClick={() => setIsMobileMenuOpen(false)}>
                  <Link href="/signin">Sign In</Link>
                </Button>
                <Button asChild onClick={() => setIsMobileMenuOpen(false)}>
                  <Link href="/signup">Sign Up</Link>
                </Button>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
}