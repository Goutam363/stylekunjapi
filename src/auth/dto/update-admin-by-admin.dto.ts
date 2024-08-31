import { IsEnum, IsNotEmpty } from "class-validator";
import { AccountStatus } from "../account-status.enum";

export class UpdateAdminByAdminDto {
    @IsNotEmpty()
    name: string;

    @IsNotEmpty()
    email: string;

    @IsNotEmpty()
    username: string;

    admin_details: string;

    @IsEnum(AccountStatus)
    account_status: AccountStatus;
}