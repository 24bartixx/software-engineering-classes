import {useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import PageCard from '../../components/page-card';
import ToastNotification, { type Notification, type NotificationType } from '../../components/toast-notification';
import type { ExpiredBelbinTest } from "../../types/belbin";
import { getExpiredBelbinTests, sendReminderNotification } from "../../services/api/belbin-api";

export default function ExpiredTestsView() {
    const navigate = useNavigate();

    const [expiredTests, setExpiredTests] = useState<ExpiredBelbinTest[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [sendingMap, setSendingMap] = useState<Record<number, boolean>>({});
    const [remindedUserIds, setRemindedUserIds] = useState<Set<number>>(new Set());
    const [notifications, setNotifications] = useState<Notification[]>([]);

    const addNotification = (type: NotificationType, message: string) => {
        const id = Date.now();
        setNotifications((prev) => [...prev, { id, type, message }]);
        setTimeout(() => removeNotification(id), 5000);
    };

    const removeNotification = (id: number) => {
        setNotifications((prev) => prev.filter((n) => n.id !== id));
    };

    const formatDate = (date: Date) => new Date(date).toLocaleDateString();

    useEffect(() => {
        const fetchData = async () => {
            setIsLoading(true);
            try {
                const data = await getExpiredBelbinTests();
                setExpiredTests(data);
            } catch (error) {
                console.error("Błąd pobierania listy:", error);
                addNotification('error', 'Nie udało się pobrać listy przeterminowanych testów.');
            } finally {
                setIsLoading(false);
            }
        };
        fetchData();
    }, []);

    const handleSendReminder = async (test: ExpiredBelbinTest) => {
        setSendingMap(prev => ({ ...prev, [test.employeeId]: true }));
        try {
            await sendReminderNotification(test.employeeId);
            addNotification('success', `Wysłano pomyślnie powiadomienie do pracownika ${test.firstName} ${test.lastName}.`);
            setRemindedUserIds(prev => new Set(prev).add(test.employeeId));
        } catch (error: any) {
            console.error('Błąd wysyłania powiadomienia:', error);
            const msg = error.response?.data?.message || `Wystąpił błąd podczas wysyłania powiadomienia do pracownika ${test.firstName} ${test.lastName}.`;
            addNotification('error', Array.isArray(msg) ? msg[0] : msg);
        } finally {
            setSendingMap(prev => ({ ...prev, [test.employeeId]: false }));
        }
    };

    const handleViewTest = (employeeId: number) => {
        navigate(`/hr/belbin/results/${employeeId}`);
    };

    if (isLoading) {
        return (
            <PageCard>
                <div className="flex flex-col items-center gap-4">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-slate-800"></div>
                    <p className="text-gray-500 font-medium">Ładowanie wyników...</p>
                </div>
            </PageCard>
        );
    }

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

                            <button
                                onClick={() => navigate(-1)}
                                className="text-sm text-gray-500 hover:text-gray-800 flex items-center transition-colors group"
                            >
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
                                {expiredTests.map((test) => (
                                    <tr key={test.employeeId} className="group hover:bg-gray-50 transition-colors">
                                        <td className="py-4 pl-2 text-sm font-medium text-gray-900">{test.firstName} {test.lastName}</td>
                                        <td className="py-4 text-sm text-gray-600">{test.departments.join(", ")}</td>
                                        <td className="py-4 text-sm text-gray-600">{formatDate(test.testExpirationDate)}</td>
                                        <td className="py-4">
                                            <div className="flex items-center gap-2">
                                                <button
                                                    onClick={() => handleViewTest(test.employeeId)}
                                                    className="px-3 py-1.5 text-xs font-medium text-white bg-slate-900 rounded hover:bg-slate-800 transition-colors"
                                                >
                                                    Zobacz test
                                                </button>

                                                <button
                                                    onClick={() => handleSendReminder(test)}
                                                    disabled={remindedUserIds.has(test.employeeId) || sendingMap[test.employeeId]}
                                                    className={`px-3 py-1.5 text-xs font-medium rounded transition-colors border ${
                                                        sendingMap[test.employeeId] || remindedUserIds.has(test.employeeId)
                                                            ? 'bg-gray-200 text-gray-400 border-gray-200 cursor-not-allowed' 
                                                            : 'bg-white text-slate-900 border-slate-900 hover:bg-gray-50'
                                                    }`}
                                                >
                                                    {sendingMap[test.employeeId] ? 'Wysyłanie...'
                                                        : remindedUserIds.has(test.employeeId) ? 'Przypomnienie wysłane' :
                                                            'Wyślij przypomnienie'}
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
        </div>
    );
}