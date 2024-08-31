import { IsNotEmpty } from "class-validator";

export class ContactUsDto {
    @IsNotEmpty()
    name: string;

    @IsNotEmpty()
    email: string;

    @IsNotEmpty()
    mobile: string;

    @IsNotEmpty()
    subject: string;

    @IsNotEmpty()
    message: string;
}