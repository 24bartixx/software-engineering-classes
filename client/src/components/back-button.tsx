import { useNavigate } from 'react-router-dom';

type BackButtonProps = {
    label?: string;
    onClick?: () => void;
    className?: string;
};

export default function BackButton({ label = "Powrót", onClick, className = "" }: BackButtonProps) {
    const navigate = useNavigate();
    const handleClick = onClick || (() => navigate(-1));

    return (
        <button
            onClick={handleClick}
            className={`group text-sm text-gray-500 hover:text-gray-800 mb-4 flex items-center transition-colors ${className}`}
        >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 -2 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4 mr-2 text-gray-400 group-hover:text-gray-800 transition-colors">
                <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
            </svg>
            {label}
        </button>
    );
}