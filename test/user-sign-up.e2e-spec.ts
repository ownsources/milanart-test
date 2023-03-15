import * as request from 'supertest';
import { Test } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import { AppModule } from '../src/app.module';

const signUpUrl = '/user/sign-up';

describe('Sign Up Endpoint', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleFixture = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(
      new ValidationPipe({ whitelist: true, transform: true }),
    );
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  it('should create a new user when valid signup data is provided', async () => {
    const response = await request(app.getHttpServer())
      .post(signUpUrl)
      .send({
        name: 'Test User 2',
        password: 'testpassword',
      })
      .expect(201);

    expect(response.body.id).toBeDefined();
    expect(response.body.name).toEqual('Test User 2');
  });

  it('should create a new user with avatar when valid signup data is provided', async () => {
    const filePath = 'test/assets/avatar.jpg';

    const response = await request(app.getHttpServer())
      .post(signUpUrl)
      .set('Content-Type', 'multipart/form-data')
      .field('name', 'Test User 3')
      .field('password', 'testpassword')
      .attach('avatar', filePath)
      .expect(201);

    expect(response.body.id).toBeDefined();
    expect(response.body.name).toEqual('Test User 3');
    expect(response.body.avatar).toBeDefined();
  });

  it('should return 400 status if file type is not allowed', async () => {
    const filePath = 'test/assets/avatar.txt';

    const response = await request(app.getHttpServer())
      .post(signUpUrl)
      .field('name', 'Test User')
      .field('password', 'testpassword')
      .attach('avatar', filePath)
      .expect(400);
  });

  it('should return a 400 error when name is not provided', async () => {
    await request(app.getHttpServer())
      .post(signUpUrl)
      .send({
        password: 'testpassword',
      })
      .expect(400);
  });

  it('should return a 400 error when password is not provided', async () => {
    await request(app.getHttpServer())
      .post(signUpUrl)
      .send({
        name: 'Test User',
      })
      .expect(400);
  });

  it('should return a 409 error when attempting to create a user with an existing name', async () => {
    await request(app.getHttpServer()).post(signUpUrl).send({
      name: 'Test User 4',
      password: 'testpassword',
    });

    await request(app.getHttpServer())
      .post(signUpUrl)
      .send({
        name: 'Test User 4',
        password: 'newtestpassword',
      })
      .expect(409);
  });
});
