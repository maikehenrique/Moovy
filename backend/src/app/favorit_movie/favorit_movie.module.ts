import { Module } from '@nestjs/common';
import { FavoritMovieService } from './favorit_movie.service';
import { FavoritMovie } from './favorit_movie.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FavoritMovieController } from './favorit_movie.controller';

@Module({
  imports: [TypeOrmModule.forFeature([FavoritMovie])],
  providers: [FavoritMovieService],
  controllers: [FavoritMovieController]
})
export class FavoritMovieModule {}
