"use client";

import React, { useState, useEffect, useCallback } from 'react';
import { Subject, TutorProfile } from '@/src/types';
import { TutorGrid } from '@/src/components/tutors/TutorGrid';
import { FilterSidebar, FilterState } from '@/src/components/tutors/FilterSidebar';
import { Input } from '@/src/components/ui/input';
import { Button } from '@/src/components/ui/button';
import { Select } from '@/src/components/ui/select';

interface TutorsPageData {
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
  filters: {
    subjects: Array<{ name: string; category?: string; count: number }>;
    locations: string[];
    priceRange: { min: number; max: number };
    teachingFormats: string[];
    languages: string[];
  };
  pagination: {
    page: number;
    limit: number;
    totalCount: number;
    totalPages: number;
  };
  searchQuery: {
    query?: string;
    subjects?: Subject[];
    priceRange?: [number, number];
    location?: string;
    minRating?: number;
    teachingFormats?: string[];
    languages?: string[];
  };
}

export default function TutorsPage() {
  const [data, setData] = useState<TutorsPageData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [favorites, setFavorites] = useState<Set<string>>(new Set());
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('rating');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [showFilters, setShowFilters] = useState(false);

  const [filters, setFilters] = useState<FilterState>({
    subjects: [],
    priceRange: [0, 1000],
    location: '',
    teachingFormats: [],
    languages: [],
    rating: 0,
    experienceYears: 0,
    verified: false
  });

  const fetchTutors = useCallback(async (
    page: number = 1,
    customFilters?: Partial<FilterState>,
    customQuery?: string,
    customSort?: { sortBy: string; sortOrder: 'asc' | 'desc' }
  ) => {
    try {
      setLoading(true);
      setError(null);

      const currentFilters = { ...filters, ...customFilters };
      const currentQuery = customQuery !== undefined ? customQuery : searchQuery;
      const currentSort = customSort || { sortBy, sortOrder };

      // Build query parameters
      const params = new URLSearchParams({
        q: currentQuery,
        page: page.toString(),
        limit: '12',
        minPrice: currentFilters.priceRange[0].toString(),
        maxPrice: currentFilters.priceRange[1].toString(),
        minRating: currentFilters.rating.toString()
      });

      if (currentFilters.subjects.length > 0) {
        params.append('subjects', currentFilters.subjects.join(','));
      }
      if (currentFilters.location) {
        params.append('location', currentFilters.location);
      }
      if (currentFilters.teachingFormats.length > 0) {
        params.append('teachingFormats', currentFilters.teachingFormats.join(','));
      }
      if (currentFilters.languages.length > 0) {
        params.append('languages', currentFilters.languages.join(','));
      }

      const response = await fetch(`/api/search?${params}`);
      const result = await response.json();

      if (!result.success) {
        throw new Error(result.error || 'Failed to fetch tutors');
      }

      setData(result.data);
    } catch (err) {
      console.error('Error fetching tutors:', err);
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  }, [filters, searchQuery, sortBy, sortOrder]);

  // Load favorites from localStorage
  useEffect(() => {
    const savedFavorites = localStorage.getItem('gocours_favorites');
    if (savedFavorites) {
      try {
        const parsed = JSON.parse(savedFavorites);
        setFavorites(new Set(parsed));
      } catch (err) {
        console.error('Error loading favorites:', err);
      }
    }
  }, []);

  // Initial load
  useEffect(() => {
    fetchTutors();
  }, []);

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    fetchTutors(1, undefined, query);
  };

  const handleFiltersChange = (newFilters: Partial<FilterState>) => {
    setFilters(prev => ({ ...prev, ...newFilters }));
  };

  const handleApplyFilters = () => {
    fetchTutors(1, filters);
    setShowFilters(false);
  };

  const handleResetFilters = () => {
    const resetFilters: FilterState = {
      subjects: [],
      priceRange: [0, 1000],
      location: '',
      teachingFormats: [],
      languages: [],
      rating: 0,
      experienceYears: 0,
      verified: false
    };
    setFilters(resetFilters);
    fetchTutors(1, resetFilters);
  };

  const handleSortChange = (newSortBy: string) => {
    const newSortOrder = newSortBy === sortBy && sortOrder === 'desc' ? 'asc' : 'desc';
    setSortBy(newSortBy);
    setSortOrder(newSortOrder);
    fetchTutors(1, undefined, undefined, { sortBy: newSortBy, sortOrder: newSortOrder });
  };

  const handlePageChange = (page: number) => {
    fetchTutors(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleFavoriteToggle = async (tutorId: string) => {
    const newFavorites = new Set(favorites);
    
    if (newFavorites.has(tutorId)) {
      newFavorites.delete(tutorId);
    } else {
      newFavorites.add(tutorId);
    }
    
    setFavorites(newFavorites);
    
    // Save to localStorage
    localStorage.setItem('gocours_favorites', JSON.stringify([...newFavorites]));
    
    // TODO: Also sync with backend
    try {
      const response = await fetch('/api/favorites', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          tutorId,
          action: newFavorites.has(tutorId) ? 'add' : 'remove'
        })
      });
      
      if (!response.ok) {
        console.warn('Failed to sync favorite with backend');
      }
    } catch (err) {
      console.warn('Error syncing favorite:', err);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Find Your Perfect Tutor</h1>
              <p className="text-gray-600 mt-2">
                {data?.pagination.totalCount ? 
                  `${data.pagination.totalCount} expert tutors ready to help you learn` :
                  'Discover expert tutors ready to help you achieve your learning goals'
                }
              </p>
            </div>
            
            <div className="flex items-center gap-3">
              <div className="relative flex-1 lg:w-80">
                <Input
                  type="text"
                  placeholder="Search tutors, subjects..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSearch(searchQuery)}
                  className="pr-10"
                />
                <Button
                  onClick={() => handleSearch(searchQuery)}
                  className="absolute right-1 top-1/2 -translate-y-1/2 h-8 w-8 p-0"
                  size="sm"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </Button>
              </div>
              
              <Button
                onClick={() => setShowFilters(!showFilters)}
                variant="outline"
                className="lg:hidden"
              >
                Filters
                <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707v4.586a1 1 0 01-.293.707l-2 2A1 1 0 0111 21v-6.586a1 1 0 00-.293-.707L4.293 7.293A1 1 0 014 6.586V4z" />
                </svg>
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Filters Sidebar */}
          <div className={`lg:w-80 lg:flex-shrink-0 ${showFilters ? 'block' : 'hidden lg:block'}`}>
            <div className="sticky top-8">
              <FilterSidebar
                filters={filters}
                onFiltersChange={handleFiltersChange}
                onApplyFilters={handleApplyFilters}
                onResetFilters={handleResetFilters}
                availableLocations={data?.filters.locations || []}
              />
            </div>
          </div>

          {/* Main Content */}
          <div className="flex-1 min-w-0">
            {/* Sort Options */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6">
              <div className="flex items-center gap-4 mb-4 sm:mb-0">
                <span className="text-sm text-gray-600">Sort by:</span>
                <div className="flex gap-2">
                  {[
                    { key: 'rating', label: 'Rating' },
                    { key: 'price', label: 'Price' },
                    { key: 'reviews', label: 'Reviews' },
                    { key: 'newest', label: 'Newest' }
                  ].map(({ key, label }) => (
                    <Button
                      key={key}
                      onClick={() => handleSortChange(key)}
                      variant={sortBy === key ? 'default' : 'outline'}
                      size="sm"
                      className="relative"
                    >
                      {label}
                      {sortBy === key && (
                        <svg 
                          className={`w-3 h-3 ml-1 transition-transform ${
                            sortOrder === 'asc' ? 'rotate-180' : ''
                          }`} 
                          fill="none" 
                          stroke="currentColor" 
                          viewBox="0 0 24 24"
                        >
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                      )}
                    </Button>
                  ))}
                </div>
              </div>
              
              {data && (
                <div className="text-sm text-gray-600">
                  Page {data.pagination.page} of {data.pagination.totalPages}
                </div>
              )}
            </div>

            {/* Tutors Grid */}
            <TutorGrid
              tutors={data?.tutors || []}
              loading={loading}
              error={error}
              onFavoriteToggle={handleFavoriteToggle}
              favorites={favorites}
              pagination={data?.pagination}
              onPageChange={handlePageChange}
              emptyStateTitle={searchQuery ? "No tutors found for your search" : "No tutors available"}
              emptyStateDescription={
                searchQuery 
                  ? `Try adjusting your search term "${searchQuery}" or filters to find more tutors.`
                  : "Try adjusting your filters or check back later for new tutors."
              }
              emptyStateAction={{
                label: searchQuery ? "Clear search" : "Reset filters",
                onClick: () => {
                  if (searchQuery) {
                    handleSearch('');
                  } else {
                    handleResetFilters();
                  }
                }
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}