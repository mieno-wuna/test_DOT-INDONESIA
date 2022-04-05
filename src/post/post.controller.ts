import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Req,
  NotFoundException,
  HttpException,
  Put,
  Query,
} from '@nestjs/common';
import { Request } from 'express';
import axios, { AxiosResponse } from 'axios';

import { PostService } from './post.service';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { Method } from '../common/helpers/method';

@Controller('posts')
export class PostController {
  constructor(private readonly postService: PostService) {}

  @Post()
  async create(@Body() createPostDto: CreatePostDto, @Req() req: Request) {
    const post: AxiosResponse<CreatePostDto> = await axios
      .post(
        `${process.env.BASE_URL_THIRD_PARTY}${req.url}`,
        JSON.stringify(createPostDto),
        {
          headers: {
            'Content-Type': 'application/json',
          },
        },
      )
      .catch((err) => err.response);

    if (post.status !== 201) {
      throw new HttpException(post.statusText, post.status);
    }

    return post.data;
  }

  @Get()
  async findAll(@Query('save') isSave: boolean, @Req() req: Request) {
    const posts: AxiosResponse<CreatePostDto[]> = await axios
      .get(`${process.env.BASE_URL_THIRD_PARTY}${req.url}`)
      .catch((err) => err.response);

    if (posts.status !== 200) {
      throw new NotFoundException();
    }

    if (isSave) {
      posts.data = await this.postService.create(posts.data);
    }

    return posts.data;
  }

  @Get(':id')
  async findOne(@Req() req: Request) {
    const post: AxiosResponse = await axios
      .get(`${process.env.BASE_URL_THIRD_PARTY}${req.url}`)
      .catch((err) => err.response);

    if (post.status !== 200) {
      throw new NotFoundException();
    }

    return post.data;
  }

  @Patch(':id')
  patch(
    @Param('id') id: number,
    @Body() updatePostDto: UpdatePostDto,
    @Req() req: Request,
  ) {
    return this.update(id, updatePostDto, req);
  }

  @Put(':id')
  put(
    @Param('id') id: number,
    @Body() updatePostDto: UpdatePostDto,
    @Req() req: Request,
  ) {
    return this.update(id, updatePostDto, req);
  }

  // https://github.com/nestjs/nest/issues/783#issuecomment-397817106
  async update(id: number, updatePostDto: UpdatePostDto, req: Request) {
    const post: AxiosResponse = await axios[Method[req.method]](
      `${process.env.BASE_URL_THIRD_PARTY}${req.url}`,
      {
        headers: {
          'Content-Type': 'application/json',
        },
        data: JSON.stringify(updatePostDto),
      },
    ).catch((err) => err.response);

    if (post.status !== 200) {
      throw new HttpException(post.statusText, post.status);
    }

    return {
      ...JSON.parse(post.data.data),
      id: post.data.id,
    };
  }

  @Delete(':id')
  async remove(@Param('id') id: number, @Req() req: Request) {
    const post: AxiosResponse = await axios
      .delete(`${process.env.BASE_URL_THIRD_PARTY}${req.url}`)
      .catch((err) => err.response);

    return post.data;
  }
}
