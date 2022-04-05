import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Environment } from 'src/common/configs/environment.config';
import { PostEntity } from './entities/post.entity';
import { PostService } from './post.service';

if (process.env.NODE_ENV !== Environment.Test) {
  throw new Error('NODE_ENV must be "test"!');
}

describe('PostService', () => {
  let postService: PostService;
  let postRepository: Repository<PostEntity>;
  const POST_REPOSITORY_TOKEN = getRepositoryToken(PostEntity);

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PostService,
        {
          provide: POST_REPOSITORY_TOKEN,
          useValue: {
            save: jest.fn().mockResolvedValue([]),
          },
        },
      ],
    }).compile();

    postService = module.get<PostService>(PostService);
    postRepository = module.get<Repository<PostEntity>>(POST_REPOSITORY_TOKEN);
  });

  it('postService should be defined', () => {
    expect(postService).toBeDefined();
  });

  it('postRepository should be defined', () => {
    expect(postRepository).toBeDefined();
  });

  it('postRepository return orders & total orders', async () => {
    const dataPosts = [
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
    ];

    await postService.create(dataPosts);

    expect(postRepository.save).toBeCalledWith(dataPosts);
  });
});
