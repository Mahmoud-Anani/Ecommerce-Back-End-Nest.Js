import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';
import { Coupon } from 'src/coupon/coupon.schema';
import { Product } from 'src/product/product.schema';
import { User } from 'src/user/user.schema';

export type cartDocument = HydratedDocument<Cart>;

@Schema({ timestamps: true })
export class Cart {
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
          default: 1,
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
      };
      quantity: number;
      color: string;
    },
  ];

  @Prop({
    type: Number,
    required: true,
  })
  totalPrice: number;
  @Prop({
    type: Number,
  })
  totalPriceAfterDiscount: number;

  @Prop({
    type: [
      {
        name: {
          type: String,
        },
        couponId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: Coupon.name,
        },
      },
    ],
  })
  coupons: [
    {
      name: string;
      couponId: string;
    },
  ];

  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: User.name,
  })
  user: string;
}

export const cartSchema = SchemaFactory.createForClass(Cart);
