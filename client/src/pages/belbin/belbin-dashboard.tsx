import { useState } from 'react';
import PageCard from '../../components/page-card';

const MOCKED_USERS = [
    {
        id: 1,
        name: "Jan Kowalski",
        status: "not_started",
        lastTestDate: null
    },
    {
        id: 2,
        name: "Anna Nowak",
        status: "completed",
        lastTestDate: "15.11.2025"
    },
    {
        id: 3,
        name: "Piotr Wiśniewski",
        status: "expired",
        lastTestDate: "15.03.2024"
    }
];

type StatusConfig = {
    icon: React.ReactNode;
    iconContainerClass: string;
    text: React.ReactNode;
    buttonLabel: string;
};

export default function BelbinDashboard() {
    const [selectedUserId, setSelectedUserId] = useState(MOCKED_USERS[0].id);

    const currentUser = MOCKED_USERS.find(u => u.id === selectedUserId) || MOCKED_USERS[0];

    const renderTestStatusContent = () => {
        let config: StatusConfig;
        switch (currentUser.status) {
            case 'completed':
                config = {
                    icon: (
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-3 h-3 text-emerald-600">
                            <path fillRule="evenodd" d="M19.916 4.626a.75.75 0 01.208 1.04l-9 13.5a.75.75 0 01-1.154.114l-6-9a.75.75 0 011.06-1.06l5.353 8.03 8.493-12.74a.75.75 0 011.04-.208z" clipRule="evenodd" />
                        </svg>
                    ),
                    iconContainerClass: "border-emerald-500",
                    text: (
                        <>
                            Ostatni test wykonano <span className="font-semibold text-gray-900">{currentUser.lastTestDate}</span>. Twoje wyniki są aktualne.
                        </>
                    ),
                    buttonLabel: "Zobacz wyniki"
                };
                break;

            case 'expired':
                config = {
                    icon: (
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-3 h-3 text-orange-500">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                    ),
                    iconContainerClass: "border-orange-400",
                    text: (
                        <>
                            Twój ostatni test wykonano <span className="font-semibold text-gray-900">{currentUser.lastTestDate}</span>.<br />
                            Zaktualizuj swoje wyniki, aby mieć aktualne informacje o swoich rolach zespołowych.
                        </>
                    ),
                    buttonLabel: "Rozpocznij ponownie"
                };
                break;

            case 'not_started':
            default:
                config = {
                    icon: (
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5 text-gray-400">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m2.25 0H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
                        </svg>
                    ),
                    iconContainerClass: "border-transparent", // Brak widocznego borderu, ale zachowujemy układ
                    text: "Nie masz jeszcze wykonanego testu Belbina. Poznaj swoje role zespołowe i dowiedz się, jak możesz najlepiej funkcjonować w zespole.",
                    buttonLabel: "Rozpocznij test"
                };
                break;
        }

        return (
            <>
                <div className="flex items-start mb-5">
                    <div className={`w-5 h-5 mt-0.5 mr-3 rounded-full border flex items-center justify-center shrink-0 ${config.iconContainerClass}`}>
                        {config.icon}
                    </div>
                    <div className="text-sm text-gray-600">
                        {config.text}
                    </div>
                </div>
                <button className="px-4 py-2 text-sm font-medium text-white bg-slate-900 rounded-lg hover:bg-slate-800 transition-colors">
                    {config.buttonLabel}
                </button>
            </>
        );
    };

    return (
        <div className="min-h-screen bg-[#e9f0f6] flex justify-center items-center py-8 font-sans">
            <div className="w-full max-w-3xl">
                <PageCard>
                    <div className="w-full max-w-3xl p-6">
                        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 pb-8 border-b border-gray-100">
                            <div>
                                <h1 className="text-2xl font-bold text-gray-900">Cześć, {currentUser.name}! 👋</h1>
                                <p className="text-sm text-gray-500 mt-1">Panel Twojego rozwoju zawodowego</p>
                            </div>

                            <div className="mt-4 sm:mt-0 flex items-center bg-gray-50 px-3 py-2 rounded-lg border border-gray-200">
                                <span className="text-xs font-semibold text-gray-500 mr-2 uppercase tracking-wide">Widok:</span>
                                <select
                                    className="bg-transparent text-sm font-medium text-gray-900 focus:outline-none cursor-pointer"
                                    value={selectedUserId}
                                    onChange={(e) => setSelectedUserId(Number(e.target.value))}
                                >
                                    {MOCKED_USERS.map(user => (
                                        <option key={user.id} value={user.id}>
                                            {user.name} ({user.status})
                                        </option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        <div>
                            <h2 className="text-lg font-bold text-gray-900 mb-4">Mój rozwój</h2>
                            <div className="bg-gray-50 rounded-xl border border-gray-200 p-6 transition-all hover:border-gray-300">
                                <h3 className="text-base font-semibold text-gray-900 mb-3">
                                    Test Ról Zespołowych Belbina
                                </h3>
                                {renderTestStatusContent()}
                            </div>
                        </div>
                    </div>
                </PageCard>
            </div>
        </div>
    );
}