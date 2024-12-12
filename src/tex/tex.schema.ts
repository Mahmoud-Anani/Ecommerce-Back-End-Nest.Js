import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type texDocument = HydratedDocument<Tex>;

@Schema({ timestamps: true })
export class Tex {
  @Prop({
    type: Number,
    default: 0,
  })
  texPrice: string;
  @Prop({
    type: Number,
    default: 0,
  })
  shippingPrice: string;
}

export const texSchema = SchemaFactory.createForClass(Tex);
