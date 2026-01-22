import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ProjectManager } from './entities/project-manager.entity';
import { Repository } from 'typeorm';
import { CreateProjectManagerDto } from './dto/create-project-manager.dto';
import { UpdateProjectManagerDto } from './dto/update-project-manager.dto';
import { Employee } from 'src/employee/entities/employee.entity';

@Injectable()
export class ProjectManagerService {
  constructor(
    @InjectRepository(ProjectManager)
    private readonly projectManagerRepository: Repository<ProjectManager>,
    @InjectRepository(Employee)
    private readonly employeeRepository: Repository<Employee>,
  ) {}

  async create(
    createProjectManagerDto: CreateProjectManagerDto,
  ): Promise<ProjectManager> {
    const employee = await this.ensureEmployeeExists(
      createProjectManagerDto.employeeId,
    );
    await this.ensureEmployeeIsNotProjectManager(
      createProjectManagerDto.employeeId,
    );
    const projectManager = this.projectManagerRepository.create({
      employee: employee,
    });
    return await this.projectManagerRepository.save(projectManager);
  }

  async findAll(): Promise<ProjectManager[]> {
    return await this.projectManagerRepository.find({
      relations: ['employee', 'employee.user'],
    });
  }

  async findOne(id: number): Promise<ProjectManager> {
    const projectManager = await this.projectManagerRepository.findOne({
      where: { project_manager_id: id },
      relations: ['employee', 'employee.user'],
    });
    if (!projectManager) {
      throw new NotFoundException(`Project Manager with ID ${id} not found`);
    }
    return projectManager;
  }

  async remove(id: number): Promise<void> {
    const projectManager = await this.findOne(id);
    await this.projectManagerRepository.remove(projectManager);
  }

  private async ensureEmployeeExists(employeeId: number): Promise<Employee> {
    const employee = await this.employeeRepository.findOneBy({
      id: employeeId,
    });
    if (!employee) {
      throw new NotFoundException(`Employee with ID ${employeeId} not found`);
    }
    return employee;
  }

  private async ensureEmployeeIsNotProjectManager(
    employeeId: number,
  ): Promise<void> {
    const existingProjectManager = await this.projectManagerRepository.findOne({
      where: { employee_id: employeeId },
    });
    if (existingProjectManager) {
      throw new BadRequestException(
        `Employee with ID ${employeeId} is already a project manager`,
      );
    }
  }
}
