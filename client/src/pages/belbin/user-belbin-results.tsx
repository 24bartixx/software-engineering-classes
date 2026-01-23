import { useNavigate, useParams } from 'react-router-dom';
import PageCard from '../../components/page-card';
import BelbinReportBody from '../../components/belbin-results-body';
import {useEffect, useState } from "react";
import type { EmployeeBelbinResult } from "../../types/belbin";
import {getTestResults} from "../../services/api/belbin-api";

export default function UserBelbinResults() {
    const { employeeId } = useParams<{ employeeId: string }>();
    const navigate = useNavigate();

    const [data, setData] = useState<EmployeeBelbinResult | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

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

    if (isLoading) {
        /*return (
            <div className="min-h-screen bg-[#e9f0f6] flex justify-center items-center">
                <div className="flex flex-col items-center gap-4">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-slate-800"></div>
                    <p className="text-gray-500 font-medium">Analiza wyników...</p>
                </div>
            </div>
        );*/
        return (
            <PageCard>
                <div className="flex items-center justify-center min-h-[400px]">
                    <div className="text-lg text-black/60">Ładowanie wyników...</div>
                </div>
            </PageCard>
        );
    }

    if (error || !data) {
        return (
            <div className="min-h-screen bg-[#e9f0f6] flex justify-center items-start py-8">
                <div className="w-full max-w-3xl">
                    <PageCard>
                        <div className="p-8 text-center">
                            <div className="bg-red-50 text-red-600 p-4 rounded-lg inline-block mb-4">
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
                                </svg>
                            </div>
                            <h2 className="text-xl font-bold text-gray-900 mb-2">Nie można wyświetlić wyników</h2>
                            <p className="text-gray-600 mb-6">{error}</p>
                            <button
                                onClick={() => navigate(-1)}
                                className="px-6 py-2 bg-slate-800 text-white rounded-lg hover:bg-slate-900 transition-colors"
                            >
                                Wróć do panelu
                            </button>
                        </div>
                    </PageCard>
                </div>
            </div>
        );
    }

    const sortedResults = [...data.results].sort((a, b) => b.score - a.score);
    const topRoleName = sortedResults[0]?.name.split(' (')[0] || 'Nieokreślony';
    const lastRoleName = sortedResults[sortedResults.length - 1]?.name.split(' (')[0] || 'Nieokreślony';

    const formattedDate = new Date(data.testDate).toLocaleDateString();

    return (
        <div className="min-h-screen bg-[#e9f0f6] flex justify-center items-start py-8 font-sans">
            <div className="w-full max-w-3xl">
                <PageCard>
                    <div className="p-6">
                        <div className="mb-8">
                            <button
                                onClick={() => navigate("/belbin/dashboard")}
                                className="text-sm text-gray-500 hover:text-gray-800 mb-8 flex items-center transition-colors"
                            >
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    fill="none"
                                    viewBox="0 -1 24 24"
                                    strokeWidth={1.5}
                                    stroke="currentColor"
                                    className="w-4 h-4 mr-2 text-gray-400 group-hover:text-gray-800 transition-colors"
                                >
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
                                </svg>
                                Powrót do profilu
                            </button>
                            <h1 className="text-2xl font-bold text-gray-900 mb-1">Twoje Role Zespołowe Belbina</h1>
                            <p className="text-sm text-gray-400">{data.firstName} {data.lastName}</p>
                            {<p className="text-sm text-gray-400">Test wykonano: {formattedDate}</p>}
                        </div>

                        <BelbinReportBody results={data.results} />

                        <div className="bg-emerald-50 border border-emerald-100 rounded-xl p-6">
                            <h3 className="font-bold text-emerald-900 mb-3">Interpretacja wyników</h3>
                            <p className="text-sm text-emerald-800 mb-4 leading-relaxed">
                                Role zespołowe Belbina pokazują, jak naturalnie zachowujesz się w zespole i jakie są Twoje mocne strony.
                                Większość osób wykazuje 2-3 dominujące role.
                                Twój dominujący styl to <strong>{topRoleName}</strong>.
                            </p>

                            <div className="mt-4">
                                <h4 className="font-semibold text-emerald-900 text-sm mb-2">Wykorzystaj wiedzę o swoich rolach, aby:</h4>
                                <ul className="list-disc list-inside text-sm text-emerald-800 space-y-1 ml-3">
                                    <li>Lepiej współpracować z innymi członkami zespołu.</li>
                                    <li>Świadomie rozwijać swoje mocne strony.</li>
                                    <li>Rozumieć, w jakich zadaniach możesz być najbardziej efektywny.</li>
                                    <li>Dostosować swój styl pracy do potrzeb zespołu.</li>
                                </ul>
                            </div>

                            <div className="mt-4">
                                <h4 className="font-semibold text-emerald-900 text-sm mb-2">Jak to wykorzystać?</h4>
                                <ul className="list-disc list-inside text-sm text-emerald-800 space-y-1 ml-3">
                                    <li>Wykorzystuj swoje mocne strony, takie jak {topRoleName.split(' (')[0]}.</li>
                                    <li>Rozwijaj świadomie role wspierające (twoje miejsca 2 i 3).</li>
                                    <li>Unikaj zadań, które wymagają ról z końca Twojej listy (np. <strong>{lastRoleName}</strong>).</li>
                                    <li>Dziel się tymi wynikami z zespołem, aby lepiej dzielić zadania.</li>
                                </ul>
                            </div>
                        </div>

                    </div>
                </PageCard>
            </div>
        </div>
    );
};