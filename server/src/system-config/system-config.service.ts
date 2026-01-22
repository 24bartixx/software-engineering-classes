import { Injectable } from '@nestjs/common';
import { InjectRepository } from "@nestjs/typeorm";
import { SystemConfig } from "./entities/system-config.entity";
import { Repository } from "typeorm";

@Injectable()
export class SystemConfigService {
    constructor(
        @InjectRepository(SystemConfig)
        private readonly configRepo: Repository<SystemConfig>,
    ) {}

    async get(key: string): Promise<string | null> {
        const config = await this.configRepo.findOne({ where: { keyName: key } });
        return config ? config.value : null;
    }

    async getOrDefault(key: string, defaultValue: string): Promise<string> {
        const value = await this.get(key);
        return value !== null ? value : defaultValue;
    }

    async getOrThrow(key: string): Promise<string> {
        const value = await this.get(key);
        if (!value) {
            throw new Error(`There is no system config for key: ${key}`);
        }
        return value;
    }

    async set(key: string, value: string): Promise<SystemConfig> {
        const config = this.configRepo.create({ keyName: key, value: value });
        return await this.configRepo.save(config);
    }
}

