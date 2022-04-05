import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'posts' })
export class PostEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'user_id' })
  userId: number;

  @Column()
  title: string;

  @Column()
  body: string;

  // create instance with optional properties
  constructor(partial: Partial<PostEntity>) {
    Object.assign(this, partial);
  }
}
