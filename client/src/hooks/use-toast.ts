import { useState, useCallback } from 'react';
import type { Notification, NotificationType } from '../components/toast-notification';

export function useToast() {
    const [notifications, setNotifications] = useState<Notification[]>([]);

    const removeNotification = useCallback((id: number) => {
        setNotifications((prev) => prev.filter((n) => n.id !== id));
    }, []);

    const addNotification = useCallback((type: NotificationType, message: string) => {
        const id = Date.now();
        setNotifications((prev) => [...prev, { id, type, message }]);
        setTimeout(() => removeNotification(id), 10000);
    }, [removeNotification]);

    return {
        notifications,
        addNotification,
        removeNotification
    };
}