import { INestApplication, ValidationPipe } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';
import { UserService } from '../src/user/user.service';

const loginUrl = '/user/login';

describe('Login Endpoint', () => {
  let app: INestApplication;
  let userService: UserService;

  beforeAll(async () => {
    const moduleFixture = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(
      new ValidationPipe({ whitelist: true, transform: true }),
    );

    await app.init();

    userService = app.get<UserService>(UserService);
    // Create a test user to login with
    await userService.signUp({
      email: 'testemail@gmail.com',
      name: 'Test User 1',
      password: 'testpassword',
      avatar: 'random/path/to/avatar.jpeg',
    });
  });

  afterAll(async () => {
    await app.close();
  });

  it('should return a JWT token when valid login data is provided', async () => {
    const loginData = {
      name: 'Test User 1',
      password: 'testpassword',
    };
    const response = await request(app.getHttpServer())
      .post(loginUrl)
      .send({
        name: loginData.name,
        password: loginData.password,
      })
      .expect(200);

    const { user, tokens } = response.body;

    expect(user.name).toBe(loginData.name);
    expect(user.email).toBeDefined();
    expect(tokens.accessToken).toBeDefined();
    expect(tokens.refreshToken).toBeDefined();
  });

  it('should return a 401 error when provided name doesnt exist', async () => {
    await request(app.getHttpServer())
      .post(loginUrl)
      .send({
        name: 'Nonexistent User',
        password: 'testpassword',
      })
      .expect(401);
  });

  it('should return a 401 error when wrong password provided', async () => {
    await request(app.getHttpServer())
      .post(loginUrl)
      .send({
        name: 'Test User 1',
        password: 'wrongpassword',
      })
      .expect(401);
  });
});
