"use client";

import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { TutorGrid } from '@/src/components/tutors/TutorGrid';
import { FilterSidebar, FilterState } from '@/src/components/tutors/FilterSidebar';
import { Button } from '@/src/components/ui/button';
import { Input } from '@/src/components/ui/input';
import { Select } from '@/src/components/ui/select';
import { Card, CardContent } from '@/src/components/ui/card';
import { useDemoData, DemoTutor } from './DemoDataProvider';
import { getAvailableCities } from '@/src/lib/mock-data';
import { Subject } from '@/src/types';

// Sort options
const SORT_OPTIONS = [
  { value: 'rating', label: 'Highest Rated' },
  { value: 'price_low', label: 'Price: Low to High' },
  { value: 'price_high', label: 'Price: High to Low' },
  { value: 'reviews', label: 'Most Reviews' },
  { value: 'newest', label: 'Newest First' },
  { value: 'experience', label: 'Most Experienced' },
] as const;

type SortOption = typeof SORT_OPTIONS[number]['value'];

// Pagination settings
const ITEMS_PER_PAGE = 12;

export function DemoTutorsPage() {
  const { tutors: allTutors, isLoading } = useDemoData();

  // State management
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<SortOption>('rating');
  const [currentPage, setCurrentPage] = useState(1);
  const [favorites, setFavorites] = useState<Set<string>>(new Set());
  const [isMobileFiltersOpen, setIsMobileFiltersOpen] = useState(false);
  
  // Filter state
  const [filters, setFilters] = useState<FilterState>({
    subjects: [],
    priceRange: [0, 1000],
    location: '',
    teachingFormats: [],
    languages: [],
    rating: 0,
    experienceYears: 0,
    verified: false,
  });

  const [appliedFilters, setAppliedFilters] = useState<FilterState>(filters);

  // Load favorites from localStorage on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem('demo-tutor-favorites');
      if (saved) {
        setFavorites(new Set(JSON.parse(saved)));
      }
    } catch (error) {
      console.warn('Failed to load favorites from localStorage:', error);
    }
  }, []);

  // Save favorites to localStorage when they change
  const handleFavoriteToggle = useCallback((tutorId: string) => {
    setFavorites(prev => {
      const newFavorites = new Set(prev);
      if (newFavorites.has(tutorId)) {
        newFavorites.delete(tutorId);
      } else {
        newFavorites.add(tutorId);
      }
      
      // Save to localStorage
      try {
        localStorage.setItem('demo-tutor-favorites', JSON.stringify([...newFavorites]));
      } catch (error) {
        console.warn('Failed to save favorites to localStorage:', error);
      }
      
      return newFavorites;
    });
  }, []);

  // Apply filters
  const handleApplyFilters = useCallback(() => {
    setAppliedFilters({ ...filters });
    setCurrentPage(1);
    setIsMobileFiltersOpen(false);
  }, [filters]);

  // Reset filters
  const handleResetFilters = useCallback(() => {
    const resetFilters: FilterState = {
      subjects: [],
      priceRange: [0, 1000],
      location: '',
      teachingFormats: [],
      languages: [],
      rating: 0,
      experienceYears: 0,
      verified: false,
    };
    setFilters(resetFilters);
    setAppliedFilters(resetFilters);
    setCurrentPage(1);
    setSearchQuery('');
  }, []);

  // Filter and search logic
  const filteredTutors = useMemo(() => {
    if (!allTutors.length) return [];

    return allTutors.filter(tutor => {
      // Text search (name, bio, headline)
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase().trim();
        const searchableText = [
          tutor.user?.displayName || '',
          tutor.bio || '',
          tutor.headline || '',
        ].join(' ').toLowerCase();
        
        if (!searchableText.includes(query)) {
          return false;
        }
      }

      // Subject filter
      if (appliedFilters.subjects.length > 0) {
        const hasSubject = appliedFilters.subjects.some(subject => 
          tutor.subjects.includes(subject)
        );
        if (!hasSubject) return false;
      }

      // Price range filter
      if (appliedFilters.priceRange[0] > 0 || appliedFilters.priceRange[1] < 1000) {
        if (tutor.hourlyRate < appliedFilters.priceRange[0] || 
            tutor.hourlyRate > appliedFilters.priceRange[1]) {
          return false;
        }
      }

      // Location filter
      if (appliedFilters.location.trim()) {
        const locationQuery = appliedFilters.location.toLowerCase().trim();
        const tutorLocation = tutor.location?.city?.toLowerCase() || '';
        if (!tutorLocation.includes(locationQuery)) {
          return false;
        }
      }

      // Teaching format filter
      if (appliedFilters.teachingFormats.length > 0) {
        const hasFormat = appliedFilters.teachingFormats.some(format =>
          tutor.teachingFormats.includes(format)
        );
        if (!hasFormat) return false;
      }

      // Languages filter
      if (appliedFilters.languages.length > 0) {
        const hasLanguage = appliedFilters.languages.some(lang =>
          tutor.languages.includes(lang)
        );
        if (!hasLanguage) return false;
      }

      // Rating filter
      if (appliedFilters.rating > 0) {
        if (tutor.averageRating < appliedFilters.rating) {
          return false;
        }
      }

      // Experience filter
      if (appliedFilters.experienceYears > 0) {
        if (!tutor.experienceYears || tutor.experienceYears < appliedFilters.experienceYears) {
          return false;
        }
      }

      // Verified filter
      if (appliedFilters.verified) {
        if (!tutor.isVerified) {
          return false;
        }
      }

      return true;
    });
  }, [allTutors, searchQuery, appliedFilters]);

  // Sort tutors
  const sortedTutors = useMemo(() => {
    const sorted = [...filteredTutors];
    
    switch (sortBy) {
      case 'rating':
        return sorted.sort((a, b) => b.averageRating - a.averageRating);
      case 'price_low':
        return sorted.sort((a, b) => a.hourlyRate - b.hourlyRate);
      case 'price_high':
        return sorted.sort((a, b) => b.hourlyRate - a.hourlyRate);
      case 'reviews':
        return sorted.sort((a, b) => b.reviewCount - a.reviewCount);
      case 'newest':
        return sorted.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
      case 'experience':
        return sorted.sort((a, b) => (b.experienceYears || 0) - (a.experienceYears || 0));
      default:
        return sorted;
    }
  }, [filteredTutors, sortBy]);

  // Pagination
  const totalPages = Math.ceil(sortedTutors.length / ITEMS_PER_PAGE);
  const paginatedTutors = useMemo(() => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    return sortedTutors.slice(startIndex, startIndex + ITEMS_PER_PAGE);
  }, [sortedTutors, currentPage]);

  // Reset page when search or filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, appliedFilters]);

  // Count active filters
  const activeFiltersCount = useMemo(() => {
    let count = 0;
    if (appliedFilters.subjects.length > 0) count++;
    if (appliedFilters.priceRange[0] > 0 || appliedFilters.priceRange[1] < 1000) count++;
    if (appliedFilters.location.trim()) count++;
    if (appliedFilters.teachingFormats.length > 0) count++;
    if (appliedFilters.languages.length > 0) count++;
    if (appliedFilters.rating > 0) count++;
    if (appliedFilters.experienceYears > 0) count++;
    if (appliedFilters.verified) count++;
    return count;
  }, [appliedFilters]);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              Find Your Perfect Tutor
            </h1>
            <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
              Discover expert tutors across Europe. Filter by subject, location, price and more.
              This is a demo showcasing all platform features with mock data.
            </p>
            
            {/* Search Bar */}
            <div className="max-w-2xl mx-auto">
              <div className="relative">
                <Input
                  type="text"
                  placeholder="Search tutors by name, subject, or description..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 text-lg rounded-lg border-2 border-gray-300 focus:border-blue-500 focus:ring-0"
                />
                <svg
                  className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex gap-8">
          {/* Sidebar - Desktop */}
          <div className="hidden lg:block w-80 flex-shrink-0">
            <div className="sticky top-8">
              <FilterSidebar
                filters={filters}
                onFiltersChange={(newFilters) => setFilters(prev => ({ ...prev, ...newFilters }))}
                onApplyFilters={handleApplyFilters}
                onResetFilters={handleResetFilters}
                availableLocations={getAvailableCities()}
              />
            </div>
          </div>

          {/* Main Content */}
          <div className="flex-1 min-w-0">
            {/* Controls Bar */}
            <div className="bg-white rounded-lg border border-gray-200 p-4 mb-6">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div className="flex items-center gap-4">
                  {/* Mobile Filter Toggle */}
                  <Button
                    variant="outline"
                    onClick={() => setIsMobileFiltersOpen(true)}
                    className="lg:hidden"
                  >
                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4" />
                    </svg>
                    Filters {activeFiltersCount > 0 && `(${activeFiltersCount})`}
                  </Button>

                  {/* Results Count */}
                  {!isLoading && (
                    <div className="text-sm text-gray-600">
                      {searchQuery || activeFiltersCount > 0 ? (
                        <span>
                          {sortedTutors.length} of {allTutors.length} tutors
                        </span>
                      ) : (
                        <span>{allTutors.length} tutors available</span>
                      )}
                    </div>
                  )}

                  {/* Active Filters Tags */}
                  {activeFiltersCount > 0 && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={handleResetFilters}
                      className="text-blue-600 hover:text-blue-700 hidden sm:inline-flex"
                    >
                      Clear all filters
                    </Button>
                  )}
                </div>

                {/* Sort Dropdown */}
                <div className="flex items-center gap-2">
                  <span className="text-sm text-gray-600 whitespace-nowrap">Sort by:</span>
                  <Select
                    value={sortBy}
                    onValueChange={(value) => setSortBy(value as SortOption)}
                  >
                    {SORT_OPTIONS.map(option => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </Select>
                </div>
              </div>
            </div>

            {/* Active Search/Filter Indicators */}
            {(searchQuery || activeFiltersCount > 0) && (
              <div className="mb-6">
                <div className="flex flex-wrap gap-2">
                  {searchQuery && (
                    <div className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm flex items-center gap-2">
                      Search: "{searchQuery}"
                      <button
                        onClick={() => setSearchQuery('')}
                        className="text-blue-600 hover:text-blue-800"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    </div>
                  )}
                  
                  {appliedFilters.subjects.length > 0 && (
                    <div className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm">
                      Subjects: {appliedFilters.subjects.join(', ')}
                    </div>
                  )}
                  
                  {appliedFilters.location && (
                    <div className="bg-purple-100 text-purple-800 px-3 py-1 rounded-full text-sm">
                      Location: {appliedFilters.location}
                    </div>
                  )}
                  
                  {(appliedFilters.priceRange[0] > 0 || appliedFilters.priceRange[1] < 1000) && (
                    <div className="bg-yellow-100 text-yellow-800 px-3 py-1 rounded-full text-sm">
                      Price: €{appliedFilters.priceRange[0]}-€{appliedFilters.priceRange[1]}
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Tutors Grid */}
            <TutorGrid
              tutors={paginatedTutors}
              loading={isLoading}
              onFavoriteToggle={handleFavoriteToggle}
              favorites={favorites}
              pagination={{
                page: currentPage,
                totalPages,
                totalCount: sortedTutors.length,
                limit: ITEMS_PER_PAGE,
              }}
              onPageChange={setCurrentPage}
              emptyStateTitle={searchQuery || activeFiltersCount > 0 ? "No tutors match your search" : "No tutors available"}
              emptyStateDescription={
                searchQuery || activeFiltersCount > 0 
                  ? "Try adjusting your search terms or filters to find more tutors."
                  : "Check back later for new tutors."
              }
              emptyStateAction={
                searchQuery || activeFiltersCount > 0 
                  ? { label: "Clear all filters", onClick: handleResetFilters }
                  : undefined
              }
            />
          </div>
        </div>
      </div>

      {/* Mobile Filter Sidebar */}
      {isMobileFiltersOpen && (
        <div className="lg:hidden fixed inset-0 z-50 overflow-hidden">
          <div className="absolute inset-0 bg-black bg-opacity-50" onClick={() => setIsMobileFiltersOpen(false)} />
          <div className="absolute right-0 top-0 h-full w-80 bg-white shadow-xl overflow-y-auto">
            <div className="p-4">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold">Filters</h3>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setIsMobileFiltersOpen(false)}
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </Button>
              </div>
              <FilterSidebar
                filters={filters}
                onFiltersChange={(newFilters) => setFilters(prev => ({ ...prev, ...newFilters }))}
                onApplyFilters={handleApplyFilters}
                onResetFilters={handleResetFilters}
                availableLocations={getAvailableCities()}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default DemoTutorsPage;