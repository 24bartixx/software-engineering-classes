import { useState } from 'react';
import PageCard from '../components/page-card';
import ToastNotification, { type Notification, type NotificationType } from '../components/toast-notification';
import type { ExpiredBelbinTest } from "../types/belbin";

const EXPIRED_TESTS: ExpiredBelbinTest[] = [
    { userId: 1, firstName: 'Tomasz', lastName: 'Kowalski', department: ['Marketing', 'IT'], expirationDate: '15.11.2025' },
    { userId: 2, firstName: 'Anna', lastName: 'Kowalska', department: ['Marketing', 'IT'], expirationDate: '10.11.2025' },
    { userId: 3, firstName: 'Jan', lastName: ' Nowak', department: ['Sprzedaż'], expirationDate: '05.11.2025' },
    { userId: 4, firstName: 'Piotr', lastName: 'Wiśniewski', department: ['HR'], expirationDate: '01.11.2025' },
    { userId: 5, firstName: 'Maria', lastName: 'Wójcik', department: ['Finanse'], expirationDate: '28.10.2025' },
    { userId: 6, firstName: 'Krzysztof', lastName: 'Kamiński', department: ['IT'], expirationDate: '25.10.2025' },
    { userId: 7, firstName: 'Magdalena', lastName: 'Lewandowska', department: ['Marketing'], expirationDate: '20.10.2025' },
    { userId: 8, firstName: 'Paweł', lastName: 'Zieliński', department: ['Sprzedaż'], expirationDate: '18.10.2025' },
];

export default function ExpiredTestsView() {
    const [notifications, setNotifications] = useState<Notification[]>([]);
    const [remindedUserIds, setRemindedUserIds] = useState<Set<number>>(new Set());

    const addNotification = (type: NotificationType, message: string) => {
        const id = Date.now();
        setNotifications((prev) => [...prev, { id, type, message }]);

        setTimeout(() => {
            setNotifications((prev) => prev.filter((n) => n.id !== id));
        }, 4000);
    };

    const removeNotification = (id: number) => {
        setNotifications((prev) => prev.filter((n) => n.id !== id));
    };

    const handleSendReminder = (user: ExpiredBelbinTest) => {
        if (user.userId === 8) {
            addNotification('error', `Błąd przy wysyłaniu powiadomienia do pracownika ${user.firstName} ${user.lastName}.`);
            return;
        }

        addNotification('success', `Wysłano pomyślnie powiadomienie do pracownika ${user.firstName} ${user.lastName}.`);
        setRemindedUserIds((prev) => new Set(prev).add(user.userId));
    };

    return (
        <div className="min-h-screen bg-[#e9f0f6] flex justify-center items-start py-12 font-sans relative">
            <ToastNotification notifications={notifications} removeNotification={removeNotification} />
            <div className="w-full max-w-5xl px-4">
                <PageCard>
                    <div className="w-full p-6">
                        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
                            <div className="flex items-center gap-3 mb-4 md:mb-0">
                                <div className="w-8 h-8 flex items-center justify-center">
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-7 h-7 text-slate-900">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M14.857 17.082a23.848 23.848 0 005.454-1.31A8.967 8.967 0 0118 9.75v-.7V9A6 6 0 006 9v.75a8.967 8.967 0 01-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 01-5.714 0m5.714 0a3 3 0 11-5.714 0" />
                                    </svg>
                                </div>
                                <h1 className="text-2xl font-bold text-gray-900">Przeterminowane Testy Belbina</h1>
                            </div>

                            <button className="text-sm text-gray-500 hover:text-gray-800 flex items-center transition-colors group">
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    fill="none"
                                    viewBox="0 -2 24 24"
                                    strokeWidth={1.5}
                                    stroke="currentColor"
                                    className="w-4 h-4 mr-2 text-gray-400 group-hover:text-gray-800 transition-colors"
                                >
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
                                </svg>
                                Powrót do strony głównej
                            </button>
                        </div>

                        <div className="overflow-x-auto">
                            <table className="w-full text-left border-collapse">
                                <thead>
                                <tr className="border-b border-gray-200">
                                    <th className="pb-3 pl-2 text-xs font-bold text-gray-900 uppercase tracking-wide w-5/20">Pracownik</th>
                                    <th className="pb-3 text-xs font-bold text-gray-900 uppercase tracking-wide w-4/20">Dział</th>
                                    <th className="pb-3 text-xs font-bold text-gray-900 uppercase tracking-wide w-4/20">Data wygaśnięcia</th>
                                    <th className="pb-3 text-xs font-bold text-gray-900 uppercase tracking-wide w-7/20">Akcje</th>
                                </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-100">
                                {EXPIRED_TESTS.map((user) => (
                                    <tr key={user.userId} className="group hover:bg-gray-50 transition-colors">
                                        <td className="py-4 pl-2 text-sm font-medium text-gray-900">{user.firstName} {user.lastName}</td>
                                            <td className="py-4 text-sm text-gray-600">{user.department.join(", ")}</td>
                                        <td className="py-4 text-sm text-gray-600">{user.expirationDate}</td>
                                        <td className="py-4">
                                            <div className="flex items-center gap-2">
                                                <button className="px-3 py-1.5 text-xs font-medium text-white bg-slate-900 rounded hover:bg-slate-800 transition-colors">
                                                    Zobacz test
                                                </button>

                                                <button
                                                    onClick={() => handleSendReminder(user)}
                                                    disabled={remindedUserIds.has(user.userId)}
                                                    className={`px-3 py-1.5 text-xs font-medium rounded transition-colors border ${
                                                        remindedUserIds.has(user.userId)
                                                            ? 'bg-gray-200 text-gray-400 border-gray-200 cursor-not-allowed' 
                                                            : 'bg-white text-slate-900 border-slate-900 hover:bg-gray-50'
                                                    }`}
                                                >
                                                    {remindedUserIds.has(user.userId) ? 'Przypomnienie wysłane' : 'Wyślij przypomnienie'}
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </PageCard>
            </div>

            <style>{`
                @keyframes slide-in {
                    from { transform: translateX(100%); opacity: 0; }
                    to { transform: translateX(0); opacity: 1; }
                }
                .animate-slide-in {
                    animation: slide-in 0.3s ease-out forwards;
                }
            `}</style>
        </div>
    );
}