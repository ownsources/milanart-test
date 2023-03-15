import { Transform } from 'class-transformer';
import { IsEmail, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class SignUpLocalRequestDto {
  @IsEmail()
  @IsOptional()
  @Transform((params: { value: string }) => params.value.trim())
  email: string;

  @IsNotEmpty()
  @IsString()
  @Transform((params: { value: string }) => params.value.trim())
  password: string;

  @IsNotEmpty()
  @IsString()
  @Transform((params: { value: string }) => params.value.trim())
  name: string;
}
