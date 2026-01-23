import {
    Chart as ChartJS,
    RadialLinearScale,
    PointElement,
    LineElement,
    Filler,
    Tooltip,
    Legend,
} from 'chart.js';
import { Radar } from 'react-chartjs-2';
import type { BelbinCategoryResult } from "../types/belbin";

ChartJS.register(RadialLinearScale, PointElement, LineElement, Filler, Tooltip, Legend);

type BelbinResultsBodyProps = {
    results: Array<BelbinCategoryResult>;
}

export default function BelbinResultsBody({ results }: BelbinResultsBodyProps) {
    const sortedResults = [...results].sort((a, b) => b.score - a.score);
    const top3 = sortedResults.slice(0, 3);
    const maxScore = Math.max(...results.map(r => r.score));

    const chartLabels = results.map(role => role.name.split(' (')[0]);
    const chartDataValues = results.map(role => role.score);

    const chartData = {
        labels: chartLabels,
        datasets: [
            {
                data: chartDataValues,
                backgroundColor: 'rgba(30, 41, 59, 0.2)',   // slate-800 z opacity
                borderColor: 'rgba(30, 41, 59, 0.8)',   // slate-800
                borderWidth: 2,
                pointBackgroundColor: '#fff',
                pointBorderColor: 'rgba(30, 41, 59, 1)',
                pointHoverBackgroundColor: '#fff',
                pointHoverBorderColor: 'rgba(30, 41, 59, 1)',
            },
        ],
    };

    const chartOptions = {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
            r: {
                angleLines: { color: '#e5e7eb' },   // gray-200
                grid: { color: '#e5e7eb' },         // gray-200
                pointLabels: {
                    font: { size: 11, family: 'sans-serif' },
                    color: '#4b5563'    // gray-600
                },
                suggestedMin: 0,
                ticks: { display: false, backdropColor: 'transparent' }
            }
        },
        plugins: { legend: { display: false } }
    };

    return (
        <>
            <div className="bg-gray-50 rounded-xl p-6 mb-10 border border-gray-100">
                <h3 className="font-bold text-gray-900 mb-4 text-lg">Dominujące role</h3>
                <div className="space-y-3">
                    {top3.map((role, index) => (
                        <div key={role.id} className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div className="w-6 h-6 rounded-full bg-slate-900 text-white flex items-center justify-center text-xs font-bold shrink-0">
                                    {index + 1}
                                </div>
                                <span className="font-medium text-gray-800">{role.name}</span>
                            </div>
                            <span className="font-bold text-gray-900 text-sm">{role.score} pkt</span>
                        </div>
                    ))}
                </div>
            </div>

            <div className="mb-12">
                <h3 className="font-bold text-gray-900 mb-4 text-lg">Wykres ról zespołowych</h3>
                <div className="bg-gray-50 border border-gray-100 rounded-xl p-4 md:p-8 h-80 flex items-center justify-center">
                    <div className="w-full h-full max-w-md">
                        <Radar data={chartData} options={chartOptions} />
                    </div>
                </div>
            </div>

            <div className="mb-10">
                <h3 className="font-bold text-gray-900 mb-6 text-lg">Szczegółowe wyniki</h3>
                <div className="space-y-3">
                    {sortedResults.map((role) => (
                        <div key={role.id} className="group bg-gray-50 rounded-xl p-5 border border-gray-100">
                            <div className="flex justify-between items-end mb-2">
                                <span className="font-bold text-gray-800 text-sm md:text-base">{role.name}</span>
                                <span className="font-bold text-gray-900 text-sm">{role.score} pkt</span>
                            </div>
                            <div className="w-full h-2.5 bg-gray-100 rounded-full mb-3 overflow-hidden">
                                <div
                                    className="h-full bg-slate-900 rounded-full"
                                    style={{ width: `${(role.score / maxScore) * 100}%` }}
                                />
                            </div>
                            <p className="text-xs text-gray-500 leading-relaxed">
                                {role.description}
                            </p>
                        </div>
                    ))}
                </div>
            </div>
        </>
    );
}