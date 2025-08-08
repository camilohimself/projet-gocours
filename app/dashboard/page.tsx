import { auth } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';
import { Suspense } from 'react';
import DashboardContent from '@/src/components/dashboard/DashboardContent';
import DashboardSkeleton from '@/src/components/dashboard/DashboardSkeleton';

export const metadata = {
  title: 'Dashboard - GoCours',
  description: 'Manage your tutoring activities and profile on GoCours',
};

export default async function DashboardPage() {
  const { userId } = await auth();
  
  if (!userId) {
    redirect('/signin');
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b">
        <div className="container mx-auto px-4 py-6">
          <h1 className="text-3xl font-headline font-bold">Dashboard</h1>
          <p className="text-muted-foreground mt-2">
            Manage your profile, bookings, and tutoring activities
          </p>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        <Suspense fallback={<DashboardSkeleton />}>
          <DashboardContent />
        </Suspense>
      </div>
    </div>
  );
}