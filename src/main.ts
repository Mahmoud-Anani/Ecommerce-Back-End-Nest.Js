import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { I18nValidationPipe } from 'nestjs-i18n';
import helmet from 'helmet';
// import { doubleCsrf } from 'csrf-csrf';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    rawBody: true,
    bodyParser: true,
  });

  // start security
  // // CSRF protection
  // const {
  //   doubleCsrfProtection, // This is the default CSRF protection middleware.
  // } = doubleCsrf({
  //   secret: process.env.CSRF_SECRET,
  //   cookie: {
  //     httpOnly: true,
  //     secure: true,
  //     sameSite: 'strict',
  //   },
    
  //   });
  // app.use(doubleCsrfProtection);

  // helmet HTTP headers
  app.use(helmet());
  // Cors
  app.enableCors({
    origin: ['https://ecommerce-nestjs.com'],
  });
  // end security

  app.useGlobalPipes(new I18nValidationPipe());
  app.setGlobalPrefix('api');
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
