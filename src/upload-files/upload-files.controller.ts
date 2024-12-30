import {
  Controller,
  FileTypeValidator,
  MaxFileSizeValidator,
  ParseFilePipe,
  Post,
  UploadedFile,
  UploadedFiles,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { CloudinaryService } from './upload-files.service';
import { FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';
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
  uploadImage(
    @UploadedFile(
      new ParseFilePipe({
        validators: [
          new MaxFileSizeValidator({
            maxSize: 500000,
            message: 'File is too large must be less than 500KB',
          }),
          new FileTypeValidator({ fileType: 'image/png' }),
        ],
      }),
    )
    file: any,
  ) {
    return this.cloudinaryService.uploadFile(file);
  }
  //  @docs  Admin can upload images or files
  //  @Route  POST /api/v1/image/uploads
  //  @access Private [admin]
  @Post('uploads')
  @Roles(['admin'])
  @UseGuards(AuthGuard)
  @UseInterceptors(FilesInterceptor('files[]', 5))
  uploadImages(
    @UploadedFiles(
      new ParseFilePipe({
        validators: [
          new MaxFileSizeValidator({
            maxSize: 500000,
            message: 'File is too large must be less than 500KB',
          }),
          new FileTypeValidator({ fileType: 'image/png' }),
        ],
      }),
    )
    files: any,
  ) {
    return this.cloudinaryService.uploadFiles(files);
  }
}
