import { Controller, Post, Body, HttpCode } from '@nestjs/common';
import {
  FavoritMovieDto,
  SearchFavoritAll
} from './dto/save-favorit-movie-dto';
import { FavoritMovieService } from './favorit_movie.service';

@Controller('api/v1')
export class FavoritMovieController {
  constructor(private readonly reviewService: FavoritMovieService) {}

  @Post('favorit-movie/add')
  @HttpCode(200)
  async save(@Body() body: FavoritMovieDto) {
    return this.reviewService.save(body);
  }

  @Post('favorit-movie/remove')
  @HttpCode(200)
  async remove(@Body() body: FavoritMovieDto) {
    return this.reviewService.remove(body);
  }

  @Post('favorit-movie-all')
  @HttpCode(200)
  async findAll(@Body() body: SearchFavoritAll) {
    return this.reviewService.findAll(body);
  }
}
