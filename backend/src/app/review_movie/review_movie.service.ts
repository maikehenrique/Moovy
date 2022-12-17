import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { SaveReviewMovieDto } from './dto/save-review-movie-dto';
import { ReviewMovie } from './review_movie.entity';

@Injectable()
export class ReviewMovieService {
  private readonly reviews: ReviewMovie[] = [];

  constructor(
    @InjectRepository(ReviewMovie)
    private readonly reviewMovieRepository: Repository<ReviewMovie>
  ) {}

  async save(review: SaveReviewMovieDto): Promise<ReviewMovie> {
    return this.reviewMovieRepository.save(
      this.reviewMovieRepository.create(review)
    );
  }

  async remove(idMovie): Promise<any> {
    const movie = await this.reviewMovieRepository.findOne({
      where: { idMovie: idMovie }
    });

    if (!movie) {
      throw new NotFoundException(`Review movie not found with id ${idMovie}`);
    }

    const query = `DELETE FROM review_movie rm WHERE rm.id_movie = '${movie.idMovie}';`;

    return await this.reviewMovieRepository.manager.query(query);
  }
}
