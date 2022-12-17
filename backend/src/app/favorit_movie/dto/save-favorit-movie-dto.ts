import { IsNotEmpty } from 'class-validator';
import { FavoritMovie } from '../favorit_movie.entity';

export class FavoritMovieDto {
  @IsNotEmpty()
  idMovie: string;

  @IsNotEmpty()
  idUser: string;

  idFavoritMovie: number;

  action: string;

  public static fromEntity(entity: FavoritMovie) {
    return {
      id_favorit_movie: entity.id_favorit_movie,
      id_user: entity.idUser,
      id_movie: entity.idMovie,
      created_at: entity.createdAt
    };
  }
}

export class SearchFavoritAll {
  @IsNotEmpty()
  public idUser: string;
}
