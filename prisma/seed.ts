import { PrismaClient } from '@prisma/client';
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

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting database seeding...');

  try {
    // Clear existing data
    console.log('🧹 Cleaning existing data...');
    await prisma.availabilitySlot.deleteMany();
    await prisma.favorite.deleteMany();
    await prisma.booking.deleteMany();
    await prisma.review.deleteMany();
    await prisma.tutorProfile.deleteMany();
    await prisma.studentProfile.deleteMany();
    await prisma.userProfile.deleteMany();
    await prisma.subject.deleteMany();

    console.log('✅ Existing data cleared');

    // Seed Subjects
    console.log('📚 Seeding subjects...');
    const createdSubjects = await Promise.all(
      SUBJECTS_DATA.map(subject =>
        prisma.subject.create({
          data: subject,
        })
      )
    );
    console.log(`✅ Created ${createdSubjects.length} subjects`);

    // Seed Tutor Profiles with UserProfiles
    console.log('👨‍🏫 Seeding tutors...');
    const createdTutors = [];
    
    for (const tutorData of TUTOR_PROFILES) {
      const city = EUROPEAN_CITIES.find(c => c.name === tutorData.city);
      
      // Create UserProfile first
      const userProfile = await prisma.userProfile.create({
        data: {
          clerkId: tutorData.clerkId,
          role: 'tutor',
          displayName: tutorData.displayName,
          email: tutorData.email,
          photoUrl: tutorData.photoUrl,
        },
      });

      // Get subjects for this tutor
      const tutorSubjects = createdSubjects.filter(subject =>
        tutorData.subjects.includes(subject.name)
      );

      // Create TutorProfile
      const tutorProfile = await prisma.tutorProfile.create({
        data: {
          userId: userProfile.id,
          headline: tutorData.headline,
          bio: tutorData.bio,
          teachingLevels: tutorData.teachingLevels,
          languages: tutorData.languages,
          hourlyRate: tutorData.hourlyRate,
          teachingFormats: tutorData.teachingFormats,
          locationCity: city?.name,
          locationLat: city?.lat,
          locationLng: city?.lng,
          responseTime: tutorData.responseTime,
          qualifications: tutorData.qualifications,
          experienceYears: tutorData.experienceYears,
          subjects: {
            connect: tutorSubjects.map(subject => ({ id: subject.id })),
          },
        },
      });

      createdTutors.push({ userProfile, tutorProfile });
    }
    console.log(`✅ Created ${createdTutors.length} tutors`);

    // Seed Student Profiles with UserProfiles
    console.log('🎓 Seeding students...');
    const createdStudents = [];
    
    for (const studentData of STUDENT_PROFILES) {
      // Create UserProfile first
      const userProfile = await prisma.userProfile.create({
        data: {
          clerkId: studentData.clerkId,
          role: 'student',
          displayName: studentData.displayName,
          email: studentData.email,
          photoUrl: studentData.photoUrl,
        },
      });

      // Create StudentProfile
      const studentProfile = await prisma.studentProfile.create({
        data: {
          userId: userProfile.id,
          learningGoals: studentData.learningGoals,
          preferredLevel: studentData.preferredLevel,
          budget: studentData.budget,
        },
      });

      createdStudents.push({ userProfile, studentProfile });
    }
    console.log(`✅ Created ${createdStudents.length} students`);

    // Seed Availability Slots
    console.log('🕒 Seeding availability slots...');
    let availabilityCount = 0;
    
    for (const { tutorProfile } of createdTutors) {
      // Each tutor gets 5-10 random availability slots
      const numSlots = Math.floor(Math.random() * 6) + 5; // 5-10 slots
      const randomSlots = getRandomElements(AVAILABILITY_SLOTS, numSlots);
      
      for (const slot of randomSlots) {
        await prisma.availabilitySlot.create({
          data: {
            tutorId: tutorProfile.id,
            dayOfWeek: slot.dayOfWeek,
            timeSlot: slot.timeSlot,
            isActive: Math.random() > 0.1, // 90% chance of being active
          },
        });
        availabilityCount++;
      }
    }
    console.log(`✅ Created ${availabilityCount} availability slots`);

    // Seed Reviews
    console.log('⭐ Seeding reviews...');
    let reviewCount = 0;
    
    for (const { tutorProfile } of createdTutors) {
      // Each tutor gets 3-8 reviews
      const numReviews = Math.floor(Math.random() * 6) + 3; // 3-8 reviews
      
      for (let i = 0; i < numReviews; i++) {
        const randomStudent = getRandomElement(createdStudents);
        const reviewTemplate = getRandomElement(REVIEW_TEMPLATES);
        const comment = getRandomElement(reviewTemplate.comments);
        
        // Add some rating variation
        const ratingVariation = (Math.random() - 0.5) * 0.5; // -0.25 to +0.25
        const finalRating = Math.max(1.0, Math.min(5.0, reviewTemplate.rating + ratingVariation));
        
        await prisma.review.create({
          data: {
            rating: Math.round(finalRating * 2) / 2, // Round to nearest 0.5
            comment,
            authorId: randomStudent.userProfile.id,
            recipientId: tutorProfile.userId,
            tutorId: tutorProfile.id,
            createdAt: generateRandomDate(90, 0), // Reviews from last 90 days
          },
        });
        reviewCount++;
      }
    }
    console.log(`✅ Created ${reviewCount} reviews`);

    // Update tutor ratings and review counts
    console.log('📊 Updating tutor statistics...');
    for (const { tutorProfile } of createdTutors) {
      const reviews = await prisma.review.findMany({
        where: { tutorId: tutorProfile.id },
      });
      
      if (reviews.length > 0) {
        const averageRating = reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length;
        
        await prisma.tutorProfile.update({
          where: { id: tutorProfile.id },
          data: {
            averageRating: Math.round(averageRating * 10) / 10, // Round to 1 decimal
            reviewCount: reviews.length,
          },
        });
      }
    }
    console.log('✅ Updated tutor statistics');

    // Seed Bookings
    console.log('📅 Seeding bookings...');
    let bookingCount = 0;
    
    // Create some historical and future bookings
    for (let i = 0; i < 50; i++) {
      const randomStudent = getRandomElement(createdStudents);
      const randomTutor = getRandomElement(createdTutors);
      const subject = getRandomElement(BOOKING_SUBJECTS);
      
      // Mix of past and future bookings
      const scheduledAt = generateRandomDate(30, 30); // 30 days ago to 30 days ahead
      const isPast = scheduledAt < new Date();
      
      // Duration: 60, 90, or 120 minutes
      const duration = getRandomElement([60, 90, 120]);
      const totalAmount = (duration / 60) * randomTutor.tutorProfile.hourlyRate;
      
      // Status based on timing
      let status = 'PENDING';
      if (isPast) {
        status = getRandomElement(['COMPLETED', 'COMPLETED', 'COMPLETED', 'CANCELLED', 'NO_SHOW']); // Mostly completed
      } else {
        status = getRandomElement(['PENDING', 'CONFIRMED', 'CONFIRMED']); // Mostly confirmed for future
      }
      
      await prisma.booking.create({
        data: {
          studentId: randomStudent.userProfile.id,
          tutorId: randomTutor.tutorProfile.id,
          subject,
          scheduledAt,
          duration,
          status: status as any,
          totalAmount,
          sessionNotes: status === 'COMPLETED' ? getRandomElement([
            'Great session! Student showed significant improvement.',
            'Covered all planned topics. Student asks good questions.',
            'Productive session. Assigned practice problems for next time.',
            'Student is making steady progress. Very engaged.',
            'Excellent focus today. Ready for next chapter.',
          ]) : null,
        },
      });
      bookingCount++;
    }
    console.log(`✅ Created ${bookingCount} bookings`);

    // Seed Favorites
    console.log('❤️ Seeding favorites...');
    let favoriteCount = 0;
    
    // Each student has 2-5 favorite tutors
    for (const { userProfile: student } of createdStudents) {
      const numFavorites = Math.floor(Math.random() * 4) + 2; // 2-5 favorites
      const favoriteTutors = getRandomElements(createdTutors, numFavorites);
      
      for (const { tutorProfile } of favoriteTutors) {
        await prisma.favorite.create({
          data: {
            userId: student.id,
            tutorId: tutorProfile.id,
            createdAt: generateRandomDate(60, 0), // Favorites from last 60 days
          },
        });
        favoriteCount++;
      }
    }
    console.log(`✅ Created ${favoriteCount} favorites`);

    // Final statistics
    console.log('\n🎉 Seeding completed successfully!');
    console.log('📊 Final Statistics:');
    
    const stats = await Promise.all([
      prisma.subject.count(),
      prisma.userProfile.count(),
      prisma.tutorProfile.count(),
      prisma.studentProfile.count(),
      prisma.review.count(),
      prisma.booking.count(),
      prisma.favorite.count(),
      prisma.availabilitySlot.count(),
    ]);
    
    console.log(`   📚 Subjects: ${stats[0]}`);
    console.log(`   👥 Users: ${stats[1]}`);
    console.log(`   👨‍🏫 Tutors: ${stats[2]}`);
    console.log(`   🎓 Students: ${stats[3]}`);
    console.log(`   ⭐ Reviews: ${stats[4]}`);
    console.log(`   📅 Bookings: ${stats[5]}`);
    console.log(`   ❤️ Favorites: ${stats[6]}`);
    console.log(`   🕒 Availability Slots: ${stats[7]}`);
    
    console.log('\n✨ Your GoCours platform is now populated with realistic demo data!');

  } catch (error) {
    console.error('❌ Error during seeding:', error);
    throw error;
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });