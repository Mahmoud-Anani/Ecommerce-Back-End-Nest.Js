import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';
import { User } from 'src/user/user.schema';

export type requestProductDocument = HydratedDocument<RequestProduct>;

@Schema({ timestamps: true })
export class RequestProduct {
  @Prop({
    type: String,
    required: true,
  })
  titleNeed: string;

  @Prop({
    type: String,
    min: [5, 'Details must be at least 5 characters'],
    required: true,
  })
  details: string;
  @Prop({
    type: Number,
    min: [1, 'Qauntity must be at least 1 product'],
    required: true,
  })
  qauntity: number;
  @Prop({
    type: String,
  })
  category: string;
  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: User.name,
  })
  user: {
    _id: string;
  };
}

export const requestProductSchema =
  SchemaFactory.createForClass(RequestProduct);
