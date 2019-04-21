import { enableProdMode } from '@angular/core';
import { NestFactory } from '@nestjs/core';
import { ApplicationModule } from './app.module';

enableProdMode();

async function bootstrap() {
  const app = await NestFactory.create(ApplicationModule);
  app.enableCors({
    methods: 'GET',
    maxAge: 3600,
  });
  // await app.listen(5400);
  await app.listen(process.env.PORT || 8080);
}
bootstrap().catch(err => console.error(err));
