import { Module } from '@nestjs/common'

import { ParseService } from './parse/parse.service'
import { ParseController } from './parse/parse.controller'

@Module({
    imports: [],
    controllers: [ParseController],
    providers: [ParseService],
})
export class AppModule {}
