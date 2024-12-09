import { IsString, IsUrl, MaxLength, MinLength } from 'class-validator';

export class CreateSuppliersDto {
  @IsString({ message: 'name must be a string' })
  @MinLength(3, { message: 'name must be at least 3 characters' })
  @MaxLength(100, { message: 'name must be at most 100 characters' })
  name: string;
  @IsString({ message: 'website must be a string' })
  @IsUrl({}, { message: 'website must be a valid URL' })
  website: string;
}
