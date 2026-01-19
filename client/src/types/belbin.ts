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
    title: string;
    statements: {
        id: string;
        text: string;
        relatedRole: BelbinRole;
    }[];
}

export type ExpiredBelbinTest = {
    userId: number;
    firstName: string;
    lastName: string;
    department: string[];
    expirationDate: string;
    lastTestDate?: string;
}