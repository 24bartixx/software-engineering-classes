import { Entity, PrimaryGeneratedColumn, Column, OneToMany, CreateDateColumn } from 'typeorm';
import { NotificationSending } from './notification-sending.entity';
import { NotificationType } from '../../common/enum/notification-type.enum';

@Entity('notification')
export class Notification {
    @PrimaryGeneratedColumn({ name: 'notification_id' })
    id: number;

    @Column()
    title: string;

    @Column({ nullable: true })
    content: string;

    @Column({
        type: 'enum',
        enum: NotificationType,
        name: 'notification_type'
    })
    notificationType: NotificationType;

    @CreateDateColumn({ name: 'created_at', type: 'timestamptz' })
    createdAt: Date;

    @OneToMany(() => NotificationSending, (ns) => ns.notification)
    sentNotifications: NotificationSending[];
}