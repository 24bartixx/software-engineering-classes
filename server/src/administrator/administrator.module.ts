import { Module } from '@nestjs/common';
import { AdministratorService } from './administrator.service';
import { AdministratorController } from './administrator.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Administrator } from './entities/administrator.entity';
import { HrEmployee } from 'src/hr-employee/entities/hr-employee.entity';
import { ProjectManager } from 'src/project-managers/entities/project-manager.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Administrator, HrEmployee, ProjectManager]),
  ],
  controllers: [AdministratorController],
  providers: [AdministratorService],
  exports: [TypeOrmModule],
})
export class AdministratorModule {}
