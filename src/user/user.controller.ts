import {
  Controller,
  Post,
  Body,
  UploadedFile,
  UseInterceptors,
  HttpCode,
  BadRequestException,
  FileTypeValidator,
  MaxFileSizeValidator,
  ParseFilePipe,
} from '@nestjs/common';
import { LoginResponseDto } from './dto/login-response.dto';
import { LoginLocalRequestDto } from './dto/login-request.dto';
import { SignUpLocalRequestDto } from './dto/sign-up-local-request.dto';
import { UserResponseDto } from './dto/user-response.dto';
import { UserService } from './user.service';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { FileInterceptor } from '@nestjs/platform-express';
import { v4 as uuid } from 'uuid';
import { Express } from 'express';
@Controller('user')
export class UserController {
  constructor(private userService: UserService) {}

  @Post('sign-up')
  @UseInterceptors(
    FileInterceptor('avatar', {
      storage: diskStorage({
        destination: '/app/data',
        filename: (req, file, cb) => {
          const randomName = uuid();
          const extension = extname(file.originalname);
          cb(null, `${randomName}${extension}`);
        },
      }),
    }),
  )
  public async signUp(
    @UploadedFile(
      new ParseFilePipe({
        validators: [
          new FileTypeValidator({ fileType: /(jpg|jpeg|png|gif)$/ }),
          new MaxFileSizeValidator({ maxSize: 2097152 }), //2mb
        ],
        fileIsRequired: false,
      }),
    )
    avatar: Express.Multer.File,
    @Body() signUpLocalRequest: SignUpLocalRequestDto,
  ): Promise<UserResponseDto> {
    return this.userService.signUp({
      ...signUpLocalRequest,
      avatar: avatar?.filename,
    });
  }

  @Post('login')
  @HttpCode(200)
  public async login(
    @Body() loginLocalRequest: LoginLocalRequestDto,
  ): Promise<LoginResponseDto> {
    return this.userService.login(loginLocalRequest);
  }
}
