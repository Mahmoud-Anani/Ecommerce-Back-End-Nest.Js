import {
  IsDateString,
  IsNumber,
  IsString,
  MaxLength,
  Min,
  MinLength,
} from 'class-validator';

export class CreateCouponDto {
  @IsString({ message: 'name must be a string' })
  @MinLength(3, { message: 'name must be at least 3 characters' })
  @MaxLength(100, { message: 'name must be at most 100 characters' })
  name: string;
  @IsString({ message: 'expireDate must be a string' })
  @IsDateString(
    {},
    {
      message:
        'expireDate must be a valid date string in the format YYYY-MM-DD',
    },
  )
  expireDate: string;
  @IsNumber({}, { message: 'discount must be a number' })
  @Min(0, { message: 'discount must be at least 0' })
  discount: number;
}
