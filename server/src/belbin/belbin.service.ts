import {BadRequestException, Inject, Injectable, NotFoundException} from '@nestjs/common';
import {BelbinQuestion} from "./entities/belbin-question.entity";
import {LessThan, Repository} from "typeorm";
import {InjectRepository} from "@nestjs/typeorm";
import {addDays, isBefore, subDays} from 'date-fns';
import {ExpiredBelbinTestDto} from "./dto/expired-belbin-test.dto";
import {BelbinCategoryResult, EmployeeBelbinResultDto} from "./dto/employee-belbin-result.dto";
import {SystemConfigService} from "src/system-config/system-config.service";
import {BelbinTest} from "./entities/belbin-test.entity";
import {SystemConfigKeysEnum} from "src/common/enum/system-config-keys.enum";
import {BelbinRolesMetadata} from "./entities/belbin-roles-metadata.entity";
import {BelbinTestStatus, EmployeeTestStatusDto} from "./dto/employee-test-status.dto";
import {Employee} from "src/employee/entities/employee.entity";
import { EmailService } from "src/common/email.service";
import {BelbinTestAnswersDto} from "./dto/belbin-test-answers.dto";

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
        private emailService: EmailService
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

        return expiredTests.map(test => {
            const currentDepartments = test.employee.departmentsHistory
                .filter(dh => dh.stoppedAt === null)
                .map(dh => dh.department.name);

            return {
                employeeId: test.employee.id,
                firstName: test.employee.user.first_name,
                lastName: test.employee.user.last_name,
                departments: currentDepartments,
                testExpirationDate: addDays(test.performedAt, testValidityDays),
            };
        });
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
        const testResults: BelbinCategoryResult[] = belbinRolesMetadata.map(roleMetadata => {
            return {
                id: roleMetadata.id,
                name: roleMetadata.name,
                score: belbinTest[roleMetadata.property] || 0,
                description: roleMetadata.description,
            };
        });

        return {
            employeeId: belbinTest.employee.id,
            employeeFirstName: belbinTest.employee.user.first_name,
            employeeLastName: belbinTest.employee.user.last_name,
            testDate: belbinTest.performedAt,
            results: testResults,
        };
    }

    async getEmployeeTestInfo(): Promise<EmployeeTestStatusDto[]> {
        const testValidityDays = await this.getTestValidityDays();
        const now = new Date();
        const employees = await this.employeeRepository.find({
            relations: ['user', 'belbinTest'],
        });

        return employees.map(employee => {
            let lastTestDate: Date | null = null;
            let testStatus: BelbinTestStatus = BelbinTestStatus.NOT_STARTED;
            if (employee.belbinTest) {
                lastTestDate = employee.belbinTest.performedAt;
                const testExpirationDate = addDays(lastTestDate, testValidityDays);
                if (isBefore(testExpirationDate, now)) {
                    testStatus = BelbinTestStatus.EXPIRED;
                } else {
                    testStatus = BelbinTestStatus.COMPLETED;
                }
            }

            return {
                id: employee.id,
                name: `${employee.user.first_name} ${employee.user.last_name}`,
                status: testStatus,
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
        const now = new Date();
        let testStatus: BelbinTestStatus = BelbinTestStatus.NOT_STARTED;
        let testExpirationDate: Date = new Date();
        if (employee.belbinTest) {
            testExpirationDate = addDays(employee.belbinTest.performedAt, testValidityDays);
            if (isBefore(testExpirationDate, now)) {
                testStatus = BelbinTestStatus.EXPIRED;
            } else {
                testStatus = BelbinTestStatus.COMPLETED;
            }
        }

        if (testStatus != BelbinTestStatus.EXPIRED) {
            throw new BadRequestException(`Test pracownika o ID ${employeeId} nie jest przeterminowany`);
        }

        await this.emailService.sendExpiredTestNotification(employee.user.email, testExpirationDate.toLocaleDateString())
        return { message: 'The notification about expired belbin test sent!' };
    }

    async saveTestResults(testAnswersDto: BelbinTestAnswersDto) {
        const employee = await this.employeeRepository.findOne({ where: { id: testAnswersDto.id } });
        if (!employee) throw new NotFoundException(`Pracownik o ID ${testAnswersDto.id} nie istnieje`);

        const allQuestions = await this.belbinQuestionRepository.find();
        const questionToRoleFieldMap = new Map<string, keyof BelbinTest>;
        allQuestions.forEach(section => {
            section.statements.forEach(statement => {
                questionToRoleFieldMap.set(statement.id, statement.relatedRoleFieldName as keyof BelbinTest);
            });
        });

        const newBelbinTest = new BelbinTest();
        newBelbinTest.employee = employee;
        newBelbinTest.performedAt = new Date();

        for (const [questionId, points] of Object.entries(testAnswersDto.answers)) {
            const targetScoreFieldName = questionToRoleFieldMap.get(questionId);
            if (targetScoreFieldName) {
                const roleCurrentScore = (newBelbinTest as any)[targetScoreFieldName] || 0;
                newBelbinTest[targetScoreFieldName] = roleCurrentScore + points;
            } else {
                console.warn(`Nieznane ID pytania: ${questionId}`);
            }
        }

        const existingTest = await this.belbinTestRepository.findOne({
            where: { employee: { id: employee.id } }
        });
        if (existingTest) {
            await this.belbinTestRepository.remove(existingTest);
        }

        return await this.belbinTestRepository.save(newBelbinTest);
    }

    private async getTestValidityDays() {
        const testValidityDaysString = await this.systemConfigService
            .getOrThrow(SystemConfigKeysEnum.BELBIN_TEST_VALIDITY_DAYS);
        return parseInt(testValidityDaysString, 10);
    }
}
