import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { TokensPairDto } from './dto/tokens-pair.dto';
import { TokenPayloadType } from '../common/token-payload.type';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserEntity } from './user.entity';

@Injectable()
export class AuthJwtService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  public async generateAndSaveJwtPair(id: number): Promise<TokensPairDto> {
    const newJwtPair = await this.generateTokensPair(id);
    await this.userRepository.update(id, {
      refreshToken: newJwtPair.refreshToken,
    });

    return newJwtPair;
  }

  public async verifyToken<T extends {}>(token: string): Promise<T> {
    return this.jwtService.verify(token);
  }

  private async generateTokensPair(id: number): Promise<TokensPairDto> {
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
}
