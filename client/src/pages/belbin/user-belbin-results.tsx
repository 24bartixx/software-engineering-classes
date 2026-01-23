import PageCard from '../../components/page-card';
import BelbinReportBody from '../../components/belbin-results-body';

const MOCKED_RESULTS = [
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

const TEST_DONE_DATE = new Date('2025-01-15');

export default function UserBelbinResults() {
    const sorted = [...MOCKED_RESULTS].sort((a, b) => b.score - a.score);
    const topRoleName = sorted[0].name.split(' (')[0];

    return (
        <div className="min-h-screen bg-[#e9f0f6] flex justify-center items-start py-8 font-sans">
            <div className="w-full max-w-3xl">
                <PageCard>
                    <div className="p-6">
                        <div className="mb-8">
                            <button className="text-sm text-gray-500 hover:text-gray-800 mb-8 flex items-center transition-colors">
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
                            <p className="text-sm text-gray-400">Test wykonano: {TEST_DONE_DATE.toLocaleDateString()}</p>
                        </div>
                        <BelbinReportBody results={MOCKED_RESULTS} />
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
                                    <li>Unikaj zadań, które wymagają ról z końca Twojej listy (np. {sorted[sorted.length-1].name.split(' (')[0]}).</li>
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