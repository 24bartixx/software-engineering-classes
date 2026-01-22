import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { User } from './entities/user.entity';
import { Employee } from './entities/employee.entity';
import { HrEmployee } from './entities/hr-employee.entity';
import { ProjectManager } from './entities/project-manager.entity';
import { Administrator } from './entities/administrator.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      User,
      Employee,
      HrEmployee,
      ProjectManager,
      Administrator,
    ]),
  ],
  controllers: [UsersController],
  providers: [UsersService],
})
export class UsersModule {}
