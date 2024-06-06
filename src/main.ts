import { NestFactory } from '@nestjs/core'
import { AppModule } from './app.module'

const start = async () => {
    const app = await NestFactory.create(AppModule)
    app.enableCors()
    await app.listen(5000)
}

start()
