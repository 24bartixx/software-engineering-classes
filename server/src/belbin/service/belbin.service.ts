import {BadRequestException, Inject, Injectable, NotFoundException} from '@nestjs/common';
import {BelbinQuestion} from "../entities/belbin-question.entity";
import {LessThan, Repository} from "typeorm";
import {InjectRepository} from "@nestjs/typeorm";
import {addDays, isBefore, subDays} from 'date-fns';
import {ExpiredBelbinTestDto} from "../dto/expired-belbin-test.dto";
import {EmployeeBelbinResultDto} from "../dto/employee-belbin-result.dto";
import {SystemConfigService} from "src/system-config/system-config.service";
import {BelbinTest} from "../entities/belbin-test.entity";
import {SystemConfigKeys} from "src/common/enum/system-config-keys.enum";
import {BelbinRolesMetadata} from "../entities/belbin-roles-metadata.entity";
import {BelbinTestStatus, EmployeeTestStatusDto} from "../dto/employee-test-status.dto";
import {Employee} from "src/employee/entities/employee.entity";
import {BelbinTestAnswersDto} from "../dto/belbin-test-answers.dto";
import {BelbinConverter} from "../belbin.converter";
import { BelbinNotificationService } from "./belbin-notification.service";
import { BelbinScoreCalculator } from "./belbin-score-calculator.service";

@Injectable()
export class BelbinService {
    constructor(
        @InjectRepository(BelbinQuestion)
        private belbinQuestionRepository: Repository<BelbinQuestion>,
        @InjectRepository(BelbinTest)
        private belbinTestRepository: Repository<BelbinTest>,
        @InjectRepository(BelbinRolesMetadata)
        private belbinRolesMetadataRepository: Repository<BelbinRolesMetadata>,
        @InjectRepository(Employee)
        private employeeRepository: Repository<Employee>,
        @Inject() private notificationService: BelbinNotificationService,
        @Inject() private scoreCalculator: BelbinScoreCalculator,
        @Inject() private systemConfigService: SystemConfigService,
        @Inject() private belbinConverter: BelbinConverter,
    ) {}

    async getBelbinQuestions(): Promise<BelbinQuestion[]> {
        return this.belbinQuestionRepository.find();
    }

    async getExpiredBelbinTests(): Promise<ExpiredBelbinTestDto[]> {
        const testValidityDays = await this.getTestValidityDays();
        const lastValidDate = subDays(new Date(), testValidityDays);
        const expiredTests = await this.belbinTestRepository.find({
            where: { performedAt: LessThan(lastValidDate) },
            relations: ['employee', 'employee.user', 'employee.departmentsHistory', 'employee.departmentsHistory.department'],
        })
        const userIds = expiredTests.map(test => test.employee.user.user_id);
        const reminderBlockedMap = await this.notificationService.getReminderBlockedMap(userIds);
        return expiredTests.map(test => this.belbinConverter.mapToExpiredDto(test, testValidityDays, reminderBlockedMap));
    }

    async getEmployeeTestResults(employeeId: number): Promise<EmployeeBelbinResultDto> {
        const belbinTest = await this.belbinTestRepository.findOne({
            where: { employee: { id: employeeId } },
            relations: ['employee', 'employee.user'],
        });
        if (!belbinTest) {
            throw new NotFoundException(`Nie znaleziono wyników testu Belbina dla pracownika o ID ${employeeId}`);
        }
        const belbinRolesMetadata = await this.belbinRolesMetadataRepository.find();

        const isBlockedByStatus = await this.isRemindBlockedByStatus(belbinTest);
        const notificationBlockedMap = await this.notificationService.getReminderBlockedMap([belbinTest.employee.user.user_id]);
        const isBlockedByNotifications = notificationBlockedMap.get(belbinTest.employee.user.user_id) || false;
        const finalIsBlocked = isBlockedByStatus || isBlockedByNotifications;
        return this.belbinConverter.mapToBelbinResultDto(belbinTest, belbinRolesMetadata, finalIsBlocked);
    }

    async getEmployeeTestInfo(): Promise<EmployeeTestStatusDto[]> {
        const testValidityDays = await this.getTestValidityDays();
        const employees = await this.employeeRepository.find({
            relations: ['user', 'belbinTest'],
        });
        return employees.map(employee => {
            const { status, lastTestDate } = this.calculateTestStatus(employee.belbinTest, testValidityDays);
            return {
                id: employee.id,
                name: `${employee.user.first_name} ${employee.user.last_name}`,
                status: status,
                lastTestDate: lastTestDate,
            };
        });
    }

    async sendNotification(employeeId: number) {
        const employee = await this.employeeRepository.findOne({
            where: { id: employeeId },
            relations: ['user', 'belbinTest'],
        });
        if (!employee) {
            throw new NotFoundException(`Pracownik o ID ${employeeId} nie istnieje`);
        }

        const testValidityDays = await this.getTestValidityDays();
        const { status, expirationDate } = this.calculateTestStatus(employee.belbinTest, testValidityDays);
        if (status === BelbinTestStatus.NOT_STARTED || !expirationDate) {
            throw new NotFoundException(`Nie znaleziono testu Belbina dla pracownika o ID ${employeeId}`);
        }

        await this.notificationService.sendReminder(employee, expirationDate);
        return { message: 'The notification about expired belbin test sent!' };
    }

    async saveTestResults(testAnswersDto: BelbinTestAnswersDto) {
        const employee = await this.employeeRepository.findOne({ where: { id: testAnswersDto.id } });
        if (!employee) {
            throw new NotFoundException(`Pracownik o ID ${testAnswersDto.id} nie istnieje`);
        }

        let belbinTest = await this.belbinTestRepository.findOne({
            where: { employee: { id: employee.id } }
        });
        if (!belbinTest) {
            belbinTest = new BelbinTest();
            belbinTest.employee = employee;
        }

        const allQuestions = await this.belbinQuestionRepository.find();
        this.scoreCalculator.calculate(belbinTest, testAnswersDto.answers, allQuestions);
        belbinTest.performedAt = new Date();
        return await this.belbinTestRepository.save(belbinTest);
    }

    private async isRemindBlockedByStatus(belbinTest: BelbinTest): Promise<boolean> {
        const testValidityDays = await this.getTestValidityDays();
        const daysToExpirationDate = await this.getDaysToExpirationDateWhenMayRemind();
        const { status, expirationDate } = this.calculateTestStatus(belbinTest, testValidityDays);

        if (status !== BelbinTestStatus.COMPLETED || !expirationDate) {
            return false;
        }

        const remindAllowedDate = subDays(expirationDate, daysToExpirationDate);
        const now = new Date();
        return now < remindAllowedDate;
    }

    private async getTestValidityDays(): Promise<number> {
        const testValidityDaysString = await this.systemConfigService
            .getOrThrow(SystemConfigKeys.BELBIN_TEST_VALIDITY_DAYS);
        return parseInt(testValidityDaysString, 10);
    }

    private async getDaysToExpirationDateWhenMayRemind() {
        const daysString = await this.systemConfigService.getOrThrow(SystemConfigKeys.REMINDER_DAYS_TO_TEST_EXPIRATION_DATE);
        return parseInt(daysString, 10);
    }

    private calculateTestStatus(test: BelbinTest | null, validityDays: number): { status: BelbinTestStatus, lastTestDate: Date | null, expirationDate: Date | null } {
        if (!test) {
            return { status: BelbinTestStatus.NOT_STARTED, lastTestDate: null, expirationDate: null };
        }

        const lastTestDate = test.performedAt;
        const expirationDate = addDays(lastTestDate, validityDays);
        const now = new Date();

        const status = isBefore(expirationDate, now)
            ? BelbinTestStatus.EXPIRED
            : BelbinTestStatus.COMPLETED;

        return { status, lastTestDate, expirationDate };
    }
}
