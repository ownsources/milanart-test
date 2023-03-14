import {
  ConflictException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TokensPairDto } from './dto/tokens-pair.dto';
import { EncryptionService } from './encryption.service';
import { AuthJwtService } from './auth-jwt.service';
import { LoginResponseDto } from './dto/login-response.dto';
import { LoginLocalRequestDto } from './dto/login-request.dto';
import { CreateUserDto } from './dto/сreate-user.dto';
import { UserResponseDto } from './dto/user-response.dto';
import { UserEntity } from './user.entity';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
    private readonly encryptionService: EncryptionService,
    private readonly authJwtService: AuthJwtService,
  ) {}

  public async create(identity: CreateUserDto): Promise<UserResponseDto> {
    const user = await this.userRepository.findOneBy({
      name: identity.name,
    });

    if (user) {
      throw new ConflictException('User already exist');
    }
    const passwordHash = await this.encryptionService.generateHash(
      identity.password,
    );

    const createdUser = this.userRepository.create({
      ...identity,
      password: passwordHash,
    });

    const savedUser = await this.userRepository.save(createdUser);

    return new UserResponseDto(savedUser);
  }

  public async login(
    loginData: LoginLocalRequestDto,
  ): Promise<LoginResponseDto> {
    const user = await this.userRepository.findOneBy({ name: loginData.name });

    const isPasswordValid = await this.encryptionService.compareHash(
      loginData.password,
      user.password,
    );
    if (!isPasswordValid) {
      throw new UnauthorizedException('Incorrect password');
    }

    const tokens = await this.generateAndSaveJwtPair(user.id);

    return {
      user: new UserResponseDto(user),
      tokens,
    };
  }

  public async generateAndSaveJwtPair(id: number): Promise<TokensPairDto> {
    const newJwtPair = await this.authJwtService.generateTokensPair(id);
    await this.userRepository.update(id, {
      refreshToken: newJwtPair.refreshToken,
    });

    return newJwtPair;
  }
}
