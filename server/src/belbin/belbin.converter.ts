import { Injectable } from "@nestjs/common";
import { BelbinTest } from "./entities/belbin-test.entity";
import { ExpiredBelbinTestDto } from "./dto/expired-belbin-test.dto";
import { addDays } from "date-fns";
import { BelbinRolesMetadata } from "./entities/belbin-roles-metadata.entity";
import {BelbinCategoryResult, EmployeeBelbinResultDto } from "./dto/employee-belbin-result.dto";

@Injectable()
export class BelbinConverter {
    mapToExpiredDto(test: BelbinTest, validityDays: number): ExpiredBelbinTestDto {
        const currentDepartments = test.employee.departmentsHistory
            .filter(dh => dh.stoppedAt === null)
            .map(dh => dh.department.name);

        return {
            employeeId: test.employee.id,
            firstName: test.employee.user.first_name,
            lastName: test.employee.user.last_name,
            departments: currentDepartments,
            testExpirationDate: addDays(test.performedAt, validityDays),
        };
    }

    mapToBelbinResultDto(test: BelbinTest, metadata: BelbinRolesMetadata[]): EmployeeBelbinResultDto {
        const testResults: BelbinCategoryResult[] = metadata.map(roleMetadata => ({
            id: roleMetadata.id,
            name: roleMetadata.name,
            score: test[roleMetadata.property] || 0,
            description: roleMetadata.description,
        }));

        return {
            employeeId: test.employee.id,
            employeeFirstName: test.employee.user.first_name,
            employeeLastName: test.employee.user.last_name,
            testDate: test.performedAt,
            results: testResults,
        };
    }
}