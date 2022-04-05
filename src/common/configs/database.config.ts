import { registerAs } from '@nestjs/config';
import { MysqlConnectionOptions } from 'typeorm/driver/mysql/MysqlConnectionOptions';

import { PostEntity } from 'src/post/entities/post.entity';

export default registerAs(
  'database',
  (): MysqlConnectionOptions => ({
    type: 'mysql',
    port: +process.env.DATABASE_PORT,
    username: process.env.DATABASE_USERNAME,
    password: process.env.DATABASE_PASSWORD,
    database: process.env.DATABASE_NAME,
    synchronize: false,
    entities: [PostEntity],
  }),
);
