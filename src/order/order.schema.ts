import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';
import { User } from '../user/user.schema';
import { Product } from 'src/product/product.schema';

export type orderDocument = HydratedDocument<Order>;

@Schema({ timestamps: true })
export class Order {
  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    required: true,
  })
  user: typeof User;
  @Prop({
    type: String,
    required: false,
  })
  sessionId: string;
  @Prop({
    type: [
      {
        productId: {
          type: mongoose.Schema.Types.ObjectId,
          require: true,
          ref: Product.name,
        },
        quantity: {
          type: Number,
          required: true,
        },
        color: {
          type: String,
          default: '',
        },
      },
    ],
  })
  cartItems: [
    {
      productId: {
        _id: string;
        price: number;
        priceAfterDiscount: number;
      };
      quantity: number;
      color: string;
    },
  ];

  @Prop({
    type: Number,
    required: false,
    default: 0,
  })
  taxPrice: number;
  @Prop({
    type: Number,
    required: false,
    default: 0,
  })
  shippingPrice: number;
  @Prop({
    type: Number,
    required: true,
    default: 0,
  })
  totalOrderPrice: number;
  @Prop({
    type: String,
    required: false,
    default: 'card',
    enum: ['cash', 'card'],
  })
  paymentMethodType: string;
  @Prop({
    type: Boolean,
    required: false,
    default: false,
  })
  isPaid: boolean;
  @Prop({
    type: Date,
    required: false,
  })
  paidAt: Date;
  @Prop({
    type: Boolean,
    required: false,
    default: false,
  })
  isDeliverd: boolean;
  @Prop({
    type: Date,
    required: false,
  })
  deliverdAt: Date;
  @Prop({
    type: String,
    required: false,
  })
  shippingAddress: string;
}

export const orderSchema = SchemaFactory.createForClass(Order);
