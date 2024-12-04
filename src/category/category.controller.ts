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
import { CategoryService } from './category.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { AuthGuard } from 'src/user/guard/Auth.guard';
import { Roles } from 'src/user/decorator/Roles.decorator';

@Controller('v1/category')
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  //  @docs   Admin Can create a new category
  //  @Route  POST /api/v1/category
  //  @access Private [Amdin]
  @Post()
  @Roles(['admin'])
  @UseGuards(AuthGuard)
  create(
    @Body(new ValidationPipe({ forbidNonWhitelisted: true }))
    createCategoryDto: CreateCategoryDto,
  ) {
    return this.categoryService.create(createCategoryDto);
  }

  //  @docs   Any User Can get categorys
  //  @Route  GET /api/v1/category
  //  @access Public
  @Get()
  findAll() {
    return this.categoryService.findAll();
  }

  //  @docs   Any User Can get any category
  //  @Route  GET /api/v1/category/:id
  //  @access Public
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.categoryService.findOne(id);
  }

  //  @docs   Admin Can update any category
  //  @Route  UPDATE /api/v1/category/:id
  //  @access Private [Amdin]
  @Patch(':id')
  @Roles(['admin'])
  @UseGuards(AuthGuard)
  update(
    @Param('id') id: string,
    @Body(new ValidationPipe({ forbidNonWhitelisted: true }))
    updateCategoryDto: UpdateCategoryDto,
  ) {
    return this.categoryService.update(id, updateCategoryDto);
  }

  //  @docs   Admin Can delete any category
  //  @Route  DELETE /api/v1/category/:id
  //  @access Private [Amdin]
  @Delete(':id')
  @Roles(['admin'])
  @UseGuards(AuthGuard)
  remove(@Param('id') id: string) {
    return this.categoryService.remove(id);
  }
}
