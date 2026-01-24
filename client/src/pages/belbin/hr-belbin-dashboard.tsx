import {useNavigate} from 'react-router-dom';
import PageCard from '../../components/page-card';
import PageLoader from '../../components/page-loader';
import ErrorState from '../../components/error-state';
import BackButton from '../../components/back-button';
import {BelbinTestStatus} from "../../types/belbin";
import {useBelbinEmployees} from "../../hooks/use-belbin-employees";
import EmployeeSelector from "../../components/employee-selector";
import BelbinStatusCard from "../../components/belbin-status-card";

const SELECTED_EMPLOYEE_ID_KEY = "hr_belbin_dashboard_selected_employee_id";

export default function HrBelbinDashboard() {
    const navigate = useNavigate();
    const { employees, isLoading, selectedEmployeeId, selectedEmployee, setSelectedEmployeeId, formatDate }
        = useBelbinEmployees(SELECTED_EMPLOYEE_ID_KEY);

    const handlePreview = (employeeId: number) => {
        navigate(`/hr/belbin/results/${employeeId}`);
    };

    const renderEmployeeTestStatusContent = () => {
        if (!selectedEmployee) return null;

        const commonBtnClass = "px-5 py-2.5 bg-slate-800 text-white text-sm font-medium rounded-lg hover:bg-slate-900 transition-all shadow-sm";
        switch (selectedEmployee.status) {
            case BelbinTestStatus.COMPLETED:
                return (
                    <BelbinStatusCard
                        variant="success"
                        title="Test ukończony"
                        description={<span>Pracownik posiada aktualny test. Data wykonania: <strong>{formatDate(selectedEmployee.lastTestDate)}</strong>.</span>}
                        icon={
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-8 h-8">
                                <path fillRule="evenodd" d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12zm13.36-1.814a.75.75 0 10-1.22-.872l-3.236 4.53L9.53 12.22a.75.75 0 00-1.06 1.06l2.25 2.25a.75.75 0 001.14-.094l3.75-5.25z" clipRule="evenodd" />
                            </svg>
                        }
                        actions={
                            <button onClick={() => handlePreview(selectedEmployee.id)} className={commonBtnClass}>
                                Zobacz wyniki
                            </button>
                        }
                    />
                );

            case BelbinTestStatus.EXPIRED:
                return (
                    <BelbinStatusCard
                        variant="warning"
                        title="Test przeterminowany"
                        description={<span>Wygasł: <strong>{formatDate(selectedEmployee.lastTestDate)}</strong>. Dostępne są wyniki archiwalne.</span>}
                        icon={
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-8 h-8">
                                <path fillRule="evenodd" d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25zM12.75 6a.75.75 0 00-1.5 0v6c0 .414.336.75.75.75h4.5a.75.75 0 000-1.5h-3.75V6z" clipRule="evenodd" />
                            </svg>
                        }
                        actions={
                            <button onClick={() => handlePreview(selectedEmployee.id)} className={commonBtnClass}>
                                Zobacz wyniki
                            </button>
                        }
                    />
                );

            case BelbinTestStatus.NOT_STARTED:
            default:
                return (
                    <BelbinStatusCard
                        variant="neutral"
                        title="Brak wyników"
                        description="Ten pracownik nie wykonał jeszcze testu Belbina."
                        icon={
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-8 h-8">
                                <path fillRule="evenodd" d="M10.5 3.75a6.75 6.75 0 100 13.5 6.75 6.75 0 000-13.5zM2.25 10.5a8.25 8.25 0 1114.59 5.28l4.69 4.69a.75.75 0 11-1.06 1.06l-4.69-4.69A8.25 8.25 0 012.25 10.5z" clipRule="evenodd" />
                            </svg>
                        }
                    />
                );
        }
    };

    if (isLoading) return <PageLoader message="Ładowanie danych o pracownikach..." />;
    if (employees.length === 0) {
        return <ErrorState title="Brak danych" description="Nie znaleziono danych o pracownikach w systemie." />;
    }

    return (
        <div className="min-h-screen bg-[#e9f0f6] flex justify-center items-start py-8 font-sans">
            <div className="w-full max-w-4xl">
                <PageCard>
                    <div className="w-full max-w-3xl p-6">
                        <div className="mb-8 border-b border-gray-100 pb-6">
                            <div className="flex justify-between items-start mb-4">
                                <div>
                                    <BackButton label="Powrót do strony głównej" onClick={() => navigate('/')}/>
                                    <h1 className="text-2xl font-bold text-gray-900">Panel HR - Belbin</h1>
                                    <p className="text-sm text-gray-500 mt-1">Przeglądaj wyniki i zarządzaj testami pracowników.</p>
                                </div>
                                <div className="hidden sm:block">
                                    <span className="bg-blue-50 text-blue-700 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide">
                                        HR
                                    </span>
                                </div>
                            </div>
                            <div className="mt-6 bg-gray-50 p-4 rounded-lg border border-gray-200">
                                <EmployeeSelector
                                    employees={employees}
                                    selectedId={selectedEmployeeId}
                                    onSelect={setSelectedEmployeeId}
                                    label="Wybierz pracownika z listy:"
                                />
                            </div>
                        </div>
                        <div>
                            <h2 className="text-lg font-bold text-gray-900 mb-4">Status pracownika</h2>
                            {renderEmployeeTestStatusContent()}
                        </div>
                    </div>
                </PageCard>
            </div>
        </div>
    );
}