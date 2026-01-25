import { useParams, useNavigate, useLocation } from 'react-router-dom';
import PageCard from '../../components/page-card';
import BelbinReportBody from '../../components/belbin-results-body';
import {useEffect, useRef, useState } from "react";
import type { EmployeeBelbinResult } from "../../types/belbin";
import {getTestResults} from "../../services/api/belbin-api";
import PageLoader from "../../components/page-loader";
import ErrorState from "../../components/error-state";
import BackButton from "../../components/back-button";
import { useToast } from "../../hooks/use-toast";
import ToastNotification from "../../components/toast-notification";

export default function UserBelbinResults() {
    const { employeeId } = useParams<{ employeeId: string }>();
    const navigate = useNavigate();
    const location = useLocation();
    const { notifications, addNotification, removeNotification } = useToast();

    const [data, setData] = useState<EmployeeBelbinResult | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const toastShownRef = useRef(false);
    useEffect(() => {
        if (location.state?.testCompleted && !toastShownRef.current) {
            addNotification('success', 'Twój test został zapisany pomyślnie.');
            toastShownRef.current = true;
            window.history.replaceState({}, document.title);
        }
    }, [location]);

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

    if (isLoading) return <PageLoader/>
    if (error || !data) {
        return <ErrorState title='Nie można wyświetlić wyników' description={error || 'Nie znaleziono danych.'} backLabel='Powrót do profilu'/>;
    }

    const sortedResults = [...data.results].sort((a, b) => b.score - a.score);
    const topRoleName = sortedResults[0]?.name.split(' (')[0] || 'Nieokreślony';
    const lastRoleName = sortedResults[sortedResults.length - 1]?.name.split(' (')[0] || 'Nieokreślony';
    const formattedDate = new Date(data.testDate).toLocaleDateString();

    return (
        <div className="min-h-screen bg-[#e9f0f6] flex justify-center items-start py-8 font-sans">
            <ToastNotification notifications={notifications} removeNotification={removeNotification} />
            <div className="w-full max-w-3xl">
                <PageCard>
                    <div className="p-6">
                        <div className="mb-8">
                            <BackButton label='Powrót do profilu' onClick={() => navigate("/belbin/dashboard")}/>
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