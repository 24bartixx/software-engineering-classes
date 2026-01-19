// import { Module } from '@nestjs/common';
// import { AppController } from './app.controller';
// import { AppService } from './app.service';

// @Module({
//   imports: [],
//   controllers: [AppController],
//   providers: [AppService],
// })
// export class AppModule {}

import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { ProjectsModule } from './projects/projects.module';
import { UsersModule } from './users/users.module';
import { BelbinModule } from './belbin/belbin.module';

@Module({
  imports: [
    ConfigModule.forRoot(), // Obsługa pliku .env
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DB_HOST || 'localhost',
      port: 5432,
      username: process.env.DB_USER || 'postgres',
      password: process.env.DB_PASSWORD,
      database: process.env.DB_DATABASE || 'teambuilder',
      autoLoadEntities: true,
      synchronize: false,
    }),
    ProjectsModule,
    UsersModule,
    BelbinModule,
  ],
})
export class AppModule {}
