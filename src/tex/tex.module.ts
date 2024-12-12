import { Module } from '@nestjs/common';
import { TexService } from './tex.service';
import { TexController } from './tex.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Tex, texSchema } from './tex.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: Tex.name,
        schema: texSchema,
      },
    ]),
  ],
  controllers: [TexController],
  providers: [TexService],
})
export class TexModule {}
