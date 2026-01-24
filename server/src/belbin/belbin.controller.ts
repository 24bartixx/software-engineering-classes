import {Body, Controller, Get, Param, ParseIntPipe, Post } from '@nestjs/common';
import {BelbinService} from "./service/belbin.service";
import { BelbinQuestion } from "./entities/belbin-question.entity";
import { ExpiredBelbinTestDto } from "./dto/expired-belbin-test.dto";
import { EmployeeBelbinResultDto } from "./dto/employee-belbin-result.dto";
import { EmployeeTestStatusDto } from "./dto/employee-test-status.dto";
import { BelbinTestAnswersDto } from "./dto/belbin-test-answers.dto";
import { BelbinTest } from "./entities/belbin-test.entity";

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
    async provideEmployeeTestAnswers(@Body() testAnswersDto: BelbinTestAnswersDto): Promise<BelbinTest> {
        return await this.belbinService.saveTestResults(testAnswersDto);
    }

    @Post('notify/expired/:employeeId')
    async sendExpiredNotification(@Param('employeeId', ParseIntPipe) employeeId: number) {
        return this.belbinService.sendNotification(employeeId);
    }
}
