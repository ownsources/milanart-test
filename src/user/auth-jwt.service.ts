import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { TokensPairDto } from './dto/tokens-pair.dto';
import { TokenPayloadType } from '../auth/types/token-payload.type';

@Injectable()
export class AuthJwtService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  public async generateTokensPair(id: number): Promise<TokensPairDto> {
    const accessPayload: TokenPayloadType = { id };
    const refreshPayload: TokenPayloadType = { id };

    const accessToken = await this.jwtService.signAsync(accessPayload, {
      expiresIn: this.configService.get('JWT_ACCESS_EXPIRATION_TIME'),
    });

    const refreshToken = await this.jwtService.signAsync(refreshPayload, {
      expiresIn: this.configService.get('JWT_REFRESH_EXPIRATION_TIME'),
    });

    return {
      accessToken,
      refreshToken,
    };
  }

  public async verifyToken<T extends {}>(token: string): Promise<T> {
    return this.jwtService.verify(token);
  }
}
