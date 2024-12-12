import { PartialType } from '@nestjs/mapped-types';
import { CreateTexDto } from './create-tex.dto';

export class UpdateTexDto extends PartialType(CreateTexDto) {}
