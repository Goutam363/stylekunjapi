import { IsEnum, IsNotEmpty } from "class-validator";
import { OrderStatus } from "../order-status.enum";

export class UpdateOrderAdminDto {
    @IsNotEmpty()
    email: string;

    @IsNotEmpty()
    mobile: string;

    @IsNotEmpty()
    shipping_address: string;

    @IsEnum(OrderStatus)
    order_status: OrderStatus;
}