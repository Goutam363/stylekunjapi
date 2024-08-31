import { IsEnum, IsOptional, IsString } from 'class-validator';
import { OrderStatus } from '../order-status.enum';

export class GetOrdersFilterDto {
  @IsOptional()
  @IsEnum(OrderStatus)
  status?: OrderStatus;

  @IsOptional()
  @IsString()
  search?: string;
}