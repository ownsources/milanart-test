
import * as request from 'supertest';
import { Test } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import { AppModule } from '../app.module';

describe('Sign Up Endpoint', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleFixture = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  it('should create a new user when valid signup data is provided', async () => {
    const response = await request(app.getHttpServer())
      .post('/auth/signup')
      .send({
        name: 'Test User',
        password: 'testpassword',
      })
      .expect(201);

    const { user } = response.body;

    expect(user).toBeDefined();
    expect(user.name).toEqual('Test User');
    expect(user.password).toBeUndefined();
  });

  it('should return a 400 error when name is not provided', async () => {
    await request(app.getHttpServer())
      .post('/auth/signup')
      .send({
        password: 'testpassword',
      })
      .expect(400);
  });

  it('should return a 400 error when password is not provided', async () => {
    await request(app.getHttpServer())
      .post('/auth/signup')
      .send({
        name: 'Test User',
      })
      .expect(400);
  });

  it('should return a 409 error when attempting to create a user with an existing name', async () => {
    await request(app.getHttpServer())
      .post('/auth/signup')
      .send({
        name: 'Test User',
        password: 'testpassword',
      })
      .expect(409);
  });
});