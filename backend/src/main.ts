import { NestFactory } from '@nestjs/core'
import { ValidationPipe } from '@nestjs/common'
import { AppModule } from './app.module.js'

async function bootstrap() {
  const app = await NestFactory.create(AppModule)

  // Enable CORS for frontend dev server (Vite :5173)
  app.enableCors({
    origin: ['http://localhost:5173', 'http://127.0.0.1:5173'],
    credentials: true,
  })

  // Force UTF-8 charset for all JSON responses
  app.use((_req, res, next) => {
    res.setHeader('Content-Type', 'application/json; charset=utf-8')
    next()
  })

  // Global validation pipe — auto-validate DTOs with class-validator
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      stopAtFirstError: true,
    }),
  )

  const port = process.env.PORT ?? 3000
  await app.listen(port)
  console.log(`🚀 HongDuCC API running on http://localhost:${port}`)
}
bootstrap()
