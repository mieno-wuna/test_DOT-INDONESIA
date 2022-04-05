import { Test, TestingModule } from '@nestjs/testing';
import axios from 'axios';
import { Request } from 'express';

import { Environment } from 'src/common/configs/environment.config';
import { PostController } from './post.controller';
import { PostService } from './post.service';

if (process.env.NODE_ENV !== Environment.Test) {
  throw new Error('NODE_ENV must be "test"!');
}

describe('PostController', () => {
  let postController: PostController;
  let postService: PostService;

  const postSuccesData = {
    status: 200,
    data: [
      {
        body: 'body 1',
        title: 'title 1',
        userId: 1,
      },
      {
        body: 'body 2',
        title: 'title 2',
        userId: 2,
      },
    ],
  };

  const postFailData = {
    response: {
      status: 404,
      statusText: 'Not Found',
    },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PostController],
      providers: [
        {
          provide: PostService,
          useValue: {
            create: jest.fn().mockResolvedValue([]),
          },
        },
      ],
    }).compile();

    postController = module.get<PostController>(PostController);
    postService = module.get<PostService>(PostService);
  });

  it('postController should be defined', async () => {
    expect(postController).toBeDefined();
  });

  it('postService should be defined', async () => {
    expect(postService).toBeDefined();
  });

  describe('PostController.create', () => {
    it('should be succes create post', async () => {
      const postSuccesData = {
        status: 201,
        data: {
          body: 'body',
          title: 'title',
          userId: 1,
        },
      };
      const req = { url: 'posts' } as Request;
      jest.spyOn(axios, 'post').mockResolvedValue(postSuccesData);

      const posts = await postController.create(postSuccesData.data, req);

      expect(axios.post).toBeCalledWith(
        `${process.env.BASE_URL_THIRD_PARTY}${req.url}`,
        JSON.stringify(postSuccesData.data),
        {
          headers: {
            'Content-Type': 'application/json',
          },
        },
      );
      expect(posts).toEqual(postSuccesData.data);
    });

    it('should be throw exception', async () => {
      const postFailData = {
        response: {
          status: 500,
          statusText: 'Something went wrong!',
        },
        data: {
          body: 'body',
          title: 'title',
          userId: 1,
        },
      };
      const req = { url: 'posts' } as Request;
      jest.spyOn(axios, 'post').mockRejectedValue(postFailData);

      try {
        await postController.create(postFailData.data, req);
      } catch (error) {
        expect(error.message).toEqual(postFailData.response.statusText);
        expect(error.status).toEqual(postFailData.response.status);
      }
    });
  });

  describe('PostController.findAll', () => {
    it('should be succes findAll posts & should not be stored in the database', async () => {
      const postSuccesData = {
        status: 200,
        data: [
          {
            body: 'body 1',
            title: 'title 1',
            userId: 1,
          },
          {
            body: 'body 2',
            title: 'title 2',
            userId: 2,
          },
        ],
      };
      const req = { url: 'posts' } as Request;
      jest.spyOn(axios, 'get').mockResolvedValue(postSuccesData);
      const posts = await postController.findAll(false, req);
      expect(axios.get).toBeCalledWith(
        `${process.env.BASE_URL_THIRD_PARTY}${req.url}`,
      );
      expect(posts).toEqual(postSuccesData.data);
      expect(postService.create).not.toBeCalled();
    });

    it('should be succes findAll posts & should be stored in the database', async () => {
      const req = { url: 'posts' } as Request;
      jest.spyOn(axios, 'get').mockResolvedValue(postSuccesData);
      const posts = await postController.findAll(true, req);
      expect(posts).toEqual(postSuccesData.data);
      expect(postService.create).toBeCalledWith([
        {
          body: 'body 1',
          title: 'title 1',
          userId: 1,
        },
        {
          body: 'body 2',
          title: 'title 2',
          userId: 2,
        },
      ]);
    });

    it('findAll should be fail & throw not found exception', async () => {
      const req = { url: 'posts' } as Request;
      jest.spyOn(axios, 'get').mockResolvedValue({});
      try {
        await postController.findAll(true, req);
      } catch (error) {
        expect(error.message).toEqual(postFailData.response.statusText);
        expect(error.status).toEqual(postFailData.response.status);
      }
    });

    it('should be throw exception', async () => {
      const postFailData = {
        response: {
          status: 500,
          statusText: 'Something went wrong!',
        },
        data: {
          body: 'body',
          title: 'title',
          userId: 1,
        },
      };
      const req = { url: 'posts' } as Request;
      jest.spyOn(axios, 'post').mockRejectedValue(postFailData);
      try {
        await postController.create(postFailData.data, req);
      } catch (error) {
        expect(error.message).toEqual(postFailData.response.statusText);
        expect(error.status).toEqual(postFailData.response.status);
      }
    });
  });

  describe('PostController.findOne', () => {
    it('should be succes get single post data', async () => {
      const postSuccesData = {
        status: 200,
        data: {
          body: 'body 1',
          title: 'title 1',
          userId: 1,
        },
      };
      const req = { url: 'posts' } as Request;
      jest.spyOn(axios, 'get').mockResolvedValue(postSuccesData);

      const posts = await postController.findOne(req);

      expect(posts).toEqual(postSuccesData.data);
    });

    it('should be fail & throw exception', async () => {
      const req = { url: 'posts' } as Request;
      jest.spyOn(axios, 'get').mockRejectedValue(postFailData);
      try {
        await postController.findOne(req);
      } catch (error) {
        expect(error.message).toEqual(postFailData.response.statusText);
        expect(error.status).toEqual(postFailData.response.status);
      }
    });
  });

  describe('PostController.put', () => {
    it('should be succes update posts', async () => {
      const postSuccesData = {
        status: 200,
        data: { body: 'body 1', title: 'title 1', userId: 1 },
        id: 1,
      };
      const req = { url: 'posts', method: 'PUT' } as Request;
      jest.spyOn(axios, 'put').mockResolvedValue(postSuccesData);
      jest.spyOn(JSON, 'parse').mockReturnValue(postSuccesData);

      const posts = await postController.put(1, postSuccesData.data, req);

      expect(posts.data).toEqual(postSuccesData.data);
    });

    it('should be fail & throw exception', async () => {
      const req = { url: 'posts', method: 'PUT' } as Request;
      jest.spyOn(axios, 'put').mockRejectedValue(postFailData);
      try {
        await postController.put(1, {}, req);
      } catch (error) {
        expect(error.message).toEqual(postFailData.response.statusText);
        expect(error.status).toEqual(postFailData.response.status);
      }
    });
  });

  describe('PostController.patch', () => {
    it('should be succes update posts', async () => {
      const postSuccesData = {
        status: 200,
        data: { body: 'body 1', title: 'title 1', userId: 1 },
        id: 1,
      };
      const req = { url: 'posts', method: 'PATCH' } as Request;
      jest.spyOn(axios, 'patch').mockResolvedValue(postSuccesData);
      jest.spyOn(JSON, 'parse').mockReturnValue(postSuccesData);

      const posts = await postController.patch(1, postSuccesData.data, req);

      expect(posts.data).toEqual(postSuccesData.data);
    });

    it('should be fail & throw exception', async () => {
      const req = { url: 'posts', method: 'PATCH' } as Request;
      jest.spyOn(axios, 'patch').mockRejectedValue(postFailData);
      try {
        await postController.patch(1, {}, req);
      } catch (error) {
        expect(error.message).toEqual(postFailData.response.statusText);
        expect(error.status).toEqual(postFailData.response.status);
      }
    });
  });

  describe('PostController.remove', () => {
    it('should be succes delete single post data', async () => {
      const postSuccesData = {
        status: 200,
        data: {},
      };
      const req = { url: 'posts' } as Request;
      jest.spyOn(axios, 'delete').mockResolvedValue(postSuccesData);

      const posts = await postController.remove(1, req);

      expect(posts).toEqual(postSuccesData.data);
    });
  });
});
