import {BadRequestException, Inject, Injectable, NotFoundException} from '@nestjs/common';
import {BelbinQuestion} from "./entities/belbin-question.entity";
import {DataSource, In, LessThan, MoreThan, Repository} from "typeorm";
import {InjectRepository} from "@nestjs/typeorm";
import {addDays, isBefore, subDays} from 'date-fns';
import {ExpiredBelbinTestDto} from "./dto/expired-belbin-test.dto";
import {EmployeeBelbinResultDto} from "./dto/employee-belbin-result.dto";
import {SystemConfigService} from "src/system-config/system-config.service";
import {BelbinTest} from "./entities/belbin-test.entity";
import {SystemConfigKeys} from "src/common/enum/system-config-keys.enum";
import {BelbinRolesMetadata} from "./entities/belbin-roles-metadata.entity";
import {BelbinTestStatus, EmployeeTestStatusDto} from "./dto/employee-test-status.dto";
import {Employee} from "src/employee/entities/employee.entity";
import {EmailService} from "src/common/email.service";
import {BelbinTestAnswersDto} from "./dto/belbin-test-answers.dto";
import {BelbinConverter} from "./belbin.converter";
import {Notification} from "./entities/notification.entity";
import {NotificationSending} from "./entities/notification-sending.entity";
import {NotificationType} from "src/common/enum/notification-type.enum";

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
        @InjectRepository(NotificationSending)
        private notificationSendingRepository: Repository<NotificationSending>,
        @InjectRepository(Notification)
        private notificationRepository: Repository<Notification>,
        @Inject()
        private systemConfigService: SystemConfigService,
        @Inject()
        private emailService: EmailService,
        @Inject()
        private belbinConverter: BelbinConverter,
        @Inject()
        private dataSource: DataSource,
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
        const reminderBlockedMap = await this.getNotificationBasedReminderBlockedMap(userIds);
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
        const notificationBlockedMap = await this.getNotificationBasedReminderBlockedMap([belbinTest.employee.user.user_id]);
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
            throw new BadRequestException(`Nie znaleziono testu Belbina dla pracownika o ID ${employeeId}`);
        }

        await this.dataSource.transaction(async (manager) => {
            const title = await this.getExpiredTestNotificationTitle();
            const type = await this.getExpiredTestNotificationType();
            const notification = await manager.findOneOrFail(Notification, {
                where: {
                    title: title,
                    notificationType: type,
                }
            });
            const sending = new NotificationSending();
            sending.userId = employee.user.user_id;
            sending.notificationId = notification.id;
            sending.pushedAt = new Date();
            await manager.save(sending);
            await this.emailService.sendExpiredTestNotification(employee.user.email, title, expirationDate.toLocaleDateString());
        });
        return { message: 'The notification about expired belbin test sent!' };
    }

    async saveTestResults(testAnswersDto: BelbinTestAnswersDto) {
        const employee = await this.employeeRepository.findOne({ where: { id: testAnswersDto.id } });
        if (!employee) {
            throw new NotFoundException(`Pracownik o ID ${testAnswersDto.id} nie istnieje`);
        }

        const allQuestions = await this.belbinQuestionRepository.find();
        const questionToRoleFieldMap = this.createQuestionToFieldMap(allQuestions);

        const newBelbinTest = new BelbinTest();
        newBelbinTest.employee = employee;
        newBelbinTest.performedAt = new Date();
        this.calculateScores(newBelbinTest, testAnswersDto.answers, questionToRoleFieldMap);

        const existingTest = await this.belbinTestRepository.findOne({
            where: { employee: { id: employee.id } }
        });
        if (existingTest) {
            await this.belbinTestRepository.remove(existingTest);
        }
        return await this.belbinTestRepository.save(newBelbinTest);
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

    private async getNotificationBasedReminderBlockedMap(userIds: number[]): Promise<Map<number, boolean>> {
        const cooldownDays = await this.getReminderCooldownDays();
        const thresholdDate = subDays(new Date(), cooldownDays);
        const expiredNotificationTitle = await this.getExpiredTestNotificationTitle();
        const expiredNotificationType = await this.getExpiredTestNotificationType();

        const recentSends = await this.notificationSendingRepository.find({
            where: {
                user: { user_id: In(userIds) },
                pushedAt: MoreThan(thresholdDate),
                notification: {
                    title: expiredNotificationTitle,
                    notificationType: expiredNotificationType
                }
            },
            relations: ['notification'],
            select: ['userId']
        });

        const blockerUserIds = new Set(recentSends.map(ns => ns.userId));
        const result = new Map<number, boolean>();
        userIds.forEach(id => result.set(id, blockerUserIds.has(id)));
        return result;
    }

    private async getTestValidityDays(): Promise<number> {
        const testValidityDaysString = await this.systemConfigService
            .getOrThrow(SystemConfigKeys.BELBIN_TEST_VALIDITY_DAYS);
        return parseInt(testValidityDaysString, 10);
    }

    private async getReminderCooldownDays(): Promise<number> {
        const reminderCooldownDaysString = await this.systemConfigService
            .getOrThrow(SystemConfigKeys.REMINDER_COOLDOWN_DAYS);
        return parseInt(reminderCooldownDaysString, 10);
    }

    private async getExpiredTestNotificationTitle(): Promise<string> {
        return await this.systemConfigService.getOrThrow(SystemConfigKeys.EXPIRED_TEST_NOTIFICATION_TITLE);
    }

    private async getExpiredTestNotificationType(): Promise<NotificationType> {
        const typeString = await this.systemConfigService.getOrThrow(SystemConfigKeys.EXPIRED_TEST_NOTIFICATION_TYPE);
        return NotificationType[typeString];
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

    private createQuestionToFieldMap(questions: BelbinQuestion[]): Map<string, keyof BelbinTest> {
        const map = new Map<string, keyof BelbinTest>();
        questions.forEach(section => {
            section.statements.forEach(statement => {
                map.set(statement.id, statement.relatedRoleFieldName as keyof BelbinTest);
            });
        });
        return map;
    }

    private calculateScores(test: BelbinTest, answers: Record<string, number>, fieldMap: Map<string, keyof BelbinTest>) {
        for (const [questionId, points] of Object.entries(answers)) {
            const targetScoreFieldName = fieldMap.get(questionId);
            if (targetScoreFieldName) {
                const currentScore = (test as any)[targetScoreFieldName] || 0;
                test[targetScoreFieldName] = currentScore + points;
            } else {
                console.warn(`Otrzymano nieznane ID pytania: ${questionId}`);
            }
        }
    }
}
