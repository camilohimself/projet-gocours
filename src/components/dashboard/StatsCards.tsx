'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/src/components/ui/card';
import { 
  Calendar, 
  DollarSign, 
  Star, 
  Users, 
  BookOpen, 
  Heart,
  Clock,
  TrendingUp
} from 'lucide-react';

export type StatCardData = {
  title: string;
  value: string | number;
  description?: string;
  icon: keyof typeof iconMap;
  trend?: {
    value: number;
    isPositive: boolean;
  };
};

const iconMap = {
  calendar: Calendar,
  dollar: DollarSign,
  star: Star,
  users: Users,
  book: BookOpen,
  heart: Heart,
  clock: Clock,
  trending: TrendingUp,
};

const iconColors = {
  calendar: 'text-blue-600',
  dollar: 'text-green-600',
  star: 'text-yellow-600',
  users: 'text-purple-600',
  book: 'text-indigo-600',
  heart: 'text-red-600',
  clock: 'text-orange-600',
  trending: 'text-emerald-600',
};

const backgroundColors = {
  calendar: 'bg-blue-50',
  dollar: 'bg-green-50',
  star: 'bg-yellow-50',
  users: 'bg-purple-50',
  book: 'bg-indigo-50',
  heart: 'bg-red-50',
  clock: 'bg-orange-50',
  trending: 'bg-emerald-50',
};

type StatCardProps = {
  data: StatCardData;
  className?: string;
};

function StatCard({ data, className }: StatCardProps) {
  const Icon = iconMap[data.icon];
  const iconColor = iconColors[data.icon];
  const bgColor = backgroundColors[data.icon];

  return (
    <Card className={`hover:shadow-md transition-shadow duration-200 ${className}`}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">
          {data.title}
        </CardTitle>
        <div className={`p-2 rounded-lg ${bgColor}`}>
          <Icon className={`h-4 w-4 ${iconColor}`} />
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex items-baseline justify-between">
          <div className="text-2xl font-bold">
            {typeof data.value === 'number' && data.icon === 'dollar' 
              ? `$${data.value.toLocaleString()}`
              : data.value
            }
          </div>
          {data.trend && (
            <div className={`flex items-center text-sm ${
              data.trend.isPositive ? 'text-green-600' : 'text-red-600'
            }`}>
              <TrendingUp 
                className={`h-3 w-3 mr-1 ${
                  data.trend.isPositive ? '' : 'rotate-180'
                }`} 
              />
              {Math.abs(data.trend.value)}%
            </div>
          )}
        </div>
        {data.description && (
          <p className="text-xs text-muted-foreground mt-1">
            {data.description}
          </p>
        )}
      </CardContent>
    </Card>
  );
}

type StatsCardsProps = {
  stats: StatCardData[];
  className?: string;
};

export default function StatsCards({ stats, className }: StatsCardsProps) {
  return (
    <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 ${className}`}>
      {stats.map((stat, index) => (
        <StatCard key={`${stat.title}-${index}`} data={stat} />
      ))}
    </div>
  );
}