import {useNavigate} from "react-router-dom";
import PageCard from '../../components/page-card';
import {BelbinTestStatus} from "../../types/belbin";
import PageLoader from "../../components/page-loader";
import ErrorState from "../../components/error-state";
import BackButton from "../../components/back-button";
import {useBelbinEmployees} from "../../hooks/use-belbin-employees";
import EmployeeSelector from "../../components/employee-selector";
import BelbinStatusCard from "../../components/belbin-status-card";

const SELECTED_EMPLOYEE_ID_KEY = "belbin_dashboard_selected_employee_id";

export default function BelbinDashboard() {
    const navigate = useNavigate();
    const { employees, isLoading, selectedEmployeeId, selectedEmployee, setSelectedEmployeeId, formatDate}
        = useBelbinEmployees(SELECTED_EMPLOYEE_ID_KEY);

    const renderTestStatusContent = () => {
        if (!selectedEmployee) return null;

        const commonBtnClass = "px-5 py-2.5 bg-slate-800 text-white text-sm font-medium rounded-lg hover:bg-slate-900 transition-all shadow-sm whitespace-nowrap";
        switch (selectedEmployee.status) {
            case BelbinTestStatus.COMPLETED:
                return (
                    <BelbinStatusCard
                        variant="success"
                        description={<>Ostatni test wykonano <strong>{formatDate(selectedEmployee.lastTestDate)}</strong>. Twoje wyniki są aktualne.</>}
                        icon={
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                                <path fillRule="evenodd" d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12zm13.36-1.814a.75.75 0 10-1.22-.872l-3.236 4.53L9.53 12.22a.75.75 0 00-1.06 1.06l2.25 2.25a.75.75 0 001.14-.094l3.75-5.25z" clipRule="evenodd" />
                            </svg>
                        }
                        actions={
                            <button onClick={() => navigate(`/belbin/results/${selectedEmployee.id}`)} className={commonBtnClass}>
                                Zobacz wyniki
                            </button>
                        }
                    />
                );

            case BelbinTestStatus.EXPIRED:
                return (
                    <BelbinStatusCard
                        variant="warning"
                        description={<span>Twój ostatni test wykonano <strong>{formatDate(selectedEmployee.lastTestDate)}</strong>.
                            <br/> Zaktualizuj swoje wyniki, aby mieć aktualne informacje o swoich rolach zespołowych. </span>}
                        icon={
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                                <path fillRule="evenodd" d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25zM12.75 6a.75.75 0 00-1.5 0v6c0 .414.336.75.75.75h4.5a.75.75 0 000-1.5h-3.75V6z" clipRule="evenodd" />
                            </svg>
                        }
                        actions={
                            <button onClick={() => navigate(`/belbin/test/${selectedEmployee.id}`)} className={commonBtnClass}>
                                Rozpocznij ponownie
                            </button>
                        }
                    />
                );

            case BelbinTestStatus.NOT_STARTED:
            default:
                return (
                    <BelbinStatusCard
                        variant="info"
                        description="Nie masz jeszcze wykonanego testu Belbina. Wypełnij go aby poznać swoje role zespołowe i dowiedzieć się, jak możesz najlepiej funkcjonować w zespole."
                        icon={
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                                <path d="M21.731 2.269a2.625 2.625 0 00-3.712 0l-1.157 1.157 3.712 3.712 1.157-1.157a2.625 2.625 0 000-3.712zM19.513 8.199l-3.712-3.712-8.4 8.4a5.25 5.25 0 00-1.32 2.214l-.8 2.685a.75.75 0 00.933.933l2.685-.8a5.25 5.25 0 002.214-1.32l8.4-8.4z" /><path d="M5.25 5.25a3 3 0 00-3 3v10.5a3 3 0 003 3h10.5a3 3 0 003-3V13.5a.75.75 0 00-1.5 0v5.25a1.5 1.5 0 01-1.5 1.5H5.25a1.5 1.5 0 01-1.5-1.5V8.25a1.5 1.5 0 011.5-1.5h5.25a.75.75 0 000-1.5H5.25z" />
                            </svg>
                        }
                        actions={
                            <button onClick={() => navigate(`/belbin/test/${selectedEmployee.id}`)} className={commonBtnClass}>
                                Rozpocznij test
                            </button>
                        }
                    />
                );
        }
    };

    if (isLoading) return <PageLoader message='Ładowanie danych o pracownikach...'/>;
    if (employees.length === 0) {
        return <ErrorState title="Brak danych" description="Nie znaleziono danych o pracownikach w systemie."/>;
    }

    const employeeName = selectedEmployee?.name || 'Użytkowniku';

    return (
        <div className="min-h-screen bg-[#e9f0f6] flex justify-center items-center py-8 font-sans">
            <div className="w-full max-w-4xl">
                <PageCard>
                    <div className="w-full max-w-4xl p-6">
                        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 pb-8 border-b border-gray-100">
                            <div>
                                <h1 className="text-2xl font-bold text-gray-900">Cześć, {employeeName}! 👋</h1>
                                <p className="text-sm text-gray-500 mt-1">Panel Twojego rozwoju zawodowego</p>
                            </div>

                            <div className="flex flex-col items-end">
                                <BackButton label='Powrót do strony głównej' onClick={() => navigate("/")}/>
                                <div className="mt-4 sm:mt-0 flex items-center bg-gray-50 px-3 py-2 rounded-lg border border-gray-200">
                                    <EmployeeSelector
                                        employees={employees}
                                        selectedId={selectedEmployeeId}
                                        onSelect={setSelectedEmployeeId}
                                        label="Widok:"
                                    />
                                </div>
                            </div>
                        </div>

                        <div>
                            <h2 className="text-lg font-bold text-gray-900 mb-4">Mój rozwój</h2>
                            {renderTestStatusContent()}
                        </div>
                    </div>
                </PageCard>
            </div>
        </div>
    );
}