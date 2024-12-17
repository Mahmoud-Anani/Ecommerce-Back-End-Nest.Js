import {
  IsArray,
  IsMongoId,
  IsNumber,
  IsOptional,
  IsString,
  IsUrl,
  Max,
  Min,
  MinLength,
} from 'class-validator';

export class CreateProductDto {
  @IsString({ message: 'Title Must be a String' })
  @MinLength(3, { message: 'Title must be at least 3 characters' })
  title: string;

  @IsString({ message: 'Description Must be a String' })
  @MinLength(20, { message: 'Description must be at least 20 characters' })
  description: string;

  @IsNumber({}, { message: 'quantity Must be a Number' })
  @Min(1, { message: 'quantity must be at least 1 characters' })
  quantity: number;

  @IsString({ message: 'imageCover Must be a String' })
  @IsUrl({}, { message: 'imageCover Must be a URL' })
  imageCover: string;

  @IsArray({ message: 'Images Must be an array' })
  @IsOptional()
  images: string[];

  @IsNumber({}, { message: 'sold Must be a Number' })
  @IsOptional()
  sold: number;

  @IsNumber({}, { message: 'Price Must be a Number' })
  @Min(1, { message: 'price must be at least 1 L.E' })
  @Max(20000, { message: 'price must be at max 20000 L.E' })
  price: number;

  @IsOptional()
  @IsNumber({}, { message: 'priceAfterDiscount Must be a Number' })
  @Min(1, { message: 'priceAfterDiscount must be at least 1 L.E' })
  @Max(20000, { message: 'priceAfterDiscount must be at max 20000 L.E' })
  priceAfterDiscount: number;

  @IsOptional()
  @IsArray({ message: 'Images Must be an array' })
  colors: string[];

  @IsString({ message: 'category Must be a String' })
  @IsMongoId({ message: 'category Must be MongoId' })
  category: string;

  @IsOptional()
  @IsString({ message: 'subCategory Must be a String' })
  @IsMongoId({ message: 'subCategory Must be MongoId' })
  subCategory: string;

  @IsOptional()
  @IsString({ message: 'brand Must be a String' })
  @IsMongoId({ message: 'brand Must be MongoId' })
  brand: string;
}
