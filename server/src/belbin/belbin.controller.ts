import { Controller, Get, Param, ParseIntPipe, Post } from '@nestjs/common';
import {BelbinService} from "./belbin.service";
import { BelbinQuestion } from "./entities/belbin-question.entity";
import { ExpiredBelbinTestDto } from "./dto/expired-belbin-test.dto";
import { EmployeeBelbinResultDto } from "./dto/employee-belbin-result.dto";
import { EmployeeTestStatusDto } from "./dto/employee-test-status.dto";

@Controller('belbin')
export class BelbinController {
    constructor(private readonly belbinService: BelbinService) {}

    @Get('questions')
    async getBelbinQuestions(): Promise<BelbinQuestion[]> {
        return this.belbinService.getBelbinQuestions();
    }

    @Get('expired')
    async getExpiredBelbinTests(): Promise<ExpiredBelbinTestDto[]> {
        return this.belbinService.getExpiredBelbinTests();
    }

    @Get('results/:employeeId')
    async getEmployeeTestResults(@Param('employeeId', ParseIntPipe) employeeId: number): Promise<EmployeeBelbinResultDto> {
        return this.belbinService.getEmployeeTestResults(employeeId);
    }

    @Get('info')
    async getEmployeesTestInfo(): Promise<EmployeeTestStatusDto[]> {
        return this.belbinService.getEmployeeTestInfo();
    }

    @Post('answers')
    async provideEmployeeTestAnswers() {

    }

    @Post('notify/:employeeId')
    async sendNotification() {

    }
}
