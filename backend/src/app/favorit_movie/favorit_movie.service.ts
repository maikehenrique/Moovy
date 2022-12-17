import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { FavoritMovieDto } from './dto/save-favorit-movie-dto';
import { FavoritMovie } from './favorit_movie.entity';

@Injectable()
export class FavoritMovieService {
  constructor(
    @InjectRepository(FavoritMovie)
    private readonly favoritMovieRepository: Repository<FavoritMovie>
  ) {}

  async save(data: FavoritMovieDto): Promise<FavoritMovie> {
    return this.favoritMovieRepository.save(
      this.favoritMovieRepository.create(data)
    );
  }

  async remove(data: FavoritMovieDto): Promise<any> {
    const movie = await this.favoritMovieRepository.findOne({
      where: { idMovie: data.idMovie, idUser: data.idUser }
    });

    if (!movie) {
      throw new NotFoundException(
        `Favorite movie not found with id ${data.idFavoritMovie}`
      );
    }

    await this.favoritMovieRepository.delete(movie.id_favorit_movie);

    const query = `DELETE FROM review_movie rm WHERE rm.id_movie = '${movie.idMovie}';`;
    await this.favoritMovieRepository.manager.query(query);

    return {
      message: `The favorit movie deleted with success`
    };
  }

  async findAll(someParam): Promise<any> {
    const dataObject = JSON.stringify(someParam);
    const resultFavoritMovie = await this.findAllFavoritMovie(dataObject);
    if (resultFavoritMovie === null) {
      return dataObject;
    } else if (resultFavoritMovie[0]?.rstatus) {
      return resultFavoritMovie[0]?.rretorno;
    } else {
      throw new NotFoundException(resultFavoritMovie[0]?.rmensagem);
    }
  }

  async findAllFavoritMovie(someParam): Promise<any> {
    const encodedString = Buffer.from(someParam).toString('base64');
    const query = `SELECT * FROM f_entidade_movie('search_favorit_movies','${encodedString}');`;
    return await this.favoritMovieRepository.manager.query(query);
  }
}
