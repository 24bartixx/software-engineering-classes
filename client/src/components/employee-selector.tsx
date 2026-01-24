import type { EmployeeBelbinTestStatus } from "../types/belbin";

type EmployeeSelectorProps = {
    employees: EmployeeBelbinTestStatus[];
    selectedId: number | null;
    onSelect: (id: number) => void;
    label?: string;
};

export default function EmployeeSelector({ employees, selectedId, onSelect, label = "Wybierz pracownika:" }: EmployeeSelectorProps) {
    return (
        <div className="flex flex-col sm:flex-row items-center gap-2">
            <span className="text-xs font-semibold text-gray-500 uppercase tracking-wide whitespace-nowrap">
                {label}
            </span>
            <div className="relative w-full sm:w-auto">
                <select
                    className="appearance-none bg-gray-50 border border-gray-200 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full pl-3 pr-8 py-2 cursor-pointer font-medium"
                    value={selectedId || ''}
                    onChange={(e) => onSelect(Number(e.target.value))}
                >
                    {employees.map(emp => (
                        <option key={emp.id} value={emp.id}>
                            {emp.name} ({emp.status})
                        </option>
                    ))}
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-500">
                    <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/></svg>
                </div>
            </div>
        </div>
    );
}