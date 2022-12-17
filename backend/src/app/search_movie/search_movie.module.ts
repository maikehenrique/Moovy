import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SearchMovieService } from './search_movie.service';
import { SearchMovieController } from './search_movie.controller';
import { ReviewMovie } from '../review_movie/review_movie.entity';

@Module({
  imports: [TypeOrmModule.forFeature([ReviewMovie])],
  providers: [SearchMovieService],
  controllers: [SearchMovieController]
})
export class SearchMovieModule {}
