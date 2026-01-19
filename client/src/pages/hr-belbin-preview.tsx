import { useState } from 'react';
import PageCard from '../components/page-card';
import BelbinResultsBody from '../components/belbin-results-body';
import ToastNotification, {type Notification, type NotificationType} from "../components/toast-notification";

const MOCKED_EMPLOYEE_RESULTS = [
    { id: 'completer', name: 'Perfekcjonista (Completer Finisher)', score: 27, description: 'Sumienny, dbający o szczegóły. Sprawdza pracę pod kątem błędów i pilnuje, aby wszystko było wykonane na czas.' },
    { id: 'teamworker', name: 'Dusza Zespołu (Teamworker)', score: 15, description: 'Kooperatywny, dyplomatyczny. Słucha innych i łagodzi konflikty. Buduje harmonię w grupie.' },
    { id: 'monitor', name: 'Ewaluator (Monitor Evaluator)', score: 9, description: 'Strategiczny i wnikliwy. Widzi wszystkie opcje i trafnie ocenia sytuację. Rzadko się myli.' },
    { id: 'implementer', name: 'Realizator (Implementer)', score: 5, description: 'Praktyczny, niezawodny, zorganizowany. Przekształca pomysły w konkretne działania.' },
    { id: 'shaper', name: 'Inspirator (Shaper)', score: 4, description: 'Dynamiczny, radzi sobie z presją. Ma odwagę i siłę, by pokonywać przeszkody.' },
    { id: 'plant', name: 'Kreator (Plant)', score: 4, description: 'Kreatywny, obdarzony wyobraźnią. Rozwiązuje trudne problemy w nietypowy sposób.' },
    { id: 'coordinator', name: 'Koordynator (Coordinator)', score: 3, description: 'Dojrzały, pewny siebie. Wyjaśnia cele, promuje decyzyjność i dobrze deleguje zadania.' },
    { id: 'resource', name: 'Poszukiwacz Źródeł (Resource Investigator)', score: 3, description: 'Entuzjastyczny, komunikatywny. Bada możliwości i rozwija kontakty.' },
    { id: 'specialist', name: 'Specjalista (Specialist)', score: 0, description: 'Jednostka skupiona na celu. Dostarcza rzadkiej wiedzy i umiejętności.' },
];

export default function ManagerBelbinPreview() {
    const employeeName = "Tomasz Kowalski";
    const testDate = "15.11.2025";
    const [reminderSent, setReminderSent] = useState(false);
    const [notifications, setNotifications] = useState<Notification[]>([]);

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

    const handleSendReminder = () => {
        addNotification('success', `Wysłano pomyślnie powiadomienie do pracownika ${employeeName}.`);
        setReminderSent(true);
    };

    return (
        <div className="min-h-screen bg-[#e9f0f6] flex justify-center items-start py-8 font-sans">
            <ToastNotification notifications={notifications} removeNotification={removeNotification} />
            <div className="w-full max-w-3xl">
                <PageCard>
                    <div className="p-6">
                        <div className="mb-8">
                            <button className="text-sm text-gray-500 hover:text-gray-800 mb-8 flex items-center transition-colors group">
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 -1 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4 mr-2 text-gray-400 group-hover:text-gray-800">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
                                </svg>
                                Powrót do listy przeterminowanych testów
                            </button>
                            <h1 className="text-2xl font-bold text-gray-900 mb-1">
                                Role zespołowe pracownika <span className="text-slate-700">{employeeName}</span>
                            </h1>
                            <p className="text-sm text-gray-400">Test wykonano: {testDate}</p>
                        </div>
                        <BelbinResultsBody results={MOCKED_EMPLOYEE_RESULTS} />
                        <div className="bg-gray-50 border border-gray-200 rounded-xl p-6 flex flex-col sm:flex-row justify-between items-center gap-4">
                            <div>
                                <h3 className="font-bold text-gray-900">Akcje</h3>
                                <p className="text-sm text-gray-500 mt-1">
                                    Test wygasa wkrótce lub jest przeterminowany? Wyślij przypomnienie.
                                </p>
                            </div>

                            <button
                                onClick={handleSendReminder}
                                disabled={reminderSent}
                                className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors border ${
                                    reminderSent
                                        ? 'bg-gray-100 text-gray-400 border-gray-200 cursor-not-allowed'
                                        : 'bg-white text-slate-900 border-slate-900 hover:bg-slate-50'
                                }`}
                            >
                                {reminderSent ? 'Przypomnienie wysłane' : 'Wyślij przypomnienie'}
                            </button>
                        </div>
                    </div>
                </PageCard>
            </div>
        </div>
    );
}