import {BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from "@nestjs/typeorm";
import { Notification } from "../entities/notification.entity";
import { NotificationSending } from "../entities/notification-sending.entity";
import { DataSource, In, MoreThan, Repository } from "typeorm";
import { SystemConfigService } from "src/system-config/system-config.service";
import { EmailService } from "src/common/email.service";
import { Employee } from "src/employee/entities/employee.entity";
import { NotificationType } from "src/common/enum/notification-type.enum";
import { SystemConfigKeys } from "src/common/enum/system-config-keys.enum";
import { subDays } from "date-fns";

@Injectable()
export class BelbinNotificationService {
    constructor(
        @InjectRepository(NotificationSending) private notificationSendingRepository: Repository<NotificationSending>,
        private emailService: EmailService,
        private systemConfigService: SystemConfigService,
        private dataSource: DataSource
    ) {}

    async sendReminder(employee: Employee, expirationDate: Date): Promise<void> {
        const blockedMap = await this.getReminderBlockedMap([employee.user.user_id]);
        if (blockedMap.get(employee.user.user_id)) {
            throw new BadRequestException('Powiadomienie zostało wysłane zbyt niedawno.');
        }

        await this.dataSource.transaction(async (manager) => {
            const title = await this.getExpiredTestNotificationTitle();
            const type = await this.getExpiredTestNotificationType();
            let notification = await manager.findOne(Notification, {
                where: {
                    title: title,
                    notificationType: type,
                }
            });
            if (!notification) {
                notification = manager.create(Notification, {
                    title: title,
                    notificationType: type,
                });
                await manager.save(notification);
            }
            const sending = new NotificationSending();
            sending.userId = employee.user.user_id;
            sending.notificationId = notification.id;
            sending.pushedAt = new Date();
            await manager.save(sending);
            await this.emailService.sendExpiredTestNotification(employee.user.email, title, expirationDate.toLocaleDateString());
        });
    }

    async getReminderBlockedMap(userIds: number[]): Promise<Map<number, boolean>> {
        const cooldownDays = await this.getReminderCooldownDays();
        const thresholdDate = subDays(new Date(), cooldownDays);
        const expiredNotificationTitle = await this.getExpiredTestNotificationTitle();
        const expiredNotificationType = await this.getExpiredTestNotificationType();

        const recentSends = await this.notificationSendingRepository.find({
            where: {
                user: { user_id: In(userIds) },
                pushedAt: MoreThan(thresholdDate),
                notification: {
                    title: expiredNotificationTitle,
                    notificationType: expiredNotificationType
                }
            },
            relations: ['notification'],
            select: ['userId']
        });

        const blockerUserIds = new Set(recentSends.map(ns => ns.userId));
        const result = new Map<number, boolean>();
        userIds.forEach(id => result.set(id, blockerUserIds.has(id)));
        return result;
    }

    private async getReminderCooldownDays(): Promise<number> {
        const reminderCooldownDaysString = await this.systemConfigService
            .getOrThrow(SystemConfigKeys.REMINDER_COOLDOWN_DAYS);
        return parseInt(reminderCooldownDaysString, 10);
    }

    private async getExpiredTestNotificationTitle(): Promise<string> {
        return await this.systemConfigService.getOrThrow(SystemConfigKeys.EXPIRED_TEST_NOTIFICATION_TITLE);
    }

    private async getExpiredTestNotificationType(): Promise<NotificationType> {
        const typeString = await this.systemConfigService.getOrThrow(SystemConfigKeys.EXPIRED_TEST_NOTIFICATION_TYPE);
        return NotificationType[typeString];
    }
}
