import { IsNotEmpty } from "class-validator";

export class UpdateCartDto {
    @IsNotEmpty()
    username: string;

    cart: string;
}