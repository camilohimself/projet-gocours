'use client';

import { Card, CardContent, CardHeader } from '@/src/components/ui/card';

const SkeletonCard = ({ className }: { className?: string }) => (
  <Card className={className}>
    <CardHeader className="pb-2">
      <div className="h-4 bg-gray-200 rounded animate-pulse w-24 mb-2" />
      <div className="h-8 bg-gray-200 rounded animate-pulse w-16" />
    </CardHeader>
    <CardContent>
      <div className="h-3 bg-gray-100 rounded animate-pulse w-32" />
    </CardContent>
  </Card>
);

const SkeletonActivityItem = () => (
  <div className="flex items-center space-x-4 p-4">
    <div className="w-2 h-2 bg-gray-200 rounded-full animate-pulse" />
    <div className="flex-1 space-y-2">
      <div className="h-4 bg-gray-200 rounded animate-pulse w-3/4" />
      <div className="h-3 bg-gray-100 rounded animate-pulse w-1/2" />
    </div>
    <div className="h-3 bg-gray-100 rounded animate-pulse w-16" />
  </div>
);

const SkeletonRecentCard = () => (
  <Card>
    <CardHeader>
      <div className="h-5 bg-gray-200 rounded animate-pulse w-32" />
    </CardHeader>
    <CardContent className="space-y-4">
      {[...Array(3)].map((_, i) => (
        <SkeletonActivityItem key={i} />
      ))}
    </CardContent>
  </Card>
);

export default function DashboardSkeleton() {
  return (
    <div className="space-y-8">
      {/* Stats Cards Skeleton */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[...Array(4)].map((_, i) => (
          <SkeletonCard key={i} />
        ))}
      </div>

      {/* Main Content Skeleton */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Recent Activity Skeleton */}
        <SkeletonRecentCard />
        
        {/* Secondary Content Skeleton */}
        <SkeletonRecentCard />
      </div>

      {/* Quick Actions Skeleton */}
      <Card>
        <CardHeader>
          <div className="h-5 bg-gray-200 rounded animate-pulse w-32" />
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-4">
            {[...Array(3)].map((_, i) => (
              <div 
                key={i} 
                className="h-10 bg-gray-200 rounded animate-pulse w-32"
              />
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}