import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Cart } from 'src/cart/cart.schema';

@Injectable()
export class CartAdminService {
  constructor(@InjectModel(Cart.name) private cartModule: Model<Cart>) {}
  async findAll() {
    const carts = await this.cartModule
      .find()
      .populate(
        'cartItems.productId user coupons.couponId',
        'name email expireDate price title description',
      );
    console.log('Service and use find all');
    console.log(carts[0].coupons[0]);

    return carts; // Return the array of carts directly
  }
}
