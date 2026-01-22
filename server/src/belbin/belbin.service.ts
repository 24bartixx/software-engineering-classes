import {Inject, Injectable, NotFoundException } from '@nestjs/common';
import { BelbinQuestion } from "./entities/belbin-question.entity";
import {LessThan, Repository } from "typeorm";
import { InjectRepository } from "@nestjs/typeorm";
import {addDays, subDays } from 'date-fns';
import { ExpiredBelbinTestDto } from "./dto/expired-belbin-test.dto";
import {BelbinCategoryResult, EmployeeBelbinResultDto} from "./dto/employee-belbin-result.dto";
import { SystemConfigService } from "src/system-config/system-config.service";
import { BelbinTest } from "./entities/belbin-test.entity";
import { SystemConfigKeysEnum } from "src/common/system-config-keys.enum";
import { BelbinRolesMetadata } from "./entities/belbin-roles-metadata.entity";

@Injectable()
export class BelbinService {
    constructor(
        @InjectRepository(BelbinQuestion)
        private belbinQuestionRepository: Repository<BelbinQuestion>,
        @InjectRepository(BelbinTest)
        private belbinTestRepository: Repository<BelbinTest>,
        @InjectRepository(BelbinRolesMetadata)
        private belbinRolesMetadataRepository: Repository<BelbinRolesMetadata>,
        @Inject()
        private systemConfigService: SystemConfigService
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
            }
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
            }
        });

        return {
            employeeId: belbinTest.employee.id,
            employeeFirstName: belbinTest.employee.user.first_name,
            employeeLastName: belbinTest.employee.user.last_name,
            testDate: belbinTest.performedAt,
            results: testResults,
        };
    }

    private async getTestValidityDays() {
        const testValidityDaysString = await this.systemConfigService
            .getOrThrow(SystemConfigKeysEnum.BELBIN_TEST_VALIDITY_DAYS);
        return parseInt(testValidityDaysString, 10);
    }
}
