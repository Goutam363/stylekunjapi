import { Body, Controller, Post } from '@nestjs/common';
import { MobileService } from './mobile.service';

@Controller('mobile')
export class MobileController {
    constructor(private readonly mobileService: MobileService) {}

    @Post('verify-mobile')
    async verifyMobile(@Body('phoneNumber') phoneNumber: string): Promise<{msg: string}> {
        const msg = await this.mobileService.sendOTPbyf2s(phoneNumber);
        return msg;
    }
}
