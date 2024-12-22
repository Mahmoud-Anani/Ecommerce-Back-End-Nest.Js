import { Resolver, Query } from '@nestjs/graphql';
import { Cart } from './cart-admin.schema';
import { CartAdminService } from './cart-admin.service';
import { Roles } from 'src/user/decorator/Roles.decorator';
import { UseGuards } from '@nestjs/common';
import { AuthGuard } from 'src/user/guard/Auth.guard';

@Resolver(() => Cart)
export class CartAdminResolver {
  constructor(private readonly cartAdminService: CartAdminService) {}

  //  @docs   Can Admin Get All Carts
  //  @Route  Query /graphql
  //  @access Private [Admin]
  @Query(() => [Cart], { name: 'Cart' })
  @Roles(['admin'])
  @UseGuards(AuthGuard)
  async getCarts() {
    return this.cartAdminService.findAll();
  }
}
