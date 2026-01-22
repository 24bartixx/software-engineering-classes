import {Inject, Injectable, OnModuleInit } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Employee } from "../../employee/entities/employee.entity";
import { seed } from "./seed";
import { SystemConfigService } from "src/system-config/system-config.service";

@Injectable()
export class BelbinSeeder implements OnModuleInit {
    constructor(
        @InjectRepository(Employee) private employeeRepo: Repository<Employee>,
        @Inject() private systemConfigService: SystemConfigService,
    ) {}

    async onModuleInit() {
        if (await this.employeeRepo.count() > 0) return;
        await seed(this.systemConfigService);
    }
}