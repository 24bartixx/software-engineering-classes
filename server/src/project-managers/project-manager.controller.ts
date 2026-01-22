import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  UseInterceptors,
} from '@nestjs/common';
import { ProjectManagerService } from './project-manager.service';
import { UpdateProjectManagerDto } from './dto/update-project-manager.dto';
import { CreateProjectManagerDto } from './dto/create-project-manager.dto';
import { ProjectManager } from './entities/project-manager.entity';

@Controller('project-managers')
@UseInterceptors(ClassSerializerInterceptor)
export class ProjectManagerController {
  constructor(private readonly projectManagerService: ProjectManagerService) {}

  @Post()
  async create(
    @Body() createProjectManagerDto: CreateProjectManagerDto,
  ): Promise<ProjectManager> {
    return await this.projectManagerService.create(createProjectManagerDto);
  }

  @Get()
  async findAll(): Promise<ProjectManager[]> {
    return await this.projectManagerService.findAll();
  }

  @Get(':id')
  async findOne(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<ProjectManager> {
    return await this.projectManagerService.findOne(id);
  }

  @Patch(':id')
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateProjectManagerDto: UpdateProjectManagerDto,
  ): Promise<ProjectManager> {
    return await this.projectManagerService.update(id, updateProjectManagerDto);
  }

  @Delete(':id')
  async remove(@Param('id', ParseIntPipe) id: number): Promise<void> {
    return await this.projectManagerService.remove(id);
  }
}
