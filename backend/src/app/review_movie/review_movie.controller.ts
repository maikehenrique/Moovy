import {
  Controller,
  Post,
  Delete,
  Param,
  Body,
  HttpCode
} from '@nestjs/common';
import { SaveReviewMovieDto } from './dto/save-review-movie-dto';
import { ReviewMovieService } from './review_movie.service';

@Controller('api/v1/review-movie')
export class ReviewMovieController {
  constructor(private readonly reviewService: ReviewMovieService) {}

  @Post()
  @HttpCode(200)
  async save(@Body() body: SaveReviewMovieDto) {
    return this.reviewService.save(body);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.reviewService.remove(id);
  }
}
