import { IsNotEmpty } from "class-validator";

export class CreateCouponDto {
    @IsNotEmpty()
    coupon_code: string;

    @IsNotEmpty()
    base_value: number;

    @IsNotEmpty()
    discount: number;

    @IsNotEmpty()
    description: string;
}