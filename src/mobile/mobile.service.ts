import { Injectable } from '@nestjs/common';
import * as Twilio from 'twilio';
import axios from 'axios';
import { ConfigService } from '@nestjs/config';

function generateOTP() {
    // Generate a random 6-digit number
    const otp = Math.floor(100000 + Math.random() * 900000);
    return otp.toString(); // Convert the number to a string
    // return otp; // Return the number
  }

@Injectable()
export class MobileService {
    private readonly client: Twilio.Twilio;
    constructor(
      private configService: ConfigService,
    ) {
        this.client = Twilio(this.configService.get('TWILIO_AC_SID'), this.configService.get('TWILIO_AUTH_TOKEN'));
    }

    async sendOTP(phoneNumber: string): Promise<{msg:string}> {
        const otp = generateOTP();
        const message = `Dear User,\n\nThank you for signing up with Stylekunj. Your OTP is: ${otp}\n\nThis OTP is valid for a limited time only. Please enter it on the signup page to complete the verification process.\n\nIf you did not sign up for an account with Stylekunj, please disregard this message.\n\nThank you,\nStylekunj Team`;

        try {
            await this.client.messages.create({
                body: message,
                from: '+12512202207',
                to: phoneNumber
            });
            return {msg: otp};
        } catch (error) {
            console.error('Error sending OTP:', error);
            throw new Error('Failed to send OTP');
        }
    }

    async sendOTPbyf2s(phoneNumber: string): Promise<{msg:string}> {
        const otp = generateOTP();
        const requestData = {
            route: "otp",
            variables_values: `${otp}`,
            numbers: `${phoneNumber}`,
          };
          const config = {
            headers: {
              Authorization: this.configService.get('F2S_API_KEY'),
              'Content-Type': 'application/json'
            }
          };
        try {
            await axios.post('https://www.fast2sms.com/dev/bulkV2', requestData, config);
            return {msg: otp};
          } catch (error) {
            console.log(error);
            throw new Error('Failed to send OTP');
          }
    }
}
