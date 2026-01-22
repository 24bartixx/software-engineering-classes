import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export const deleteAddress = async (id: number) => {
  const response = await axios.delete(`${API_BASE_URL}/addresses/${id}`);
  return response.data;
};
