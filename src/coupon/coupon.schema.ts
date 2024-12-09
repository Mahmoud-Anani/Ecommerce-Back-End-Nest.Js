import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type couponDocument = HydratedDocument<Coupon>;

@Schema({ timestamps: true })
export class Coupon {
  @Prop({
    type: String,
    required: true,
    min: [3, 'Name must be at least 3 characters'],
    max: [100, 'Name must be at most 100 characters'],
  })
  name: string;
  @Prop({
    type: Date,
    required: true,
    min: new Date(),
  })
  expireDate: Date;
  @Prop({
    type: Number,
    required: true,
  })
  discount: number;
}

export const couponSchema = SchemaFactory.createForClass(Coupon);
