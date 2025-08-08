"use client";

import React, { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { TutorProfile, Review } from '@/src/types';
import { ReviewsList } from '@/src/components/tutors/ReviewsList';
import { Button } from '@/src/components/ui/button';
import { Card, CardContent, CardHeader } from '@/src/components/ui/card';
import { Avatar } from '@/src/components/ui/avatar';
import { Badge } from '@/src/components/ui/badge';
import { Separator } from '@/src/components/ui/separator';

interface TutorDetailData {
  tutor: TutorProfile & {
    user?: {
      displayName: string | null;
      photoUrl: string | null;
    };
    subjects?: { name: string; category?: string }[];
    reviews?: Array<Review & {
      author?: {
        displayName: string | null;
        photoUrl: string | null;
      };
    }>;
    availability?: Array<{
      id: string;
      dayOfWeek: string;
      timeSlot: string;
      isActive: boolean;
    }>;
  };
  relatedTutors?: Array<TutorProfile & {
    user?: {
      displayName: string | null;
      photoUrl: string | null;
    };
  }>;
}

export default function TutorDetailPage() {
  const params = useParams();
  const tutorId = params?.id as string;

  const [data, setData] = useState<TutorDetailData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isFavorite, setIsFavorite] = useState(false);
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [reviewsPage, setReviewsPage] = useState(1);
  const [allReviews, setAllReviews] = useState<Review[]>([]);
  const [loadingReviews, setLoadingReviews] = useState(false);

  useEffect(() => {
    if (!tutorId) return;

    fetchTutorDetail();
    checkFavoriteStatus();
  }, [tutorId]);

  const fetchTutorDetail = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch(`/api/tutors/${tutorId}`);
      const result = await response.json();

      if (!result.success) {
        throw new Error(result.error || 'Failed to fetch tutor details');
      }

      setData(result.data);
      setAllReviews(result.data.tutor.reviews || []);
    } catch (err) {
      console.error('Error fetching tutor:', err);
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const checkFavoriteStatus = () => {
    const savedFavorites = localStorage.getItem('gocours_favorites');
    if (savedFavorites) {
      try {
        const favorites = JSON.parse(savedFavorites);
        setIsFavorite(favorites.includes(tutorId));
      } catch (err) {
        console.error('Error checking favorite status:', err);
      }
    }
  };

  const handleFavoriteToggle = async () => {
    const newFavoriteStatus = !isFavorite;
    setIsFavorite(newFavoriteStatus);

    // Update localStorage
    const savedFavorites = localStorage.getItem('gocours_favorites');
    let favorites: string[] = [];
    
    if (savedFavorites) {
      try {
        favorites = JSON.parse(savedFavorites);
      } catch (err) {
        console.error('Error parsing favorites:', err);
      }
    }

    if (newFavoriteStatus) {
      if (!favorites.includes(tutorId)) {
        favorites.push(tutorId);
      }
    } else {
      favorites = favorites.filter(id => id !== tutorId);
    }

    localStorage.setItem('gocours_favorites', JSON.stringify(favorites));

    // Sync with backend
    try {
      const response = await fetch('/api/favorites', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          tutorId,
          action: newFavoriteStatus ? 'add' : 'remove'
        })
      });

      if (!response.ok) {
        console.warn('Failed to sync favorite with backend');
      }
    } catch (err) {
      console.warn('Error syncing favorite:', err);
    }
  };

  const loadMoreReviews = async () => {
    if (!tutorId) return;

    try {
      setLoadingReviews(true);
      const nextPage = reviewsPage + 1;

      const response = await fetch(`/api/reviews?tutorId=${tutorId}&page=${nextPage}&limit=5`);
      const result = await response.json();

      if (result.success && result.data.reviews.length > 0) {
        setAllReviews(prev => [...prev, ...result.data.reviews]);
        setReviewsPage(nextPage);
      }
    } catch (err) {
      console.error('Error loading more reviews:', err);
    } finally {
      setLoadingReviews(false);
    }
  };

  const renderStars = (rating: number, size: 'sm' | 'md' | 'lg' = 'md') => {
    const sizeClasses = {
      sm: 'w-4 h-4',
      md: 'w-5 h-5',
      lg: 'w-6 h-6'
    };

    return (
      <div className="flex items-center gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <svg
            key={star}
            className={`${sizeClasses[size]} ${
              star <= rating ? 'text-yellow-400 fill-current' : 'text-gray-300'
            }`}
            viewBox="0 0 20 20"
          >
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
          </svg>
        ))}
      </div>
    );
  };

  const formatAvailability = (availability: Array<{ dayOfWeek: string; timeSlot: string; isActive: boolean }>) => {
    const activeSlots = availability.filter(slot => slot.isActive);
    const groupedByDay = activeSlots.reduce((acc, slot) => {
      if (!acc[slot.dayOfWeek]) {
        acc[slot.dayOfWeek] = [];
      }
      acc[slot.dayOfWeek].push(slot.timeSlot);
      return acc;
    }, {} as Record<string, string[]>);

    return Object.entries(groupedByDay).map(([day, times]) => ({
      day,
      times: times.join(', ')
    }));
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="animate-pulse">
          {/* Header Skeleton */}
          <div className="bg-white border-b">
            <div className="max-w-7xl mx-auto px-4 py-8">
              <div className="flex items-center gap-6">
                <div className="w-32 h-32 bg-gray-200 rounded-full"></div>
                <div className="flex-1 space-y-4">
                  <div className="h-8 bg-gray-200 rounded w-1/3"></div>
                  <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                  <div className="h-4 bg-gray-200 rounded w-1/4"></div>
                </div>
                <div className="space-y-2">
                  <div className="h-10 w-32 bg-gray-200 rounded"></div>
                  <div className="h-10 w-32 bg-gray-200 rounded"></div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Content Skeleton */}
          <div className="max-w-7xl mx-auto px-4 py-8">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2 space-y-6">
                <div className="bg-white rounded-lg p-6">
                  <div className="h-6 bg-gray-200 rounded w-1/4 mb-4"></div>
                  <div className="space-y-2">
                    <div className="h-4 bg-gray-200 rounded"></div>
                    <div className="h-4 bg-gray-200 rounded w-5/6"></div>
                    <div className="h-4 bg-gray-200 rounded w-4/6"></div>
                  </div>
                </div>
              </div>
              <div className="space-y-6">
                <div className="bg-white rounded-lg p-6">
                  <div className="h-6 bg-gray-200 rounded w-1/2 mb-4"></div>
                  <div className="space-y-2">
                    <div className="h-4 bg-gray-200 rounded"></div>
                    <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Tutor not found</h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <Link href="/tutors">
            <Button>Browse all tutors</Button>
          </Link>
        </div>
      </div>
    );
  }

  if (!data?.tutor) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Tutor not found</h2>
          <p className="text-gray-600 mb-4">The tutor you're looking for doesn't exist.</p>
          <Link href="/tutors">
            <Button>Browse all tutors</Button>
          </Link>
        </div>
      </div>
    );
  }

  const { tutor } = data;
  const displayName = tutor.user?.displayName || 'Anonymous Tutor';
  const photoUrl = tutor.user?.photoUrl;
  const subjects = tutor.subjects || [];
  const reviews = allReviews || [];
  const availability = tutor.availability || [];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col lg:flex-row lg:items-start gap-6">
            <Avatar className="h-32 w-32 mx-auto lg:mx-0 flex-shrink-0">
              {photoUrl ? (
                <img
                  src={photoUrl}
                  alt={displayName}
                  className="h-full w-full object-cover"
                />
              ) : (
                <div className="h-full w-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white text-4xl font-bold">
                  {displayName.charAt(0).toUpperCase()}
                </div>
              )}
            </Avatar>

            <div className="flex-1 text-center lg:text-left">
              <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
                <div>
                  <h1 className="text-3xl font-bold text-gray-900 mb-2">
                    {displayName}
                    {tutor.isVerified && (
                      <svg className="w-6 h-6 text-green-500 inline ml-2" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                    )}
                  </h1>
                  <p className="text-lg text-gray-600 mb-3">{tutor.headline}</p>
                  
                  <div className="flex flex-col lg:flex-row lg:items-center gap-4 mb-4">
                    <div className="flex items-center justify-center lg:justify-start gap-2">
                      {renderStars(tutor.averageRating, 'md')}
                      <span className="text-lg font-semibold text-gray-900">
                        {tutor.averageRating.toFixed(1)}
                      </span>
                      <span className="text-gray-600">
                        ({tutor.reviewCount} reviews)
                      </span>
                    </div>
                    
                    <div className="text-center lg:text-left">
                      <span className="text-3xl font-bold text-gray-900">
                        €{tutor.hourlyRate}
                      </span>
                      <span className="text-gray-600 ml-1">/hour</span>
                    </div>
                  </div>
                </div>

                <div className="flex flex-col gap-3 mt-4 lg:mt-0">
                  <Button
                    onClick={() => setShowBookingModal(true)}
                    size="lg"
                    className="px-8"
                  >
                    Book Session
                  </Button>
                  
                  <Button
                    onClick={handleFavoriteToggle}
                    variant={isFavorite ? "default" : "outline"}
                    size="lg"
                    className="px-8"
                  >
                    <svg
                      className={`w-5 h-5 mr-2 ${
                        isFavorite ? 'text-white' : 'text-gray-600'
                      }`}
                      fill={isFavorite ? 'currentColor' : 'none'}
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                    </svg>
                    {isFavorite ? 'Saved' : 'Save'}
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Main Info */}
          <div className="lg:col-span-2 space-y-8">
            {/* About Section */}
            <Card>
              <CardHeader>
                <h2 className="text-xl font-semibold">About {displayName}</h2>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700 leading-relaxed whitespace-pre-line">
                  {tutor.bio}
                </p>
              </CardContent>
            </Card>

            {/* Subjects Section */}
            <Card>
              <CardHeader>
                <h2 className="text-xl font-semibold">Subjects Taught</h2>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {subjects.map((subject, index) => (
                    <Badge key={index} variant="secondary" className="text-sm py-2 px-3">
                      {subject.name}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Teaching Levels */}
            {tutor.teachingLevels.length > 0 && (
              <Card>
                <CardHeader>
                  <h2 className="text-xl font-semibold">Teaching Levels</h2>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2">
                    {tutor.teachingLevels.map((level, index) => (
                      <Badge key={index} variant="outline" className="text-sm py-2 px-3">
                        {level}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Reviews Section */}
            <Card>
              <CardHeader>
                <h2 className="text-xl font-semibold">Student Reviews</h2>
              </CardHeader>
              <CardContent>
                <ReviewsList
                  reviews={reviews}
                  loading={loadingReviews}
                  showPagination={true}
                  onLoadMore={loadMoreReviews}
                  hasMore={reviews.length < tutor.reviewCount}
                  totalCount={tutor.reviewCount}
                />
              </CardContent>
            </Card>
          </div>

          {/* Right Column - Sidebar */}
          <div className="space-y-6">
            {/* Quick Info */}
            <Card>
              <CardHeader>
                <h3 className="text-lg font-semibold">Quick Info</h3>
              </CardHeader>
              <CardContent className="space-y-4">
                {tutor.experienceYears && (
                  <div className="flex justify-between">
                    <span className="text-gray-600">Experience</span>
                    <span className="font-medium">{tutor.experienceYears}+ years</span>
                  </div>
                )}
                
                {tutor.responseTime && (
                  <div className="flex justify-between">
                    <span className="text-gray-600">Response time</span>
                    <span className="font-medium">{tutor.responseTime}</span>
                  </div>
                )}

                <div className="flex justify-between">
                  <span className="text-gray-600">Languages</span>
                  <span className="font-medium text-right">
                    {tutor.languages.join(', ')}
                  </span>
                </div>

                <div className="flex justify-between">
                  <span className="text-gray-600">Teaching Format</span>
                  <span className="font-medium text-right">
                    {tutor.teachingFormats.join(', ')}
                  </span>
                </div>

                {tutor.location?.city && (
                  <div className="flex justify-between">
                    <span className="text-gray-600">Location</span>
                    <span className="font-medium">{tutor.location.city}</span>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Qualifications */}
            {tutor.qualifications.length > 0 && (
              <Card>
                <CardHeader>
                  <h3 className="text-lg font-semibold">Qualifications</h3>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {tutor.qualifications.map((qualification, index) => (
                      <li key={index} className="text-gray-700 text-sm">
                        • {qualification}
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            )}

            {/* Availability */}
            {availability.length > 0 && (
              <Card>
                <CardHeader>
                  <h3 className="text-lg font-semibold">Availability</h3>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {formatAvailability(availability).map(({ day, times }, index) => (
                      <div key={index} className="flex justify-between">
                        <span className="text-gray-600 font-medium">{day}</span>
                        <span className="text-sm text-gray-700 text-right">{times}</span>
                      </div>
                    ))}
                  </div>
                  <Separator className="my-4" />
                  <Button
                    onClick={() => setShowBookingModal(true)}
                    className="w-full"
                    size="lg"
                  >
                    Book a Session
                  </Button>
                </CardContent>
              </Card>
            )}

            {/* Contact */}
            <Card>
              <CardContent className="pt-6">
                <Button variant="outline" className="w-full mb-3">
                  Send Message
                </Button>
                <Button variant="outline" className="w-full">
                  Report Tutor
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* TODO: Add BookingModal component */}
      {showBookingModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full">
            <h3 className="text-lg font-semibold mb-4">Book a Session</h3>
            <p className="text-gray-600 mb-4">
              Booking functionality will be implemented in the next phase.
            </p>
            <div className="flex gap-3">
              <Button
                onClick={() => setShowBookingModal(false)}
                variant="outline"
                className="flex-1"
              >
                Close
              </Button>
              <Button className="flex-1" disabled>
                Coming Soon
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}