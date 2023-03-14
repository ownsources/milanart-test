import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class LoginLocalRequestDto {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsNotEmpty()
  @IsString()
  password: string;
}
