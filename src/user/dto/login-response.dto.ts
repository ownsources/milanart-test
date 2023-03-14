import { TokensPairDto } from './tokens-pair.dto';
import { UserResponseDto } from './user-response.dto';

export class LoginResponseDto {
  user: UserResponseDto;
  tokens: TokensPairDto;
}
