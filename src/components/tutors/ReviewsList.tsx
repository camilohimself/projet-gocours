"use client";

import React, { useState } from 'react';
import { Review } from '../../types';
import { Button } from '../ui/button';
import { Card, CardContent } from '../ui/card';
import { Avatar } from '../ui/avatar';

interface ReviewsListProps {
  reviews: Array<Review & {
    author?: {
      displayName: string | null;
      photoUrl: string | null;
    };
  }>;
  loading?: boolean;
  error?: string;
  showPagination?: boolean;
  initialDisplayCount?: number;
  onLoadMore?: () => void;
  hasMore?: boolean;
  totalCount?: number;
}

export function ReviewsList({
  reviews,
  loading = false,
  error,
  showPagination = false,
  initialDisplayCount = 5,
  onLoadMore,
  hasMore = false,
  totalCount
}: ReviewsListProps) {
  const [displayCount, setDisplayCount] = useState(initialDisplayCount);
  const [expandedReviews, setExpandedReviews] = useState<Set<string>>(new Set());

  const toggleReviewExpansion = (reviewId: string) => {
    const newExpanded = new Set(expandedReviews);
    if (newExpanded.has(reviewId)) {
      newExpanded.delete(reviewId);
    } else {
      newExpanded.add(reviewId);
    }
    setExpandedReviews(newExpanded);
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
      </div>
    );
  };

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    }).format(new Date(date));
  };

  const LoadingSkeleton = () => (
    <div className="space-y-4">
      {Array.from({ length: 3 }).map((_, index) => (
        <Card key={index} className="animate-pulse">
          <CardContent className="p-6">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-gray-200 rounded-full"></div>
              <div className="flex-1 space-y-3">
                <div className="flex items-center gap-2">
                  <div className="h-4 bg-gray-200 rounded w-24"></div>
                  <div className="flex gap-1">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <div key={i} className="w-4 h-4 bg-gray-200 rounded"></div>
                    ))}
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="h-3 bg-gray-200 rounded"></div>
                  <div className="h-3 bg-gray-200 rounded w-5/6"></div>
                  <div className="h-3 bg-gray-200 rounded w-4/6"></div>
                </div>
                <div className="h-3 bg-gray-200 rounded w-20"></div>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );

  // Error state
  if (error) {
    return (
      <div className="text-center py-8">
        <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <h3 className="text-lg font-semibold text-gray-900 mb-2">Failed to load reviews</h3>
        <p className="text-gray-600">{error}</p>
      </div>
    );
  }

  // Loading state
  if (loading && reviews.length === 0) {
    return <LoadingSkeleton />;
  }

  // Empty state
  if (reviews.length === 0 && !loading) {
    return (
      <div className="text-center py-8">
        <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
          </svg>
        </div>
        <h3 className="text-lg font-semibold text-gray-900 mb-2">No reviews yet</h3>
        <p className="text-gray-600">Be the first to leave a review for this tutor.</p>
      </div>
    );
  }

  const displayedReviews = showPagination ? reviews : reviews.slice(0, displayCount);

  return (
    <div className="space-y-6">
      {/* Reviews count */}
      {totalCount && (
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-gray-900">
            Reviews ({totalCount})
          </h3>
        </div>
      )}

      {/* Reviews list */}
      <div className="space-y-4">
        {displayedReviews.map((review) => {
          const authorName = review.author?.displayName || 'Anonymous';
          const authorPhoto = review.author?.photoUrl;
          const isExpanded = expandedReviews.has(review.id);
          const isLongComment = review.comment && review.comment.length > 200;
          const shouldTruncate = isLongComment && !isExpanded;

          return (
            <Card key={review.id} className="hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-start gap-4">
                  <Avatar className="h-12 w-12 flex-shrink-0">
                    {authorPhoto ? (
                      <img
                        src={authorPhoto}
                        alt={authorName}
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <div className="h-full w-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-medium">
                        {authorName.charAt(0).toUpperCase()}
                      </div>
                    )}
                  </Avatar>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-3 mb-2">
                      <h4 className="font-medium text-gray-900">{authorName}</h4>
                      {renderStars(review.rating)}
                    </div>
                    
                    {review.comment && (
                      <div className="mb-3">
                        <p className="text-gray-700 leading-relaxed">
                          {shouldTruncate 
                            ? `${review.comment.slice(0, 200)}...`
                            : review.comment
                          }
                        </p>
                        {isLongComment && (
                          <button
                            onClick={() => toggleReviewExpansion(review.id)}
                            className="text-blue-600 hover:text-blue-700 text-sm font-medium mt-1"
                          >
                            {isExpanded ? 'Show less' : 'Read more'}
                          </button>
                        )}
                      </div>
                    )}
                    
                    <div className="text-sm text-gray-500">
                      {formatDate(review.createdAt)}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Load more functionality */}
      {!showPagination && reviews.length > displayCount && (
        <div className="text-center">
          <Button
            onClick={() => setDisplayCount(prev => prev + 5)}
            variant="outline"
            disabled={loading}
          >
            {loading ? 'Loading...' : `Show more reviews (${reviews.length - displayCount} remaining)`}
          </Button>
        </div>
      )}

      {/* Load more with API call */}
      {showPagination && hasMore && onLoadMore && (
        <div className="text-center">
          <Button
            onClick={onLoadMore}
            variant="outline"
            disabled={loading}
          >
            {loading ? 'Loading...' : 'Load more reviews'}
          </Button>
        </div>
      )}

      {/* Loading indicator for additional reviews */}
      {loading && reviews.length > 0 && (
        <div className="flex justify-center py-4">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
      )}
    </div>
  );
}