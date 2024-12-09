import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ValidationPipe,
  UseGuards,
} from '@nestjs/common';
import { SuppliersService } from './suppliers.service';
import { CreateSuppliersDto } from './dto/create-suppliers.dto';
import { UpdateSuppliersDto } from './dto/update-suppliers.dto';
import { Roles } from 'src/user/decorator/Roles.decorator';
import { AuthGuard } from 'src/user/guard/Auth.guard';

@Controller('v1/suppliers')
export class SuppliersController {
  constructor(private readonly suppliersService: SuppliersService) {}

  //  @docs   Admin Can create a new Suppliers
  //  @Route  POST /api/v1/suppliers
  //  @access Private [Amdin]
  @Post()
  @Roles(['admin'])
  @UseGuards(AuthGuard)
  create(
    @Body(new ValidationPipe({ forbidNonWhitelisted: true }))
    createSuppliersDto: CreateSuppliersDto,
  ) {
    return this.suppliersService.create(createSuppliersDto);
  }

  //  @docs   Any User Can get all Suppliers
  //  @Route  GET /api/v1/suppliers
  //  @access Public
  @Get()
  findAll() {
    return this.suppliersService.findAll();
  }

  //  @docs   Any User Can get single Suppliers
  //  @Route  GET /api/v1/suppliers
  //  @access Public
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.suppliersService.findOne(id);
  }

  //  @docs   Admin can update a supplier
  //  @Route  PATCH /api/v1/suppliers
  //  @access Private [admin]
  @Patch(':id')
  @Roles(['admin'])
  @UseGuards(AuthGuard)
  update(
    @Param('id') id: string,
    @Body(new ValidationPipe({ forbidNonWhitelisted: true }))
    updateSuppliersDto: UpdateSuppliersDto,
  ) {
    return this.suppliersService.update(id, updateSuppliersDto);
  }

  //  @docs   Admin can delete a Supplier
  //  @Route  DELETE /api/v1/suppliers
  //  @access Private [admin]
  @Delete(':id')
  @Roles(['admin'])
  @UseGuards(AuthGuard)
  remove(@Param('id') id: string) {
    return this.suppliersService.remove(id);
  }
}
