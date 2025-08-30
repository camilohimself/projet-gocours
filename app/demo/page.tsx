import { DemoTutorsPage } from '../../src/components/demo/DemoTutorsPage';
import { DemoDataProvider } from '../../src/components/demo/DemoDataProvider';

export const metadata = {
  title: 'Demo - GoCours Tutors',
  description: 'Explore our tutors with realistic demo data',
};

export default function DemoPage() {
  return (
    <DemoDataProvider>
      <div className="min-h-screen bg-background">
        {/* Demo Banner */}
        <div className="bg-accent/10 border-b border-accent/20">
          <div className="container mx-auto px-4 py-3">
            <div className="flex items-center justify-center text-sm">
              <div className="bg-accent/20 text-accent px-3 py-1 rounded-full font-medium">
                🚀 DEMO MODE
              </div>
              <span className="ml-3 text-muted-foreground">
                This is a demonstration with realistic mock data
              </span>
            </div>
          </div>
        </div>

        <DemoTutorsPage />
      </div>
    </DemoDataProvider>
  );
}