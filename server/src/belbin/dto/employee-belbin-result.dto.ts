export type BelbinCategoryResult = {
    id: string;
    name: string;
    score: number;
    description: string;
}

export class EmployeeBelbinResultDto {
    employeeId: number;
    employeeFirstName: string;
    employeeLastName: string;
    testDate: Date;
    results: BelbinCategoryResult[];
}