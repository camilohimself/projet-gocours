"use client";

import React, { useState, useEffect, useCallback } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { Subject, TutorProfile } from '@/src/types';
import { TutorGrid } from '@/src/components/tutors/TutorGrid';
import { FilterSidebar, FilterState } from '@/src/components/tutors/FilterSidebar';
import { Input } from '@/src/components/ui/input';
import { Button } from '@/src/components/ui/button';
import { Select } from '@/src/components/ui/select';
import { Card, CardContent, CardHeader } from '@/src/components/ui/card';

interface AdvancedSearchData {
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
  pagination: {
    page: number;
    limit: number;
    totalCount: number;
    totalPages: number;
  };
  appliedFilters: Record<string, any>;
  sortBy: string;
  sortOrder: string;
}

export default function SearchPage() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const [data, setData] = useState<AdvancedSearchData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [favorites, setFavorites] = useState<Set<string>>(new Set());
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('rating');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [showFilters, setShowFilters] = useState(true);
  const [savedSearches, setSavedSearches] = useState<Array<{
    id: string;
    name: string;
    query: string;
    filters: FilterState;
    timestamp: Date;
  }>>([]);

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

  // Parse URL parameters on mount
  useEffect(() => {
    const query = searchParams?.get('q') || '';
    const subjects = searchParams?.get('subjects')?.split(',').filter(Boolean) as Subject[] || [];
    const minPrice = parseFloat(searchParams?.get('minPrice') || '0');
    const maxPrice = parseFloat(searchParams?.get('maxPrice') || '1000');
    const location = searchParams?.get('location') || '';
    const rating = parseFloat(searchParams?.get('rating') || '0');
    const formats = searchParams?.get('formats')?.split(',').filter(Boolean) || [];
    const languages = searchParams?.get('languages')?.split(',').filter(Boolean) || [];
    const experience = parseFloat(searchParams?.get('experience') || '0');
    const verified = searchParams?.get('verified') === 'true';

    setSearchQuery(query);
    setFilters({
      subjects,
      priceRange: [minPrice, maxPrice],
      location,
      teachingFormats: formats,
      languages,
      rating,
      experienceYears: experience,
      verified
    });

    performSearch(query, {
      subjects,
      priceRange: [minPrice, maxPrice],
      location,
      teachingFormats: formats,
      languages,
      rating,
      experienceYears: experience,
      verified
    });
  }, [searchParams]);

  // Load favorites and saved searches
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

    const savedSearchesData = localStorage.getItem('gocours_saved_searches');
    if (savedSearchesData) {
      try {
        const parsed = JSON.parse(savedSearchesData);
        setSavedSearches(parsed.map((search: any) => ({
          ...search,
          timestamp: new Date(search.timestamp)
        })));
      } catch (err) {
        console.error('Error loading saved searches:', err);
      }
    }
  }, []);

  const performSearch = useCallback(async (
    query: string,
    searchFilters: FilterState,
    page: number = 1,
    customSort?: { sortBy: string; sortOrder: 'asc' | 'desc' }
  ) => {
    try {
      setLoading(true);
      setError(null);

      const currentSort = customSort || { sortBy, sortOrder };

      const requestBody = {
        query: query.trim(),
        filters: {
          subjects: searchFilters.subjects.length > 0 ? searchFilters.subjects : undefined,
          priceRange: searchFilters.priceRange[0] > 0 || searchFilters.priceRange[1] < 1000 
            ? searchFilters.priceRange 
            : undefined,
          location: searchFilters.location.trim() || undefined,
          teachingFormats: searchFilters.teachingFormats.length > 0 ? searchFilters.teachingFormats : undefined,
          languages: searchFilters.languages.length > 0 ? searchFilters.languages : undefined,
          rating: searchFilters.rating > 0 ? searchFilters.rating : undefined,
          experienceYears: searchFilters.experienceYears > 0 ? searchFilters.experienceYears : undefined,
          verified: searchFilters.verified || undefined
        },
        sortBy: currentSort.sortBy,
        sortOrder: currentSort.sortOrder,
        page,
        limit: 12
      };

      // Remove undefined values
      const cleanedFilters = Object.fromEntries(
        Object.entries(requestBody.filters).filter(([, value]) => value !== undefined)
      );
      requestBody.filters = cleanedFilters as typeof requestBody.filters;

      const response = await fetch('/api/search', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody)
      });

      const result = await response.json();

      if (!result.success) {
        throw new Error(result.error || 'Search failed');
      }

      setData(result.data);
      
      // Update URL with search parameters
      updateURL(query, searchFilters);
    } catch (err) {
      console.error('Error performing search:', err);
      setError(err instanceof Error ? err.message : 'An error occurred during search');
    } finally {
      setLoading(false);
    }
  }, [sortBy, sortOrder]);

  const updateURL = (query: string, searchFilters: FilterState) => {
    const params = new URLSearchParams();
    
    if (query) params.set('q', query);
    if (searchFilters.subjects.length > 0) params.set('subjects', searchFilters.subjects.join(','));
    if (searchFilters.priceRange[0] > 0) params.set('minPrice', searchFilters.priceRange[0].toString());
    if (searchFilters.priceRange[1] < 1000) params.set('maxPrice', searchFilters.priceRange[1].toString());
    if (searchFilters.location) params.set('location', searchFilters.location);
    if (searchFilters.rating > 0) params.set('rating', searchFilters.rating.toString());
    if (searchFilters.teachingFormats.length > 0) params.set('formats', searchFilters.teachingFormats.join(','));
    if (searchFilters.languages.length > 0) params.set('languages', searchFilters.languages.join(','));
    if (searchFilters.experienceYears > 0) params.set('experience', searchFilters.experienceYears.toString());
    if (searchFilters.verified) params.set('verified', 'true');

    const newURL = params.toString() ? `/search?${params.toString()}` : '/search';
    router.replace(newURL, { scroll: false });
  };

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    performSearch(query, filters);
  };

  const handleFiltersChange = (newFilters: Partial<FilterState>) => {
    setFilters(prev => ({ ...prev, ...newFilters }));
  };

  const handleApplyFilters = () => {
    performSearch(searchQuery, filters);
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
    performSearch(searchQuery, resetFilters);
    setShowFilters(false);
  };

  const handleSortChange = (newSortBy: string) => {
    const newSortOrder = newSortBy === sortBy && sortOrder === 'desc' ? 'asc' : 'desc';
    setSortBy(newSortBy);
    setSortOrder(newSortOrder);
    performSearch(searchQuery, filters, 1, { sortBy: newSortBy, sortOrder: newSortOrder });
  };

  const handlePageChange = (page: number) => {
    performSearch(searchQuery, filters, page);
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
    localStorage.setItem('gocours_favorites', JSON.stringify([...newFavorites]));
    
    // Sync with backend
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

  const saveCurrentSearch = () => {
    const searchName = prompt('Give this search a name:');
    if (!searchName) return;

    const savedSearch = {
      id: Date.now().toString(),
      name: searchName,
      query: searchQuery,
      filters: { ...filters },
      timestamp: new Date()
    };

    const newSavedSearches = [savedSearch, ...savedSearches.slice(0, 9)]; // Keep last 10
    setSavedSearches(newSavedSearches);
    
    localStorage.setItem('gocours_saved_searches', JSON.stringify(newSavedSearches));
  };

  const loadSavedSearch = (savedSearch: typeof savedSearches[0]) => {
    setSearchQuery(savedSearch.query);
    setFilters(savedSearch.filters);
    performSearch(savedSearch.query, savedSearch.filters);
  };

  const deleteSavedSearch = (searchId: string) => {
    const newSavedSearches = savedSearches.filter(search => search.id !== searchId);
    setSavedSearches(newSavedSearches);
    localStorage.setItem('gocours_saved_searches', JSON.stringify(newSavedSearches));
  };

  const hasActiveFilters = () => {
    return (
      filters.subjects.length > 0 ||
      filters.priceRange[0] > 0 ||
      filters.priceRange[1] < 1000 ||
      filters.location.trim() !== '' ||
      filters.teachingFormats.length > 0 ||
      filters.languages.length > 0 ||
      filters.rating > 0 ||
      filters.experienceYears > 0 ||
      filters.verified
    );
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col gap-4">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Advanced Search</h1>
                <p className="text-gray-600 mt-2">
                  Find the perfect tutor with detailed search and filtering options
                </p>
              </div>
              
              <div className="flex items-center gap-3">
                <Button
                  onClick={() => setShowFilters(!showFilters)}
                  variant="outline"
                  className="lg:hidden"
                >
                  {showFilters ? 'Hide' : 'Show'} Filters
                  <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707v4.586a1 1 0 01-.293.707l-2 2A1 1 0 0111 21v-6.586a1 1 0 00-.293-.707L4.293 7.293A1 1 0 014 6.586V4z" />
                  </svg>
                </Button>
                
                {hasActiveFilters() && (
                  <Button
                    onClick={saveCurrentSearch}
                    variant="outline"
                    size="sm"
                  >
                    Save Search
                  </Button>
                )}
              </div>
            </div>

            {/* Search Bar */}
            <div className="relative max-w-2xl">
              <Input
                type="text"
                placeholder="Search for tutors, subjects, skills..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSearch(searchQuery)}
                className="pr-12 text-lg py-3"
              />
              <Button
                onClick={() => handleSearch(searchQuery)}
                className="absolute right-2 top-1/2 -translate-y-1/2 h-8 w-8 p-0"
                size="sm"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
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
            <div className="sticky top-8 space-y-6">
              <FilterSidebar
                filters={filters}
                onFiltersChange={handleFiltersChange}
                onApplyFilters={handleApplyFilters}
                onResetFilters={handleResetFilters}
              />

              {/* Saved Searches */}
              {savedSearches.length > 0 && (
                <Card>
                  <CardHeader>
                    <h3 className="font-medium text-gray-900">Saved Searches</h3>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    {savedSearches.map((search) => (
                      <div
                        key={search.id}
                        className="flex items-center justify-between p-2 hover:bg-gray-50 rounded group"
                      >
                        <button
                          onClick={() => loadSavedSearch(search)}
                          className="flex-1 text-left text-sm text-gray-700 hover:text-gray-900 truncate"
                          title={search.name}
                        >
                          {search.name}
                        </button>
                        <button
                          onClick={() => deleteSavedSearch(search.id)}
                          className="opacity-0 group-hover:opacity-100 text-gray-400 hover:text-red-500 transition-opacity"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                          </svg>
                        </button>
                      </div>
                    ))}
                  </CardContent>
                </Card>
              )}
            </div>
          </div>

          {/* Main Content */}
          <div className="flex-1 min-w-0">
            {/* Search Results Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6">
              <div className="mb-4 sm:mb-0">
                {data && (
                  <p className="text-gray-600">
                    {data.pagination.totalCount > 0 ? (
                      <>
                        Showing {((data.pagination.page - 1) * data.pagination.limit) + 1} to{' '}
                        {Math.min(data.pagination.page * data.pagination.limit, data.pagination.totalCount)} of{' '}
                        {data.pagination.totalCount} results
                        {searchQuery && (
                          <span className="font-medium"> for "{searchQuery}"</span>
                        )}
                      </>
                    ) : (
                      <>
                        No results found
                        {searchQuery && (
                          <span className="font-medium"> for "{searchQuery}"</span>
                        )}
                      </>
                    )}
                  </p>
                )}
              </div>

              {/* Sort Options */}
              <div className="flex items-center gap-4">
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
            </div>

            {/* Active Filters Display */}
            {hasActiveFilters() && (
              <Card className="mb-6">
                <CardContent className="py-4">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-sm font-medium text-gray-700">Active filters:</span>
                    {filters.subjects.map((subject) => (
                      <span key={subject} className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-blue-100 text-blue-800">
                        {subject}
                        <button
                          onClick={() => handleFiltersChange({
                            subjects: filters.subjects.filter(s => s !== subject)
                          })}
                          className="ml-1 hover:text-blue-600"
                        >
                          ×
                        </button>
                      </span>
                    ))}
                    {(filters.priceRange[0] > 0 || filters.priceRange[1] < 1000) && (
                      <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-green-100 text-green-800">
                        €{filters.priceRange[0]} - €{filters.priceRange[1]}
                        <button
                          onClick={() => handleFiltersChange({ priceRange: [0, 1000] })}
                          className="ml-1 hover:text-green-600"
                        >
                          ×
                        </button>
                      </span>
                    )}
                    {filters.location && (
                      <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-purple-100 text-purple-800">
                        {filters.location}
                        <button
                          onClick={() => handleFiltersChange({ location: '' })}
                          className="ml-1 hover:text-purple-600"
                        >
                          ×
                        </button>
                      </span>
                    )}
                    <Button
                      onClick={handleResetFilters}
                      variant="outline"
                      size="sm"
                      className="text-xs"
                    >
                      Clear all
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Tutors Grid */}
            <TutorGrid
              tutors={data?.tutors || []}
              loading={loading}
              error={error || undefined}
              onFavoriteToggle={handleFavoriteToggle}
              favorites={favorites}
              pagination={data?.pagination}
              onPageChange={handlePageChange}
              emptyStateTitle={searchQuery ? "No tutors found for your search" : "Start your search"}
              emptyStateDescription={
                searchQuery 
                  ? "Try adjusting your search terms or filters to find more tutors."
                  : "Enter a search term or apply filters to find tutors that match your needs."
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