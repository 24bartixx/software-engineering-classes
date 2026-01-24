import React from 'react';

type CardVariant = 'success' | 'warning' | 'info' | 'neutral';

type BelbinStatusCardProps = {
    variant: CardVariant;
    icon: React.ReactNode;
    title?: string;
    description: React.ReactNode;
    actions?: React.ReactNode;
};

const VARIANT_STYLES: Record<CardVariant, { bg: string, text: string }> = {
    success: { bg: 'bg-green-100', text: 'text-green-600' },
    warning: { bg: 'bg-amber-100', text: 'text-amber-600' },
    info:    { bg: 'bg-blue-100',  text: 'text-blue-600' },
    neutral: { bg: 'bg-gray-100',  text: 'text-gray-400' },
};

export default function BelbinStatusCard({ variant, icon, title = 'Test Ról Zespołowych Belbina', description, actions }: BelbinStatusCardProps) {
    const styles = VARIANT_STYLES[variant];

    return (
        <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm transition-all hover:shadow-md">
            <div className="flex flex-col sm:flex-row gap-5 items-start sm:items-center">
                <div className={`p-3 rounded-full shrink-0 ${styles.bg} ${styles.text}`}>
                    <div className="w-8 h-8">
                        {icon}
                    </div>
                </div>

                <div className="flex-1">
                    <h3 className="text-lg font-bold text-gray-900">{title}</h3>
                    <div className="text-sm text-gray-500 mt-1">
                        {description}
                    </div>
                </div>

                {actions && (
                    <div className="shrink-0">
                        {actions}
                    </div>
                )}
            </div>
        </div>
    );
}