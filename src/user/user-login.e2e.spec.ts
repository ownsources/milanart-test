import { INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import * as request from 'supertest';
import { AppModule } from '../app.module';
import { UserService } from './user.service';

describe('Login Endpoint', () => {
  let app: INestApplication;
  let userService: UserService;

  beforeAll(async () => {
    const moduleFixture = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();

    userService = app.get<UserService>(UserService);

    // Create a test user to login with
    await userService.create({
      email: 'testemail@gmail.com',
      name: 'Test User',
      password: 'testpassword',
    });
  });

  afterAll(async () => {
    await app.close();
  });

  it('should return a JWT token when valid login data is provided', async () => {
    const response = await request(app.getHttpServer())
      .post('/user/login')
      .send({
        name: 'Test User',
        password: 'testpassword',
      })
      .expect(200);

    const { token } = response.body;

    expect(token).toBeDefined();
  });

  it('should return a 401 error when invalid name is provided', async () => {
    await request(app.getHttpServer())
      .post('/user/login')
      .send({
        name: 'Nonexistent User',
        password: 'testpassword',
      })
      .expect(401);
  });

  it('should return a 401 error when invalid password is provided', async () => {
    await request(app.getHttpServer())
      .post('user/login')
      .send({
        name: 'Test User',
        password: 'wrongpassword',
      })
      .expect(401);
  });
});
