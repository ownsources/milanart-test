import {
  ConflictException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { EncryptionService } from './encryption.service';
import { AuthJwtService } from './auth-jwt.service';
import { LoginResponseDto } from './dto/login-response.dto';
import { LoginLocalRequestDto } from './dto/login-request.dto';
import { CreateUserDto } from './dto/create-user.dto';
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

  public async signUp(identity: CreateUserDto): Promise<UserResponseDto> {
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

    if (!user) {
      throw new UnauthorizedException('Incorrect login or password');
    }

    const isPasswordValid = await this.encryptionService.compareHash(
      loginData.password,
      user.password,
    );

    if (!isPasswordValid) {
      throw new UnauthorizedException('Incorrect login or password');
    }

    const tokens = await this.authJwtService.generateAndSaveJwtPair(user.id);

    return {
      user: new UserResponseDto(user),
      tokens,
    };
  }
}
