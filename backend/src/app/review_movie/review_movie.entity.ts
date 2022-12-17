import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  PrimaryColumn,
  UpdateDateColumn
} from 'typeorm';

@Entity({ name: 'review_movie' })
export class ReviewMovie {
  @PrimaryColumn()
  @Column({ name: 'id_movie', nullable: false, primary: true })
  idMovie: string;

  @PrimaryColumn()
  @Column({ name: 'id_user', nullable: false, primary: true })
  idUser: string;

  @Column({ name: 'review', type: 'bytea', nullable: false })
  review: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: string;

  @UpdateDateColumn({ name: 'update_at' })
  updateAt: string;

  @DeleteDateColumn({ name: 'deleted_at' })
  deletedAt: string;
}
