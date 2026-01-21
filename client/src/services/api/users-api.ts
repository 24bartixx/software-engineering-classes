import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export interface CreateAccountDto {
  first_name: string;
  last_name: string;
  email: string;
  gender: "Male" | "Female" | "Other";
  phone_number: string;
  birthday_date: string;
  address_id?: number;
}

export interface VerifyAccountDto {
  password: string;
  repeat_password: string;
}

export const createAccount = async (data: CreateAccountDto) => {
  console.log(`${API_BASE_URL}/auth/create-account`);
  const response = await axios.post(
    `${API_BASE_URL}/auth/create-account`,
    data,
  );
  return response.data;
};

export const verifyAccount = async (token: string, data: VerifyAccountDto) => {
  const response = await axios.post(
    `${API_BASE_URL}/auth/verify-account?token=${token}`,
    data,
  );
  return response.data;
};
