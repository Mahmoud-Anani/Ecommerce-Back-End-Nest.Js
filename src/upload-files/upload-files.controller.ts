import {
  Controller,
  Post,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { CloudinaryService } from './upload-files.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { Roles } from 'src/user/decorator/Roles.decorator';
import { AuthGuard } from 'src/user/guard/Auth.guard';

@Controller('v1/image')
export class UploadFilesController {
  constructor(private readonly cloudinaryService: CloudinaryService) {}

  //  @docs  User can upload image or file
  //  @Route  POST /api/v1/image/upload
  //  @access Private [admin, user]
  @Post('upload')
  @Roles(['admin', 'user'])
  @UseGuards(AuthGuard)
  @UseInterceptors(FileInterceptor('file'))
  uploadImage(@UploadedFile() file: any) {
    return this.cloudinaryService.uploadFile(file);
  }
}
