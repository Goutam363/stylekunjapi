import { IsNotEmpty } from "class-validator";

export class UpdateContactByAdminDto {
    @IsNotEmpty()
    name: string;

    @IsNotEmpty()
    email: string;

    mobile: string;

    dnd: boolean;

    address: string;

    isUser: boolean;

    usernames: string;
}