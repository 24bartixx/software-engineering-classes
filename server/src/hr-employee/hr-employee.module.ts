import { Module } from '@nestjs/common';
import { HrEmployeeService } from './hr-employee.service';
import { HrEmployeeController } from './hr-employee.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { HrEmployee } from './entities/hr-employee.entity';
import { Employee } from 'src/employee/entities/employee.entity';

@Module({
  imports: [TypeOrmModule.forFeature([HrEmployee, Employee])],
  controllers: [HrEmployeeController],
  providers: [HrEmployeeService],
})
export class HrEmployeeModule {}
