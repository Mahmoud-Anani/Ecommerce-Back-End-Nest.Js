import { Module } from '@nestjs/common';
import { ReviewService } from './review.service';
import {
  ReviewController,
  ReviewDashbourdController,
} from './review.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Review, reviewSchema } from './review.schema';
import { Product, productSchema } from 'src/product/product.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: Review.name,
        schema: reviewSchema,
      },
      {
        name: Product.name,
        schema: productSchema,
      },
    ]),
  ],
  controllers: [ReviewController, ReviewDashbourdController],
  providers: [ReviewService],
})
export class ReviewModule {}
