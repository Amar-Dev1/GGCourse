import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { CourseModule } from './course/course.module';
import { EnrollmentModule } from './enrollment/enrollment.module';
import { ReviewModule } from './review/review.module';
import { UserService } from './user/user.service';
import { UserModule } from './user/user.module';
import { ConfigModule } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { jwtConstants } from './auth/constants';
import { PrismaModule } from './prisma.module';
import { SectionModule } from './section/section.module';
import { LessonModule } from './lesson/lesson.module';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';
import { APP_GUARD } from '@nestjs/core';

@Module({
  imports: [
    AuthModule,
    CourseModule,
    EnrollmentModule,
    ReviewModule,
    UserModule,
    PrismaModule,
    SectionModule,
    LessonModule,
    JwtModule.register({
      global: true,
      secret: jwtConstants.secret,
      signOptions: { expiresIn: '10d' },
    }),
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    ThrottlerModule.forRoot({
      throttlers: [
        {
          ttl: 1_000,
          limit: 3,
        },
        {
          ttl: 60_000,
          limit: 40,
        },
      ],
    }),
  ],
  controllers: [AppController],
  providers: [
    AppService,
    UserService,
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
  ],
})
export class AppModule {}
