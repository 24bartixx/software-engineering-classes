import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { ProjectsModule } from './projects/projects.module';
import { UsersModule } from './users/users.module';
import { BelbinModule } from './belbin/belbin.module';
import { AddressesModule } from './addresses/addresses.module';
import { RolesModule } from './roles/roles.module';
import { AuthController } from './auth/auth.controller';
import { EmailService } from './email/email.service';

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
    AddressesModule,
    UsersModule,
    ProjectsModule,
    BelbinModule,
    RolesModule,
  ],
  controllers: [AuthController],
  providers: [EmailService],
})
export class AppModule {}
