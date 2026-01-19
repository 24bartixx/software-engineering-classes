import { useState } from 'react';
import PageCard from '../components/page-card';

const MOCKED_QUESTIONS = [
    {
        id: 1,
        title: "Sekcja I: Co wnoszę do zespołu?",
        questions: [
            { id: '1a', text: "Szybko zauważam nowe możliwości.Szybko zauważam nowe możliwości.  Szybko zauważam nowe możliwości. Szybko zauważam nowe możliwości. ", relatedRole: 'Resource Investigator' },
            { id: '1b', text: "Dobrze współpracuję z różnymi ludźmi.", relatedRole: 'Teamworker' },
        ]
    },
    {
        id: 2,
        title: "Sekcja II: Pytanie?",
        questions: [
            { id: '2a', text: "Odpowiedz 1", relatedRole: 'Resource Investigator' },
            { id: '2b', text: "Odpowiedz 2", relatedRole: 'Resource Investigator' },
            { id: '2c', text: "Odpoweiedz 3", relatedRole: 'Resource Investigator' },
        ]
    },
    {
        id: 3,
        title: "Sekcja III Pytanie?",
        questions: [
            { id: '3a', text: "Odpowiedz 1", relatedRole: 'Resource Investigator' },
            { id: '3b', text: "Odpowiedz 2", relatedRole: 'Resource Investigator' },
            { id: '3c', text: "Odpoweiedz 3", relatedRole: 'Resource Investigator' },
        ]
    },
];

export default function DoBelbinTest() {
    const [answers, setAnswers] = useState<Record<string, number>>({});
    const [currentSectionIndex, setCurrentSectionIndex] = useState(0);

    const currentSection = MOCKED_QUESTIONS[currentSectionIndex];

    const pointsUsed = currentSection?.questions.reduce((sum, q) => {
        return sum + (answers[q.id] || 0);
    }, 0) || 0;

    const pointsLeft = 10 - pointsUsed;

    const handleInputChange = (questionId: string, value: string) => {
        const numVal = parseInt(value) || 0;
        if (numVal < 0) return;

        const oldVal = answers[questionId] || 0;
        if ((pointsUsed - oldVal + numVal) > 10) return;

        setAnswers(prev => ({ ...prev, [questionId]: numVal }));
    };

    const handleNext = () => {
        if (pointsUsed !== 10) {
            alert("Musisz rozdzielić dokładnie 10 punktów!");
            return;
        }
        if (currentSectionIndex < MOCKED_QUESTIONS.length - 1) {
            setCurrentSectionIndex(prev => prev + 1);
        } else {
            console.log("Koniec testu, wysyłanie...", answers);
            // call API: POST /belbin/submit
            // and then redirect to test results
        }
    };

    return (
        <div className="min-h-screen bg-[#e9f0f6] flex justify-center items-center py-8 font-sans">
            <div className="w-full max-w-3xl">
                <PageCard>
                    <div className="p-6">
                        <div className="w-full flex justify-between items-start mb-4">
                            <div>
                                <h1 className="text-2xl font-bold text-gray-900 mb-1 text-left">Test Ról Zespołowych Belbina</h1>
                                <div className="text-gray-500 text-sm text-left">Pytanie {currentSectionIndex + 1} z {MOCKED_QUESTIONS.length}</div>
                            </div>
                            <button className="text-gray-400 text-sm hover:text-gray-600">Anuluj test</button>
                        </div>
                        <div className="w-full h-2 bg-gray-200 rounded-full mb-8 overflow-hidden">
                            <div
                                className="h-full bg-slate-800 rounded-full transition-all duration-300 ease-out"
                                style={{ width: `${((currentSectionIndex + 1) / MOCKED_QUESTIONS.length) * 100}%` }}
                            />
                        </div>

                        <h2 className="w-full text-xl font-semibold mb-4 text-gray-800 text-left">{currentSection.title}</h2>

                        <div className="bg-gray-100 rounded-lg p-5 mb-6 text-sm text-gray-700 leading-relaxed">
                            Rozdziel 10 punktów pomiędzy poniższe opcje. Możesz przydzielić wszystkie punkty jednej opcji lub rozdzielić je między kilka opcji.<br />
                            <span className="font-bold mt-2 block">Pozostało punktów: {pointsLeft}</span>
                        </div>

                        <div className="space-y-4">
                            {currentSection.questions.map((q) => (
                                <div key={q.id} className="flex items-center justify-between bg-gray-50 rounded-lg p-4">
                                    <span className="text-sm font-medium text-gray-700 flex-1 pr-4">{q.text}</span>

                                    <div className="flex items-center space-x-3">
                                        <button
                                            className="w-8 h-8 rounded-full border border-gray-300 bg-white text-lg text-gray-500 hover:bg-gray-50 flex justify-center items-center disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                                            onClick={() => handleInputChange(q.id, String((answers[q.id] || 0) - 1))}
                                            disabled={(answers[q.id] || 0) <= 0}
                                            type="button"
                                        >
                                            <span className="leading-none mb-0.5">-</span>
                                        </button>

                                        <div className="w-10 h-8 bg-white border border-gray-300 rounded flex justify-center items-center font-semibold text-gray-700">
                                            {answers[q.id] || 0}
                                        </div>

                                        <button
                                            className="w-8 h-8 rounded-full border border-gray-300 bg-white text-lg text-gray-500 hover:bg-gray-50 flex justify-center items-center disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                                            onClick={() => handleInputChange(q.id, String((answers[q.id] || 0) + 1))}
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
                                disabled={currentSectionIndex === 0}
                                onClick={() => setCurrentSectionIndex(i => i - 1)}
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 -2 24 24" strokeWidth={3} stroke="currentColor" className="w-3 h-3">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
                                </svg>
                                Wstecz
                            </button>

                            <button
                                className={`px-4 py-2.5 min-w-[128px] text-sm font-medium rounded-lg transition-all flex justify-center items-center gap-2 ${
                                    pointsUsed === 10
                                        ? 'bg-slate-800 text-white hover:bg-slate-900 shadow-md' // Dodałem shadow-md dla głębi
                                        : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                                }`}
                                disabled={pointsUsed !== 10}
                                onClick={handleNext}
                            >
                                {currentSectionIndex === MOCKED_QUESTIONS.length - 1 ? "Zakończ Test" : "Dalej"}
                                {currentSectionIndex !== MOCKED_QUESTIONS.length - 1 && (
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