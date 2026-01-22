import { Module } from '@nestjs/common';
import { EmployeeBranchService } from './employee-branch.service';
import { EmployeeBranchController } from './employee-branch.controller';
import { EmployeeBranch } from './entities/employee-branch.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Employee } from 'src/employee/entities/employee.entity';
import { Branch } from 'src/branches/entities/branch.entity';

@Module({
  imports: [TypeOrmModule.forFeature([EmployeeBranch, Employee, Branch])],
  controllers: [EmployeeBranchController],
  providers: [EmployeeBranchService],
})
export class EmployeeBranchModule {}
