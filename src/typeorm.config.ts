import { config } from 'dotenv';
import { SnakeNamingStrategy } from 'typeorm-naming-strategies';
import { DataSource } from 'typeorm';
import { ConfigService } from '@nestjs/config';
import { join } from 'path';
import { UserEntity } from './user/user.entity';

config();

const configService = new ConfigService();

console.log('process.env.DB_HOST', process.env.DB_HOST);
console.log('configService.get(POSTGRES_HOST)', configService.get('POSTGRES_HOST'));
const connectionSource = new DataSource({
  type: 'postgres',
  host: configService.get('POSTGRES_HOST'),
  port: configService.get('POSTGRES_PORT'),
  username: configService.get('POSTGRES_USER'),
  password: configService.get('POSTGRES_PASSWORD'),
  database: configService.get('POSTGRES_DB'),
  entities: [UserEntity],
  synchronize: true,
  logging: true,
  namingStrategy: new SnakeNamingStrategy(),
});
module.exports = {
  connectionSource,
};
