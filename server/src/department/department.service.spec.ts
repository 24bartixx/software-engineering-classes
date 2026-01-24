import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BadRequestException, NotFoundException } from '@nestjs/common';
import { DepartmentService } from './department.service';
import { Department } from './entities/department.entity';
import { CreateDepartmentDto } from './dto/create-department.dto';
import { UpdateDepartmentDto } from './dto/update-department.dto';

describe('DepartmentService', () => {
  let service: DepartmentService;
  let departmentRepository: jest.Mocked<Repository<Department>>;

  const mockRepository = () => ({
    create: jest.fn(),
    save: jest.fn(),
    find: jest.fn(),
    findOne: jest.fn(),
    remove: jest.fn(),
  });

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        DepartmentService,
        {
          provide: getRepositoryToken(Department),
          useValue: mockRepository(),
        },
      ],
    }).compile();

    service = module.get<DepartmentService>(DepartmentService);
    departmentRepository = module.get(getRepositoryToken(Department));
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should successfully create a new department', async () => {
      const createDepartmentDto: CreateDepartmentDto = {
        name: 'IT Department',
      };

      const expectedDepartment = {
        id: 1,
        ...createDepartmentDto,
        employeeDepartments: [],
      };

      departmentRepository.create.mockReturnValue(expectedDepartment as any);
      departmentRepository.save.mockResolvedValue(expectedDepartment as any);

      const result = await service.create(createDepartmentDto);

      expect(departmentRepository.create).toHaveBeenCalledWith(
        createDepartmentDto,
      );
      expect(departmentRepository.save).toHaveBeenCalledWith(
        expectedDepartment,
      );
      expect(result).toEqual(expectedDepartment);
      expect(result.name).toBe('IT Department');
    });

    it('should create department with different name', async () => {
      const createDepartmentDto: CreateDepartmentDto = {
        name: 'Human Resources',
      };

      const expectedDepartment = {
        id: 2,
        ...createDepartmentDto,
      };

      departmentRepository.create.mockReturnValue(expectedDepartment as any);
      departmentRepository.save.mockResolvedValue(expectedDepartment as any);

      const result = await service.create(createDepartmentDto);

      expect(result.name).toBe('Human Resources');
      expect(result.id).toBe(2);
    });

    it('should create department with special characters in name', async () => {
      const createDepartmentDto: CreateDepartmentDto = {
        name: 'R&D - Research & Development',
      };

      const expectedDepartment = {
        id: 3,
        ...createDepartmentDto,
      };

      departmentRepository.create.mockReturnValue(expectedDepartment as any);
      departmentRepository.save.mockResolvedValue(expectedDepartment as any);

      const result = await service.create(createDepartmentDto);

      expect(result.name).toBe('R&D - Research & Development');
    });

    it('should create department with very long name', async () => {
      const createDepartmentDto: CreateDepartmentDto = {
        name: 'Very Long Department Name That Contains Many Words And Characters',
      };

      const expectedDepartment = {
        id: 4,
        ...createDepartmentDto,
      };

      departmentRepository.create.mockReturnValue(expectedDepartment as any);
      departmentRepository.save.mockResolvedValue(expectedDepartment as any);

      const result = await service.create(createDepartmentDto);

      expect(result.name).toBe(
        'Very Long Department Name That Contains Many Words And Characters',
      );
    });
  });

  describe('findAll', () => {
    it('should return an array of departments', async () => {
      const departments = [
        { id: 1, name: 'IT Department', employeeDepartments: [] },
        { id: 2, name: 'HR Department', employeeDepartments: [] },
        { id: 3, name: 'Marketing', employeeDepartments: [] },
      ];

      departmentRepository.find.mockResolvedValue(departments as any);

      const result = await service.findAll();

      expect(departmentRepository.find).toHaveBeenCalled();
      expect(result).toEqual(departments);
      expect(result).toHaveLength(3);
    });

    it('should return an empty array when no departments exist', async () => {
      departmentRepository.find.mockResolvedValue([]);

      const result = await service.findAll();

      expect(result).toEqual([]);
      expect(result).toHaveLength(0);
    });

    it('should return single department in array', async () => {
      const departments = [
        { id: 1, name: 'Solo Department', employeeDepartments: [] },
      ];

      departmentRepository.find.mockResolvedValue(departments as any);

      const result = await service.findAll();

      expect(result).toHaveLength(1);
      expect(result[0].name).toBe('Solo Department');
    });
  });

  describe('findOne', () => {
    it('should return a department when found', async () => {
      const department = {
        id: 1,
        name: 'IT Department',
        employeeDepartments: [],
      };

      departmentRepository.findOne.mockResolvedValue(department as any);

      const result = await service.findOne(1);

      expect(departmentRepository.findOne).toHaveBeenCalledWith({
        where: { id: 1 },
      });
      expect(result).toEqual(department);
      expect(result.name).toBe('IT Department');
    });

    it('should throw NotFoundException when department does not exist', async () => {
      departmentRepository.findOne.mockResolvedValue(null);

      await expect(service.findOne(999)).rejects.toThrow(NotFoundException);
      await expect(service.findOne(999)).rejects.toThrow(
        'Department with ID 999 not found',
      );
    });

    it('should throw NotFoundException for negative ID', async () => {
      departmentRepository.findOne.mockResolvedValue(null);

      await expect(service.findOne(-1)).rejects.toThrow(NotFoundException);
      await expect(service.findOne(-1)).rejects.toThrow(
        'Department with ID -1 not found',
      );
    });

    it('should throw NotFoundException for zero ID', async () => {
      departmentRepository.findOne.mockResolvedValue(null);

      await expect(service.findOne(0)).rejects.toThrow(NotFoundException);
      await expect(service.findOne(0)).rejects.toThrow(
        'Department with ID 0 not found',
      );
    });

    it('should return department with large ID', async () => {
      const department = {
        id: 999999,
        name: 'Large ID Department',
        employeeDepartments: [],
      };

      departmentRepository.findOne.mockResolvedValue(department as any);

      const result = await service.findOne(999999);

      expect(result).toEqual(department);
    });
  });

  describe('update', () => {
    it('should successfully update a department', async () => {
      const updateDepartmentDto: UpdateDepartmentDto = {
        name: 'Updated IT Department',
      };

      const existingDepartment = {
        id: 1,
        name: 'IT Department',
        employeeDepartments: [],
      };

      const updatedDepartment = {
        ...existingDepartment,
        ...updateDepartmentDto,
      };

      departmentRepository.findOne.mockResolvedValue(existingDepartment as any);
      departmentRepository.save.mockResolvedValue(updatedDepartment as any);

      const result = await service.update(1, updateDepartmentDto);

      expect(departmentRepository.findOne).toHaveBeenCalledWith({
        where: { id: 1 },
      });
      expect(departmentRepository.save).toHaveBeenCalledWith(updatedDepartment);
      expect(result.name).toBe('Updated IT Department');
    });

    it('should throw NotFoundException when updating non-existent department', async () => {
      const updateDepartmentDto: UpdateDepartmentDto = {
        name: 'Updated Name',
      };

      departmentRepository.findOne.mockResolvedValue(null);

      await expect(service.update(999, updateDepartmentDto)).rejects.toThrow(
        NotFoundException,
      );
      await expect(service.update(999, updateDepartmentDto)).rejects.toThrow(
        'Department with ID 999 not found',
      );
    });

    it('should update department with empty dto (no changes)', async () => {
      const updateDepartmentDto: UpdateDepartmentDto = {};

      const existingDepartment = {
        id: 1,
        name: 'IT Department',
        employeeDepartments: [],
      };

      departmentRepository.findOne.mockResolvedValue(existingDepartment as any);
      departmentRepository.save.mockResolvedValue(existingDepartment as any);

      const result = await service.update(1, updateDepartmentDto);

      expect(result.name).toBe('IT Department');
      expect(result.id).toBe(1);
    });

    it('should preserve department ID when updating', async () => {
      const updateDepartmentDto: UpdateDepartmentDto = {
        name: 'New Name',
      };

      const existingDepartment = {
        id: 5,
        name: 'Old Name',
        employeeDepartments: [],
      };

      const updatedDepartment = {
        ...existingDepartment,
        ...updateDepartmentDto,
      };

      departmentRepository.findOne.mockResolvedValue(existingDepartment as any);
      departmentRepository.save.mockResolvedValue(updatedDepartment as any);

      const result = await service.update(5, updateDepartmentDto);

      expect(result.id).toBe(5);
      expect(result.name).toBe('New Name');
    });

    it('should handle updating with special characters', async () => {
      const updateDepartmentDto: UpdateDepartmentDto = {
        name: 'Finance & Accounting',
      };

      const existingDepartment = {
        id: 2,
        name: 'Finance',
        employeeDepartments: [],
      };

      const updatedDepartment = {
        ...existingDepartment,
        ...updateDepartmentDto,
      };

      departmentRepository.findOne.mockResolvedValue(existingDepartment as any);
      departmentRepository.save.mockResolvedValue(updatedDepartment as any);

      const result = await service.update(2, updateDepartmentDto);

      expect(result.name).toBe('Finance & Accounting');
    });
  });

  describe('remove', () => {
    it('should successfully delete a department', async () => {
      const department = {
        id: 1,
        name: 'IT',
        employeeDepartments: [],
      };

      departmentRepository.findOne.mockResolvedValue(department as any);
      departmentRepository.remove.mockResolvedValue(department as any);

      await service.remove(1);

      expect(departmentRepository.findOne).toHaveBeenCalledWith({
        where: { id: 1 },
        relations: ['employeeDepartments'],
      });
      expect(departmentRepository.remove).toHaveBeenCalledWith(department);
    });

    it('should throw NotFoundException when deleting non-existent department', async () => {
      departmentRepository.findOne.mockResolvedValue(null);

      await expect(service.remove(999)).rejects.toThrow(NotFoundException);
      await expect(service.remove(-1)).rejects.toThrow(NotFoundException);
    });

    it('should throw BadRequestException when deleting department with existing relationships', async () => {
      const department = {
        id: 3,
        name: 'HR',
        employeeDepartments: [
          { employeeId: 1, departmentId: 3 },
          { employeeId: 2, departmentId: 3 },
        ],
      };

      departmentRepository.findOne.mockResolvedValue(department as any);

      await expect(service.remove(3)).rejects.toThrow(BadRequestException);
      expect(departmentRepository.remove).not.toHaveBeenCalled();
    });

    it('should call findOne before remove', async () => {
      const department = {
        id: 5,
        name: 'IT',
        employeeDepartments: [],
      };

      departmentRepository.findOne.mockResolvedValue(department as any);
      departmentRepository.remove.mockResolvedValue(department as any);

      await service.remove(5);

      expect(departmentRepository.findOne).toHaveBeenCalled();
      expect(departmentRepository.remove).toHaveBeenCalled();
    });
  });
});
