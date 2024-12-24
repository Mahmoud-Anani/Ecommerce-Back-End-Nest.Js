import { Module } from '@nestjs/common';
import { RequestProductService } from './request-product.service';
import { RequestProductController } from './request-product.controller';
import { RequestProduct, requestProductSchema } from './request-product.schema';
import { MongooseModule } from '@nestjs/mongoose';
import { User, userSchema } from 'src/user/user.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: RequestProduct.name, schema: requestProductSchema },
      { name: User.name, schema: userSchema },
    ]),
  ],
  controllers: [RequestProductController],
  providers: [RequestProductService],
})
export class RequestProductModule {}
