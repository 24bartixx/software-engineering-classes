import {Global, Module } from '@nestjs/common';
import { SystemConfigService } from './system-config.service';
import { TypeOrmModule } from "@nestjs/typeorm";
import { SystemConfig } from "./entities/system-config.entity";

@Global()
@Module({
    imports: [TypeOrmModule.forFeature([SystemConfig])],
    providers: [SystemConfigService],
    exports: [SystemConfigService],
})
export class SystemConfigModule {}
