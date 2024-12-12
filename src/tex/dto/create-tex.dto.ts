import { IsNumber, IsOptional } from 'class-validator';

export class CreateTexDto {
  @IsNumber({}, { message: 'texPrice must be a number' })
  @IsOptional()
  texPrice: number;
  @IsNumber({}, { message: 'shippingPrice must be a number' })
  @IsOptional()
  shippingPrice: number;
}
