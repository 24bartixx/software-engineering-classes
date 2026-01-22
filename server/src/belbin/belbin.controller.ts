import { Controller, Get, Post } from '@nestjs/common';
import {BelbinService} from "./belbin.service";
import { BelbinQuestion } from "./entities/belbin-question.entity";
import { ExpiredBelbinTestDto } from "./dto/expired-belbin-test.dto";
import { EmployeeBelbinResultDto } from "./dto/employee-belbin-result.dto";

@Controller('belbin')
export class BelbinController {
    constructor(private readonly belbinService: BelbinService) {}

    @Get('questions')
    getBelbinQuestions(): Promise<BelbinQuestion[]> {
        return this.belbinService.getBelbinQuestions();
    }

    @Get('expired')
    getExpiredBelbinTests(): Promise<ExpiredBelbinTestDto[]> {
        return this.belbinService.getExpiredBelbinTests();
    }

    @Get('results/:employeeId')
    getEmployeeTestResults(): Promise<EmployeeBelbinResultDto> {
        return this.belbinService.getEmployeeTestResults();
    }

    @Get('info/:employeeId')
    getEmployeeTestInfo() {}

    @Post('answers')
    provideEmployeeTestAnswers() {

    }

    @Post('notify/:employeeId')
    sendNotification() {

    }
}
