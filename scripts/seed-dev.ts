#!/usr/bin/env tsx

/**
 * Development Seeding Script for GoCours
 * 
 * This script provides advanced database seeding capabilities for development:
 * - Complete database reset
 * - Detailed logging with progress indicators
 * - Error handling and recovery
 * - Performance monitoring
 * - Interactive confirmation for destructive operations
 */

import { PrismaClient } from '@prisma/client';
import * as readline from 'readline';

const prisma = new PrismaClient({
  log: ['query', 'info', 'warn', 'error'],
});

// Color codes for better console output
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m',
};

function colorLog(color: keyof typeof colors, message: string) {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

function createProgressBar(current: number, total: number, width: number = 30): string {
  const percentage = Math.round((current / total) * 100);
  const filledWidth = Math.round((current / total) * width);
  const emptyWidth = width - filledWidth;
  
  const filled = '█'.repeat(filledWidth);
  const empty = '░'.repeat(emptyWidth);
  
  return `[${filled}${empty}] ${percentage}% (${current}/${total})`;
}

async function askForConfirmation(question: string): Promise<boolean> {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  return new Promise((resolve) => {
    rl.question(`${colors.yellow}${question} (y/N): ${colors.reset}`, (answer) => {
      rl.close();
      resolve(answer.toLowerCase() === 'y' || answer.toLowerCase() === 'yes');
    });
  });
}

async function checkDatabaseConnection(): Promise<void> {
  try {
    colorLog('cyan', '🔍 Checking database connection...');
    await prisma.$connect();
    colorLog('green', '✅ Database connection successful');
  } catch (error) {
    colorLog('red', '❌ Database connection failed');
    console.error(error);
    throw new Error('Cannot connect to database');
  }
}

async function getDatabaseStats(): Promise<Record<string, number>> {
  const [
    subjects,
    users,
    tutors,
    students,
    reviews,
    bookings,
    favorites,
    availability,
  ] = await Promise.all([
    prisma.subject.count(),
    prisma.userProfile.count(),
    prisma.tutorProfile.count(),
    prisma.studentProfile.count(),
    prisma.review.count(),
    prisma.booking.count(),
    prisma.favorite.count(),
    prisma.availabilitySlot.count(),
  ]);

  return {
    subjects,
    users,
    tutors,
    students,
    reviews,
    bookings,
    favorites,
    availability,
  };
}

async function displayCurrentStats(): Promise<void> {
  colorLog('cyan', '📊 Current Database Statistics:');
  try {
    const stats = await getDatabaseStats();
    
    console.log(`   📚 Subjects: ${stats.subjects}`);
    console.log(`   👥 Users: ${stats.users}`);
    console.log(`   👨‍🏫 Tutors: ${stats.tutors}`);
    console.log(`   🎓 Students: ${stats.students}`);
    console.log(`   ⭐ Reviews: ${stats.reviews}`);
    console.log(`   📅 Bookings: ${stats.bookings}`);
    console.log(`   ❤️ Favorites: ${stats.favorites}`);
    console.log(`   🕒 Availability Slots: ${stats.availability}`);
    
    const total = Object.values(stats).reduce((sum, count) => sum + count, 0);
    console.log(`   📈 Total Records: ${total}`);
  } catch (error) {
    colorLog('red', '❌ Failed to get database statistics');
    console.error(error);
  }
}

async function resetDatabase(): Promise<void> {
  colorLog('yellow', '🗑️  Resetting database...');
  
  const resetOperations = [
    { name: 'Availability Slots', fn: () => prisma.availabilitySlot.deleteMany() },
    { name: 'Favorites', fn: () => prisma.favorite.deleteMany() },
    { name: 'Bookings', fn: () => prisma.booking.deleteMany() },
    { name: 'Reviews', fn: () => prisma.review.deleteMany() },
    { name: 'Tutor Profiles', fn: () => prisma.tutorProfile.deleteMany() },
    { name: 'Student Profiles', fn: () => prisma.studentProfile.deleteMany() },
    { name: 'User Profiles', fn: () => prisma.userProfile.deleteMany() },
    { name: 'Subjects', fn: () => prisma.subject.deleteMany() },
  ];

  for (let i = 0; i < resetOperations.length; i++) {
    const operation = resetOperations[i];
    try {
      const result = await operation.fn();
      const progressBar = createProgressBar(i + 1, resetOperations.length);
      colorLog('green', `✅ ${operation.name} cleared (${result.count} records) ${progressBar}`);
    } catch (error) {
      colorLog('red', `❌ Failed to clear ${operation.name}`);
      console.error(error);
      throw error;
    }
  }
  
  colorLog('green', '✅ Database reset completed');
}

async function runSeedScript(): Promise<void> {
  colorLog('cyan', '🌱 Running seed script...');
  
  try {
    // Import and run the main seed function
    const { execSync } = require('child_process');
    const result = execSync('tsx prisma/seed.ts', { 
      stdio: 'inherit',
      cwd: process.cwd()
    });
    
    colorLog('green', '✅ Seed script completed successfully');
  } catch (error) {
    colorLog('red', '❌ Seed script failed');
    console.error(error);
    throw error;
  }
}

async function validateSeededData(): Promise<void> {
  colorLog('cyan', '🔍 Validating seeded data...');
  
  const checks = [
    {
      name: 'Subjects exist',
      check: async () => (await prisma.subject.count()) > 0,
    },
    {
      name: 'Tutors have subjects',
      check: async () => {
        const tutorWithSubjects = await prisma.tutorProfile.findFirst({
          include: { subjects: true },
        });
        return tutorWithSubjects?.subjects.length > 0;
      },
    },
    {
      name: 'Reviews have ratings',
      check: async () => {
        const review = await prisma.review.findFirst();
        return review && review.rating >= 1 && review.rating <= 5;
      },
    },
    {
      name: 'Tutors have ratings calculated',
      check: async () => {
        const tutor = await prisma.tutorProfile.findFirst({
          where: { reviewCount: { gt: 0 } },
        });
        return tutor && tutor.averageRating > 0;
      },
    },
    {
      name: 'Bookings have valid amounts',
      check: async () => {
        const booking = await prisma.booking.findFirst();
        return booking && booking.totalAmount > 0;
      },
    },
  ];

  for (let i = 0; i < checks.length; i++) {
    const checkItem = checks[i];
    try {
      const isValid = await checkItem.check();
      const progressBar = createProgressBar(i + 1, checks.length);
      
      if (isValid) {
        colorLog('green', `✅ ${checkItem.name} ${progressBar}`);
      } else {
        colorLog('red', `❌ ${checkItem.name} ${progressBar}`);
      }
    } catch (error) {
      colorLog('red', `❌ Error checking ${checkItem.name}: ${error.message}`);
    }
  }
  
  colorLog('green', '✅ Data validation completed');
}

async function showCompletion(): Promise<void> {
  console.log('\n' + '='.repeat(60));
  colorLog('green', '🎉 Development Database Seeding Complete!');
  console.log('='.repeat(60));
  
  colorLog('cyan', '\n📋 What you can do now:');
  console.log('   • Start your development server: npm run dev');
  console.log('   • Browse tutors at: http://localhost:3000/tutors');
  console.log('   • Check the dashboard at: http://localhost:3000/dashboard');
  console.log('   • Explore subjects at: http://localhost:3000/search');
  
  colorLog('cyan', '\n🛠️  Development Commands:');
  console.log('   • Reset & reseed: npm run db:reset');
  console.log('   • Seed only: npm run db:seed');
  console.log('   • Open Prisma Studio: npx prisma studio');
  
  colorLog('cyan', '\n📊 Final Statistics:');
  await displayCurrentStats();
}

async function main(): Promise<void> {
  const startTime = Date.now();
  
  try {
    colorLog('bright', '\n🚀 GoCours Development Database Seeder');
    console.log('='.repeat(50));
    
    // Check database connection
    await checkDatabaseConnection();
    
    // Show current state
    colorLog('cyan', '\n📊 Current Database State:');
    await displayCurrentStats();
    
    // Ask for confirmation if database has data
    const stats = await getDatabaseStats();
    const hasData = Object.values(stats).some(count => count > 0);
    
    if (hasData) {
      const shouldProceed = await askForConfirmation(
        '\n⚠️  Database contains data. This will delete all existing records. Continue?'
      );
      
      if (!shouldProceed) {
        colorLog('yellow', '❌ Operation cancelled by user');
        return;
      }
    }
    
    // Reset database
    await resetDatabase();
    
    // Run seeding
    await runSeedScript();
    
    // Validate data
    await validateSeededData();
    
    // Show completion info
    await showCompletion();
    
    const endTime = Date.now();
    const duration = ((endTime - startTime) / 1000).toFixed(2);
    colorLog('green', `\n⏱️  Total execution time: ${duration}s`);
    
  } catch (error) {
    colorLog('red', '\n❌ Seeding failed!');
    console.error(error);
    process.exit(1);
  }
}

// Handle graceful shutdown
process.on('SIGINT', async () => {
  colorLog('yellow', '\n⚠️  Received interrupt signal. Cleaning up...');
  await prisma.$disconnect();
  process.exit(0);
});

process.on('SIGTERM', async () => {
  colorLog('yellow', '\n⚠️  Received termination signal. Cleaning up...');
  await prisma.$disconnect();
  process.exit(0);
});

// Run the main function
main()
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });