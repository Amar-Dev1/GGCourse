import { Injectable, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService
  extends PrismaClient
  implements OnModuleInit, OnModuleDestroy
{
  constructor() {
    super({
      omit: {
        user: { created_at: false, updated_at: false },
        course: { created_at: false, updated_at: false },
        lesson: { created_at: false, updated_at: false },
        section: { created_at: false, updated_at: false },
        enrollment: { created_at: false, updated_at: false },
        review: { created_at: false },
      },
    });
  }
  async onModuleInit() {
    await this.$connect();
  }
  async onModuleDestroy() {
    await this.$disconnect();
  }
}
