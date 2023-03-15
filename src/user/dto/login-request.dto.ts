import { Transform } from 'class-transformer';
import { IsNotEmpty, IsString } from 'class-validator';

export class LoginLocalRequestDto {
  @IsNotEmpty()
  @IsString()
  @Transform((params: { value: string }) => params.value.trim())
  name: string;

  @IsNotEmpty()
  @IsString()
  @Transform((params: { value: string }) => params.value.trim())
  password: string;
}
