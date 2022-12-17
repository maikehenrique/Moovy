import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { SearchMovie, FindMovieComplete } from './dto/search-movie-dto';
import fetch from 'node-fetch';
import { Repository } from 'typeorm';
import { ReviewMovie } from '../review_movie/review_movie.entity';

const urlApi = process.env.OMDBAPIURL || 'https://www.omdbapi.com/';

@Injectable()
export class SearchMovieService {
  constructor(
    @InjectRepository(ReviewMovie)
    private readonly reviewMovieRepository: Repository<ReviewMovie>
  ) {}

  async findAll(body: SearchMovie): Promise<any> {
    let movies;
    const apiKey = process.env.OMDPAPIKEY;
    await fetch(urlApi + `?s=${body.search}&apikey=${apiKey}&page=${body.page}`)
      .then(async (response) => {
        const isJson = response.headers
          .get('content-type')
          ?.includes('application/json');
        const data = isJson ? await response.json() : null;

        movies = data;
        movies.idUsuario = body.idUsuario;

        if (!response.ok) {
          const error =
            (data && data.Error) || (data && data.message) || response.status;
          return Promise.reject(error);
        }
      })
      .catch((err) => {
        throw new NotFoundException(err);
      });

    if (
      movies.Error &&
      movies.Error !== 'Too many results.' &&
      movies.Error !== 'Movie not found!'
    ) {
      const resultMovies = await this.findMovieDB(movies);

      if (resultMovies === null) {
        return movies;
      } else if (resultMovies[0]?.rstatus) {
        return resultMovies[0]?.rretorno;
      } else {
        throw new NotFoundException(resultMovies[0]?.rmensagem);
      }
    } else {
      return movies;
    }
  }

  async findMovieDB(someParam): Promise<any> {
    const params = JSON.stringify(someParam);
    const encodedString = Buffer.from(params).toString('base64');
    const query = `SELECT * FROM f_entidade_movie('search_movies','${encodedString}');`;

    return await this.reviewMovieRepository.manager.query(query);
  }

  async findCompleteInformation(movies: FindMovieComplete): Promise<any> {
    let movieComplete;
    const apiKey = process.env.OMDPAPIKEY;

    await fetch(urlApi + `?i=${movies?.imdbRating}&apikey=${apiKey}`)
      .then(async (response) => {
        const isJson = response.headers
          .get('content-type')
          ?.includes('application/json');
        const data = isJson ? await response.json() : null;

        if (!response.ok) {
          const error =
            (data && data.Error) || (data && data.message) || response.status;
          return Promise.reject(error);
        }
        movieComplete = data;
      })
      .catch((err) => {
        throw new NotFoundException(err);
      });
    return movieComplete;
  }
}
