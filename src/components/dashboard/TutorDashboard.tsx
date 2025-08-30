'use client';

import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import StatsCards, { StatCardData } from './StatsCards';
import RecentActivity, { ActivityItem } from './RecentActivity';
import { 
  Plus, 
  User, 
  Calendar, 
  Settings,
  BookOpen,
  MessageSquare
} from 'lucide-react';
import { TutorProfile, Booking, Review } from '../../types';

type TutorDashboardData = {
  profile: TutorProfile;
  stats: {
    totalEarnings: number;
    monthlyEarnings: number;
    totalBookings: number;
    completedSessions: number;
    averageRating: number;
    totalStudents: number;
    pendingBookings: number;
    upcomingBookings: number;
  };
  recentBookings: Booking[];
  recentReviews: Review[];
  recentActivity: ActivityItem[];
};

type TutorDashboardProps = {
  data: TutorDashboardData;
};

export default function TutorDashboard({ data }: TutorDashboardProps) {
  const { profile, stats, recentBookings, recentReviews, recentActivity } = data;

  // Prepare stats cards data
  const statsData: StatCardData[] = [
    {
      title: "Monthly Earnings",
      value: stats.monthlyEarnings,
      icon: "dollar",
      description: `Total: $${stats.totalEarnings.toLocaleString()}`,
      trend: {
        value: 12,
        isPositive: true
      }
    },
    {
      title: "Total Bookings",
      value: stats.totalBookings,
      icon: "calendar",
      description: `${stats.pendingBookings} pending`,
      trend: {
        value: 8,
        isPositive: true
      }
    },
    {
      title: "Average Rating",
      value: stats.averageRating.toFixed(1),
      icon: "star",
      description: `${profile.reviewCount} reviews`,
    },
    {
      title: "Active Students",
      value: stats.totalStudents,
      icon: "users",
      description: "This month",
      trend: {
        value: 5,
        isPositive: true
      }
    }
  ];

  // Quick actions
  const quickActions = [
    {
      label: "Create Session",
      icon: Plus,
      href: "/dashboard/sessions/create",
      variant: "default" as const
    },
    {
      label: "Manage Profile",
      icon: User,
      href: "/dashboard/profile",
      variant: "outline" as const
    },
    {
      label: "View Schedule",
      icon: Calendar,
      href: "/dashboard/schedule",
      variant: "outline" as const
    },
    {
      label: "Settings",
      icon: Settings,
      href: "/dashboard/settings",
      variant: "outline" as const
    }
  ];

  return (
    <div className="space-y-8">
      {/* Welcome Message */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-6 rounded-lg border">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          Welcome back, {profile.user?.displayName || 'Tutor'}!
        </h2>
        <p className="text-gray-600">
          You have <span className="font-semibold text-blue-600">
            {stats.pendingBookings} pending booking{stats.pendingBookings !== 1 ? 's' : ''}
          </span> and <span className="font-semibold text-green-600">
            {stats.upcomingBookings} upcoming session{stats.upcomingBookings !== 1 ? 's' : ''}
          </span> this week.
        </p>
      </div>

      {/* Stats Cards */}
      <StatsCards stats={statsData} />

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Recent Bookings */}
        <RecentActivity
          title="Recent Bookings"
          activities={recentActivity.filter(activity => activity.type === 'booking')}
          maxItems={5}
          showViewAll={true}
          onViewAll={() => window.location.href = '/dashboard/bookings'}
        />

        {/* Recent Reviews */}
        <RecentActivity
          title="Recent Reviews"
          activities={recentActivity.filter(activity => activity.type === 'review')}
          maxItems={5}
          showViewAll={true}
          onViewAll={() => window.location.href = '/dashboard/reviews'}
        />
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <BookOpen className="h-5 w-5" />
            <span>Quick Actions</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {quickActions.map((action) => {
              const Icon = action.icon;
              return (
                <Button
                  key={action.label}
                  variant={action.variant}
                  className="h-auto p-4 flex-col space-y-2"
                  onClick={() => window.location.href = action.href}
                >
                  <Icon className="h-6 w-6" />
                  <span className="text-sm">{action.label}</span>
                </Button>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Performance Insights */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Session Performance</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Completion Rate</span>
                <span className="font-semibold">
                  {((stats.completedSessions / stats.totalBookings) * 100).toFixed(1)}%
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Response Time</span>
                <span className="font-semibold">{profile.responseTime || '< 1 hour'}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Student Retention</span>
                <span className="font-semibold">85%</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Top Subjects</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {profile.subjects.slice(0, 3).map((subject, index) => (
                <div key={subject} className="flex justify-between items-center">
                  <span className="text-sm">{subject}</span>
                  <span className="text-xs text-gray-500">
                    {Math.max(20 - index * 5, 5)} sessions
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Messages</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <MessageSquare className="h-4 w-4 text-blue-600" />
                  <span className="text-sm">Unread Messages</span>
                </div>
                <span className="font-semibold text-blue-600">3</span>
              </div>
              <Button 
                variant="outline" 
                size="sm" 
                className="w-full"
                onClick={() => window.location.href = '/dashboard/messages'}
              >
                View All Messages
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}