import { IsNotEmpty } from "class-validator";

export class UpdatePasswordDto {
    @IsNotEmpty()
    username: string;

    @IsNotEmpty()
    email: string;

    @IsNotEmpty()
    password: string;
}