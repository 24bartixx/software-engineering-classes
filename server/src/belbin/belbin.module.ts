import { Module } from '@nestjs/common';
import {BelbinController} from "./belbin.controller";
import { BelbinService } from './belbin.service';
import { TypeOrmModule } from "@nestjs/typeorm";
import { BelbinQuestion } from "./entities/belbin-question";

@Module({
    imports: [TypeOrmModule.forFeature([BelbinQuestion])],
    controllers: [BelbinController],
    providers: [BelbinService]
})
export class BelbinModule {}
