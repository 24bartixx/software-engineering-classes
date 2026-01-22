import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { ProjectsModule } from './projects/projects.module';
import { UsersModule } from './users/users.module';
import { BelbinModule } from './belbin/belbin.module';
import { AddressesModule } from './addresses/addresses.module';
import { RolesModule } from './roles/roles.module';
import { AuthModule } from './auth/auth.module';
import { SystemConfigModule } from './system-config/system-config.module';
import { DepartmentModule } from './department/department.module';
import { EmployeeModule } from './employee/employee.module';
import { EmployeeDepartmentModule } from './employee-department/employee-department.module';

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
    SystemConfigModule,
    AuthModule,
    AddressesModule,
    UsersModule,
    ProjectsModule,
    BelbinModule,
    RolesModule,
    DepartmentModule,
    EmployeeModule,
    EmployeeDepartmentModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
