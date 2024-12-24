import { IsBoolean, IsDate, IsOptional } from 'class-validator';

export class CreateOrderDto {
  @IsOptional()
  shippingAddress: string;
}
export class AcceptOrderCashDto {
  @IsOptional()
  @IsBoolean()
  isPaid: boolean;
  @IsOptional()
  @IsDate()
  paidAt: Date;
  @IsOptional()
  @IsBoolean()
  isDeliverd: boolean;
  @IsOptional()
  @IsDate()
  deliverdAt: Date;
}
