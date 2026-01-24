import { Entity, Column, ManyToOne, JoinColumn, PrimaryColumn } from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { Notification } from './notification.entity';

@Entity('notification_sending')
export class NotificationSending {
    @PrimaryColumn({ name: 'user_id' })
    userId: number;

    @PrimaryColumn({ name: 'notification_id' })
    notificationId: number;

    @Column({ name: 'pushed_at', type: 'timestamptz'})
    pushedAt: Date;

    @ManyToOne(() => User)
    @JoinColumn({ name: 'user_id' })
    user: User;

    @ManyToOne(() => Notification)
    @JoinColumn({ name: 'notification_id' })
    notification: Notification;
}