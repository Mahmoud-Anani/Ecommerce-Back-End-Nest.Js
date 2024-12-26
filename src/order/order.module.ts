import { Module } from '@nestjs/common';
import { OrderService } from './order.service';
import {
  CheckoutCardController,
  OrderCheckoutController,
  OrderController,
} from './order.controller';
import { Order, orderSchema } from './order.schema';
import { MongooseModule } from '@nestjs/mongoose';
import { Cart, cartSchema } from 'src/cart/cart.schema';
import { Tax, taxSchema } from 'src/tex/tax.schema';
import { Product, productSchema } from 'src/product/product.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Order.name, schema: orderSchema },
      { name: Cart.name, schema: cartSchema },
      { name: Tax.name, schema: taxSchema },
      { name: Product.name, schema: productSchema },
    ]),
  ],
  controllers: [
    OrderCheckoutController,
    CheckoutCardController,
    OrderController,
  ],
  providers: [OrderService],
})
export class OrderModule {}
