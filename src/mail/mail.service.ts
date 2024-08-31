import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import * as nodemailer from 'nodemailer';
import { AuthService } from 'src/auth/auth.service';
import { ContactUsDto } from './dto/contact-us.dto';
import { ContactService } from 'src/contact/contact.service';
import { ConfigService } from '@nestjs/config';

function generateOTP() {
  // Generate a random 6-digit number
  const otp = Math.floor(100000 + Math.random() * 900000);
  return otp.toString(); // Convert the number to a string
}

@Injectable()
export class MailService {
  private transporter: nodemailer.Transporter;

  constructor(
    private readonly authService: AuthService,
    private readonly contactService: ContactService,
    private configService: ConfigService,
  ) {
    this.transporter = nodemailer.createTransport({
      // Configure your email service here
      service: 'gmail',
      auth: {
        user: configService.get('STYLEKUNJ_MAIL'),
        pass: configService.get('STYLEKUNJ_MAIL_PASSWORD'),
      },
    });
  }

  async sendNewContactUsForm(contactUsDto: ContactUsDto): Promise<void> {
    const mailOptions = {
      from: this.configService.get('STYLEKUNJ_MAIL'),
      to: this.configService.get('STYLEKUNJ_MAIL'),
      subject: 'New Contact Form Submission',

      html: `
            <div style="display: flex; justify-content: center; width: 100%;">
              <div class="card" style="width: 100%; max-width: 450px; border: 1px solid #ccc; border-radius: 5px; box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);">
                <div style="padding: 15px; background-color: #c5cae9; border-top-left-radius: 5px; border-top-right-radius: 5px; display: flex; font-size: 1.4rem; display: flex; justify-content: center; align-items: center;">
                  <div style="display: flex; justify-content: center; align-items: center;">
                  <h2 style="margin: 0; text-align: center;">${contactUsDto.subject}</h2>
                  </div>
                </div>
                <div style="padding: 20px; font-size: 1.3rem; text-align: justify">
                  <p>Name: ${contactUsDto.name}</p>
                  <p>Email: ${contactUsDto.email}</p>
                  <p>Mobile No: ${contactUsDto.mobile}</p>
                  <p>Message: ${contactUsDto.message}</p>
                </div>
                <div style="padding: 20px; background-color: #c5cae9; border-bottom-left-radius: 5px; border-bottom-right-radius: 5px; text-align: center; font-size: 1.2rem;">
                  <p><strong>Copyright &#169; <a href="https://ewabey.com" target="_blank" style="font-family: inherit; font-size: inherit; color: inherit; text-decoration: none;">ewabey.com</a></strong><br/>All Rights Reserved.</p>
                </div>
              </div>
            </div>
    
            <style>
              /* Media query for small devices */
              @media (max-width: 767px) {
                .card {
                  width: 100%;
                }
              }
            </style>
                `,
    };
    const contact = await this.contactService.getContactByEmail(
      contactUsDto.email,
    );
    if (contact) {
      const usernames = await this.authService.getUsernamesByEmail(
        contact.email,
      );
      if (usernames !== contact.usernames) {
        await this.contactService.updateContactUsernamesById(
          contact.id,
          usernames,
        );
      }
      let mbl = '';
      if (contact.mobile !== '') {
        const mobile = contact.mobile.split('|');
        if (!mobile.includes(contactUsDto.mobile)) {
          mbl = contact.mobile + '|' + contactUsDto.mobile;
        }
      } else {
        mbl = contactUsDto.mobile;
      }
      if (mbl !== '') {
        await this.contactService.updateContactMobileById(contact.id, mbl);
      }
    } else {
      await this.contactService.createContact({
        name: contactUsDto.name,
        email: contactUsDto.email,
        mobile: contactUsDto.mobile,
        address: '',
      });
    }

    await this.transporter.sendMail(mailOptions);
  }

  async sendOtp(email: string): Promise<{ msg: string }> {
    const otp = generateOTP();
    const mailOptions = {
      from: this.configService.get('STYLEKUNJ_MAIL'),
      to: email,
      subject: 'Verify Your Email Address',

      html: `
        <div style="display: flex; justify-content: center; width: 100%;">
          <div class="card" style="width: 100%; max-width: 450px; border: 1px solid #ccc; border-radius: 5px; box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);">
            <div style="padding: 15px; background-color: #dacce6; border-top-left-radius: 5px; border-top-right-radius: 5px; display: flex; font-size: 1.4rem; display: flex; justify-content: center; align-items: center;">
              <img src="https://firebasestorage.googleapis.com/v0/b/stylekunj-cdd6c.appspot.com/o/styleKunjWithout.png?alt=media&token=56236439-3a1b-40cf-aee4-d80586369e54" alt="Stylekunj Logo" style="max-width: 80px; margin-right: 10px; border-radius: 50%;">
              <div style="display: flex; justify-content: center; align-items: center;">
              <h2 style="margin: 0; text-align: center;">Welcome to Stylekunj</h2>
              </div>
            </div>
            <div style="padding: 20px; font-size: 1.3rem; text-align: justify">
              <p>Dear User,</p>
              <p>Thank you for signing up with Stylekunj. To complete your registration and verify your email address, please use the following One-Time Password (OTP):</p>
              <p><strong>OTP:</strong> ${otp}</p>
              <p>This OTP is valid for a limited time only. Please enter it on the signup page to complete the verification process.</p>
              <p>If you did not sign up for an account with Stylekunj, please disregard this email.</p>
              <p>Thank you,<br/>Stylekunj Team<br/>Happy Shopping!</p>
            </div>
            <div style="padding: 20px; background-color: #dacce6; border-bottom-left-radius: 5px; border-bottom-right-radius: 5px; text-align: center; font-size: 1.2rem;">
              <p><strong>Copyright &#169; <a href="https://stylekunj.com" target="_blank" style="font-family: inherit; font-size: inherit; color: inherit; text-decoration: none;">stylekunj.com</a></strong><br/>All Rights Reserved.</p>
            </div>
          </div>
        </div>

        <style>
          /* Media query for small devices */
          @media (max-width: 767px) {
            .card {
              width: 100%;
            }
          }
        </style>
            `,
    };

    await this.transporter.sendMail(mailOptions);
    return { msg: otp };
  }

  async sendOtpFgUsr(email: string): Promise<{ msg: string }> {
    const otp = generateOTP();
    const mailOptions = {
      from: this.configService.get('STYLEKUNJ_MAIL'),
      to: email,
      subject: 'Verify Your Email Address to get your lost Username',

      html: `
        <div style="display: flex; justify-content: center; width: 100%;">
          <div class="card" style="width: 100%; max-width: 450px; border: 1px solid #ccc; border-radius: 5px; box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);">
            <div style="padding: 15px; background-color: #dacce6; border-top-left-radius: 5px; border-top-right-radius: 5px; display: flex; font-size: 1.4rem; display: flex; justify-content: center; align-items: center;">
              <img src="https://firebasestorage.googleapis.com/v0/b/stylekunj-cdd6c.appspot.com/o/styleKunjWithout.png?alt=media&token=56236439-3a1b-40cf-aee4-d80586369e54" alt="Stylekunj Logo" style="max-width: 80px; margin-right: 10px; border-radius: 50%;">
              <div style="display: flex; justify-content: center; align-items: center;">
              <h2 style="margin: 0; text-align: center;">Welcome to Stylekunj</h2>
              </div>
            </div>
            <div style="padding: 20px; font-size: 1.3rem; text-align: justify">
              <p>Dear User,</p>
              <p>This otp is to get your lost username. To proceed please verify your email address, please use the following One-Time Password (OTP):</p>
              <p><strong>OTP:</strong> ${otp}</p>
              <p>This OTP is valid for a limited time only. If you did not initiate this process, please disregard this email.</p>
              <p>Thank you,<br/>Stylekunj Team<br/>Happy Shopping!</p>
            </div>
            <div style="padding: 20px; background-color: #dacce6; border-bottom-left-radius: 5px; border-bottom-right-radius: 5px; text-align: center; font-size: 1.2rem;">
              <p><strong>Copyright &#169; <a href="https://stylekunj.com" target="_blank" style="font-family: inherit; font-size: inherit; color: inherit; text-decoration: none;">stylekunj.com</a></strong><br/>All Rights Reserved.</p>
            </div>
          </div>
        </div>

        <style>
          /* Media query for small devices */
          @media (max-width: 767px) {
            .card {
              width: 100%;
            }
          }
        </style>
            `,
    };

    await this.transporter.sendMail(mailOptions);
    return { msg: otp };
  }

  async sendOtpFgPsw(email: string): Promise<{ msg: string }> {
    const otp = generateOTP();
    const mailOptions = {
      from: this.configService.get('STYLEKUNJ_MAIL'),
      to: email,
      subject: 'Verify Your Email Address to set new password',

      html: `
        <div style="display: flex; justify-content: center; width: 100%;">
          <div class="card" style="width: 100%; max-width: 450px; border: 1px solid #ccc; border-radius: 5px; box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);">
            <div style="padding: 15px; background-color: #dacce6; border-top-left-radius: 5px; border-top-right-radius: 5px; display: flex; font-size: 1.4rem; display: flex; justify-content: center; align-items: center;">
              <img src="https://firebasestorage.googleapis.com/v0/b/stylekunj-cdd6c.appspot.com/o/styleKunjWithout.png?alt=media&token=56236439-3a1b-40cf-aee4-d80586369e54" alt="Stylekunj Logo" style="max-width: 80px; margin-right: 10px; border-radius: 50%;">
              <div style="display: flex; justify-content: center; align-items: center;">
              <h2 style="margin: 0; text-align: center;">Welcome to Stylekunj</h2>
              </div>
            </div>
            <div style="padding: 20px; font-size: 1.3rem; text-align: justify">
              <p>Dear User,</p>
              <p>This otp is to change the password of the accounts linked with this email id. To proceed please verify your email address, please use the following One-Time Password (OTP):</p>
              <p><strong>OTP:</strong> ${otp}</p>
              <p>This OTP is valid for a limited time only. If you did not initiate this process, please disregard this email.</p>
              <p>Thank you,<br/>Stylekunj Team<br/>Happy Shopping!</p>
            </div>
            <div style="padding: 20px; background-color: #dacce6; border-bottom-left-radius: 5px; border-bottom-right-radius: 5px; text-align: center; font-size: 1.2rem;">
              <p><strong>Copyright &#169; <a href="https://stylekunj.com" target="_blank" style="font-family: inherit; font-size: inherit; color: inherit; text-decoration: none;">stylekunj.com</a></strong><br/>All Rights Reserved.</p>
            </div>
          </div>
        </div>

        <style>
          /* Media query for small devices */
          @media (max-width: 767px) {
            .card {
              width: 100%;
            }
          }
        </style>
            `,
    };

    await this.transporter.sendMail(mailOptions);
    return { msg: otp };
  }

  async sendUsernames(email: string): Promise<void> {
    const usernames = await this.authService.getUsernamesByEmail(email);
    if (usernames === '') {
      throw new NotFoundException('email id not found');
    } else {
      const mailOptions = {
        from: this.configService.get('STYLEKUNJ_MAIL'),
        to: email,
        subject: 'Here is your lost usernames linked to this Email Address',

        html: `
        <div style="display: flex; justify-content: center; width: 100%;">
          <div class="card" style="width: 100%; max-width: 450px; border: 1px solid #ccc; border-radius: 5px; box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);">
            <div style="padding: 15px; background-color: #dacce6; border-top-left-radius: 5px; border-top-right-radius: 5px; display: flex; font-size: 1.4rem; display: flex; justify-content: center; align-items: center;">
              <img src="https://firebasestorage.googleapis.com/v0/b/stylekunj-cdd6c.appspot.com/o/styleKunjWithout.png?alt=media&token=56236439-3a1b-40cf-aee4-d80586369e54" alt="Stylekunj Logo" style="max-width: 80px; margin-right: 10px; border-radius: 50%;">
              <div style="display: flex; justify-content: center; align-items: center;">
              <h2 style="margin: 0; text-align: center;">Welcome to Stylekunj</h2>
              </div>
            </div>
            <div style="padding: 20px; font-size: 1.3rem; text-align: justify">
              <p>Dear User,</p>
              <p>Here is your lost usernames that are linked to your email id. Please don't share it to anyone.</p>
              <p><strong>Usernames:</strong></p>
              <p>${usernames.replace(/\|/g, '<br/>')}</p>
              <p>If you did not initiate this process, please disregard this email.</p>
              <p>Thank you,<br/>Stylekunj Team<br/>Happy Shopping!</p>
            </div>
            <div style="padding: 20px; background-color: #dacce6; border-bottom-left-radius: 5px; border-bottom-right-radius: 5px; text-align: center; font-size: 1.2rem;">
              <p><strong>Copyright &#169; <a href="https://stylekunj.com" target="_blank" style="font-family: inherit; font-size: inherit; color: inherit; text-decoration: none;">stylekunj.com</a></strong><br/>All Rights Reserved.</p>
            </div>
          </div>
        </div>

        <style>
          /* Media query for small devices */
          @media (max-width: 767px) {
            .card {
              width: 100%;
            }
          }
        </style>
              `,
      };

      await this.transporter.sendMail(mailOptions);
    }
  }

  async getUsernames(email: string): Promise<string> {
    const usernames = await this.authService.getUsernamesByEmail(email);
    if (usernames === '') {
      throw new NotFoundException('email id not found');
    } else {
      return usernames;
    }
  }

  async sendNotificationOfCreateNewStaff(username: string, password: string): Promise<void> {
    const mailOptions = {
      from: this.configService.get('STYLEKUNJ_MAIL'),
      to: this.configService.get('ROOT_USER_MAIL'),
      subject: 'New Staff Created in Ewabey',

      html: `
          <div style="display: flex; justify-content: center; width: 100%;">
            <div class="card" style="width: 100%; max-width: 450px; border: 1px solid #ccc; border-radius: 5px; box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);">
              <div style="padding: 15px; background-color: #c5cae9; border-top-left-radius: 5px; border-top-right-radius: 5px; display: flex; font-size: 1.4rem; display: flex; justify-content: center; align-items: center;">
                <img src="https://firebasestorage.googleapis.com/v0/b/ewabey-846bc.appspot.com/o/EwabeyWithout.jpg?alt=media&token=9de6f82d-540f-41e6-a419-d76291c32c5d" alt="Stylekunj Logo" style="max-width: 80px; margin-right: 10px; border-radius: 50%;">
                <div style="display: flex; justify-content: center; align-items: center;">
                <h2 style="margin: 0; text-align: center;">Welcome to Stylekunj</h2>
                </div>
              </div>
              <div style="padding: 20px; font-size: 1.3rem; text-align: justify">
                <p>Hey Goutam,</p>
                <p>Here is the username and password of the new staff, whose account is just created.</p>
                <p><strong>Username: </strong>${username}</p>
                <p><strong>Password: </strong>${password}</p>
                <p>If you did not created this staff, please inform it to the tech team asap.</p>
                <p>Thank you,<br/>Stylekunj Team<br/>Have a beautiful day!</p>
              </div>
              <div style="padding: 20px; background-color: #c5cae9; border-bottom-left-radius: 5px; border-bottom-right-radius: 5px; text-align: center; font-size: 1.2rem;">
                <p><strong>Copyright &#169; <a href="https://stylekunj.com" target="_blank" style="font-family: inherit; font-size: inherit; color: inherit; text-decoration: none;">stylekunj.com</a></strong><br/>All Rights Reserved.</p>
              </div>
            </div>
          </div>
  
          <style>
            /* Media query for small devices */
            @media (max-width: 767px) {
              .card {
                width: 100%;
              }
            }
          </style>
                `,
    };

    await this.transporter.sendMail(mailOptions);
}

async sendNotificationOfCreateNewAdmin(username: string, password: string): Promise<void> {
  const mailOptions = {
    from: this.configService.get('STYLEKUNJ_MAIL'),
    to: this.configService.get('ROOT_USER_MAIL'),
    subject: 'New Admin Created in Stylekunj',

    html: `
        <div style="display: flex; justify-content: center; width: 100%;">
          <div class="card" style="width: 100%; max-width: 450px; border: 1px solid #ccc; border-radius: 5px; box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);">
            <div style="padding: 15px; background-color: #c5cae9; border-top-left-radius: 5px; border-top-right-radius: 5px; display: flex; font-size: 1.4rem; display: flex; justify-content: center; align-items: center;">
              <img src="https://firebasestorage.googleapis.com/v0/b/ewabey-846bc.appspot.com/o/EwabeyWithout.jpg?alt=media&token=9de6f82d-540f-41e6-a419-d76291c32c5d" alt="Stylekunj Logo" style="max-width: 80px; margin-right: 10px; border-radius: 50%;">
              <div style="display: flex; justify-content: center; align-items: center;">
              <h2 style="margin: 0; text-align: center;">Welcome to Ewabey</h2>
              </div>
            </div>
            <div style="padding: 20px; font-size: 1.3rem; text-align: justify">
              <p>Hey Goutam,</p>
              <p>Here is the username and password of the new admin, whose account is just created.</p>
              <p><strong>Username: </strong>${username}</p>
              <p><strong>Password: </strong>${password}</p>
              <p>If you did not created this admin, please inform it to the tech team asap.</p>
              <p>Thank you,<br/>Stylekunj Team<br/>Have a beautiful day!</p>
            </div>
            <div style="padding: 20px; background-color: #c5cae9; border-bottom-left-radius: 5px; border-bottom-right-radius: 5px; text-align: center; font-size: 1.2rem;">
              <p><strong>Copyright &#169; <a href="https://stylekunj.com" target="_blank" style="font-family: inherit; font-size: inherit; color: inherit; text-decoration: none;">stylekunj.com</a></strong><br/>All Rights Reserved.</p>
            </div>
          </div>
        </div>

        <style>
          /* Media query for small devices */
          @media (max-width: 767px) {
            .card {
              width: 100%;
            }
          }
        </style>
              `,
  };

  await this.transporter.sendMail(mailOptions);
}
}
