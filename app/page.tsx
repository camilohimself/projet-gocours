import Link from 'next/link';
import { Button } from '@/src/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/src/components/ui/card';
import { Input } from '@/src/components/ui/input';
import { Icons } from '@/src/lib/icons';
import GoCoursLogo from '@/src/components/icons/GoCoursLogo';
import Image from 'next/image';

const FeatureCard = ({ icon: Icon, title, description, link, linkText }: { icon: React.ElementType, title: string, description: string, link: string, linkText: string }) => (
  <Card className="shadow-lg hover:shadow-xl transition-shadow duration-300 flex flex-col items-center text-center p-6 rounded-xl bg-card h-full">
    <div className="mb-4 p-4 bg-primary/10 rounded-full text-primary">
      <Icon className="w-10 h-10" />
    </div>
    <CardHeader className="p-0 mb-2">
      <CardTitle className="font-headline text-xl">{title}</CardTitle>
    </CardHeader>
    <CardContent className="p-0 flex-grow">
      <p className="text-muted-foreground text-sm mb-4">{description}</p>
    </CardContent>
    <Button asChild variant="link" className="mt-auto text-primary">
      <Link href={link}>{linkText} <Icons.externalLink className="ml-2 h-4 w-4" /></Link>
    </Button>
  </Card>
);


export default function HomePage() {
  return (
    <div className="flex flex-col items-center">
      {/* Hero Section */}
      <section className="w-full py-20 md:py-32 bg-gradient-to-br from-primary/20 via-background to-accent/20 text-center relative overflow-hidden">
         <div className="absolute inset-0 opacity-10">
          {/* Decorative background elements */}
          <span className="absolute top-1/4 left-1/4 w-32 h-32 bg-primary rounded-full filter blur-2xl"></span>
          <span className="absolute bottom-1/4 right-1/4 w-32 h-32 bg-accent rounded-full filter blur-2xl"></span>
        </div>
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="max-w-3xl mx-auto">
            <GoCoursLogo className="h-16 md:h-20 mx-auto mb-6" />
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-headline font-extrabold tracking-tight mb-6 animate-slide-in-up" style={{ animationDelay: '0.1s' }}>
              Unlock Your <span className="text-primary">Learning Potential</span>
            </h1>
            <p className="text-lg md:text-xl text-foreground/80 mb-10 max-w-2xl mx-auto animate-slide-in-up" style={{ animationDelay: '0.2s' }}>
              Find expert tutors in any subject, or get personalized recommendations with our AI-powered tool. GoCours makes learning simpler and more effective.
            </p>
            <div className="flex flex-col sm:flex-row justify-center items-center gap-4 animate-slide-in-up" style={{ animationDelay: '0.3s' }}>
              <Button asChild size="lg" className="bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg transition-transform hover:scale-105 w-full sm:w-auto">
                <Link href="/demo">
                  <Icons.search className="mr-2 h-5 w-5" /> Try Demo
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg" className="border-accent text-accent hover:bg-accent/10 hover:text-accent shadow-lg transition-transform hover:scale-105 w-full sm:w-auto">
                <Link href="/dashboard">
                  <Icons.user className="mr-2 h-5 w-5" /> Dashboard
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="w-full py-16 md:py-24 bg-background">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-headline font-bold mb-3">Why Choose <span className="text-primary">GoCours</span>?</h2>
            <p className="text-md md:text-lg text-foreground/70 max-w-xl mx-auto">
              We provide the tools and connections you need to succeed academically and professionally.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <FeatureCard
              icon={Icons.search}
              title="Advanced Tutor Search"
              description="Easily find tutors by subject, location, availability, and price. Our intuitive filters help you pinpoint the perfect match."
              link="/tutors"
              linkText="Start Searching"
            />
            <FeatureCard
              icon={Icons.brain}
              title="AI-Powered Recommendations"
              description="Not sure where to start? Describe your needs, and our smart AI will suggest the most suitable tutors for you."
              link="/ai-recommender"
              linkText="Get Suggestions"
            />
            <FeatureCard
              icon={Icons.usersRound}
              title="Detailed Tutor Profiles"
              description="View comprehensive profiles with bios, experience, qualifications, student reviews, and availability."
              link="/tutors"
              linkText="Explore Profiles"
            />
            <FeatureCard
              icon={Icons.heart}
              title="Save Your Favorites"
              description="Keep track of tutors you're interested in by adding them to your favorites list for easy access later."
              link="/profile"
              linkText="Manage Favorites"
            />
            <FeatureCard
              icon={Icons.responsive}
              title="Responsive Design"
              description="Access GoCours on any device. Our platform is fully responsive for a seamless experience on desktop, tablet, and mobile."
              link="#"
              linkText="Learn More"
            />
             <FeatureCard
              icon={Icons.globe}
              title="Multilingual Platform"
              description="Available in English, French, and German, making learning accessible to a wider audience."
              link="#"
              linkText="Language Options"
            />
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="w-full py-16 md:py-24 bg-secondary/30">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-headline font-bold mb-3">How It Works</h2>
            <p className="text-md md:text-lg text-foreground/70 max-w-xl mx-auto">
              Getting started with GoCours is simple. Follow these easy steps:
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <div className="p-6">
              <div className="mb-4 inline-block p-4 bg-primary/10 rounded-full text-primary"><Icons.search className="w-10 h-10" /></div>
              <h3 className="text-xl font-headline font-semibold mb-2">1. Search or Describe</h3>
              <p className="text-sm text-foreground/70">Use our search filters or tell our AI what kind of tutor you need.</p>
            </div>
            <div className="p-6">
              <div className="mb-4 inline-block p-4 bg-primary/10 rounded-full text-primary"><Icons.users className="w-10 h-10" /></div>
              <h3 className="text-xl font-headline font-semibold mb-2">2. Review & Connect</h3>
              <p className="text-sm text-foreground/70">Browse tutor profiles, check reviews, and contact your chosen tutors.</p>
            </div>
            <div className="p-6">
              <div className="mb-4 inline-block p-4 bg-primary/10 rounded-full text-primary"><Icons.graduationCap className="w-10 h-10" /></div>
              <h3 className="text-xl font-headline font-semibold mb-2">3. Start Learning</h3>
              <p className="text-sm text-foreground/70">Schedule your sessions and begin your personalized learning journey!</p>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action Section */}
      <section className="w-full py-16 md:py-24 bg-background">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl sm:text-4xl font-headline font-bold mb-6 text-primary">Ready to Elevate Your Learning?</h2>
          <p className="text-lg text-foreground/80 mb-8 max-w-xl mx-auto">
            Join thousands of students and tutors on GoCours. Sign up today and take the next step in your educational journey.
          </p>
          <Button asChild size="lg" className="bg-accent hover:bg-accent/90 text-accent-foreground shadow-lg transition-transform hover:scale-105 px-10 py-6 text-lg">
            <Link href="/signup">Sign Up for Free</Link>
          </Button>
        </div>
      </section>
      
      {/* Testimonials (Placeholder) */}
      <section id="faq" className="w-full py-16 md:py-24 bg-secondary/30">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
                <h2 className="text-3xl sm:text-4xl font-headline font-bold mb-3">Frequently Asked Questions</h2>
            </div>
            {/* Placeholder for FAQ Accordion */}
            <div className="max-w-2xl mx-auto bg-card p-6 rounded-xl shadow-md">
                <p className="text-muted-foreground">FAQ content will be displayed here using an accordion component. Users can find answers to common questions about finding tutors, payments, and using the platform.</p>
            </div>
        </div>
      </section>
    </div>
  );
}
