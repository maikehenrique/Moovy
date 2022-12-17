import { Controller, Post, Body, HttpCode } from '@nestjs/common';
import { SearchMovie, FindMovieComplete } from './dto/search-movie-dto';
import { SearchMovieService } from './search_movie.service';

@Controller('api/v1')
export class SearchMovieController {
  constructor(private readonly searchService: SearchMovieService) {}

  @Post('search-movie')
  @HttpCode(200)
  async findAll(@Body() body: SearchMovie): Promise<string> {
    return this.searchService.findAll(body);
  }

  @Post('find-movie-complete')
  @HttpCode(200)
  async findCompleteInformation(
    @Body() body: FindMovieComplete
  ): Promise<string> {
    return this.searchService.findCompleteInformation(body);
  }
}
