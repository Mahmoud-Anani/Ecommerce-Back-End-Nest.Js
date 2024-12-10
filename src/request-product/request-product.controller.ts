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
import { RequestProductService } from './request-product.service';
import { CreateRequestProductDto } from './dto/create-request-product.dto';
import { UpdateRequestProductDto } from './dto/update-request-product.dto';
import { Roles } from 'src/user/decorator/Roles.decorator';
import { AuthGuard } from 'src/user/guard/Auth.guard';

@Controller('v1/req-product')
export class RequestProductController {
  constructor(private readonly requestProductService: RequestProductService) {}

  //  @docs   User Can Create a Request Product
  //  @Route  POST /api/v1/req-product
  //  @access Private [user]
  @Post()
  @Roles(['user'])
  @UseGuards(AuthGuard)
  create(
    @Body(new ValidationPipe({ forbidNonWhitelisted: true, whitelist: true }))
    createRequestProductDto: CreateRequestProductDto,
    @Req() req,
  ) {
    if (req.user.role.toLowerCase() === 'admin') {
      throw new UnauthorizedException();
    }
    return this.requestProductService.create({
      ...createRequestProductDto,
      user: req.user._id,
    });
  }

  //  @docs   Admin Can get All Request Product
  //  @Route  GET /api/v1/req-product
  //  @access Private [Admin]
  @Get()
  @Roles(['admin'])
  @UseGuards(AuthGuard)
  findAll() {
    return this.requestProductService.findAll();
  }

  //  @docs   Admin Can get Any Single Request Product and User Can Get Only Their Request Product
  //  @Route  GET /api/v1/req-product
  //  @access Private [Admin, User]
  @Get(':id')
  @Roles(['admin', 'user'])
  @UseGuards(AuthGuard)
  findOne(@Param('id') id: string, @Req() req) {
    return this.requestProductService.findOne(id, req);
  }

  //  @docs   User Can Update Only Their Request Product
  //  @Route  PATCH /api/v1/req-product
  //  @access Private [User]
  @Patch(':id')
  @Roles(['user'])
  @UseGuards(AuthGuard)
  update(
    @Param('id') id: string,
    @Body() updateRequestProductDto: UpdateRequestProductDto,
    @Req() req,
  ) {
    if (req.user.role.toLowerCase() === 'admin') {
      throw new UnauthorizedException();
    }

    return this.requestProductService.update(id, {
      ...updateRequestProductDto,
      user: req.user._id,
    });
  }

  //  @docs   User Can Delete Only Their Request Product
  //  @Route  DELETE /api/v1/req-product
  //  @access Private [User]
  @Delete(':id')
  @Roles(['user'])
  @UseGuards(AuthGuard)
  remove(@Param('id') id: string, @Req() req) {
    if (req.user.role.toLowerCase() === 'admin') {
      throw new UnauthorizedException();
    }
    const user_id = req.user._id;
    return this.requestProductService.remove(id, user_id);
  }
}
