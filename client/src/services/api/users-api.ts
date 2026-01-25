import axios, { AxiosError } from "axios";
import type { UserProfile } from "../../types/user-profile";
import type { Address } from "../../types/address";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export interface CreateAccountDto {
  first_name: string;
  last_name: string;
  email: string;
  gender: "Male" | "Female" | "Other";
  phone_number: string;
  birthday_date: string;
  system_role: string;
  country?: string;
  state?: string;
  postal_code?: string;
  city?: string;
  street?: string;
  number?: string;
  apartment?: string;
  department_ids?: number[];
  branch_ids?: number[];
}

export interface VerifyAccountDto {
  password: string;
  repeat_password: string;
}

export interface EditUserDto {
  first_name: string;
  last_name: string;
  email: string;
  gender: "Male" | "Female" | "Other";
  phone_number: string;
  birthday_date: string;
  department_ids?: number[];
  branch_ids?: number[];
}

export const createAccount = async (data: CreateAccountDto) => {
  try {
    const response = await axios.post(
      `${API_BASE_URL}/auth/create-account`,
      data,
    );
    return { response: response.data, status: response.status };
  } catch (err) {
    const e = err as AxiosError<any>;
    return { response: e.response?.data, status: e.response?.status };
  }
};

export const verifyAccount = async (token: string, data: VerifyAccountDto) => {
  const response = await axios.post(
    `${API_BASE_URL}/auth/verify-account?token=${token}`,
    data,
  );
  return response.data;
};

export const getUserProfile = async (id: number): Promise<UserProfile> => {
  const response = await axios.get<UserProfile>(
    `${API_BASE_URL}/users/profile/${id}`,
  );
  return response.data;
};

export const editUser = async (id: number, data: EditUserDto) => {
  const response = await axios.post(
    `${API_BASE_URL}/users/edit-user/${id}`,
    data,
  );
  return response.data;
};

export const getAddress = async (id: number): Promise<Address | null> => {
  const response = await axios.get<any>(
    `${API_BASE_URL}/users/get-address/${id}`,
  );

  if (!response.data) {
    return null;
  }

  // Transform server response to match client Address type
  return {
    address_id: response.data.address_id,
    country: response.data.country,
    state: response.data.state,
    postalCode: response.data.postal_code,
    city: response.data.city,
    street: response.data.street,
    houseNumber: response.data.number,
    apartment: response.data.apartment,
  };
};

export const removeAddressFromUser = async (id: number) => {
  console.log(id);
  const response = await axios.post(
    `${API_BASE_URL}/users/remove-address/${id}`,
  );
  return response.data;
};

export const createAddressForUser = async (
  id: number,
  addressData: Omit<Address, "address_id">,
) => {
  // Transform client Address type to server format
  const serverAddress = {
    country: addressData.country,
    state: addressData.state,
    postal_code: addressData.postalCode,
    city: addressData.city,
    street: addressData.street,
    number: addressData.houseNumber,
    apartment: addressData.apartment,
  };

  const response = await axios.post(
    `${API_BASE_URL}/users/create-address/${id}`,
    serverAddress,
  );
  return response.data;
};
