import {useEffect, useState } from 'react';
import { useNavigate, useParams } from "react-router-dom";
import PageCard from '../../components/page-card';
import type { BelbinQuestion } from "../../types/belbin";
import {getBelbinQuestions, sendBelbinTestAnswers} from "../../services/api/belbin-api";
import ToastNotification from "../../components/toast-notification";
import {useToast} from "../../hooks/use-toast";
import PageLoader from "../../components/page-loader";
import ErrorState from "../../components/error-state";

export default function DoBelbinTest() {
    const { employeeId } = useParams<{ employeeId: string }>();
    const navigate = useNavigate();
    const { notifications, addNotification, removeNotification } = useToast();

    const [questions, setQuestions] = useState<BelbinQuestion[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [answers, setAnswers] = useState<Record<string, number>>({});
    const [currentSectionIndex, setCurrentSectionIndex] = useState(0);
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        const fetchBelbinQuestions = async () => {
            try {
                setIsLoading(true);
                const belbinQuestions = await getBelbinQuestions();
                setQuestions(belbinQuestions);
            } catch (error) {
                console.error('Failed to fetch belbin questions: ', error);
                addNotification('error', "Nie udało się pobrać pytań z serwera.");
            } finally {
                setIsLoading(false);
            }
        };
        fetchBelbinQuestions();
    }, []);

    const currentSection = questions[currentSectionIndex];
    const pointsUsed = currentSection?.statements.reduce((sum, statement) => {
        return sum + (answers[statement.id] || 0);
    }, 0) || 0;
    const pointsLeft = 10 - pointsUsed;

    const handleInputChange = (statementId: string, value: string) => {
        const numVal = parseInt(value, 10);
        if (isNaN(numVal) || numVal < 0) return;

        const oldVal = answers[statementId] || 0;
        if ((pointsUsed - oldVal + numVal) > 10) return;

        setAnswers(prev => ({ ...prev, [statementId]: numVal }));
    };

    const handleNext = async () => {
        if (pointsUsed !== 10) {
            addNotification('error', "Musisz rozdzielić dokładnie 10 punktów!");
            return;
        }
        if (currentSectionIndex < questions.length - 1) {
            setCurrentSectionIndex(prev => prev + 1);
            window.scroll(0, 0);
        } else {
            await submitTest();
        }
    };

    const handleBack = () => {
        if (currentSectionIndex > 0) {
            setCurrentSectionIndex(prev => prev - 1);
        }
    };

    const submitTest = async () => {
        if (!employeeId) {
            addNotification('error', `Błąd: Brak ID pracownika: ${employeeId}.`);
            return;
        }
        setIsSubmitting(true);
        try {
            await sendBelbinTestAnswers(Number(employeeId), answers);
            addNotification('success', "Test zakończony pomyślnie! Przekierowywanie...");
            setTimeout(() => navigate(`/belbin/results/${employeeId}`), 2000);
        } catch (error: any) {
            console.error("Błąd przy zapisywaniu wynikow testu: ", error);
            const msg = error.response?.data?.message || "Błąd zapisu wyników testu.";
            addNotification('error', Array.isArray(msg) ? msg[0] : msg);
        } finally {
            setIsSubmitting(false);
        }
    };

    if (isLoading) return <PageLoader message='Ładowanie pytań...'/>
    if (questions.length === 0) {
        return <ErrorState title="Brak dostępnych pytań" description="Nie udało się załadować pytań do testu." />;
    }

    return (
        <div className="min-h-screen bg-[#e9f0f6] flex justify-center items-center py-8 font-sans">
            <ToastNotification notifications={notifications} removeNotification={removeNotification}/>
            <div className="w-full max-w-3xl">
                <PageCard>
                    <div className="p-6">
                        <div className="w-full flex justify-between items-start mb-4">
                            <div>
                                <h1 className="text-2xl font-bold text-gray-900 mb-1 text-left">Test Ról Zespołowych Belbina</h1>
                                <div className="text-gray-500 text-sm text-left">Pytanie {currentSectionIndex + 1} z {questions.length}</div>
                            </div>
                            <button onClick={() => navigate(-1)} className="text-gray-400 text-sm hover:text-gray-600">
                                Anuluj test
                            </button>
                        </div>
                        <div className="w-full h-2 bg-gray-200 rounded-full mb-8 overflow-hidden">
                            <div
                                className="h-full bg-slate-800 rounded-full transition-all duration-300 ease-out"
                                style={{ width: `${((currentSectionIndex + 1) / questions.length) * 100}%` }}
                            />
                        </div>

                        <h2 className="w-full text-xl font-semibold mb-4 text-gray-800 text-left">{currentSection.content}</h2>

                        <div className="bg-gray-100 rounded-lg p-5 mb-6 text-sm text-gray-700 leading-relaxed">
                            Rozdziel 10 punktów pomiędzy poniższe opcje. Możesz przydzielić wszystkie punkty jednej opcji lub rozdzielić je między kilka opcji.<br />
                            <span className="font-bold mt-2 block">Pozostało punktów: {pointsLeft}</span>
                        </div>

                        <div className="space-y-4">
                            {currentSection.statements.map((statement) => (
                                <div key={statement.id} className="flex items-center justify-between bg-gray-50 rounded-lg p-4">
                                    <span className="text-sm font-medium text-gray-700 flex-1 pr-4">{statement.text}</span>

                                    <div className="flex items-center space-x-3">
                                        <button
                                            className="w-8 h-8 rounded-full border border-gray-300 bg-white text-lg text-gray-500 hover:bg-gray-50 flex justify-center items-center disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                                            onClick={() => handleInputChange(statement.id, String((answers[statement.id] || 0) - 1))}
                                            disabled={(answers[statement.id] || 0) <= 0}
                                            type="button"
                                        >
                                            <span className="leading-none mb-0.5">-</span>
                                        </button>

                                        <div className="w-10 h-8 bg-white border border-gray-300 rounded flex justify-center items-center font-semibold text-gray-700">
                                            {answers[statement.id] || 0}
                                        </div>

                                        <button
                                            className="w-8 h-8 rounded-full border border-gray-300 bg-white text-lg text-gray-500 hover:bg-gray-50 flex justify-center items-center disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                                            onClick={() => handleInputChange(statement.id, String((answers[statement.id] || 0) + 1))}
                                            disabled={pointsLeft <= 0}
                                            type="button"
                                        >
                                            <span className="leading-none mb-0.5">+</span>
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div className="w-full flex justify-between items-center mt-8">
                            <button
                                className="w-32 py-2.5 text-sm font-medium text-slate-600 bg-slate-200 rounded-lg hover:bg-slate-300 hover:text-slate-900 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-slate-200 transition-all flex justify-center items-center gap-2"
                                disabled={currentSectionIndex === 0 || isSubmitting}
                                onClick={handleBack}
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 -2 24 24" strokeWidth={3} stroke="currentColor" className="w-3 h-3">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
                                </svg>
                                Wstecz
                            </button>

                            <button
                                className={`px-4 py-2.5 min-w-[128px] text-sm font-medium rounded-lg transition-all flex justify-center items-center gap-2 ${
                                    pointsUsed === 10
                                        ? 'bg-slate-800 text-white hover:bg-slate-900 shadow-md'
                                        : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                                }`}
                                disabled={pointsUsed !== 10 || isSubmitting}
                                onClick={handleNext}
                            >
                                {isSubmitting ? (
                                    <>
                                        <svg className="animate-spin -ml-1 mr-1 h-4 w-4 text-gray-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                        </svg>
                                        Zapisywanie...
                                    </>
                                ) : (
                                    currentSectionIndex === questions.length - 1 ? "Zakończ Test" : "Dalej"
                                )}

                                {currentSectionIndex !== questions.length - 1 && (
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 -2 24 24" strokeWidth={3} stroke="currentColor" className="w-3 h-3">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
                                    </svg>
                                )}
                            </button>
                        </div>
                    </div>
                </PageCard>
            </div>
        </div>
    );
};