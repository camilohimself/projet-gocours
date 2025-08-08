# GoCours Tutors Components & Pages

This document describes the tutors-related components and pages created for the GoCours unified project.

## 🏗️ Architecture

### Components Structure
```
src/components/tutors/
├── TutorCard.tsx          # Individual tutor display card
├── TutorGrid.tsx          # Grid layout with pagination
├── FilterSidebar.tsx      # Advanced search filters
├── ReviewsList.tsx        # Reviews display component
└── index.ts              # Exports barrel file
```

### Pages Structure
```
app/
├── tutors/
│   ├── page.tsx          # Main tutors listing page
│   └── [id]/
│       └── page.tsx      # Individual tutor profile page
└── search/
    └── page.tsx          # Advanced search page
```

## 📦 Components

### TutorCard
**Purpose**: Display individual tutor information in a card format

**Features**:
- Tutor photo, name, headline, and bio
- Star rating and review count
- Subject badges
- Price display
- Favorite toggle
- Book session button
- Verified status indicator
- Experience and response time

**Props**:
- `tutor`: TutorProfile with extended user and subjects data
- `onFavoriteToggle`: Function to handle favorite state changes
- `isFavorite`: Boolean favorite status
- `showBookButton`: Toggle booking button visibility

### TutorGrid
**Purpose**: Display multiple tutors in a responsive grid with pagination

**Features**:
- Responsive grid layout (1-5 columns based on screen size)
- Loading skeleton states
- Error handling
- Empty state with customizable messages
- Pagination controls
- Results count display

**Props**:
- `tutors`: Array of tutor profiles
- `loading`: Loading state
- `error`: Error message
- `pagination`: Pagination metadata
- `onPageChange`: Page change handler
- `onFavoriteToggle`: Favorite toggle handler
- `favorites`: Set of favorited tutor IDs

### FilterSidebar
**Purpose**: Advanced filtering interface for tutor search

**Features**:
- Subject selection (checkboxes)
- Price range slider
- Location autocomplete
- Teaching format selection
- Language selection
- Rating filter
- Experience filter
- Verified tutors only option
- Active filter display with count
- Reset filters functionality

**Props**:
- `filters`: Current filter state
- `onFiltersChange`: Filter update handler
- `onApplyFilters`: Apply filters handler
- `onResetFilters`: Reset filters handler
- `availableLocations`: Array of location suggestions

### ReviewsList
**Purpose**: Display and manage tutor reviews

**Features**:
- Star rating display
- Review text with expand/collapse for long reviews
- Author information and photos
- Review dates
- Load more functionality
- Pagination support
- Empty and loading states

**Props**:
- `reviews`: Array of review objects
- `loading`: Loading state
- `showPagination`: Enable pagination vs load more
- `onLoadMore`: Load more handler
- `hasMore`: Whether more reviews are available
- `totalCount`: Total review count

## 📄 Pages

### /app/tutors/page.tsx
**Purpose**: Main tutors listing and search page

**Features**:
- Search bar with instant search
- Filter sidebar (mobile responsive)
- Sort options (rating, price, reviews, newest)
- Results pagination
- Favorite management
- URL parameter sync
- Loading and error states

**APIs Used**:
- `GET /api/search` - For tutor search and filtering

### /app/tutors/[id]/page.tsx
**Purpose**: Individual tutor profile page

**Features**:
- Complete tutor profile display
- Photo, bio, and qualifications
- Subject and teaching level badges
- Reviews section with load more
- Availability display
- Booking functionality (placeholder)
- Favorite toggle
- Related tutors suggestions

**APIs Used**:
- `GET /api/tutors/[id]` - For individual tutor data
- `GET /api/reviews` - For additional reviews

### /app/search/page.tsx
**Purpose**: Advanced search with enhanced filtering

**Features**:
- Advanced search form
- Saved searches functionality
- URL parameter persistence
- Filter state management
- Search result sorting
- Active filter indicators
- Search history (localStorage)

**APIs Used**:
- `POST /api/search` - For advanced search queries

## 🎨 Styling & UX

### Design System
- Uses existing UI components (Button, Card, Input, etc.)
- Consistent spacing and typography
- Responsive design patterns
- Loading skeleton animations
- Hover effects and transitions

### Key UX Features
- Persistent favorites (localStorage + API sync)
- Search state preservation in URL
- Mobile-responsive filter sidebar
- Smooth page transitions
- Progressive loading for reviews
- Empty state messaging

## 🔌 API Integration

### Required API Endpoints
All pages integrate with the existing API structure:

1. **GET /api/search** - Basic search with query parameters
2. **POST /api/search** - Advanced search with filters
3. **GET /api/tutors/[id]** - Individual tutor details
4. **GET /api/reviews** - Reviews with pagination
5. **POST /api/favorites** - Favorite management

### Data Flow
- Components use React hooks for state management
- API calls are made in useEffect and event handlers
- Loading and error states are properly handled
- Data is cached where appropriate (favorites, searches)

## 🚀 Usage Examples

### Basic Tutor Listing
```tsx
import { TutorGrid } from '@/src/components/tutors';

<TutorGrid
  tutors={tutors}
  loading={loading}
  onFavoriteToggle={handleFavoriteToggle}
  favorites={favorites}
  pagination={pagination}
  onPageChange={handlePageChange}
/>
```

### Search with Filters
```tsx
import { FilterSidebar } from '@/src/components/tutors';

<FilterSidebar
  filters={filters}
  onFiltersChange={setFilters}
  onApplyFilters={performSearch}
  onResetFilters={resetFilters}
  availableLocations={locations}
/>
```

## 🎯 Key Features Implemented

✅ **Search & Discovery**
- Text search across tutor names, headlines, and bios
- Advanced filtering by multiple criteria
- Sort by rating, price, reviews, date
- Location-based search

✅ **User Experience**
- Responsive design for all screen sizes
- Loading states and skeleton screens
- Error handling with retry options
- Persistent user preferences

✅ **Interactive Features**
- Favorite tutors (with localStorage backup)
- Save and load search preferences
- Pagination with smooth transitions
- Review expansion for long content

✅ **Performance**
- Optimized API calls with proper loading states
- Efficient re-rendering with React hooks
- Image optimization for tutor photos
- Lazy loading where appropriate

## 🔧 Technical Details

### State Management
- React hooks (useState, useEffect, useCallback)
- Local state for UI interactions
- URL parameters for search persistence
- localStorage for user preferences

### TypeScript Integration
- Strict typing for all props and data
- Extended interfaces for API responses
- Type-safe event handlers
- Proper error typing

### Performance Optimizations
- useCallback for expensive operations
- Proper dependency arrays in useEffect
- Debounced search input (can be added)
- Memoized expensive calculations

## 🎨 Styling Features

The components include custom CSS classes for:
- `.line-clamp-2`, `.line-clamp-3` - Text truncation
- `.tutor-card` - Card hover effects
- `.star-rating` - Animated star displays
- `.skeleton` - Loading animations
- `.availability-dot` - Status indicators
- Custom scrollbars for filter areas

## 📱 Mobile Responsiveness

- Collapsible filter sidebar on mobile
- Responsive grid layouts
- Touch-friendly interface elements
- Optimized spacing for small screens
- Readable typography at all sizes

---

This implementation provides a complete, production-ready tutors system that integrates seamlessly with the existing GoCours APIs and design system.