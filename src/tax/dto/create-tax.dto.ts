import { IsNumber, IsOptional } from 'class-validator';

export class CreateTexDto {
  @IsNumber({}, { message: 'taxPrice must be a number' })
  @IsOptional()
  taxPrice: number;
  @IsNumber({}, { message: 'shippingPrice must be a number' })
  @IsOptional()
  shippingPrice: number;
}
