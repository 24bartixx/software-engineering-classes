import { useState, useEffect, useCallback } from 'react';
import { getEmployeesTestInfo } from '../services/api/belbin-api';
import type { EmployeeBelbinTestStatus } from "../types/belbin";

export function useBelbinEmployees(storageKey: string) {
    const [employees, setEmployees] = useState<EmployeeBelbinTestStatus[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [selectedEmployeeId, setSelectedEmployeeId] = useState<number | null>(() => {
        const saved = sessionStorage.getItem(storageKey);
        return saved ? Number(saved) : null;
    });

    useEffect(() => {
        const fetchEmployees = async () => {
            try {
                setIsLoading(true);
                const employeesTestInfo = await getEmployeesTestInfo();
                setEmployees(employeesTestInfo);

                if (employeesTestInfo.length > 0 && !selectedEmployeeId) {
                    const firstId = employeesTestInfo[0].id;
                    setSelectedEmployeeId(firstId);
                    sessionStorage.setItem(storageKey, String(firstId));
                }
            } catch (error) {
                console.error('Failed to fetch employees test info data: ', error);
            } finally {
                setIsLoading(false);
            }
        };
        fetchEmployees();
    }, [selectedEmployeeId]);

    const handleSelectEmployee = useCallback((id: number) => {
        setSelectedEmployeeId(id);
        sessionStorage.setItem(storageKey, String(id));
    }, [storageKey]);

    const selectedEmployee = employees.find(e => e.id === selectedEmployeeId) || null;

    const formatDate = (date: Date | string | null) => {
        if (!date) return 'Brak';
        return new Date(date).toLocaleDateString();
    };

    return {
        employees,
        isLoading,
        selectedEmployeeId,
        selectedEmployee,
        setSelectedEmployeeId: handleSelectEmployee,
        formatDate: formatDate,
    };
}