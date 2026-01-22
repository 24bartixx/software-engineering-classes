import { DataSource, QueryRunner } from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { Employee } from '../../employee/entities/employee.entity';
import { Department } from '../../department/entities/department.entity';
import { EmployeeDepartment } from '../../employee-department/entities/employee-department.entity';
import { BelbinTest } from '../entities/belbin-test.entity';
import { Address } from 'src/addresses/entities/address.entity';
import { SystemConfigService } from 'src/system-config/system-config.service';

const employeesData = [
  {
    firstName: 'Jan',
    lastName: 'Kowalski',
    email: 'jestgitbartix@gmail.com',
    gender: 'Male',
    deptIndexes: [0],
    testDate: '2026-01-15',
    belbin: {
      shaper: 10,
      implementer: 5,
      specialist: 2,
      coordinator: 3,
      plant: 1,
      resource: 4,
      monitor: 2,
      team: 6,
      completer: 3,
    },
  },
  {
    firstName: 'Anna',
    lastName: 'Nowak',
    email: 'anna.n@test.com',
    gender: 'Female',
    deptIndexes: [4],
  },
  {
    firstName: 'Piotr',
    lastName: 'Wiśniewski',
    email: 'piotr.w@test.com',
    gender: 'Male',
    deptIndexes: [2, 5],
  },
  {
    firstName: 'Matthew',
    lastName: 'Perrxhan',
    email: 'mati.pxp20@gmail.com',
    gender: 'Male',
    deptIndexes: [3],
    testDate: '2018-05-20',
    belbin: {
      shaper: 1,
      implementer: 2,
      specialist: 4,
      coordinator: 9,
      plant: 8,
      resource: 7,
      monitor: 3,
      team: 9,
      completer: 2,
    },
  },
];

export async function seed(systemConfigService: SystemConfigService) {
  const AppDataSource = new DataSource({
    type: 'postgres',
    host: process.env.DB_HOST || 'localhost',
    port: 5432,
    username: process.env.DB_USER || 'postgres',
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE || 'teambuilder',
    entities: [
      Address,
      User,
      Employee,
      Department,
      EmployeeDepartment,
      BelbinTest,
    ],
    synchronize: false,
  });
  await AppDataSource.initialize();
  const queryRunner = AppDataSource.createQueryRunner();
  await queryRunner.startTransaction();

  try {
    console.log('Rozpoczynam seedowanie...');

    systemConfigService.set('belbin_test_validity_days', '180');

    const address = new Address();
    address.country = 'Poland';
    address.state = 'Lower Silesia';
    address.postal_code = '50-342';
    address.city = 'Wroclaw';
    address.street = 'Podhalańska';
    address.number = '42';
    address.apartment = 'string';
    const savedAddress = await queryRunner.manager.save(address);
    console.log('Adres dodany.');

    const savedDepartments = [
      await saveDepartment('IT', queryRunner),
      await saveDepartment('Sales', queryRunner),
      await saveDepartment('Marketing', queryRunner),
      await saveDepartment('Finance', queryRunner),
      await saveDepartment('Customer Service', queryRunner),
      await saveDepartment('Logistics', queryRunner),
      await saveDepartment('Production', queryRunner),
      await saveDepartment('HR', queryRunner),
    ];
    console.log('Departamenty dodane.');

    for (const data of employeesData) {
      // A. User
      const user = new User();
      user.first_name = data.firstName;
      user.last_name = data.lastName;
      user.email = data.email;
      user.password = 'password123';
      user.gender = data.gender as any;
      user.phone_number = '123456789';
      user.birthday_date = new Date('1990-01-01');
      user.isactivated = true;
      user.created_at = new Date();
      user.modified_at = new Date();
      user.address = savedAddress;

      const savedUser = await queryRunner.manager.save(user);

      // B. Employee
      const employee = new Employee();
      employee.employedAt = new Date('2017-01-01');
      employee.user = savedUser;

      const savedEmployee = await queryRunner.manager.save(employee);

      // C. EmployeeDepartment
      for (const deptIndex of data.deptIndexes) {
        const empDept = new EmployeeDepartment();
        empDept.employee = savedEmployee;
        empDept.department = savedDepartments[deptIndex];
        empDept.startedAt = new Date('2017-01-01');
        empDept.employeeId = savedEmployee.id;
        empDept.departmentId = savedDepartments[deptIndex].id;
        await queryRunner.manager.save(empDept);
      }

      // D. Belbin Test
      if (!data.belbin) {
        console.log(`Dodano pracownika: ${data.firstName} ${data.lastName}`);
        continue;
      }
      const belbin = new BelbinTest();
      belbin.employee = savedEmployee;

      belbin.performedAt = new Date(data.testDate);
      belbin.shaperScore = data.belbin.shaper;
      belbin.implementerScore = data.belbin.implementer;
      belbin.specialistScore = data.belbin.specialist;
      belbin.coordinatorScore = data.belbin.coordinator;
      belbin.plantScore = data.belbin.plant;
      belbin.resourceInvestigatorScore = data.belbin.resource;
      belbin.monitorEvaluatorScore = data.belbin.monitor;
      belbin.teamWorkerScore = data.belbin.team;
      belbin.completerFinisherScore = data.belbin.completer;
      await queryRunner.manager.save(belbin);

      console.log(`Dodano pracownika: ${data.firstName} ${data.lastName}`);
    }

    await queryRunner.commitTransaction();
    console.log('Seedowanie zakończone sukcesem!');
  } catch (err) {
    console.error('Błąd podczas seedowania:', err);
    await queryRunner.rollbackTransaction();
  } finally {
    await AppDataSource.destroy();
  }
}

async function saveDepartment(
  name: string,
  queryRunner: QueryRunner,
): Promise<Department> {
  const department = new Department();
  department.name = name;
  return queryRunner.manager.save(department);
}
