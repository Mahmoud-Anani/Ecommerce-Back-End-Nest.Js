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
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { AuthGuard } from './guard/Auth.guard';
import { Roles } from './decorator/Roles.decorator';

@Controller('v1/user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  //  @docs   Admin Can Create User
  //  @Route  POST /api/v1/user
  //  @access Private [admin]
  @Post()
  @Roles(['admin'])
  @UseGuards(AuthGuard)
  create(
    @Body(new ValidationPipe({ forbidNonWhitelisted: true }))
    createUserDto: CreateUserDto,
  ) {
    return this.userService.create(createUserDto);
  }
  //  @docs   Admin Can Get All Users
  //  @Route  GET /api/v1/user
  //  @access Private [admin]
  @Get()
  @Roles(['admin'])
  @UseGuards(AuthGuard)
  findAll() {
    return this.userService.findAll();
  }
  //  @docs   Admin Can Get Single User
  //  @Route  GET /api/v1/user/:id
  //  @access Private [admin]
  @Get(':id')
  @Roles(['admin'])
  @UseGuards(AuthGuard)
  findOne(@Param('id') id: string) {
    return this.userService.findOne(id);
  }
  //  @docs   Admin Can Update Single User
  //  @Route  UPDATE /api/v1/user/:id
  //  @access Private [admin]
  @Patch(':id')
  @Roles(['admin'])
  @UseGuards(AuthGuard)
  update(
    @Param('id') id: string,
    @Body(new ValidationPipe({ forbidNonWhitelisted: true }))
    updateUserDto: UpdateUserDto,
  ) {
    return this.userService.update(id, updateUserDto);
  }
  //  @docs   Admin Can Delete Single User
  //  @Route  DELETE /api/v1/user/:id
  //  @access Private [admin]
  @Delete(':id')
  @Roles(['admin'])
  @UseGuards(AuthGuard)
  remove(@Param('id') id: string) {
    return this.userService.remove(id);
  }
}
