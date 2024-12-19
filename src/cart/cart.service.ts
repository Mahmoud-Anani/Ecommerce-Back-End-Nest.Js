import { Injectable, NotFoundException } from '@nestjs/common';
import { UpdateCartItemsDto } from './dto/update-cart-items.dto';
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
      .populate('cartItems.productId', 'price priceAfterDiscount');

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
        totalPriceCartBeforAdd +=
          item.productId.price * item.quantity -
          item.productId.priceAfterDiscount;
      });

      const cloneCartImtes = cart.cartItems;
      if (ifProductAlridyInsert.ifAdd) {
        cloneCartImtes[ifProductAlridyInsert.indexProduct].quantity += 1;
      } else {
        // eslint-disable-next-line
        // @ts-ignore
        cloneCartImtes.push({ productId: product_id, color: '', quantity: 1 });
      }
      const totalPrice = ifProductAlridyInsert.ifAdd
        ? totalPriceCartBeforAdd +
          (cloneCartImtes[ifProductAlridyInsert.indexProduct].productId.price -
            cloneCartImtes[ifProductAlridyInsert.indexProduct].productId
              .priceAfterDiscount *
              cloneCartImtes[ifProductAlridyInsert.indexProduct].quantity)
        : totalPriceCartBeforAdd +
          (product.price -
            product.priceAfterDiscount *
              cloneCartImtes[ifProductAlridyInsert.indexProduct].quantity);

      const updateCart = await this.cartModule
        .findOneAndUpdate(
          { user: user_id },
          {
            cartItems: cloneCartImtes,
            totalPrice,
          },
          {
            new: true,
          },
        )
        .populate('cartItems.productId', 'title description');
      // add sacand product=> quantity+1
      return {
        status: 200,
        message: 'Insert Product',
        data: updateCart,
      };
    } else {
      // else user don't have cart=> cart cart, insert product (productId)

      const newCart = await (
        await this.cartModule.create({
          cartItems: [
            {
              productId: product_id,
            },
          ],
          totalPrice: product.price - product.priceAfterDiscount,
          user: user_id,
        })
      ).populate('cartItems.productId', 'title description');
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

  async findOne(user_id: string) {
    const cart = await this.cartModule
      .findOne({ user: user_id })
      .select('-__v');
    if (!cart) {
      throw new NotFoundException(
        `You don't hava a cart please go to add prducts`,
      );
    }

    return {
      status: 200,
      message: 'Found Cart',
      data: cart,
    };
  }

  async update(
    productId: string,
    user_id: string,
    updateCartItemsDto: UpdateCartItemsDto,
  ) {
    const cart = await this.cartModule
      .findOne({ user: user_id })
      .populate(
        'cartItems.productId',
        'price title description priceAfterDiscount _id',
      );

    if (!cart) {
      const result = await this.create(productId, user_id);
      return result;
    }

    const indexProductUpdate = cart.cartItems.findIndex(
      (item) => item.productId._id.toString() === productId.toString(),
    );

    if (indexProductUpdate === -1) {
      throw new NotFoundException('Not Found any product in cart');
    }

    // update color
    if (updateCartItemsDto.color) {
      cart.cartItems[indexProductUpdate].color = updateCartItemsDto.color;
    }
    // update quantity
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    let totalPrice = 0;
    if (updateCartItemsDto.quantity) {
      cart.cartItems[indexProductUpdate].quantity = updateCartItemsDto.quantity;
      cart.cartItems.map((item) => {
        totalPrice +=
          item.quantity * item.productId.price -
          item.productId.priceAfterDiscount * item.quantity;
      });
      cart.totalPrice = totalPrice;
    }

    await cart.save();
    return {
      status: 200,
      message: 'Product Updated',
      data: cart,
    };
  }

  async remove(productId: string, user_id: string) {
    const cart = await this.cartModule
      .findOne({ user: user_id })
      .populate(
        'cartItems.productId',
        'price title description priceAfterDiscount _id',
      );
    if (!cart) {
      throw new NotFoundException('Not Found Cart');
    }
    const indexProductUpdate = cart.cartItems.findIndex(
      (item) => item.productId._id.toString() === productId.toString(),
    );
    if (indexProductUpdate === -1) {
      throw new NotFoundException('Not Found any product in cart');
    }

    // eslint-disable-next-line
    // @ts-ignore
    cart.cartItems = cart.cartItems.filter(
      (item, index) => index !== indexProductUpdate,
    );

    // update price after delete product
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    let totalPrice = 0;
    cart.cartItems.map((item) => {
      totalPrice += item.quantity * item.productId.price;
    });
    cart.totalPrice = totalPrice;

    await cart.save();

    return {
      status: 200,
      message: 'Deleted Product',
      data: cart,
    };
  }
}
