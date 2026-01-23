import axios from "axios";
import type { Address } from "../../types/address";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export const updateAddress = async (
  id: number,
  addressData: Partial<Address>,
) => {
  const response = await axios.patch(
    `${API_BASE_URL}/addresses/${id}`,
    addressData,
  );
  return response.data;
};

export const deleteAddress = async (id: number) => {
  const response = await axios.delete(`${API_BASE_URL}/addresses/${id}`);
  return response.data;
};
