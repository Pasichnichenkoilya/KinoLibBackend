import { Module } from '@nestjs/common'

import { ParseService } from './parse/parse.service'
import { ParseController } from './parse/parse.controller'
import { PrismaService } from './prisma.service'

@Module({
    imports: [],
    controllers: [ParseController],
    providers: [ParseService, PrismaService],
})
export class AppModule {}
