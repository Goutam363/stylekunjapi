import { IsEnum, IsNotEmpty } from "class-validator";
import { AccountStatus } from "../account-status.enum";

export class UpdateUserByAdminDto {
    @IsNotEmpty()
    name: string;

    @IsNotEmpty()
    email: string;

    @IsNotEmpty()
    mobile: string;

    @IsNotEmpty()
    dob: string;

    @IsNotEmpty()
    username: string;

    @IsEnum(AccountStatus)
    account_status: AccountStatus;
}