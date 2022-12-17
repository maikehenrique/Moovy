import { Module } from '@nestjs/common';
import { ServeStaticModule } from '@nestjs/serve-static';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FavoritMovieModule } from './app/favorit_movie/favorit_movie.module';
import { ReviewMovieModule } from './app/review_movie/review_movie.module';
import { SearchMovieModule } from './app/search_movie/search_movie.module';
import { join } from 'path';

@Module({
  imports: [
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'public'),
      exclude: ['/api*']
    }),
    ConfigModule.forRoot(),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DB_HOST,
      port: Number(process.env.DB_PORT),
      database: process.env.DB_DATABASE,
      username: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      ssl:
        process.env.NODE_ENV === 'production'
          ? { rejectUnauthorized: false }
          : false,
      synchronize: true,
      entities: [__dirname + '/**/*.entity{.js,.ts}']
    }),
    FavoritMovieModule,
    ReviewMovieModule,
    SearchMovieModule
  ]
})
export class AppModule {}
