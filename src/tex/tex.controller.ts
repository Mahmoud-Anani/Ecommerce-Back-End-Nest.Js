import { Controller, Get, Post, Body, Delete, UseGuards } from '@nestjs/common';
import { TexService } from './tex.service';
import { CreateTexDto } from './dto/create-tex.dto';
import { Roles } from 'src/user/decorator/Roles.decorator';
import { AuthGuard } from 'src/user/guard/Auth.guard';

@Controller('v1/tex')
export class TexController {
  constructor(private readonly texService: TexService) {}

  //  @docs  Can Admin Create Or Update Tex
  //  @Route  POST /api/v1/tex
  //  @access Private [admin]
  @Post()
  @Roles(['admin'])
  @UseGuards(AuthGuard)
  create(@Body() createTexDto: CreateTexDto) {
    return this.texService.createOrUpdate(createTexDto);
  }

  //  @docs  Can Admin Get Tex
  //  @Route  GET /api/v1/tex
  //  @access Private [admin]
  @Get()
  @Roles(['admin'])
  @UseGuards(AuthGuard)
  find() {
    return this.texService.find();
  }

  //  @docs  Can Admin ReSet Tes
  //  @Route  DELETE /api/v1/tex
  //  @access Private [admin]
  @Delete()
  @Roles(['admin'])
  @UseGuards(AuthGuard)
  reSet() {
    return this.texService.reSet();
  }
}
