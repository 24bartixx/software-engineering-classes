import { useNavigate } from 'react-router-dom';
import PageCard from "./page-card";

type ErrorStateProps = {
    title: string;
    description: string;
    onBack?: () => void;
    backLabel?: string;
};

export default function ErrorState({ title, description, onBack, backLabel = "Powrót" }: ErrorStateProps) {
    const navigate = useNavigate();
    const handleBack = onBack || (() => navigate(-1));

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
                        <h2 className="text-xl font-bold text-gray-900 mb-2">{title}</h2>
                        <p className="text-gray-600 mb-6">{description}</p>
                        <button
                            onClick={handleBack}
                            className="px-6 py-2 bg-slate-800 text-white rounded-lg hover:bg-slate-900 transition-colors"
                        >
                            {backLabel}
                        </button>
                    </div>
                </PageCard>
            </div>
        </div>
    );
}