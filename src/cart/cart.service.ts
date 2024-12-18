import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateCartDto } from './dto/create-cart.dto';
import { UpdateCartDto } from './dto/update-cart.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Cart } from './cart.schema';
import { Model } from 'mongoose';
import { Product } from 'src/product/product.schema';

@Injectable()
export class CartService {
  constructor(
    @InjectModel(Cart.name) private readonly cartModule: Model<Cart>,
    @InjectModel(Product.name) private readonly productModule: Model<Product>,
  ) {}

  async create(product_id: string, user_id: string) {
    const cart = await this.cartModule
      .findOne({ user: user_id })
      .populate('cartItems.productId', 'price');

    const product = await this.productModule.findById(product_id);
    // not found this product
    if (!product) {
      throw new NotFoundException('Not Found Product');
    }
    // quantity=0
    if (product.quantity <= 0) {
      throw new NotFoundException('Not Found quantity on this product');
    }
    // if user have cart=> insert product (productId)
    if (cart) {
      // add first product=> insert product in cart
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      let ifProductAlridyInsert: {
        ifAdd: boolean;
        indexProduct: number;
      } = {
        ifAdd: false,
        indexProduct: 0,
      };
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      let totalPriceCartBeforAdd = 0;
      // cartItems: [{},{},{}]
      cart.cartItems.map((item, index) => {
        if (product_id.toString() === item.productId._id.toString()) {
          ifProductAlridyInsert = {
            ifAdd: true,
            indexProduct: index,
          };
        }
        totalPriceCartBeforAdd += item.productId.price * item.quantity;
      });
      console.log(totalPriceCartBeforAdd);

      const cloneCartImtes = cart.cartItems;
      if (ifProductAlridyInsert.ifAdd) {
        cloneCartImtes[ifProductAlridyInsert.indexProduct].quantity += 1;
      } else {
        // eslint-disable-next-line
        // @ts-ignore
        cloneCartImtes.push({ productId: product_id, color: '', quantity: 1 });
      }

      const updateCart = await this.cartModule.findOneAndUpdate(
        { user: user_id },
        {
          cartItems: cloneCartImtes,
          totalPrice: ifProductAlridyInsert.ifAdd
            ? totalPriceCartBeforAdd +
              cloneCartImtes[ifProductAlridyInsert.indexProduct].productId.price
            : totalPriceCartBeforAdd + product.price,
        },
        {
          new: true,
        },
      );
      // add sacand product=> quantity+1
      return {
        status: 200,
        message: 'Insert Product',
        data: updateCart,
      };
    } else {
      // else user don't have cart=> cart cart, insert product (productId)

      const newCart = await this.cartModule.create({
        cartItems: [
          {
            productId: product_id,
          },
        ],
        totalPrice: product.price,
        user: user_id,
      });
      return {
        status: 200,
        message: 'Created Cart and Insert Product',
        data: newCart,
      };
    }
  }

  //
  findAll() {
    return `This action returns all cart`;
  }

  findOne(id: number) {
    return `This action returns a #${id} cart`;
  }

  update(id: number, updateCartDto: UpdateCartDto) {
    return `This action updates a #${id} cart`;
  }

  remove(id: number) {
    return `This action removes a #${id} cart`;
  }
}
