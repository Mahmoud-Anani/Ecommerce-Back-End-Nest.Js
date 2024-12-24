import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type texDocument = HydratedDocument<Tax>;

@Schema({ timestamps: true })
export class Tax {
  @Prop({
    type: Number,
    default: 0,
  })
  taxPrice: string;
  @Prop({
    type: Number,
    default: 0,
  })
  shippingPrice: string;
}

export const taxSchema = SchemaFactory.createForClass(Tax);
