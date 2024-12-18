import { IsNumber, IsOptional, IsString, Min } from 'class-validator';

export class UpdateCartItemsDto {
  @IsOptional()
  @IsNumber({}, { message: 'Quantity must be a number' })
  @Min(1, { message: 'Quantity must be greater than 0' })
  quantity: number;

  @IsOptional()
  @IsString({ message: 'Color must be a string' })
  color: string;
}
