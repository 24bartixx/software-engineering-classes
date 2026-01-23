export type BelbinRole =
    | 'Plant' | 'Resource Investigator' | 'Coordinator'
    | 'Shaper' | 'Monitor Evaluator' | 'Teamworker'
    | 'Implementer' | 'Completer Finisher' | 'Specialist';

export type BelbinResult = {
    userId: number;
    date: string;
    scores: Record<BelbinRole, number>;
}

export type BelbinQuestion = {
    id: number;
    content: string;
    statements: {
        id: string;
        text: string;
        relatedRoleFieldName: string;
    }[];
}

export enum BelbinTestStatus {
    NOT_STARTED = 'not_started',
    COMPLETED = 'completed',
    EXPIRED = 'expired',
}

export type EmployeeBelbinTestStatus = {
    id: number;
    name: string;
    status: BelbinTestStatus;
    lastTestDate: Date | null;
}

export type ExpiredBelbinTest = {
    userId: number;
    firstName: string;
    lastName: string;
    department: string[];
    expirationDate: string;
    lastTestDate?: string;
}