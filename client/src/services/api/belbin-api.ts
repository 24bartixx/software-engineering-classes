import axios from "axios"
import type { BelbinQuestion, EmployeeBelbinResult, EmployeeBelbinTestStatus } from "../../types/belbin";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export const getBelbinQuestions = async () => {
    const response = await axios.get<BelbinQuestion[]>(
        `${API_BASE_URL}/belbin/questions`
    );
    return response.data;
};

export const sendBelbinTestAnswers = async (employeeId: number, answers: Record<string, number>) => {
    const response = await axios.post(
        `${API_BASE_URL}/belbin/answers`,
        {
            id: employeeId,
            answers: answers,
        }
    );
    return response.data;
};

export const getEmployeesTestInfo = async () => {
    const response = await axios.get<EmployeeBelbinTestStatus[]>(
        `${API_BASE_URL}/belbin/info`
    );
    return response.data;
};

export const getTestResults = async (employeeId: number) => {
    const response = await axios.get<EmployeeBelbinResult>(
        `${API_BASE_URL}/belbin/results/${employeeId}`
    );
    return response.data;
};

export const sendReminderNotification = async (employeeId: number) => {
    const response = await axios.post(
        `${API_BASE_URL}/belbin/notify-expired/${employeeId}`
    );
    return response.data;
};
