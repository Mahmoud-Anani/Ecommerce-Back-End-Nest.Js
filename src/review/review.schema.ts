import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';
import { Product } from 'src/product/product.schema';
import { User } from 'src/user/user.schema';

export type reviewDocument = HydratedDocument<Review>;

@Schema({ timestamps: true })
export class Review {
  @Prop({
    type: String,
    required: false,
    min: [3, 'reviewText must be at least 3 characters'],
  })
  reviewText: string;
  @Prop({
    type: Number,
    required: true,
    min: [1, 'rating must be at least 1 star'],
    max: [5, 'rating must be at least 5 star'],
  })
  rating: number;
  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: User.name,
  })
  user: string;
  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: Product.name,
  })
  product: string;
}

export const reviewSchema = SchemaFactory.createForClass(Review);
