export type NotificationType = 'success' | 'error';
export type Notification = {
    id: number;
    type: NotificationType;
    message: string;
}
type ToastNotificationProps = {
    notifications: Notification[];
    removeNotification: (id: number) => void;
}

export default function ToastNotification({ notifications, removeNotification }: ToastNotificationProps) {
    return (
        <div className="fixed top-5 right-5 z-50 flex flex-col gap-2">
            {notifications.map((not: Notification) => (
                <div
                    key={not.id}
                    className={`flex items-center justify-between p-4 rounded shadow-lg min-w-[300px] text-white text-sm font-medium transition-all duration-300 animate-slide-in ${
                        not.type === 'success' ? 'bg-emerald-500' : 'bg-red-500'
                    }`}
                >
                    <span>{not.message}</span>
                    <button onClick={() => removeNotification(not.id)} className="ml-4 hover:opacity-75">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>
            ))}
        </div>
    );
};