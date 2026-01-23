import {useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import PageCard from '../../components/page-card';
import BelbinResultsBody from '../../components/belbin-results-body';
import ToastNotification, {type Notification, type NotificationType} from "../../components/toast-notification";
import type { EmployeeBelbinResult } from "../../types/belbin";
import {getTestResults, sendReminderNotification} from "../../services/api/belbin-api";

export default function ManagerBelbinPreview() {
    const { employeeId } = useParams<{ employeeId: string }>();
    const navigate = useNavigate();

    const [data, setData] = useState<EmployeeBelbinResult | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [isSending, setIsSending] = useState(false);
    const [reminderSent, setReminderSent] = useState(false);
    const [notifications, setNotifications] = useState<Notification[]>([]);

    const addNotification = (type: NotificationType, message: string) => {
        const id = Date.now();
        setNotifications((prev) => [...prev, { id, type, message }]);
        setTimeout(() => removeNotification(id), 5000);
    };

    const removeNotification = (id: number) => {
        setNotifications((prev) => prev.filter((n) => n.id !== id));
    };

    useEffect(() => {
        const fetchResults = async () => {
            setIsLoading(true);
            if (!employeeId) {
                setError("Brak identyfikatora pracownika.");
                setIsLoading(false);
                return;
            }

            try {
                const results = await getTestResults(Number(employeeId));
                setData(results);
            } catch (err: any) {
                console.error("Błąd pobierania wyników:", err);
                const msg = err.response?.status === 404
                    ? "Nie znaleziono wyników testu dla tego pracownika."
                    : "Wystąpił błąd podczas pobierania wyników. Spróbuj ponownie później.";
                setError(msg);
            } finally {
                setIsLoading(false);
            }
        };
        fetchResults();
    }, [employeeId]);

    const handleSendReminder = async () => {
        if (!employeeId) return;

        setIsSending(true);
        try {
            await sendReminderNotification(Number(employeeId));
            addNotification('success', `Wysłano pomyślnie powiadomienie do pracownika ${employeeName}.`);
            setReminderSent(true);
        } catch (error: any) {
            console.error("Błąd wysyłania przypomnienia:", error);
            const msg = error.response?.data?.message || `Wystąpił błąd podczas wysyłania powiadomienia do pracownika ${employeeName}.`;
            addNotification('error', Array.isArray(msg) ? msg[0] : msg);
        } finally {
            setIsSending(false);
        }
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

    if (error || !data) {
        return (
            <div className="min-h-screen bg-[#e9f0f6] flex justify-center items-start py-8">
                <ToastNotification notifications={notifications} removeNotification={removeNotification} />
                <div className="w-full max-w-3xl">
                    <PageCard>
                        <div className="p-8 text-center">
                            <h2 className="text-xl font-bold text-gray-900 mb-2">Błąd podglądu</h2>
                            <p className="text-gray-600 mb-6">{error || "Nie znaleziono danych."}</p>
                            <button
                                onClick={() => navigate(-1)}
                                className="px-6 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
                            >
                                Wróć
                            </button>
                        </div>
                    </PageCard>
                </div>
            </div>
        );
    }

    const employeeName = `${data.firstName} ${data.lastName}`;
    const formattedDate = new Date(data.testDate).toLocaleDateString();

    return (
        <div className="min-h-screen bg-[#e9f0f6] flex justify-center items-start py-8 font-sans">
            <ToastNotification notifications={notifications} removeNotification={removeNotification} />
            <div className="w-full max-w-3xl">
                <PageCard>
                    <div className="p-6">
                        <div className="mb-8">
                            <button
                                onClick={() => navigate(-1)}
                                className="text-sm text-gray-500 hover:text-gray-800 mb-8 flex items-center transition-colors group"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 -1 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4 mr-2 text-gray-400 group-hover:text-gray-800">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
                                </svg>
                                Powrót
                            </button>
                            <h1 className="text-2xl font-bold text-gray-900 mb-1">
                                Role zespołowe pracownika <span className="text-slate-700">{employeeName}</span>
                            </h1>
                            <p className="text-sm text-gray-400">Test wykonano: {formattedDate}</p>
                        </div>

                        <BelbinResultsBody results={data.results} />

                        <div className="bg-gray-50 border border-gray-200 rounded-xl p-6 flex flex-col sm:flex-row justify-between items-center gap-4">
                            <div>
                                <h3 className="font-bold text-gray-900">Akcje</h3>
                                <p className="text-sm text-gray-500 mt-1">
                                    Test wygasa wkrótce lub jest przeterminowany? Wyślij przypomnienie.
                                </p>
                            </div>

                            <button
                                onClick={handleSendReminder}
                                disabled={reminderSent || isSending}
                                className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors border ${
                                    reminderSent
                                        ? 'bg-gray-100 text-gray-400 border-gray-200 cursor-not-allowed'
                                        : 'bg-white text-slate-900 border-slate-900 hover:bg-slate-50'
                                }`}
                            >
                                {isSending && (
                                    <svg className="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                )}

                                {reminderSent ? (
                                    <>
                                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4">
                                            <path fillRule="evenodd" d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z" clipRule="evenodd" />
                                        </svg>
                                        Przypomnienie wysłane
                                    </>
                                ) : (
                                    isSending ? 'Wysyłanie...' : 'Wyślij przypomnienie'
                                )}
                            </button>
                        </div>
                    </div>
                </PageCard>
            </div>
        </div>
    );
}