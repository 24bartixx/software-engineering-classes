export type BelbinQuestion = {
    id: number;
    content: string;
    statements: {
        id: string;
        text: string;
        relatedRoleFieldName: string;
    }[];
};

export enum BelbinTestStatus {
    NOT_STARTED = 'not_started',
    COMPLETED = 'completed',
    EXPIRED = 'expired',
};

export type EmployeeBelbinTestStatus = {
    id: number;
    name: string;
    status: BelbinTestStatus;
    lastTestDate: Date | null;
};

export type EmployeeBelbinResult = {
    employeeId: number;
    firstName: string;
    lastName: string;
    testDate: Date,
    results: BelbinCategoryResult[];
    isReminderBlocked: boolean;
};

export type BelbinCategoryResult = {
    id: string;
    name: string;
    score: number;
    description: string;
};

export type ExpiredBelbinTest = {
    employeeId: number;
    firstName: string;
    lastName: string;
    departments: string[];
    testExpirationDate: Date;
    isReminderBlocked: boolean;
};