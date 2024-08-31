import { IsEnum, IsNotEmpty } from "class-validator";
import { AccountStatus } from "../account-status.enum";

export class UpdateUserByStaffDto {
    @IsNotEmpty()
    mobile: string;

    @IsNotEmpty()
    dob: string;

    @IsEnum(AccountStatus)
    account_status: AccountStatus;
}