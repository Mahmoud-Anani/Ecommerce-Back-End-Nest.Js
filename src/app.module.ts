import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { UserModule } from './user/user.module';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';
import { MailerModule } from '@nestjs-modules/mailer';
import { CategoryModule } from './category/category.module';
import { SubCategoryModule } from './sub-category/sub-category.module';
import { BrandModule } from './brand/brand.module';
import { CouponModule } from './coupon/coupon.module';
import { SuppliersModule } from './suppliers/suppliers.module';
import { RequestProductModule } from './request-product/request-product.module';
import { TaxModule } from './tax/tax.module';
import { ProductModule } from './product/product.module';
import { ReviewModule } from './review/review.module';
import { CartModule } from './cart/cart.module';
import { OrderModule } from './order/order.module';
import { UploadFilesModule } from './upload-files/upload-files.module';
import {
  AcceptLanguageResolver,
  HeaderResolver,
  I18nModule,
  QueryResolver,
} from 'nestjs-i18n';
import { join } from 'path';
import { ThrottlerModule } from '@nestjs/throttler';

@Module({
  imports: [
    ThrottlerModule.forRoot([
      {
        ttl: 60000,
        limit: 10,
      },
    ]),
    I18nModule.forRoot({
      fallbackLanguage: 'en',
      loaderOptions: {
        path: join(__dirname, '/apps/api/i18n/'),
        watch: true,
      },
      resolvers: [
        { use: QueryResolver, options: ['lang'] },
        AcceptLanguageResolver,
        new HeaderResolver(['x-lang']),
      ],
    }),

    ConfigModule.forRoot(),
    MongooseModule.forRoot('mongodb://localhost:27017/ecommerce'),
    UserModule,
    JwtModule.register({
      global: true,
      secret: process.env.JWT_SECRET,
      signOptions: { expiresIn: '2d' },
    }),
    AuthModule,
    MailerModule.forRoot({
      transport: {
        service: 'gmail',
        auth: {
          user: process.env.EMAIL_USERNAME,
          pass: process.env.EMAIL_PASSWORD,
        },
      },
    }),
    CategoryModule,
    SubCategoryModule,
    BrandModule,
    CouponModule,
    SuppliersModule,
    RequestProductModule,
    TaxModule,
    ProductModule,
    ReviewModule,
    CartModule,
    OrderModule,
    UploadFilesModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
