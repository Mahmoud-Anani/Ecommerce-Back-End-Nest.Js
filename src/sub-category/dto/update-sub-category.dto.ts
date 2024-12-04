import { PartialType } from '@nestjs/mapped-types';
import { SubCreateCategoryDto } from './create-sub-category.dto';

export class UpdateSubCategoryDto extends PartialType(SubCreateCategoryDto) {}
