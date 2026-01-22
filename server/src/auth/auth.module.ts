import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { User } from 'src/users/entities/user.entity';
import { Employee } from 'src/employee/entities/employee.entity';
import { HrEmployee } from 'src/hr-employee/entities/hr-employee.entity';
import { ProjectManager } from 'src/users/entities/project-manager.entity';
import { Administrator } from 'src/administrator/entities/administrator.entity';
import { EmployeeDepartment } from 'src/employee-department/entities/employee-department.entity';
import { AddressesModule } from 'src/addresses/addresses.module';
import { EmailService } from 'src/common/email.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      User,
      Employee,
      HrEmployee,
      ProjectManager,
      Administrator,
      EmployeeDepartment,
    ]),
    AddressesModule,
  ],
  controllers: [AuthController],
  providers: [AuthService, EmailService],
})
export class AuthModule {}
