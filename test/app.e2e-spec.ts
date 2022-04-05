import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';

import { AppModule } from './../src/app.module';
import { Environment } from 'src/common/configs/environment.config';
import { CreatePostDto } from 'src/post/dto/create-post.dto';
import { PostEntity } from 'src/post/entities/post.entity';
import { Repository } from 'typeorm';
import { getRepositoryToken } from '@nestjs/typeorm';

if (process.env.NODE_ENV !== Environment.Test) {
  throw new Error('NODE_ENV must be "test"!');
}

const postData: CreatePostDto = {
  body: 'body 1',
  title: 'title 1',
  userId: 1,
};

jest.setTimeout(15000);

describe('AppController (e2e)', () => {
  let app: INestApplication;

  let postRepository: Repository<PostEntity>;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    postRepository = moduleFixture.get<Repository<PostEntity>>(
      getRepositoryToken(PostEntity),
    );
    await app.init();
  });

  beforeEach(async () => {
    await postRepository.clear();
  });

  afterAll(async () => {
    await app.close();
  });

  describe('create post', () => {
    it('/ should be get status code 400', async () => {
      const post = await request(app.getHttpServer()).post('/posts');
      expect(post.statusCode).toBe(400);
    });

    it('/ should be succes create a new post', async () => {
      const post = await request(app.getHttpServer())
        .post('/posts')
        .send(postData);

      expect(post.statusCode).toBe(201);
      expect(post.body.body).toBe(postData.body);
      expect(post.body.title).toBe(postData.title);
      expect(post.body.userId).toBe(postData.userId);
      expect(post.body.id).toBeDefined();
    });
  });

  describe('findAll posts', () => {
    it('/ should be get all posts & save in the database', async () => {
      const posts = await request(app.getHttpServer()).get('/posts?save=true');

      const postsCheck = await postRepository.find();
      expect(posts.body.length).toEqual(postsCheck.length);
    });

    it('/ should be get all posts & not be stored in the database', async () => {
      const posts = await request(app.getHttpServer()).get('/posts');

      const postsCheck = await postRepository.find();

      expect(posts.body.length).not.toEqual(postsCheck.length);
      expect(posts.status).toEqual(200);
      expect(postsCheck.length).toEqual(0);
    });

    it('/ should be succes create a new post', async () => {
      const post = await request(app.getHttpServer())
        .post('/posts')
        .send(postData);

      expect(post.statusCode).toBe(201);
      expect(post.body.body).toBe(postData.body);
      expect(post.body.title).toBe(postData.title);
      expect(post.body.userId).toBe(postData.userId);
      expect(post.body.id).toBeDefined();
    });
  });

  describe('findOne post', () => {
    it('/ should be get single post', async () => {
      const post = await request(app.getHttpServer()).get('/posts/1');

      expect(post.statusCode).toBe(200);
      expect(post.body.body).toBeDefined();
      expect(post.body.title).toBeDefined();
      expect(post.body.userId).toBeDefined();
      expect(post.body.id).toBeDefined();
    });

    it('/ should be throw 404 exception', async () => {
      const post = await request(app.getHttpServer()).get('/posts/1mm0080802');

      expect(post.statusCode).toBe(404);
    });
  });

  describe('update post', () => {
    it('/ should be update post', async () => {
      const putPost = await request(app.getHttpServer())
        .put('/posts/1')
        .send(postData);

      const patchPost = await request(app.getHttpServer())
        .put('/posts/1')
        .send(postData);

      expect(putPost.statusCode).toBe(200);
      expect(putPost.body.body).toBe(postData.body);
      expect(putPost.body.title).toBe(postData.title);
      expect(putPost.body.userId).toBe(postData.userId);
      expect(putPost.body.id).toEqual(1);

      expect(patchPost.statusCode).toBe(200);
      expect(patchPost.body.body).toBe(postData.body);
      expect(patchPost.body.title).toBe(postData.title);
      expect(patchPost.body.userId).toBe(postData.userId);
      expect(patchPost.body.id).toEqual(1);
    });
  });

  describe('update post', () => {
    it('/ should be update post', async () => {
      const post = await request(app.getHttpServer()).delete('/posts/1');

      expect(post.statusCode).toBe(200);
    });
  });
});
