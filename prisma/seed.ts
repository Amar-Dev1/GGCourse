import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  // Create Users
  const admin = await prisma.user.create({
    data: {
      user_id: 'user-admin-0001',
      name: 'Admin User',
      email: 'admin@gmail.com',
      password: 'pass',
      username: 'adminuser',
      role: 'ADMIN',
    },
  });

  const instructor = await prisma.user.create({
    data: {
      user_id: 'user-instructor-0001',
      name: 'Instructor User',
      email: 'instructor@gmail.com',
      password: 'pass',
      username: 'instructoruser',
      role: 'INSTRUCTOR',
    },
  });

  const student = await prisma.user.create({
    data: {
      user_id: 'user-student-0001',
      name: 'Student User',
      email: 'student@gmail.com',
      password: 'pass',
      username: 'studentuser',
      role: 'STUDENT',
    },
  });

  // Create Courses (owned by instructor)
  const course1 = await prisma.course.create({
    data: {
      course_id: 'course-001',
      title: 'NestJS Bootcamp',
      description: 'Master NestJS with projects',
      price: 100,
      instructorId: instructor.user_id,
    },
  });

  const course2 = await prisma.course.create({
    data: {
      course_id: 'course-002',
      title: 'TypeScript Crash Course',
      description: 'Learn TS fast',
      price: 80,
      instructorId: instructor.user_id,
    },
  });

  // Create Enrollment (student in course1)
  const enrollment = await prisma.enrollment.create({
    data: {
      enrollment_id: 'enroll-001',
      userId: student.user_id,
      courseId: course1.course_id,
      completed: true,
    },
  });

  // Create Review (by student for course1)
  const review = await prisma.review.create({
    data: {
      review_id: 'review-001',
      userId: student.user_id,
      courseId: course1.course_id,
    },
  });

  console.log('✅ Seed completed!');
}

main()
  .catch((e) => {
    console.error('❌ Seed failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
