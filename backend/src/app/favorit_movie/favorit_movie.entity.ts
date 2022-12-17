import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  PrimaryColumn,
  UpdateDateColumn
} from 'typeorm';
@Entity({ name: 'favorit_movie' })
export class FavoritMovie {
  @PrimaryGeneratedColumn('increment')
  id_favorit_movie: number;

  @PrimaryColumn()
  @Column({ name: 'id_user', nullable: true })
  idUser: string;

  @PrimaryColumn()
  @Column({ name: 'id_movie', nullable: false })
  idMovie: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: string;

  @UpdateDateColumn({ name: 'update_at' })
  updateAt: string;

  @DeleteDateColumn({ name: 'deleted_at' })
  deletedAt: string;
}
