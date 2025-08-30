import { DemoTutorsPage } from '../../src/components/demo/DemoTutorsPage';
import { DemoDataProvider } from '../../src/components/demo/DemoDataProvider';

export const metadata = {
  title: 'GoCours - Interactive Demo',
  description: 'Explore our tutoring platform with realistic demo data showcasing advanced search, filters, and modern UI/UX.',
};

export default function DemoStaticPage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Enhanced Demo Banner */}
      <div className="bg-gradient-to-r from-primary/10 via-accent/10 to-primary/10 border-b">
        <div className="container mx-auto px-4 py-6">
          <div className="text-center">
            <div className="flex items-center justify-center mb-4">
              <div className="flex items-center space-x-3 px-6 py-3 bg-white/80 backdrop-blur-sm rounded-full border shadow-lg">
                <span className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></span>
                <span className="font-headline font-bold text-lg text-primary">LIVE INTERACTIVE DEMO</span>
              </div>
            </div>
            <h1 className="text-2xl sm:text-3xl font-headline font-bold text-foreground mb-2">
              GoCours Tutoring Platform
            </h1>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              🎯 <strong>Client Presentation:</strong> Fully functional demo with 12+ realistic tutors, 
              advanced search & filters, responsive design, and modern UI/UX
            </p>
            <div className="flex justify-center space-x-6 mt-4 text-sm text-muted-foreground">
              <div className="flex items-center space-x-1">
                <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                <span>Real-time Search</span>
              </div>
              <div className="flex items-center space-x-1">
                <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                <span>Advanced Filters</span>
              </div>
              <div className="flex items-center space-x-1">
                <span className="w-2 h-2 bg-purple-500 rounded-full"></span>
                <span>Interactive Features</span>
              </div>
              <div className="flex items-center space-x-1">
                <span className="w-2 h-2 bg-orange-500 rounded-full"></span>
                <span>Mobile Responsive</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <DemoDataProvider>
        <DemoTutorsPage />
      </DemoDataProvider>
    </div>
  );
}