import { IsBoolean } from 'class-validator';

export class QueryCreatePostDto {
  @IsBoolean()
  save: boolean;
}
