'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/src/components/ui/card';
import { Button } from '@/src/components/ui/button';
import { Badge } from '@/src/components/ui/badge';
import StatsCards, { StatCardData } from './StatsCards';
import RecentActivity, { ActivityItem } from './RecentActivity';
import { 
  Search, 
  Heart, 
  Calendar, 
  Settings,
  BookOpen,
  User,
  Star,
  Clock
} from 'lucide-react';
import { StudentProfile, Booking, TutorProfile, Favorite } from '@/src/types';

type StudentDashboardData = {
  profile: StudentProfile;
  stats: {
    totalSessions: number;
    completedSessions: number;
    upcomingSessions: number;
    favoriteTutors: number;
    totalSpent: number;
    monthlySpent: number;
    averageSessionRating: number;
  };
  recentBookings: Booking[];
  favoriteTutors: (TutorProfile & { favorite?: Favorite })[];
  recentActivity: ActivityItem[];
  upcomingBookings: Booking[];
};

type StudentDashboardProps = {
  data: StudentDashboardData;
};

export default function StudentDashboard({ data }: StudentDashboardProps) {
  const { profile, stats, recentBookings, favoriteTutors, recentActivity, upcomingBookings } = data;

  // Prepare stats cards data
  const statsData: StatCardData[] = [
    {
      title: "Total Sessions",
      value: stats.totalSessions,
      icon: "book",
      description: `${stats.completedSessions} completed`,
      trend: {
        value: 15,
        isPositive: true
      }
    },
    {
      title: "Upcoming Sessions",
      value: stats.upcomingSessions,
      icon: "calendar",
      description: "This week",
    },
    {
      title: "Favorite Tutors",
      value: stats.favoriteTutors,
      icon: "heart",
      description: "Saved tutors",
    },
    {
      title: "Monthly Spending",
      value: stats.monthlySpent,
      icon: "dollar",
      description: `Total: $${stats.totalSpent.toLocaleString()}`,
      trend: {
        value: 5,
        isPositive: false
      }
    }
  ];

  // Quick actions
  const quickActions = [
    {
      label: "Find Tutors",
      icon: Search,
      href: "/tutors",
      variant: "default" as const
    },
    {
      label: "My Bookings",
      icon: Calendar,
      href: "/dashboard/bookings",
      variant: "outline" as const
    },
    {
      label: "Favorites",
      icon: Heart,
      href: "/dashboard/favorites",
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
      <div className="bg-gradient-to-r from-green-50 to-emerald-50 p-6 rounded-lg border">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          Welcome back, {profile.user?.displayName || 'Student'}!
        </h2>
        <p className="text-gray-600">
          You have <span className="font-semibold text-blue-600">
            {stats.upcomingSessions} upcoming session{stats.upcomingSessions !== 1 ? 's' : ''}
          </span> this week. Keep learning!
        </p>
      </div>

      {/* Stats Cards */}
      <StatsCards stats={statsData} />

      {/* Upcoming Sessions */}
      {upcomingBookings.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Clock className="h-5 w-5 text-blue-600" />
              <span>Upcoming Sessions</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {upcomingBookings.slice(0, 3).map((booking) => (
                <div key={booking.id} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center space-x-4">
                    <div className="p-2 bg-blue-100 rounded-lg">
                      <BookOpen className="h-4 w-4 text-blue-600" />
                    </div>
                    <div>
                      <p className="font-medium">{booking.subject}</p>
                      <p className="text-sm text-gray-600">
                        with {booking.tutor?.user?.displayName}
                      </p>
                      <p className="text-xs text-gray-500">
                        {booking.scheduledAt.toLocaleDateString()} at {booking.scheduledAt.toLocaleTimeString()}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Badge variant="outline">{booking.status}</Badge>
                    <Button size="sm" variant="outline">
                      Details
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Recent Activity */}
        <RecentActivity
          title="Recent Activity"
          activities={recentActivity}
          maxItems={5}
          showViewAll={true}
          onViewAll={() => window.location.href = '/dashboard/activity'}
        />

        {/* Favorite Tutors */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="flex items-center space-x-2">
              <Heart className="h-5 w-5 text-red-500" />
              <span>Favorite Tutors</span>
            </CardTitle>
            <Button 
              variant="ghost" 
              size="sm"
              onClick={() => window.location.href = '/dashboard/favorites'}
            >
              View All
            </Button>
          </CardHeader>
          <CardContent>
            {favoriteTutors.length === 0 ? (
              <div className="text-center py-8">
                <Heart className="h-8 w-8 mx-auto mb-2 text-gray-300" />
                <p className="text-gray-500">No favorite tutors yet</p>
                <Button 
                  size="sm" 
                  className="mt-2"
                  onClick={() => window.location.href = '/tutors'}
                >
                  Find Tutors
                </Button>
              </div>
            ) : (
              <div className="space-y-4">
                {favoriteTutors.slice(0, 3).map((tutor) => (
                  <div key={tutor.id} className="flex items-center space-x-4 p-3 border rounded-lg hover:bg-gray-50 transition-colors">
                    <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
                      {tutor.user?.photoUrl ? (
                        <img 
                          src={tutor.user.photoUrl} 
                          alt={tutor.user.displayName || 'Tutor'}
                          className="w-10 h-10 rounded-full object-cover"
                        />
                      ) : (
                        <User className="h-5 w-5 text-gray-400" />
                      )}
                    </div>
                    <div className="flex-1">
                      <p className="font-medium text-sm">
                        {tutor.user?.displayName}
                      </p>
                      <p className="text-xs text-gray-600">{tutor.headline}</p>
                      <div className="flex items-center space-x-2 mt-1">
                        <div className="flex items-center">
                          <Star className="h-3 w-3 text-yellow-400 fill-yellow-400" />
                          <span className="text-xs ml-1">{tutor.averageRating.toFixed(1)}</span>
                        </div>
                        <Badge variant="outline" className="text-xs">
                          ${tutor.hourlyRate}/hr
                        </Badge>
                      </div>
                    </div>
                    <Button 
                      size="sm" 
                      variant="outline"
                      onClick={() => window.location.href = `/tutors/${tutor.id}`}
                    >
                      Book
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
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

      {/* Learning Progress */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Learning Stats</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Sessions This Month</span>
                <span className="font-semibold">{stats.completedSessions}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Average Rating Given</span>
                <span className="font-semibold">{stats.averageSessionRating.toFixed(1)}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Learning Streak</span>
                <span className="font-semibold">7 days</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Subjects Studied</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {['Mathematics', 'Physics', 'Chemistry'].map((subject, index) => (
                <div key={subject} className="flex justify-between items-center">
                  <span className="text-sm">{subject}</span>
                  <span className="text-xs text-gray-500">
                    {Math.max(10 - index * 2, 3)} sessions
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Learning Goals</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <p className="text-sm text-gray-600">
                {profile.learningGoals || "No learning goals set yet"}
              </p>
              <Button 
                variant="outline" 
                size="sm" 
                className="w-full"
                onClick={() => window.location.href = '/dashboard/goals'}
              >
                Set Learning Goals
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}