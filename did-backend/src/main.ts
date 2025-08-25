import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import cookieParser from 'cookie-parser';
import cors from 'cors';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.use(cookieParser())
  app.use(cors({
	  origin:'*',
	  credentials : true
	 }))
  await app.listen(process.env.PORT ?? 4000);
}
bootstrap();
// npm i --save-dev @types/cookie-parser
