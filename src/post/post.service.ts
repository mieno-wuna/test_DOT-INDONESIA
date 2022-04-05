import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { CreatePostDto } from './dto/create-post.dto';
import { PostEntity } from './entities/post.entity';

@Injectable()
export class PostService {
  constructor(
    @InjectRepository(PostEntity)
    private postRepository: Repository<PostEntity>,
  ) {}

  create(createPostDto: CreatePostDto[]) {
    const insertPosts: CreatePostDto[] = [];

    createPostDto.forEach((post) =>
      insertPosts.push(
        new PostEntity({
          body: post.body,
          title: post.title,
          userId: post.userId,
        }),
      ),
    );

    return this.postRepository.save(insertPosts);
  }
}
