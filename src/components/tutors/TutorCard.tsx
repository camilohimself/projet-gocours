"use client";

import React from 'react';
import Link from 'next/link';
import { TutorProfile } from '../../types';
import { Card, CardContent, CardFooter, CardHeader } from '../ui/card';
import { Avatar } from '../ui/avatar';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';

interface TutorCardProps {
  tutor: TutorProfile & {
    user?: {
      displayName: string | null;
      photoUrl: string | null;
    };
    subjects?: { name: string; category?: string }[];
    reviews?: Array<{
      rating: number;
      comment?: string;
      author?: {
        displayName: string | null;
      };
    }>;
  };
  onFavoriteToggle?: (tutorId: string) => void;
  isFavorite?: boolean;
  showBookButton?: boolean;
}

export function TutorCard({ 
  tutor, 
  onFavoriteToggle, 
  isFavorite = false, 
  showBookButton = true 
}: TutorCardProps) {
  const displayName = tutor.user?.displayName || 'Anonymous Tutor';
  const photoUrl = tutor.user?.photoUrl;
  const subjects = tutor.subjects || [];
  
  const handleFavoriteClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (onFavoriteToggle) {
      onFavoriteToggle(tutor.id);
    }
  };

  const renderStars = (rating: number) => {
    return (
      <div className="flex items-center gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <svg
            key={star}
            className={`w-4 h-4 ${
              star <= rating ? 'text-yellow-400 fill-current' : 'text-gray-300'
            }`}
            viewBox="0 0 20 20"
          >
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
          </svg>
        ))}
        <span className="text-sm text-gray-600 ml-1">
          ({tutor.reviewCount || 0})
        </span>
      </div>
    );
  };

  return (
    <Link href={`/tutors/${tutor.id}`}>
      <Card className="group hover:shadow-lg transition-all duration-200 cursor-pointer h-full">
        <CardHeader className="pb-4">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-3">
              <Avatar className="h-12 w-12">
                {photoUrl ? (
                  <img 
                    src={photoUrl} 
                    alt={displayName}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <div className="h-full w-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-medium">
                    {displayName.charAt(0).toUpperCase()}
                  </div>
                )}
              </Avatar>
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-lg text-gray-900 truncate">
                  {displayName}
                </h3>
                <p className="text-sm text-gray-600 mt-1 truncate">
                  {tutor.headline}
                </p>
              </div>
            </div>
            
            <button
              onClick={handleFavoriteClick}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
              title={isFavorite ? "Remove from favorites" : "Add to favorites"}
            >
              <svg
                className={`w-5 h-5 ${
                  isFavorite ? 'text-red-500 fill-current' : 'text-gray-400'
                }`}
                viewBox="0 0 20 20"
              >
                <path d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" />
              </svg>
            </button>
          </div>
        </CardHeader>

        <CardContent className="pb-4">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              {renderStars(tutor.averageRating)}
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold text-gray-900">
                €{tutor.hourlyRate}
              </div>
              <div className="text-sm text-gray-500">per hour</div>
            </div>
          </div>

          <div className="flex flex-wrap gap-1 mb-3">
            {subjects.slice(0, 3).map((subject, index) => (
              <Badge key={index} variant="secondary" className="text-xs">
                {(subject as any).name || subject}
              </Badge>
            ))}
            {subjects.length > 3 && (
              <Badge variant="outline" className="text-xs">
                +{subjects.length - 3} more
              </Badge>
            )}
          </div>

          <p className="text-sm text-gray-600 line-clamp-2">
            {tutor.bio}
          </p>

          <div className="flex items-center gap-4 mt-3 text-xs text-gray-500">
            {tutor.experienceYears && (
              <span>{tutor.experienceYears}+ years experience</span>
            )}
            {tutor.isVerified && (
              <div className="flex items-center gap-1">
                <svg className="w-4 h-4 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <span>Verified</span>
              </div>
            )}
            {tutor.responseTime && (
              <span>Usually responds in {tutor.responseTime}</span>
            )}
          </div>
        </CardContent>

        {showBookButton && (
          <CardFooter className="pt-0">
            <Button 
              className="w-full group-hover:bg-blue-600 transition-colors"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                // TODO: Implement booking logic
                console.log('Book session with tutor:', tutor.id);
              }}
            >
              Book Session
            </Button>
          </CardFooter>
        )}
      </Card>
    </Link>
  );
}