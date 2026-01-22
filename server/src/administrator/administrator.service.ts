import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Administrator } from './entities/administrator.entity';
import { Repository } from 'typeorm';
import { CreateAdministratorDto } from './dto/create-administrator.dto';
import { UpdateAdministratorDto } from './dto/update-administrator.dto';
import { HrEmployee } from 'src/hr-employee/entities/hr-employee.entity';
import { ProjectManager } from 'src/project-managers/entities/project-manager.entity';

@Injectable()
export class AdministratorService {
  constructor(
    @InjectRepository(Administrator)
    private readonly administratorRepository: Repository<Administrator>,
    @InjectRepository(HrEmployee)
    private readonly hrEmployeeRepository: Repository<HrEmployee>,
    @InjectRepository(ProjectManager)
    private readonly projectManagerRepository: Repository<ProjectManager>,
  ) {}

  async create(
    createAdministratorDto: CreateAdministratorDto,
  ): Promise<Administrator> {
    const hrEmployee = await this.ensureHrEmployeeExists(
      createAdministratorDto.hrEmployeeId,
    );
    const projectManager = await this.ensureProjectManagerExists(
      createAdministratorDto.projectManagerId,
    );

    const administrator = this.administratorRepository.create({
      hr_employee_id: createAdministratorDto.hrEmployeeId,
      project_manager_id: createAdministratorDto.projectManagerId,
      hrEmployee: hrEmployee,
      projectManager: projectManager,
    });
    return await this.administratorRepository.save(administrator);
  }

  async findAll(): Promise<Administrator[]> {
    return await this.administratorRepository.find({
      relations: [
        'hrEmployee',
        'hrEmployee.employee',
        'hrEmployee.employee.user',
        'projectManager',
        'projectManager.employee',
        'projectManager.employee.user',
      ],
    });
  }

  async findOne(id: number): Promise<Administrator> {
    const administrator = await this.administratorRepository.findOne({
      where: { administrator_id: id },
      relations: [
        'hrEmployee',
        'hrEmployee.employee',
        'hrEmployee.employee.user',
        'projectManager',
        'projectManager.employee',
        'projectManager.employee.user',
      ],
    });
    if (!administrator) {
      throw new NotFoundException(`Administrator with ID ${id} not found`);
    }
    return administrator;
  }

  async remove(id: number): Promise<void> {
    const administrator = await this.findOne(id);
    await this.administratorRepository.remove(administrator);
  }

  private async ensureHrEmployeeExists(
    hrEmployeeId: number,
  ): Promise<HrEmployee> {
    const hrEmployee = await this.hrEmployeeRepository.findOneBy({
      id: hrEmployeeId,
    });
    if (!hrEmployee) {
      throw new NotFoundException(
        `HR Employee with ID ${hrEmployeeId} not found`,
      );
    }
    return hrEmployee;
  }

  private async ensureProjectManagerExists(
    projectManagerId: number,
  ): Promise<ProjectManager> {
    const projectManager = await this.projectManagerRepository.findOneBy({
      project_manager_id: projectManagerId,
    });
    if (!projectManager) {
      throw new NotFoundException(
        `Project Manager with ID ${projectManagerId} not found`,
      );
    }
    return projectManager;
  }
}
