import axios from "axios";
import type { Branch } from "../../types/branch";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export const getAllBranches = async (): Promise<Branch[]> => {
  const response = await axios.get<
    { branch_id: number; is_hq: boolean; address: { city: string } }[]
  >(`${API_BASE_URL}/branches`);

  return response.data.map((branch) => ({
    value: branch.branch_id.toString(),
    label: branch.address?.city || `Branch #${branch.branch_id}`,
    isHq: branch.is_hq,
  }));
};
