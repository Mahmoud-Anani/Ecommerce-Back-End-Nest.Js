import { PartialType } from '@nestjs/mapped-types';
import { CreateSuppliersDto } from './create-suppliers.dto';

export class UpdateSuppliersDto extends PartialType(CreateSuppliersDto) {}
