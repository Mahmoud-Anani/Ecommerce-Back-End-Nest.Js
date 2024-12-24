import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  ValidationPipe,
  Query,
} from '@nestjs/common';
import { ProductService } from './product.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { Roles } from 'src/user/decorator/Roles.decorator';
import { AuthGuard } from 'src/user/guard/Auth.guard';

@Controller('v1/product')
export class ProductController {
  constructor(private readonly productService: ProductService) {}
  //  @docs   Admin Can Create a Product
  //  @Route  POST /api/v1/product
  //  @access Private [Admin]
  @Post()
  @Roles(['admin'])
  @UseGuards(AuthGuard)
  create(
    @Body(new ValidationPipe({ forbidNonWhitelisted: true, whitelist: true }))
    createProductDto: CreateProductDto,
  ) {
    return this.productService.create(createProductDto);
  }

  //  @docs   Any User Can Get Products
  //  @Route  GET /api/v1/product
  //  @access Public
  @Get()
  findAll(@Query() query) {
    return this.productService.findAll(query);
  }
  //  @docs   Any User Can Get Product
  //  @Route  GET /api/v1/product
  //  @access Public
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.productService.findOne(id);
  }

  //  @docs   Admin Can Update a Product
  //  @Route  PATCH /api/v1/product
  //  @access Private [Admin]
  @Patch(':id')
  @Roles(['admin'])
  @UseGuards(AuthGuard)
  update(
    @Param('id') id: string,
    @Body(new ValidationPipe({ forbidNonWhitelisted: true, whitelist: true }))
    updateProductDto: UpdateProductDto,
  ) {
    return this.productService.update(id, updateProductDto);
  }

  //  @docs   Admin Can Delete a Product
  //  @Route  DELETE /api/v1/product
  //  @access Private [Admin]
  @Delete(':id')
  @Roles(['admin'])
  @UseGuards(AuthGuard)
  remove(@Param('id') id: string) {
    return this.productService.remove(id);
  }
}