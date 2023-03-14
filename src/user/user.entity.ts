import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { Exclude } from 'class-transformer';

@Entity({ name: 'user' })
export class UserEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 300, unique: true, nullable: true })
  email: string;
  //неявное требование
  @Column({ type: 'varchar', length: 300, unique: true, nullable: true })
  name: string;

  @Exclude({ toPlainOnly: true })
  @Column({ type: 'varchar', length: 300, nullable: true })
  password: string;

  @Column({ type: 'varchar', length: 500, nullable: true })
  avatar: string;

  @Column({ type: 'varchar', length: 300, nullable: true })
  refreshToken: string;
}
