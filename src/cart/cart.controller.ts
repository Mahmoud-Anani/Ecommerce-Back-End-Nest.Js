import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Req,
  UnauthorizedException,
  ValidationPipe,
} from '@nestjs/common';
import { CartService } from './cart.service';
import { UpdateCartItemsDto } from './dto/update-cart-items.dto';
import { Roles } from 'src/user/decorator/Roles.decorator';
import { AuthGuard } from 'src/user/guard/Auth.guard';

@Controller('v1/cart')
export class CartController {
  constructor(private readonly cartService: CartService) {}

  //  @docs   Can Only User Logged Create Cart and add products in cart
  //  @Route  POST /api/v1/cart/:productId
  //  @access Private [User]
  @Post(':productId')
  @Roles(['user'])
  @UseGuards(AuthGuard)
  create(@Param('productId') productId: string, @Req() req) {
    if (req.user.role.toLowerCase() === 'admin') {
      throw new UnauthorizedException();
    }
    const user_id = req.user._id;
    return this.cartService.create(productId, user_id);
  }

  @Get()
  findAll() {
    return this.cartService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.cartService.findOne(+id);
  }

  //  @docs   Can Only User update cartItems
  //  @Route  PATCH /api/v1/cart/:productId
  //  @access Private [User]
  @Patch(':productId')
  @Roles(['user'])
  @UseGuards(AuthGuard)
  update(
    @Param('productId') productId: string,
    @Body(new ValidationPipe({ forbidNonWhitelisted: true, whitelist: true }))
    updateCartItemsDto: UpdateCartItemsDto,
    @Req() req,
  ) {
    if (req.user.role.toLowerCase() === 'admin') {
      throw new UnauthorizedException();
    }
    const user_id = req.user._id;
    return this.cartService.update(productId, user_id, updateCartItemsDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.cartService.remove(+id);
  }
}
