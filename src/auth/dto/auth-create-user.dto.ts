import { IsString, Matches, MaxLength, MinLength } from 'class-validator';

export class AuthCreateUserDto {
  @IsString()
  @MinLength(2)
  @MaxLength(30)
  name: string;

  @IsString()
  @MinLength(6)
  @MaxLength(30)
  email: string;

  @IsString()
  @MinLength(8)
  @MaxLength(12)
  mobile: string;

  @IsString()
  @MinLength(8)
  @MaxLength(10)
  dob: string;

  @IsString()
  @MinLength(4)
  @MaxLength(20)
  username: string;

  @IsString()
  @MinLength(8)
  @MaxLength(20)
  @Matches(/((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/, {
    message:
      'Password must contain at least one uppercase and lowercase letter and one number or special character, and at least 8 or more characters & at most 20 characters',
  })
  password: string;

  // Passwords will contain at least 1 upper case letter
  // Passwords will contain at least 1 lower case letter
  // Passwords will contain at least 1 number or special character
  // There is no length validation (min, max) in this regex!
}
