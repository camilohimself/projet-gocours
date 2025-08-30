"use client";

import React from 'react';
import { Subject, AllSubjects, AllTeachingFormats, AllLanguages } from '@/src/types';
import { Button } from '@/src/components/ui/button';
import { Input } from '@/src/components/ui/input';
import { Label } from '@/src/components/ui/label';
import { Select } from '@/src/components/ui/select';
import { Card, CardContent, CardHeader } from '@/src/components/ui/card';

export interface FilterState {
  subjects: Subject[];
  priceRange: [number, number];
  location: string;
  teachingFormats: string[];
  languages: string[];
  rating: number;
  experienceYears: number;
  verified: boolean;
  availability?: {
    day: string;
    time: string;
  };
}

interface FilterSidebarProps {
  filters: FilterState;
  onFiltersChange: (filters: Partial<FilterState>) => void;
  onApplyFilters: () => void;
  onResetFilters: () => void;
  availableLocations?: string[];
  className?: string;
}

export function FilterSidebar({
  filters,
  onFiltersChange,
  onApplyFilters,
  onResetFilters,
  availableLocations = [],
  className = ""
}: FilterSidebarProps) {
  const handleSubjectToggle = (subject: Subject) => {
    const newSubjects = filters.subjects.includes(subject)
      ? filters.subjects.filter(s => s !== subject)
      : [...filters.subjects, subject];
    onFiltersChange({ subjects: newSubjects });
  };

  const handleFormatToggle = (format: string) => {
    const newFormats = filters.teachingFormats.includes(format)
      ? filters.teachingFormats.filter(f => f !== format)
      : [...filters.teachingFormats, format];
    onFiltersChange({ teachingFormats: newFormats });
  };

  const handleLanguageToggle = (language: string) => {
    const newLanguages = filters.languages.includes(language)
      ? filters.languages.filter(l => l !== language)
      : [...filters.languages, language];
    onFiltersChange({ languages: newLanguages });
  };

  const handlePriceRangeChange = (index: number, value: string) => {
    const newRange: [number, number] = [...filters.priceRange];
    newRange[index] = parseFloat(value) || 0;
    onFiltersChange({ priceRange: newRange });
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
    <div className={`space-y-6 ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-900">Filters</h3>
        {hasActiveFilters() && (
          <Button
            variant="outline"
            size="sm"
            onClick={onResetFilters}
            className="text-sm"
          >
            Reset
          </Button>
        )}
      </div>

      {/* Subjects Filter */}
      <Card>
        <CardHeader className="pb-3">
          <h4 className="font-medium text-gray-900">Subjects</h4>
        </CardHeader>
        <CardContent className="space-y-2">
          <div className="max-h-48 overflow-y-auto space-y-2">
            {AllSubjects.map((subject) => (
              <label
                key={subject}
                className="flex items-center space-x-2 cursor-pointer hover:bg-gray-50 p-1 rounded"
              >
                <input
                  type="checkbox"
                  checked={filters.subjects.includes(subject)}
                  onChange={() => handleSubjectToggle(subject)}
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <span className="text-sm text-gray-700">{subject}</span>
              </label>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Price Range Filter */}
      <Card>
        <CardHeader className="pb-3">
          <h4 className="font-medium text-gray-900">Price Range (€/hour)</h4>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex items-center space-x-2">
            <div className="flex-1">
              <Label htmlFor="minPrice" className="text-xs text-gray-600">
                Min
              </Label>
              <Input
                id="minPrice"
                type="number"
                min="0"
                value={filters.priceRange[0]}
                onChange={(e) => handlePriceRangeChange(0, e.target.value)}
                className="mt-1"
                placeholder="0"
              />
            </div>
            <div className="flex-1">
              <Label htmlFor="maxPrice" className="text-xs text-gray-600">
                Max
              </Label>
              <Input
                id="maxPrice"
                type="number"
                min="0"
                value={filters.priceRange[1]}
                onChange={(e) => handlePriceRangeChange(1, e.target.value)}
                className="mt-1"
                placeholder="1000"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Location Filter */}
      <Card>
        <CardHeader className="pb-3">
          <h4 className="font-medium text-gray-900">Location</h4>
        </CardHeader>
        <CardContent>
          <Input
            type="text"
            value={filters.location}
            onChange={(e) => onFiltersChange({ location: e.target.value })}
            placeholder="Enter city name..."
            className="w-full"
          />
          {availableLocations.length > 0 && (
            <div className="mt-2 max-h-32 overflow-y-auto">
              {availableLocations
                .filter(location => 
                  location.toLowerCase().includes(filters.location.toLowerCase())
                )
                .slice(0, 5)
                .map((location, index) => (
                  <button
                    key={index}
                    onClick={() => onFiltersChange({ location })}
                    className="block w-full text-left text-sm text-gray-600 hover:bg-gray-50 p-1 rounded"
                  >
                    {location}
                  </button>
                ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Teaching Format Filter */}
      <Card>
        <CardHeader className="pb-3">
          <h4 className="font-medium text-gray-900">Teaching Format</h4>
        </CardHeader>
        <CardContent className="space-y-2">
          {AllTeachingFormats.map((format) => (
            <label
              key={format}
              className="flex items-center space-x-2 cursor-pointer hover:bg-gray-50 p-1 rounded"
            >
              <input
                type="checkbox"
                checked={filters.teachingFormats.includes(format)}
                onChange={() => handleFormatToggle(format)}
                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <span className="text-sm text-gray-700">{format}</span>
            </label>
          ))}
        </CardContent>
      </Card>

      {/* Languages Filter */}
      <Card>
        <CardHeader className="pb-3">
          <h4 className="font-medium text-gray-900">Languages</h4>
        </CardHeader>
        <CardContent className="space-y-2">
          <div className="max-h-32 overflow-y-auto space-y-2">
            {AllLanguages.map((language) => (
              <label
                key={language}
                className="flex items-center space-x-2 cursor-pointer hover:bg-gray-50 p-1 rounded"
              >
                <input
                  type="checkbox"
                  checked={filters.languages.includes(language)}
                  onChange={() => handleLanguageToggle(language)}
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <span className="text-sm text-gray-700">{language}</span>
              </label>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Rating Filter */}
      <Card>
        <CardHeader className="pb-3">
          <h4 className="font-medium text-gray-900">Minimum Rating</h4>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {[4, 3, 2, 1].map((rating) => (
              <label
                key={rating}
                className="flex items-center space-x-2 cursor-pointer hover:bg-gray-50 p-1 rounded"
              >
                <input
                  type="radio"
                  name="rating"
                  checked={filters.rating === rating}
                  onChange={() => onFiltersChange({ rating })}
                  className="text-blue-600 focus:ring-blue-500"
                />
                <div className="flex items-center">
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
                  <span className="text-sm text-gray-600 ml-1">& up</span>
                </div>
              </label>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Experience Filter */}
      <Card>
        <CardHeader className="pb-3">
          <h4 className="font-medium text-gray-900">Experience</h4>
        </CardHeader>
        <CardContent>
          <Select
            value={filters.experienceYears.toString()}
            onValueChange={(value) => onFiltersChange({ experienceYears: parseInt(value) })}
          >
            <option value="0">Any experience</option>
            <option value="1">1+ years</option>
            <option value="2">2+ years</option>
            <option value="5">5+ years</option>
            <option value="10">10+ years</option>
          </Select>
        </CardContent>
      </Card>

      {/* Verified Filter */}
      <Card>
        <CardContent className="pt-6">
          <label className="flex items-center space-x-2 cursor-pointer">
            <input
              type="checkbox"
              checked={filters.verified}
              onChange={(e) => onFiltersChange({ verified: e.target.checked })}
              className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            />
            <span className="text-sm text-gray-700">Verified tutors only</span>
          </label>
        </CardContent>
      </Card>

      {/* Apply Filters Button */}
      <Button
        onClick={onApplyFilters}
        className="w-full"
        disabled={!hasActiveFilters()}
      >
        Apply Filters
        {hasActiveFilters() && (
          <span className="ml-2 bg-white text-blue-600 text-xs px-2 py-1 rounded-full">
            {filters.subjects.length + 
             filters.teachingFormats.length + 
             filters.languages.length + 
             (filters.priceRange[0] > 0 || filters.priceRange[1] < 1000 ? 1 : 0) +
             (filters.location ? 1 : 0) +
             (filters.rating > 0 ? 1 : 0) +
             (filters.experienceYears > 0 ? 1 : 0) +
             (filters.verified ? 1 : 0)}
          </span>
        )}
      </Button>
    </div>
  );
}