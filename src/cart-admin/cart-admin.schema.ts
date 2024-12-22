import { ObjectType, Field, Int } from '@nestjs/graphql';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';
import { Coupon } from 'src/coupon/coupon.schema';
import { Product } from 'src/product/product.schema';
import { User } from 'src/user/user.schema';

export type cartDocument = HydratedDocument<Cart>;

@ObjectType()
class LocalUser {
  @Field(() => String)
  _id: string;

  @Field(() => String)
  email: string;

  @Field(() => String)
  name: string;
}

@Schema({ timestamps: true })
@ObjectType()
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
  @Field(() => [CartItem])
  cartItems: CartItem[];

  @Prop({
    type: Number,
    required: true,
  })
  @Field(() => Int)
  totalPrice: number;

  @Prop({
    type: Number,
  })
  @Field(() => Int, { nullable: true })
  totalPriceAfterDiscount?: number;

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
  @Field(() => [LocalCoupon])
  coupons: LocalCoupon[];

  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: User.name,
  })
  @Field(() => LocalUser)
  user: LocalUser;
}

export const cartSchema = SchemaFactory.createForClass(Cart);

@ObjectType()
class LocalCoupon {
  @Field(() => String)
  _id: string;
  @Field(() => String)
  name: string;

  @Field(() => Date, { nullable: true })
  expireDate: Date;
}

@ObjectType()
class LocalProduct {
  @Field(() => String)
  _id: string;

  @Field(() => Int)
  price: number;

  @Field(() => Int, { nullable: true })
  priceAfterDiscount: number;
}

@ObjectType()
class CartItem {
  @Field(() => LocalProduct)
  productId: LocalProduct;

  @Field(() => Int)
  quantity: number;

  @Field(() => String, { nullable: true })
  color?: string;
}
