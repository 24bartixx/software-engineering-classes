import { NotificationType } from "./notification-type.enum";

export enum SystemConfigKeys {
    BELBIN_TEST_VALIDITY_DAYS = 'belbin_test_validity_days',
    REMINDER_COOLDOWN_DAYS = 'notification_reminder_cooldown_days',
    EXPIRED_TEST_NOTIFICATION_TITLE = 'expired_belbin_test_notification_title',
    EXPIRED_TEST_NOTIFICATION_TYPE = 'expired_belbin_test_notification_type',
    REMINDER_DAYS_TO_TEST_EXPIRATION_DATE = 'notification_reminder_days_to_test_expiration_date',
}