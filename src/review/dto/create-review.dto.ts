import {
  IsMongoId,
  IsNumber,
  IsOptional,
  IsString,
  Max,
  Min,
  MinLength,
} from 'class-validator';

export class CreateReviewDto {
  @IsOptional()
  @IsString({ message: 'reviewText Must be a string' })
  @MinLength(3, { message: 'The reviewText Must be Min 3 characters' })
  reviewText: string;

  @IsNumber({}, { message: 'rating Must be a Number' })
  @Min(1, { message: 'The rating Must be Min 1 star' })
  @Max(5, { message: 'The rating Must be Min 5 star' })
  rating: number;

  @IsMongoId({ message: 'product Must be a MongoId' })
  product: string;
}
