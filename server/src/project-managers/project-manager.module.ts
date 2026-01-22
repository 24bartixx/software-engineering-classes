import { Module } from '@nestjs/common';
import { ProjectManagerService } from './project-manager.service';
import { ProjectManagerController } from './project-manager.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProjectManager } from './entities/project-manager.entity';
import { Employee } from 'src/employee/entities/employee.entity';

@Module({
  imports: [TypeOrmModule.forFeature([ProjectManager, Employee])],
  controllers: [ProjectManagerController],
  providers: [ProjectManagerService],
  exports: [TypeOrmModule],
})
export class ProjectManagerModule {}
