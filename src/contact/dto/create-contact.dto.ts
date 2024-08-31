import { IsNotEmpty } from "class-validator";

export class CreateContactDto {
    @IsNotEmpty()
    name: string;

    @IsNotEmpty()
    email: string;

    mobile: string;

    address: string;
}