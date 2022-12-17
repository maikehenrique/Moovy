import { IsNotEmpty } from 'class-validator';
import { ReviewMovie } from '../review_movie.entity';
export class SaveReviewMovieDto {
  @IsNotEmpty()
  idUser: string;

  @IsNotEmpty()
  idMovie: string;

  @IsNotEmpty()
  review: string;

  public static fromEntity(entity: ReviewMovie) {
    return {
      id_user: entity.idUser,
      id_movie: entity.idMovie,
      review: entity.review,
      created_at: entity.createdAt
    };
  }
}
