import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ReviewMovieService } from './review_movie.service';
import { ReviewMovie } from './review_movie.entity';
import { ReviewMovieController } from './review_movie.controller';

@Module({
  imports: [TypeOrmModule.forFeature([ReviewMovie])],
  providers: [ReviewMovieService],
  controllers: [ReviewMovieController]
})
export class ReviewMovieModule {}
