import { Injectable, Module, OnModuleInit } from '@nestjs/common'
import { PrismaClient } from '@prisma/client'

@Module({
    providers: [PrismaService],
    exports: [PrismaService],
})
export class PrismaService extends PrismaClient implements OnModuleInit {
    async onModuleInit() {
        await this.$connect()
    }
}
