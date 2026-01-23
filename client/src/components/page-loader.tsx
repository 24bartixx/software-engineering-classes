import PageCard from "./page-card";

export default function PageLoader({ message = "Ładowanie wyników..." }: { message?: string }) {
    return (
        <PageCard>
            <div className="flex flex-col items-center gap-4">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-slate-800"></div>
                <p className="text-gray-500 font-medium">{message}</p>
            </div>
        </PageCard>
    );
}

