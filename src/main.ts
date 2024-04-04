import { NestFactory } from '@nestjs/core'

import { AppModule } from './app.module'
import { ParseService } from './parse/parse.service'
import { ParseController } from './parse/parse.controller'

async function bootstrap() {
    const app = await NestFactory.create(AppModule)
    app.enableCors()
    await app.listen(5000)
}
bootstrap()
