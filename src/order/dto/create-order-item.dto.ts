import { IsNotEmpty } from "class-validator";

export class CreateOrderItemDto {
    @IsNotEmpty()
    order_id: string;

    @IsNotEmpty()
    product_id: string;

    @IsNotEmpty()
    product_image: string;

    @IsNotEmpty()
    product_name: string;

    @IsNotEmpty()
    quantity: number;

    @IsNotEmpty()
    net_mrp: number;

    @IsNotEmpty()
    net_amount: number;
}