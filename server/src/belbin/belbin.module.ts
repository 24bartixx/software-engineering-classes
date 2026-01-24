import { Module } from '@nestjs/common';
import { BelbinController } from './belbin.controller';
import { BelbinService } from './service/belbin.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BelbinQuestion } from './entities/belbin-question.entity';
import { BelbinSeeder } from './seeder/belbin-flow.seeder';
import { BelbinTest } from './entities/belbin-test.entity';
import { Department } from '../department/entities/department.entity';
import { EmployeeDepartment } from '../employee-department/entities/employee-department.entity';
import { Employee } from '../employee/entities/employee.entity';
import { User } from 'src/users/entities/user.entity';
import { BelbinQuestionSeeder } from './seeder/belbin-question.seeder';
import { Address } from 'src/addresses/entities/address.entity';
import { BelbinRolesMetadata } from './entities/belbin-roles-metadata.entity';

import { EmailService } from 'src/common/email.service';
import { BelbinConverter } from "./belbin.converter";
import { Notification } from "./entities/notification.entity";
import { NotificationSending } from "./entities/notification-sending.entity";
import { EmployeeBranch } from "src/employee-branch/entities/employee-branch.entity";
import { Branch } from "src/branches/entities/branch.entity";
import { BelbinNotificationService } from "./service/belbin-notification.service";
import { BelbinScoreCalculator } from "./service/belbin-score-calculator.service";

@Module({
  imports: [
    TypeOrmModule.forFeature([
      BelbinQuestion,
      BelbinTest,
      BelbinRolesMetadata,
      Department,
      EmployeeDepartment,
      Employee,
      User,
      Address,
      Notification,
      NotificationSending,
      EmployeeBranch,
      Branch,
    ]),
  ],
  controllers: [BelbinController],
  providers: [BelbinService, BelbinQuestionSeeder, BelbinSeeder, EmailService, BelbinConverter, BelbinNotificationService, BelbinScoreCalculator],
})
export class BelbinModule {}
