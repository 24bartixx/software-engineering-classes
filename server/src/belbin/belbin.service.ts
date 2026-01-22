import { Injectable } from '@nestjs/common';
import { BelbinQuestion } from "./entities/belbin-question.entity";
import { Repository } from "typeorm";
import { InjectRepository } from "@nestjs/typeorm";
import { ExpiredBelbinTestDto } from "./dto/expired-belbin-test.dto";
import { EmployeeBelbinResultDto } from "./dto/employee-belbin-result.dto";

@Injectable()
export class BelbinService {
    constructor(
        @InjectRepository(BelbinQuestion)
        private belbinQuestionRepository: Repository<BelbinQuestion>
    ) {}

    async getBelbinQuestions(): Promise<BelbinQuestion[]> {
        return this.belbinQuestionRepository.find();
    }

    async getExpiredBelbinTests(): Promise<ExpiredBelbinTestDto[]> {
        // TODO: implementacja logiki pobierania expired testów Belbina
        return [];
    }

    async getEmployeeTestResults(): Promise<EmployeeBelbinResultDto> {
        // TODO: implementacja logiki pobierania wyników testów Belbina dla pracownika
        return new EmployeeBelbinResultDto();
    }
}
