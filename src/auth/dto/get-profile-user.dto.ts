// import { IsString, Matches, MaxLength, MinLength } from 'class-validator';

export class GetUserProfileDto {
  name: string;
  email: string;
  mobile: string;
  dob: string;
  username: string;
  cart: string;
}