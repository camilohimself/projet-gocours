import Link from 'next/link';
import { Icons } from '@/src/lib/icons';
import GoCoursLogo from '@/src/components/icons/GoCoursLogo';

export default function Footer() {
  const navigation = {
    main: [
      { name: 'About', href: '/about' },
      { name: 'How it Works', href: '/#how-it-works' },
      { name: 'Find Tutors', href: '/tutors' },
      { name: 'AI Recommendations', href: '/ai-recommender' },
    ],
    support: [
      { name: 'Help Center', href: '/help' },
      { name: 'Contact Us', href: '/contact' },
      { name: 'FAQ', href: '/#faq' },
      { name: 'Safety', href: '/safety' },
    ],
    company: [
      { name: 'Privacy Policy', href: '/privacy' },
      { name: 'Terms of Service', href: '/terms' },
      { name: 'Cookie Policy', href: '/cookies' },
      { name: 'Careers', href: '/careers' },
    ],
    social: [
      { name: 'Facebook', href: '#', icon: Icons.star },
      { name: 'Twitter', href: '#', icon: Icons.star },
      { name: 'LinkedIn', href: '#', icon: Icons.star },
      { name: 'Instagram', href: '#', icon: Icons.star },
    ],
  };

  return (
    <footer className="bg-secondary/30 border-t">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
          {/* Logo and Description */}
          <div className="lg:col-span-2">
            <Link href="/" className="flex items-center space-x-2 mb-4">
              <GoCoursLogo className="h-8 w-auto" />
              <span className="font-headline text-xl font-bold">
                GoCours
              </span>
            </Link>
            <p className="text-sm text-muted-foreground mb-4">
              Find expert tutors in any subject with GoCours. AI-powered recommendations 
              and advanced search make learning simpler and more effective.
            </p>
            <div className="flex space-x-4">
              {navigation.social.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className="text-muted-foreground hover:text-primary transition-colors"
                >
                  <span className="sr-only">{item.name}</span>
                  <item.icon className="h-5 w-5" />
                </Link>
              ))}
            </div>
          </div>

          {/* Navigation Links */}
          <div>
            <h3 className="font-semibold text-sm mb-4">Platform</h3>
            <ul className="space-y-2">
              {navigation.main.map((item) => (
                <li key={item.name}>
                  <Link
                    href={item.href}
                    className="text-sm text-muted-foreground hover:text-primary transition-colors"
                  >
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="font-semibold text-sm mb-4">Support</h3>
            <ul className="space-y-2">
              {navigation.support.map((item) => (
                <li key={item.name}>
                  <Link
                    href={item.href}
                    className="text-sm text-muted-foreground hover:text-primary transition-colors"
                  >
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="font-semibold text-sm mb-4">Company</h3>
            <ul className="space-y-2">
              {navigation.company.map((item) => (
                <li key={item.name}>
                  <Link
                    href={item.href}
                    className="text-sm text-muted-foreground hover:text-primary transition-colors"
                  >
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Newsletter Signup */}
        <div className="mt-12 pt-8 border-t">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            <div>
              <h3 className="font-headline text-lg font-semibold mb-2">
                Stay updated
              </h3>
              <p className="text-sm text-muted-foreground">
                Get the latest news about new features, tutors, and learning tips.
              </p>
            </div>
            <div className="flex space-x-2">
              <div className="flex-1 min-w-0">
                <label htmlFor="email" className="sr-only">
                  Email address
                </label>
                <input
                  id="email"
                  type="email"
                  placeholder="Enter your email"
                  className="w-full px-3 py-2 border border-input bg-background rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                />
              </div>
              <button
                type="submit"
                className="px-4 py-2 bg-primary text-primary-foreground rounded-md text-sm font-medium hover:bg-primary/90 transition-colors"
              >
                Subscribe
              </button>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-8 pt-8 border-t flex flex-col md:flex-row justify-between items-center">
          <p className="text-xs text-muted-foreground">
            © {new Date().getFullYear()} GoCours. All rights reserved.
          </p>
          <div className="mt-4 md:mt-0 flex space-x-6">
            <span className="text-xs text-muted-foreground flex items-center">
              <Icons.globe className="h-3 w-3 mr-1" />
              Available in: English, Français, Deutsch
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}