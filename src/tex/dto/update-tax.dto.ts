import { PartialType } from '@nestjs/mapped-types';
import { CreateTexDto } from './create-tax.dto';

export class UpdateTexDto extends PartialType(CreateTexDto) {}
