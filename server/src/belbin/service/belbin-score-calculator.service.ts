import { Injectable } from '@nestjs/common';
import { BelbinTest } from "../entities/belbin-test.entity";
import { BelbinQuestion } from "../entities/belbin-question.entity";

@Injectable()
export class BelbinScoreCalculator {
    calculate(test: BelbinTest, answers: Record<string, number>, questions: BelbinQuestion[]): BelbinTest {
        const questionToRoleFieldMap = this.createQuestionToFieldMap(questions);
        this.resetScores(test);
        for (const [questionId, points] of Object.entries(answers)) {
            const targetScoreFieldName = questionToRoleFieldMap.get(questionId);
            if (targetScoreFieldName) {
                const currentScore = (test as any)[targetScoreFieldName] || 0;
                test[targetScoreFieldName] = currentScore + points;
            } else {
                console.warn(`Otrzymano nieznane ID pytania: ${questionId}`);
            }
        }
        return test;
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

    private resetScores(test: BelbinTest) {
        const scoreFields: (keyof BelbinTest)[] = [
            'shaperScore', 'specialistScore', 'plantScore',
            'monitorEvaluatorScore', 'completerFinisherScore', 'resourceInvestigatorScore',
            'coordinatorScore', 'teamWorkerScore', 'implementerScore'
        ];
        scoreFields.forEach(field => {
            (test as any)[field] = 0;
        });
    }
}
