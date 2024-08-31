import { IsNotEmpty } from "class-validator";

export class CreateOrderDto {
    @IsNotEmpty()
    product_ids: string;

    @IsNotEmpty()
    product_names: string;

    @IsNotEmpty()
    total_price: number;

    @IsNotEmpty()
    total_discount: number;

    @IsNotEmpty()
    delivery_charge: number;

    @IsNotEmpty()
    coupon_discount: number;

    @IsNotEmpty()
    net_amount: number;

    @IsNotEmpty()
    payment_id: string;

    @IsNotEmpty()
    quantities: string;

    @IsNotEmpty()
    email: string;

    @IsNotEmpty()
    mobile: string;

    @IsNotEmpty()
    billing_address: string;

    @IsNotEmpty()
    shipping_address: string;
}