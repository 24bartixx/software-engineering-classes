import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { User } from './entities/user.entity';
import { Employee } from '../employee/entities/employee.entity';
import { HrEmployee } from '../hr-employee/entities/hr-employee.entity';
import { EmployeeDepartment } from '../employee-department/entities/employee-department.entity';
import { EmployeeBranch } from '../employee-branch/entities/employee-branch.entity';
import { Administrator } from 'src/administrator/entities/administrator.entity';
import { ProjectManager } from 'src/project-managers/entities/project-manager.entity';
import { Address } from 'src/addresses/entities/address.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      User,
      Employee,
      HrEmployee,
      ProjectManager,
      Administrator,
      EmployeeDepartment,
      EmployeeBranch,
      Address,
    ]),
  ],
  controllers: [UsersController],
  providers: [UsersService],
})
export class UsersModule {}
