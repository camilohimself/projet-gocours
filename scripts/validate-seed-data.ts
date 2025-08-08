#!/usr/bin/env tsx

/**
 * Validation Script for GoCours Seed Data
 * 
 * This script validates the mock data structure and seed logic
 * without requiring a database connection.
 */

import {
  SUBJECTS_DATA,
  EUROPEAN_CITIES,
  TUTOR_PROFILES,
  STUDENT_PROFILES,
  REVIEW_TEMPLATES,
  AVAILABILITY_SLOTS,
  BOOKING_SUBJECTS,
  getRandomElement,
  getRandomElements,
  generateRandomDate,
} from '../src/lib/mock-data';

// Color codes for console output
const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  red: '\x1b[31m',
  cyan: '\x1b[36m',
};

function colorLog(color: keyof typeof colors, message: string) {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

function validateSubjects() {
  colorLog('cyan', '📚 Validating Subjects Data...');
  
  const categories = new Set();
  let validSubjects = 0;
  
  SUBJECTS_DATA.forEach((subject, index) => {
    if (!subject.name || !subject.category) {
      colorLog('red', `❌ Subject ${index}: Missing name or category`);
      return;
    }
    
    if (subject.name.length < 2) {
      colorLog('red', `❌ Subject ${index}: Name too short`);
      return;
    }
    
    categories.add(subject.category);
    validSubjects++;
  });
  
  colorLog('green', `✅ ${validSubjects}/${SUBJECTS_DATA.length} subjects valid`);
  colorLog('blue', `📊 Categories: ${Array.from(categories).join(', ')}`);
  
  return validSubjects === SUBJECTS_DATA.length;
}

function validateCities() {
  colorLog('cyan', '🌍 Validating Cities Data...');
  
  let validCities = 0;
  
  EUROPEAN_CITIES.forEach((city, index) => {
    if (!city.name || !city.country) {
      colorLog('red', `❌ City ${index}: Missing name or country`);
      return;
    }
    
    if (typeof city.lat !== 'number' || typeof city.lng !== 'number') {
      colorLog('red', `❌ City ${index}: Invalid coordinates`);
      return;
    }
    
    if (city.lat < -90 || city.lat > 90 || city.lng < -180 || city.lng > 180) {
      colorLog('red', `❌ City ${index}: Coordinates out of range`);
      return;
    }
    
    validCities++;
  });
  
  colorLog('green', `✅ ${validCities}/${EUROPEAN_CITIES.length} cities valid`);
  
  return validCities === EUROPEAN_CITIES.length;
}

function validateTutors() {
  colorLog('cyan', '👨‍🏫 Validating Tutor Profiles...');
  
  let validTutors = 0;
  const clerkIds = new Set();
  
  TUTOR_PROFILES.forEach((tutor, index) => {
    const errors: string[] = [];
    
    if (!tutor.clerkId || clerkIds.has(tutor.clerkId)) {
      errors.push('Invalid or duplicate clerkId');
    } else {
      clerkIds.add(tutor.clerkId);
    }
    
    if (!tutor.displayName || tutor.displayName.length < 2) {
      errors.push('Invalid displayName');
    }
    
    if (!tutor.email || !tutor.email.includes('@')) {
      errors.push('Invalid email');
    }
    
    if (!tutor.headline || tutor.headline.length < 10) {
      errors.push('Headline too short');
    }
    
    if (!tutor.bio || tutor.bio.length < 50) {
      errors.push('Bio too short');
    }
    
    if (!Array.isArray(tutor.teachingLevels) || tutor.teachingLevels.length === 0) {
      errors.push('Invalid teachingLevels');
    }
    
    if (!Array.isArray(tutor.subjects) || tutor.subjects.length === 0) {
      errors.push('Invalid subjects');
    }
    
    if (!Array.isArray(tutor.languages) || tutor.languages.length === 0) {
      errors.push('Invalid languages');
    }
    
    if (typeof tutor.hourlyRate !== 'number' || tutor.hourlyRate < 0) {
      errors.push('Invalid hourlyRate');
    }
    
    if (!Array.isArray(tutor.teachingFormats) || tutor.teachingFormats.length === 0) {
      errors.push('Invalid teachingFormats');
    }
    
    if (!tutor.city || !EUROPEAN_CITIES.find(c => c.name === tutor.city)) {
      errors.push('Invalid city');
    }
    
    if (typeof tutor.experienceYears !== 'number' || tutor.experienceYears < 0) {
      errors.push('Invalid experienceYears');
    }
    
    if (errors.length === 0) {
      validTutors++;
    } else {
      colorLog('red', `❌ Tutor ${index} (${tutor.displayName}): ${errors.join(', ')}`);
    }
  });
  
  colorLog('green', `✅ ${validTutors}/${TUTOR_PROFILES.length} tutors valid`);
  
  return validTutors === TUTOR_PROFILES.length;
}

function validateStudents() {
  colorLog('cyan', '🎓 Validating Student Profiles...');
  
  let validStudents = 0;
  const clerkIds = new Set();
  
  STUDENT_PROFILES.forEach((student, index) => {
    const errors: string[] = [];
    
    if (!student.clerkId || clerkIds.has(student.clerkId)) {
      errors.push('Invalid or duplicate clerkId');
    } else {
      clerkIds.add(student.clerkId);
    }
    
    if (!student.displayName || student.displayName.length < 2) {
      errors.push('Invalid displayName');
    }
    
    if (!student.email || !student.email.includes('@')) {
      errors.push('Invalid email');
    }
    
    if (typeof student.budget !== 'number' || student.budget < 0) {
      errors.push('Invalid budget');
    }
    
    if (errors.length === 0) {
      validStudents++;
    } else {
      colorLog('red', `❌ Student ${index} (${student.displayName}): ${errors.join(', ')}`);
    }
  });
  
  colorLog('green', `✅ ${validStudents}/${STUDENT_PROFILES.length} students valid`);
  
  return validStudents === STUDENT_PROFILES.length;
}

function validateReviewTemplates() {
  colorLog('cyan', '⭐ Validating Review Templates...');
  
  let validTemplates = 0;
  
  REVIEW_TEMPLATES.forEach((template, index) => {
    const errors: string[] = [];
    
    if (typeof template.rating !== 'number' || template.rating < 1 || template.rating > 5) {
      errors.push('Invalid rating');
    }
    
    if (!Array.isArray(template.comments) || template.comments.length === 0) {
      errors.push('Invalid comments array');
    } else {
      const invalidComments = template.comments.filter(comment => 
        typeof comment !== 'string' || comment.length < 10
      );
      if (invalidComments.length > 0) {
        errors.push(`${invalidComments.length} invalid comments`);
      }
    }
    
    if (errors.length === 0) {
      validTemplates++;
    } else {
      colorLog('red', `❌ Review Template ${index}: ${errors.join(', ')}`);
    }
  });
  
  colorLog('green', `✅ ${validTemplates}/${REVIEW_TEMPLATES.length} review templates valid`);
  
  return validTemplates === REVIEW_TEMPLATES.length;
}

function testHelperFunctions() {
  colorLog('cyan', '🔧 Testing Helper Functions...');
  
  const tests = [
    {
      name: 'getRandomElement',
      test: () => {
        const testArray = [1, 2, 3, 4, 5];
        const result = getRandomElement(testArray);
        return testArray.includes(result);
      }
    },
    {
      name: 'getRandomElements',
      test: () => {
        const testArray = [1, 2, 3, 4, 5];
        const result = getRandomElements(testArray, 3);
        return Array.isArray(result) && result.length === 3 && 
               result.every(item => testArray.includes(item));
      }
    },
    {
      name: 'generateRandomDate',
      test: () => {
        const result = generateRandomDate(30, 30);
        const now = new Date();
        const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
        const thirtyDaysAhead = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000);
        return result instanceof Date && result >= thirtyDaysAgo && result <= thirtyDaysAhead;
      }
    }
  ];
  
  let passedTests = 0;
  tests.forEach(test => {
    try {
      if (test.test()) {
        colorLog('green', `✅ ${test.name}: PASS`);
        passedTests++;
      } else {
        colorLog('red', `❌ ${test.name}: FAIL`);
      }
    } catch (error) {
      colorLog('red', `❌ ${test.name}: ERROR - ${error.message}`);
    }
  });
  
  return passedTests === tests.length;
}

function validateDataIntegrity() {
  colorLog('cyan', '🔍 Validating Data Integrity...');
  
  // Check that all tutor subjects exist in subjects data
  const subjectNames = new Set(SUBJECTS_DATA.map(s => s.name));
  const invalidTutorSubjects: string[] = [];
  
  TUTOR_PROFILES.forEach(tutor => {
    tutor.subjects.forEach(subject => {
      if (!subjectNames.has(subject)) {
        invalidTutorSubjects.push(`${tutor.displayName}: ${subject}`);
      }
    });
  });
  
  if (invalidTutorSubjects.length > 0) {
    colorLog('red', `❌ Invalid tutor subjects found:`);
    invalidTutorSubjects.forEach(error => console.log(`   • ${error}`));
    return false;
  }
  
  // Check that all tutor cities exist in cities data
  const cityNames = new Set(EUROPEAN_CITIES.map(c => c.name));
  const invalidTutorCities = TUTOR_PROFILES.filter(tutor => 
    !cityNames.has(tutor.city)
  );
  
  if (invalidTutorCities.length > 0) {
    colorLog('red', `❌ Invalid tutor cities found:`);
    invalidTutorCities.forEach(tutor => 
      console.log(`   • ${tutor.displayName}: ${tutor.city}`)
    );
    return false;
  }
  
  // Check that booking subjects exist
  const invalidBookingSubjects = BOOKING_SUBJECTS.filter(subject => 
    !subjectNames.has(subject)
  );
  
  if (invalidBookingSubjects.length > 0) {
    colorLog('red', `❌ Invalid booking subjects found:`);
    invalidBookingSubjects.forEach(subject => console.log(`   • ${subject}`));
    return false;
  }
  
  colorLog('green', '✅ Data integrity validation passed');
  return true;
}

function generateSampleData() {
  colorLog('cyan', '🎲 Generating Sample Data Preview...');
  
  console.log('\nSample Generated Data:');
  console.log('━'.repeat(50));
  
  // Sample tutor with subjects
  const sampleTutor = getRandomElement(TUTOR_PROFILES);
  console.log(`🧑‍🏫 Sample Tutor: ${sampleTutor.displayName}`);
  console.log(`   📍 Location: ${sampleTutor.city}`);
  console.log(`   📚 Subjects: ${sampleTutor.subjects.join(', ')}`);
  console.log(`   💰 Rate: €${sampleTutor.hourlyRate}/hour`);
  
  // Sample review
  const sampleReview = getRandomElement(REVIEW_TEMPLATES);
  console.log(`\n⭐ Sample Review (${sampleReview.rating} stars):`);
  console.log(`   "${getRandomElement(sampleReview.comments)}"`);
  
  // Sample availability
  const sampleAvailability = getRandomElements(AVAILABILITY_SLOTS, 3);
  console.log(`\n🕒 Sample Availability:`);
  sampleAvailability.forEach(slot => 
    console.log(`   • ${slot.dayOfWeek} ${slot.timeSlot}`)
  );
  
  // Sample date range
  const sampleDate = generateRandomDate(30, 30);
  console.log(`\n📅 Sample Random Date: ${sampleDate.toISOString().split('T')[0]}`);
}

function main() {
  console.log('\n🔍 GoCours Seed Data Validation');
  console.log('═'.repeat(50));
  
  const validations = [
    { name: 'Subjects', fn: validateSubjects },
    { name: 'Cities', fn: validateCities },
    { name: 'Tutors', fn: validateTutors },
    { name: 'Students', fn: validateStudents },
    { name: 'Review Templates', fn: validateReviewTemplates },
    { name: 'Helper Functions', fn: testHelperFunctions },
    { name: 'Data Integrity', fn: validateDataIntegrity },
  ];
  
  let passedValidations = 0;
  
  validations.forEach(validation => {
    console.log('\n' + '─'.repeat(30));
    try {
      if (validation.fn()) {
        passedValidations++;
      }
    } catch (error) {
      colorLog('red', `❌ ${validation.name} validation failed: ${error.message}`);
    }
  });
  
  console.log('\n' + '═'.repeat(50));
  
  if (passedValidations === validations.length) {
    colorLog('green', `🎉 All validations passed! (${passedValidations}/${validations.length})`);
    colorLog('blue', '✅ Seed data is ready for database seeding');
    
    generateSampleData();
    
    console.log('\n📋 Next Steps:');
    console.log('   1. Ensure your database is running and accessible');
    console.log('   2. Run: npm run db:seed');
    console.log('   3. Or run: npm run db:reset (for full reset + seed)');
    
  } else {
    colorLog('red', `❌ ${validations.length - passedValidations} validation(s) failed`);
    colorLog('yellow', '⚠️  Please fix the issues before seeding the database');
    process.exit(1);
  }
}

main();