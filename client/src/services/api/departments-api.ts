import axios from "axios";
import type { Department } from "../../types/department";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export const getAllDepartments = async (): Promise<Department[]> => {
  const response = await axios.get<{ id: number; name: string }[]>(
    `${API_BASE_URL}/departments`,
  );

  return response.data.map((dept) => ({
    value: dept.id.toString(),
    label: dept.name,
  }));
};
