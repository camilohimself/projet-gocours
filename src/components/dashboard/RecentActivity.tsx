'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/src/components/ui/card';
import { Badge } from '@/src/components/ui/badge';
import { Button } from '@/src/components/ui/button';
import { 
  Calendar, 
  User, 
  BookOpen, 
  Star,
  Clock,
  ExternalLink,
  MessageSquare
} from 'lucide-react';
import { BookingStatus } from '@/src/types';

export type ActivityItem = {
  id: string;
  type: 'booking' | 'review' | 'session' | 'message';
  title: string;
  description: string;
  timestamp: Date;
  status?: BookingStatus;
  rating?: number;
  actionUrl?: string;
  actionLabel?: string;
  metadata?: {
    subject?: string;
    studentName?: string;
    tutorName?: string;
    amount?: number;
  };
};

const getActivityIcon = (type: ActivityItem['type']) => {
  switch (type) {
    case 'booking':
      return Calendar;
    case 'review':
      return Star;
    case 'session':
      return BookOpen;
    case 'message':
      return MessageSquare;
    default:
      return Clock;
  }
};

const getStatusBadge = (status: BookingStatus) => {
  const variants = {
    [BookingStatus.PENDING]: { variant: 'outline' as const, text: 'Pending' },
    [BookingStatus.CONFIRMED]: { variant: 'default' as const, text: 'Confirmed' },
    [BookingStatus.COMPLETED]: { variant: 'secondary' as const, text: 'Completed' },
    [BookingStatus.CANCELLED]: { variant: 'destructive' as const, text: 'Cancelled' },
    [BookingStatus.NO_SHOW]: { variant: 'destructive' as const, text: 'No Show' },
  };

  const config = variants[status];
  return (
    <Badge variant={config.variant}>
      {config.text}
    </Badge>
  );
};

const formatTimeAgo = (date: Date): string => {
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / (1000 * 60));
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  if (diffMins < 60) {
    return `${diffMins}m ago`;
  } else if (diffHours < 24) {
    return `${diffHours}h ago`;
  } else if (diffDays < 7) {
    return `${diffDays}d ago`;
  } else {
    return date.toLocaleDateString();
  }
};

const renderStars = (rating: number) => {
  return (
    <div className="flex items-center">
      {[1, 2, 3, 4, 5].map((star) => (
        <Star
          key={star}
          className={`h-3 w-3 ${
            star <= rating 
              ? 'text-yellow-400 fill-yellow-400' 
              : 'text-gray-300'
          }`}
        />
      ))}
    </div>
  );
};

type ActivityItemProps = {
  item: ActivityItem;
};

function ActivityItemComponent({ item }: ActivityItemProps) {
  const Icon = getActivityIcon(item.type);

  return (
    <div className="flex items-start space-x-4 p-4 border-b last:border-b-0 hover:bg-gray-50 transition-colors">
      <div className="flex-shrink-0 mt-1">
        <div className="p-2 rounded-full bg-primary/10">
          <Icon className="h-4 w-4 text-primary" />
        </div>
      </div>
      
      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <p className="text-sm font-medium text-gray-900">
              {item.title}
            </p>
            <p className="text-sm text-gray-600 mt-1">
              {item.description}
            </p>
            
            {/* Metadata */}
            <div className="flex flex-wrap items-center gap-2 mt-2">
              {item.status && getStatusBadge(item.status)}
              
              {item.rating && (
                <div className="flex items-center space-x-1">
                  {renderStars(item.rating)}
                </div>
              )}
              
              {item.metadata?.subject && (
                <Badge variant="outline" className="text-xs">
                  {item.metadata.subject}
                </Badge>
              )}
              
              {item.metadata?.amount && (
                <span className="text-xs text-green-600 font-medium">
                  ${item.metadata.amount}
                </span>
              )}
            </div>
          </div>
          
          <div className="flex flex-col items-end space-y-2">
            <span className="text-xs text-gray-500">
              {formatTimeAgo(item.timestamp)}
            </span>
            
            {item.actionUrl && item.actionLabel && (
              <Button 
                variant="outline" 
                size="sm"
                className="text-xs"
                onClick={() => window.location.href = item.actionUrl!}
              >
                {item.actionLabel}
                <ExternalLink className="h-3 w-3 ml-1" />
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

type RecentActivityProps = {
  activities: ActivityItem[];
  title?: string;
  maxItems?: number;
  showViewAll?: boolean;
  onViewAll?: () => void;
  className?: string;
};

export default function RecentActivity({ 
  activities, 
  title = "Recent Activity",
  maxItems = 5,
  showViewAll = false,
  onViewAll,
  className 
}: RecentActivityProps) {
  const displayedActivities = activities.slice(0, maxItems);

  return (
    <Card className={className}>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-lg font-semibold">
          {title}
        </CardTitle>
        {showViewAll && activities.length > maxItems && (
          <Button 
            variant="ghost" 
            size="sm"
            onClick={onViewAll}
          >
            View All
          </Button>
        )}
      </CardHeader>
      
      <CardContent className="p-0">
        {displayedActivities.length === 0 ? (
          <div className="p-6 text-center text-gray-500">
            <Clock className="h-8 w-8 mx-auto mb-2 text-gray-300" />
            <p>No recent activity</p>
          </div>
        ) : (
          <div>
            {displayedActivities.map((activity) => (
              <ActivityItemComponent 
                key={activity.id} 
                item={activity} 
              />
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}