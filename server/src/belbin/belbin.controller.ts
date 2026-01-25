import {Body, Controller, Get, Param, ParseIntPipe, Post } from '@nestjs/common';
import {BelbinService} from "./service/belbin.service";
import { BelbinQuestion } from "./entities/belbin-question.entity";
import { ExpiredBelbinTestDto } from "./dto/expired-belbin-test.dto";
import { EmployeeBelbinResultDto } from "./dto/employee-belbin-result.dto";
import { EmployeeTestStatusDto } from "./dto/employee-test-status.dto";
import { BelbinTestAnswersDto } from "./dto/belbin-test-answers.dto";
import { BelbinTest } from "./entities/belbin-test.entity";
import {ApiCreatedResponse, ApiOkResponse, ApiResponse, ApiTags } from "@nestjs/swagger";

@Controller('belbin')
@ApiTags('Belbin - External')
@ApiResponse({ status: 500, description: 'Internal Server Error' })
export class BelbinController {
    constructor(private readonly belbinService: BelbinService) {}

    @Get('questions')
    @ApiOkResponse({ type: BelbinQuestion, isArray: true})
    async getBelbinQuestions(): Promise<BelbinQuestion[]> {
        return this.belbinService.getBelbinQuestions();
    }

    @Get('expired')
    @ApiOkResponse({ type: ExpiredBelbinTestDto, isArray: true})
    async getExpiredBelbinTests(): Promise<ExpiredBelbinTestDto[]> {
        return this.belbinService.getExpiredBelbinTests();
    }

    @Get('results/:employeeId')
    @ApiOkResponse({ type: EmployeeBelbinResultDto })
    @ApiResponse({ status: 404, description: 'Not Found - belbin test associated with given employee' })
    async getEmployeeTestResults(@Param('employeeId', ParseIntPipe) employeeId: number): Promise<EmployeeBelbinResultDto> {
        return this.belbinService.getEmployeeTestResults(employeeId);
    }

    @Get('info')
    @ApiOkResponse({ type: EmployeeTestStatusDto, isArray: true })
    async getEmployeesTestInfo(): Promise<EmployeeTestStatusDto[]> {
        return this.belbinService.getEmployeeTestInfo();
    }

    @Post('answers')
    @ApiCreatedResponse({ type: BelbinTest })
    @ApiResponse({ status: 404, description: 'Not Found - the employee' })
    async provideEmployeeTestAnswers(@Body() testAnswersDto: BelbinTestAnswersDto): Promise<BelbinTest> {
        return await this.belbinService.saveTestResults(testAnswersDto);
    }

    @Post('notify/expired/:employeeId')
    @ApiCreatedResponse({ schema: { type: 'object',
            properties: { message: { type: 'string' } },
            example: { message: 'The notification about expired test has been sent!' },
        }, })
    @ApiResponse({ status: 400, description: 'Bad Request - the notification has been recently sent' })
    @ApiResponse({ status: 404, description: 'Not Found - the employee' })
    async sendExpiredNotification(@Param('employeeId', ParseIntPipe) employeeId: number) {
        return this.belbinService.sendNotification(employeeId);
    }
}
