import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';
import { Brand } from 'src/brand/brand.schema';
import { Category } from 'src/category/category.schema';
import { SubCategory } from 'src/sub-category/sub-category.schema';

export type productDocument = HydratedDocument<Product>;

@Schema({ timestamps: true })
export class Product {
  @Prop({
    type: String,
    required: true,
    min: [3, 'Title must be at least 3 characters'],
  })
  title: string;
  @Prop({
    type: String,
    required: true,
    min: [20, 'Description must be at least 20 characters'],
  })
  description: string;
  @Prop({
    type: Number,
    required: true,
    default: 1,
    min: [1, 'Description must be at least 1 product'],
  })
  quantity: number;
  @Prop({
    type: String,
    required: true,
  })
  imageCover: string;
  @Prop({
    type: Array,
    required: false,
  })
  images: string[];
  @Prop({
    type: Number,
    required: false,
    default: 0,
  })
  sold: number;
  @Prop({
    type: Number,
    required: true,
    min: [1, 'Price must be at least 1 L.E'],
    max: [20000, 'Price must be at least 20000 L.E'],
  })
  price: number;
  @Prop({
    type: Number,
    required: false,
    default: 0,
    max: [20000, 'Price must be at least 20000 L.E'],
  })
  priceAfterDiscount: number;
  @Prop({
    type: Array,
    required: false,
  })
  colors: string[];
  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: Category.name,
  })
  category: string;
  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    required: false,
    ref: SubCategory.name,
  })
  subCategory: string;
  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    required: false,
    ref: Brand.name,
  })
  brand: string;
  @Prop({
    type: Number,
    required: false,
    default: 0,
  })
  ratingsAverage: number;
  @Prop({
    type: Number,
    required: false,
    default: 0,
  })
  ratingsQuantity: number;
}

export const productSchema = SchemaFactory.createForClass(Product);
