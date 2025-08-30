# GoCours Database Seeding System

This document describes the comprehensive database seeding system for the GoCours tutoring platform.

## Overview

The seeding system provides realistic demo data to make the GoCours platform fully testable and presentable. It includes:

- 🏫 **27 Subject areas** across 8 categories
- 👨‍🏫 **12 Detailed tutor profiles** with realistic bios and qualifications
- 🎓 **5 Student profiles** with learning goals
- ⭐ **50+ Reviews** with authentic comments and ratings
- 📅 **Bookings** with various statuses (past and future)
- 🕒 **Availability slots** for all tutors
- ❤️ **Favorite relationships** between students and tutors
- 🌍 **European locations** (Paris, London, Berlin, Madrid, etc.)

## File Structure

```
├── src/lib/mock-data.ts          # All mock data definitions
├── prisma/seed.ts                # Main seeding script
├── scripts/
│   ├── seed-dev.ts              # Advanced development seeding with reset
│   └── validate-seed-data.ts    # Data validation without DB connection
└── SEEDING.md                   # This documentation
```

## Available Commands

### Basic Seeding
```bash
# Seed the database with demo data
npm run db:seed

# Validate seed data structure (no DB required)
npm run db:validate

# Generate Prisma client
npm run db:generate
```

### Development Commands
```bash
# Full reset + seed with interactive prompts
npm run db:reset

# Open Prisma Studio to view data
npm run db:studio

# Run migrations
npm run db:migrate

# Push schema changes to DB
npm run db:push
```

## Seed Data Details

### Subjects (27 total)
- **Mathematics**: Algebra, Geometry, Calculus, Statistics
- **Sciences**: Physics, Chemistry, Biology, Earth Science
- **Languages**: English, French, Spanish, German, Italian
- **Computer Science**: Programming, Web Development, Data Science, Database Design
- **History**: World History, European History
- **Social Sciences**: Psychology, Economics
- **Arts**: Music Theory, Art History, Creative Writing
- **Test Preparation**: SAT Prep, TOEFL Prep, GMAT Prep

### Tutor Profiles (12 total)
Each tutor includes:
- Realistic name, photo, and bio (150+ words)
- Professional qualifications and experience
- Subject specializations (2-3 subjects each)
- Hourly rates (€35-65)
- Teaching levels and formats
- European city locations
- Response times and availability
- Years of experience (4-15 years)

**Sample Tutors:**
- Dr. Marie Dubois (Mathematics, Paris)
- James Thompson (Physics, London)  
- Sofia Rodriguez (Languages, Madrid)
- Dr. Hans Mueller (Chemistry, Berlin)
- Emma Johnson (Programming, Amsterdam)
- Alessandro Rossi (Art History, Rome)

### Reviews System
- **4 Rating tiers**: 5.0, 4.5, 4.0, 3.5 stars
- **20+ Unique comments** per rating level
- Realistic distribution (mostly positive)
- Automated tutor rating calculations
- Review dates spanning last 90 days

### Bookings & Availability
- **Mixed booking statuses**: Pending, Confirmed, Completed, Cancelled
- **Realistic scheduling**: Past and future sessions
- **Variable durations**: 60, 90, 120 minutes
- **Automatic pricing** calculation based on tutor rates
- **Session notes** for completed bookings
- **Availability slots**: Morning, Afternoon, Evening across weekdays/weekends

## Data Validation

The system includes comprehensive validation:

```bash
npm run db:validate
```

**Validates:**
- Subject data integrity
- Tutor profile completeness
- Student profile structure
- Review template validity
- Helper function correctness
- Cross-reference integrity
- European city coordinates

## Usage Examples

### Quick Setup for Development
```bash
# 1. Ensure database is running
# 2. Generate Prisma client
npm run db:generate

# 3. Seed the database
npm run db:seed

# 4. Start development server
npm run dev
```

### Reset Database for Clean Testing
```bash
# Interactive reset with progress tracking
npm run db:reset

# Manual steps:
# 1. Shows current database statistics
# 2. Asks for confirmation if data exists
# 3. Clears all tables in correct order
# 4. Seeds with fresh demo data
# 5. Validates seeded data
# 6. Shows completion statistics
```

### Data Validation Before Seeding
```bash
# Validate without database connection
npm run db:validate

# Sample output:
# ✅ 27/27 subjects valid
# ✅ 12/12 tutors valid  
# ✅ 5/5 students valid
# ✅ All data integrity checks passed
```

## Expected Database State After Seeding

| Table | Count | Description |
|-------|--------|-------------|
| subjects | 27 | Subject areas across 8 categories |
| user_profiles | 17 | 12 tutors + 5 students |
| tutor_profiles | 12 | Complete tutor information |
| student_profiles | 5 | Student learning preferences |
| reviews | 50-100 | Authentic reviews with ratings |
| bookings | ~50 | Mix of past/future sessions |
| favorites | 15-25 | Student-tutor favorite relationships |
| availability_slots | 60-120 | Tutor availability across week |

## Customization

### Adding More Data

1. **New Subjects**: Add to `SUBJECTS_DATA` array
2. **New Tutors**: Add to `TUTOR_PROFILES` array
3. **New Cities**: Add to `EUROPEAN_CITIES` array
4. **New Review Types**: Add to `REVIEW_TEMPLATES` array

### Modifying Generation Logic

The main seeding logic is in `prisma/seed.ts`. Key sections:
- Line 20-30: Data clearing
- Line 35-45: Subject creation
- Line 50-90: Tutor profile creation
- Line 95-130: Review generation
- Line 135-170: Booking creation

## Troubleshooting

### Database Connection Issues
```bash
# Check if database is accessible
npm run db:validate  # Should work without DB
npm run db:studio    # Should open if DB is accessible
```

### Validation Errors
```bash
# Run validation to see specific issues
npm run db:validate

# Common fixes:
# - Ensure all tutor subjects exist in SUBJECTS_DATA
# - Check tutor cities exist in EUROPEAN_CITIES
# - Verify all required fields are present
```

### Seeding Failures
```bash
# Check Prisma client is generated
npm run db:generate

# Try step-by-step:
npm run db:validate  # Should pass
npm run db:seed      # Should work if DB accessible
```

## Performance Notes

- **Seeding time**: ~10-30 seconds depending on database
- **Data size**: ~500KB of demo data
- **Memory usage**: Minimal (all operations are batched)
- **Network**: Efficient with Prisma batching

## Future Enhancements

Planned improvements:
- Support for different locales/languages
- Industry-specific tutor categories
- Seasonal availability patterns
- Advanced booking scenarios
- Integration with external APIs for photos
- Multi-language review comments
- Different pricing models per region

---

**Last Updated**: January 2025  
**Version**: 1.0.0  
**Maintainer**: GoCours Development Team