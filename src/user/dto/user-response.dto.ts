import { UserEntity } from "../user.entity";

export class UserResponseDto {
  id: number;
  email: string;
  name: string;
  avatar: string;

  constructor(user: UserEntity) {
    this.id = user.id;
    this.email = user.email;
    this.name = user.name;
    this.avatar = user.avatar;
  }
}
