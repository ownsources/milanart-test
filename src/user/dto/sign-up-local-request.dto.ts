import { IsEmail, IsNotEmpty, IsString, Matches } from "class-validator";

export class SignUpLocalRequestDto {
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsNotEmpty()
  @IsString()
  @Matches(/^(?=.*[0-9])(?=.*[a-z]).{8}/, {
      message: 'Password must be at least 8 characters long, and must have at least 1 letter and at least 1 number.',
  })
  password: string;

  @IsNotEmpty()
  @IsString()
  name: string;
}
