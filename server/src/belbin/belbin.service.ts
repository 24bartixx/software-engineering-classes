import {BadRequestException, Inject, Injectable, NotFoundException} from '@nestjs/common';
import {BelbinQuestion} from "./entities/belbin-question.entity";
import {LessThan, Repository} from "typeorm";
import {InjectRepository} from "@nestjs/typeorm";
import {addDays, isBefore, subDays} from 'date-fns';
import {ExpiredBelbinTestDto} from "./dto/expired-belbin-test.dto";
import {EmployeeBelbinResultDto} from "./dto/employee-belbin-result.dto";
import {SystemConfigService} from "src/system-config/system-config.service";
import {BelbinTest} from "./entities/belbin-test.entity";
import {SystemConfigKeysEnum} from "src/common/enum/system-config-keys.enum";
import {BelbinRolesMetadata} from "./entities/belbin-roles-metadata.entity";
import {BelbinTestStatus, EmployeeTestStatusDto} from "./dto/employee-test-status.dto";
import {Employee} from "src/employee/entities/employee.entity";
import { EmailService } from "src/common/email.service";
import {BelbinTestAnswersDto} from "./dto/belbin-test-answers.dto";
import { BelbinConverter } from "./belbin.converter";

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
        @Inject()
        private systemConfigService: SystemConfigService,
        @Inject()
        private emailService: EmailService,
        @Inject()
        private belbinConverter: BelbinConverter
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
        return expiredTests.map(test => this.belbinConverter.mapToExpiredDto(test, testValidityDays));
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
        return this.belbinConverter.mapToBelbinResultDto(belbinTest, belbinRolesMetadata);
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
        if (status !== BelbinTestStatus.EXPIRED || !expirationDate) {
            throw new BadRequestException(`Test pracownika o ID ${employeeId} nie jest przeterminowany`);
        }

        await this.emailService.sendExpiredTestNotification(employee.user.email, expirationDate.toLocaleDateString())
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

    private async getTestValidityDays(): Promise<number> {
        const testValidityDaysString = await this.systemConfigService
            .getOrThrow(SystemConfigKeysEnum.BELBIN_TEST_VALIDITY_DAYS);
        return parseInt(testValidityDaysString, 10);
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
