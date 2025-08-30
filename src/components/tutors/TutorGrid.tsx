"use client";

import React from 'react';
import { TutorProfile } from '@/src/types';
import { TutorCard } from './TutorCard';
import { Button } from '@/src/components/ui/button';

export interface TutorGridProps {
  tutors: Array<TutorProfile & {
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
  }>;
  loading?: boolean;
  error?: string;
  onFavoriteToggle?: (tutorId: string) => void;
  favorites?: Set<string>;
  pagination?: {
    page: number;
    totalPages: number;
    totalCount: number;
    limit: number;
  };
  onPageChange?: (page: number) => void;
  showBookButton?: boolean;
  emptyStateTitle?: string;
  emptyStateDescription?: string;
  emptyStateAction?: {
    label: string;
    onClick: () => void;
  };
}

export function TutorGrid({
  tutors,
  loading = false,
  error,
  onFavoriteToggle,
  favorites = new Set(),
  pagination,
  onPageChange,
  showBookButton = true,
  emptyStateTitle = "No tutors found",
  emptyStateDescription = "Try adjusting your search criteria or filters.",
  emptyStateAction
}: TutorGridProps) {
  // Loading skeleton
  const LoadingSkeleton = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {Array.from({ length: 8 }).map((_, index) => (
        <div key={index} className="animate-pulse">
          <div className="bg-white rounded-lg border shadow-sm p-6 h-80">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-gray-200 rounded-full"></div>
              <div className="flex-1">
                <div className="h-4 bg-gray-200 rounded mb-2"></div>
                <div className="h-3 bg-gray-200 rounded w-3/4"></div>
              </div>
            </div>
            <div className="space-y-2 mb-4">
              <div className="h-3 bg-gray-200 rounded"></div>
              <div className="h-3 bg-gray-200 rounded w-5/6"></div>
            </div>
            <div className="flex gap-2 mb-4">
              <div className="h-6 w-16 bg-gray-200 rounded-full"></div>
              <div className="h-6 w-20 bg-gray-200 rounded-full"></div>
            </div>
            <div className="flex justify-between items-center mb-4">
              <div className="flex gap-1">
                {Array.from({ length: 5 }).map((_, i) => (
                  <div key={i} className="w-4 h-4 bg-gray-200 rounded"></div>
                ))}
              </div>
              <div className="h-6 w-12 bg-gray-200 rounded"></div>
            </div>
            <div className="h-10 bg-gray-200 rounded w-full"></div>
          </div>
        </div>
      ))}
    </div>
  );

  // Error state
  if (error) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-4">
          <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <h3 className="text-lg font-semibold text-gray-900 mb-2">
          Something went wrong
        </h3>
        <p className="text-gray-600 mb-4 max-w-md">
          {error}
        </p>
        <Button
          onClick={() => window.location.reload()}
          variant="outline"
        >
          Try again
        </Button>
      </div>
    );
  }

  // Loading state
  if (loading) {
    return <LoadingSkeleton />;
  }

  // Empty state
  if (tutors.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
          <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>
        <h3 className="text-lg font-semibold text-gray-900 mb-2">
          {emptyStateTitle}
        </h3>
        <p className="text-gray-600 mb-4 max-w-md">
          {emptyStateDescription}
        </p>
        {emptyStateAction && (
          <Button
            onClick={emptyStateAction.onClick}
            variant="outline"
          >
            {emptyStateAction.label}
          </Button>
        )}
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Results info */}
      {pagination && (
        <div className="flex items-center justify-between text-sm text-gray-600">
          <p>
            Showing {((pagination.page - 1) * pagination.limit) + 1} to{' '}
            {Math.min(pagination.page * pagination.limit, pagination.totalCount)} of{' '}
            {pagination.totalCount} tutors
          </p>
        </div>
      )}

      {/* Tutors grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {tutors.map((tutor) => (
          <TutorCard
            key={tutor.id}
            tutor={tutor}
            onFavoriteToggle={onFavoriteToggle}
            isFavorite={favorites.has(tutor.id)}
            showBookButton={showBookButton}
          />
        ))}
      </div>

      {/* Pagination */}
      {pagination && pagination.totalPages > 1 && (
        <div className="flex items-center justify-center space-x-2 pt-8">
          <Button
            onClick={() => onPageChange?.(pagination.page - 1)}
            disabled={pagination.page <= 1}
            variant="outline"
            size="sm"
          >
            Previous
          </Button>
          
          <div className="flex items-center space-x-1">
            {/* First page */}
            {pagination.page > 3 && (
              <>
                <Button
                  onClick={() => onPageChange?.(1)}
                  variant={pagination.page === 1 ? "default" : "outline"}
                  size="sm"
                  className="w-10 h-10 p-0"
                >
                  1
                </Button>
                {pagination.page > 4 && (
                  <span className="px-2 text-gray-500">...</span>
                )}
              </>
            )}

            {/* Current page range */}
            {Array.from({ length: Math.min(5, pagination.totalPages) }, (_, i) => {
              const pageNum = Math.max(1, Math.min(
                pagination.totalPages - 4,
                pagination.page - 2
              )) + i;
              
              if (pageNum > pagination.totalPages) return null;
              
              return (
                <Button
                  key={pageNum}
                  onClick={() => onPageChange?.(pageNum)}
                  variant={pagination.page === pageNum ? "default" : "outline"}
                  size="sm"
                  className="w-10 h-10 p-0"
                >
                  {pageNum}
                </Button>
              );
            })}

            {/* Last page */}
            {pagination.page < pagination.totalPages - 2 && (
              <>
                {pagination.page < pagination.totalPages - 3 && (
                  <span className="px-2 text-gray-500">...</span>
                )}
                <Button
                  onClick={() => onPageChange?.(pagination.totalPages)}
                  variant={pagination.page === pagination.totalPages ? "default" : "outline"}
                  size="sm"
                  className="w-10 h-10 p-0"
                >
                  {pagination.totalPages}
                </Button>
              </>
            )}
          </div>
          
          <Button
            onClick={() => onPageChange?.(pagination.page + 1)}
            disabled={pagination.page >= pagination.totalPages}
            variant="outline"
            size="sm"
          >
            Next
          </Button>
        </div>
      )}
    </div>
  );
}