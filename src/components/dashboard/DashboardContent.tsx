'use client';

import { useEffect, useState } from 'react';
import { useUser } from '@clerk/nextjs';
import TutorDashboard from './TutorDashboard';
import StudentDashboard from './StudentDashboard';
import DashboardSkeleton from './DashboardSkeleton';
import { Card, CardContent } from '../ui/card';
import { Alert } from '../ui/alert';
import { Role, UserProfile, TutorProfile, StudentProfile, BookingStatus } from '../../types';
import { ActivityItem } from './RecentActivity';

// Dashboard API response type
type DashboardApiResponse = {
  user: UserProfile;
  role: Role;
  tutorProfile?: TutorProfile;
  studentProfile?: StudentProfile;
  stats: {
    // Tutor stats
    totalEarnings?: number;
    monthlyEarnings?: number;
    totalBookings?: number;
    completedSessions?: number;
    averageRating?: number;
    totalStudents?: number;
    pendingBookings?: number;
    upcomingBookings?: number;
    
    // Student stats
    totalSessions?: number;
    upcomingSessions?: number;
    favoriteTutors?: number;
    totalSpent?: number;
    monthlySpent?: number;
    averageSessionRating?: number;
  };
  recentActivity: any[];
  recentBookings: any[];
  recentReviews?: any[];
  favoriteTutors?: any[];
  upcomingBookings?: any[];
};

// Transform API response to component format
const transformActivityData = (activities: any[]): ActivityItem[] => {
  return activities.map((activity) => ({
    id: activity.id,
    type: activity.type,
    title: activity.title,
    description: activity.description,
    timestamp: new Date(activity.timestamp),
    status: activity.status,
    rating: activity.rating,
    actionUrl: activity.actionUrl,
    actionLabel: activity.actionLabel,
    metadata: activity.metadata,
  }));
};

export default function DashboardContent() {
  const { user, isLoaded } = useUser();
  const [dashboardData, setDashboardData] = useState<DashboardApiResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchDashboardData() {
      if (!isLoaded || !user) {
        return;
      }

      try {
        setLoading(true);
        setError(null);

        const response = await fetch('/api/dashboard', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        setDashboardData(data);
      } catch (err) {
        console.error('Error fetching dashboard data:', err);
        setError(err instanceof Error ? err.message : 'Failed to load dashboard data');
      } finally {
        setLoading(false);
      }
    }

    fetchDashboardData();
  }, [user, isLoaded]);

  // Show loading state
  if (!isLoaded || loading) {
    return <DashboardSkeleton />;
  }

  // Show error state
  if (error) {
    return (
      <div className="space-y-6">
        <Alert>
          <span>Error loading dashboard: {error}</span>
        </Alert>
        <Card>
          <CardContent className="p-8 text-center">
            <p className="text-gray-600 mb-4">
              We couldn't load your dashboard data. Please try refreshing the page.
            </p>
            <button 
              onClick={() => window.location.reload()}
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
            >
              Refresh Page
            </button>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Show empty state if no data
  if (!dashboardData) {
    return (
      <Card>
        <CardContent className="p-8 text-center">
          <p className="text-gray-600 mb-4">
            No dashboard data available. Please complete your profile setup.
          </p>
          <button 
            onClick={() => window.location.href = '/dashboard/profile'}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
          >
            Complete Profile
          </button>
        </CardContent>
      </Card>
    );
  }

  // Render role-specific dashboard
  if (dashboardData.role === Role.tutor && dashboardData.tutorProfile) {
    const tutorData = {
      profile: dashboardData.tutorProfile,
      stats: {
        totalEarnings: dashboardData.stats.totalEarnings || 0,
        monthlyEarnings: dashboardData.stats.monthlyEarnings || 0,
        totalBookings: dashboardData.stats.totalBookings || 0,
        completedSessions: dashboardData.stats.completedSessions || 0,
        averageRating: dashboardData.stats.averageRating || 0,
        totalStudents: dashboardData.stats.totalStudents || 0,
        pendingBookings: dashboardData.stats.pendingBookings || 0,
        upcomingBookings: dashboardData.stats.upcomingBookings || 0,
      },
      recentBookings: dashboardData.recentBookings || [],
      recentReviews: dashboardData.recentReviews || [],
      recentActivity: transformActivityData(dashboardData.recentActivity || []),
    };

    return <TutorDashboard data={tutorData} />;
  }

  if (dashboardData.role === Role.student && dashboardData.studentProfile) {
    const studentData = {
      profile: dashboardData.studentProfile,
      stats: {
        totalSessions: dashboardData.stats.totalSessions || 0,
        completedSessions: dashboardData.stats.completedSessions || 0,
        upcomingSessions: dashboardData.stats.upcomingSessions || 0,
        favoriteTutors: dashboardData.stats.favoriteTutors || 0,
        totalSpent: dashboardData.stats.totalSpent || 0,
        monthlySpent: dashboardData.stats.monthlySpent || 0,
        averageSessionRating: dashboardData.stats.averageSessionRating || 0,
      },
      recentBookings: dashboardData.recentBookings || [],
      favoriteTutors: dashboardData.favoriteTutors || [],
      recentActivity: transformActivityData(dashboardData.recentActivity || []),
      upcomingBookings: dashboardData.upcomingBookings || [],
    };

    return <StudentDashboard data={studentData} />;
  }

  // Role selection or incomplete profile
  return (
    <Card>
      <CardContent className="p-8 text-center space-y-6">
        <div>
          <h2 className="text-2xl font-bold mb-2">Complete Your Profile</h2>
          <p className="text-gray-600">
            To access your dashboard, please select your role and complete your profile.
          </p>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button 
            onClick={() => window.location.href = '/onboarding/tutor'}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            I'm a Tutor
          </button>
          <button 
            onClick={() => window.location.href = '/onboarding/student'}
            className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
          >
            I'm a Student
          </button>
        </div>
      </CardContent>
    </Card>
  );
}