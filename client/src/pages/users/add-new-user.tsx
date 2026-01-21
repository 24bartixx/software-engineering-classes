import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import PageCard from "../../components/page-card";
import CustomTextInput from "../../components/custom-text-input";
import CustomPhoneInput from "../../components/custom-phone-input";
import CustomDateInput from "../../components/custom-date-input";
import CustomMultiSelect from "../../components/custom-multi-select";
import CustomSelect from "../../components/custom-select";

import type { Department } from "../../types/department";
import type { Branch } from "../../types/branch";
import type { SystemRole } from "../../types/system-role";
import { ExclamationCircleIcon } from "@heroicons/react/24/solid";
import type { Gender } from "../../types/gender";
import { createAccount } from "../../services/api/users-api";
import { PencilIcon, PlusIcon } from "@heroicons/react/24/outline";

export type Address = {
  country: string;
  state?: string;
  postalCode: string;
  city: string;
  street: string;
  houseNumber: string;
  apartment?: string;
};

const departmentOptions: Department[] = [
  { value: "it", label: "IT" },
  { value: "engineering", label: "Engineering" },
  { value: "product", label: "Product" },
  { value: "design", label: "Design" },
  { value: "marketing", label: "Marketing" },
  { value: "sales", label: "Sales" },
  { value: "finance", label: "Finance" },
  { value: "hr", label: "Human Resources" },
  { value: "operations", label: "Operations" },
  { value: "support", label: "Customer Support" },
];

const branchOptions: Branch[] = [
  { value: "warsaw-hq", label: "Warsaw (HQ)", isHq: true },
  { value: "krakow", label: "Kraków", isHq: false },
  { value: "wroclaw", label: "Wrocław", isHq: false },
  { value: "poznan", label: "Poznań", isHq: false },
  { value: "gdansk", label: "Gdańsk", isHq: false },
  { value: "lodz", label: "Łódź", isHq: false },
  { value: "remote-pl", label: "Remote (Poland)", isHq: false },
  { value: "remote-eu", label: "Remote (EU)", isHq: false },
];

const systemRoleOptions: SystemRole[] = [
  { value: "admin", label: "Admin" },
  { value: "employee", label: "Employee" },
  { value: "hr-employee", label: "HR employee" },
  { value: "project-manager", label: "Project Manager" },
];

const genderOptions: Gender[] = [
  { value: "male", label: "Male" },
  { value: "female", label: "Female" },
  { value: "other", label: "Other" },
];

type FieldKey =
  | "firstName"
  | "lastName"
  | "email"
  | "gender"
  | "phoneNumber"
  | "birthDate"
  | "systemRole";

export default function AddNewUser() {
  const navigate = useNavigate();
  const location = useLocation();

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [gender, setGender] = useState<Gender | null>(null);

  const [phoneDial, setPhoneDial] = useState("+48");
  const [phoneNumber, setPhoneNumber] = useState("");

  const [birthDate, setBirthDate] = useState("");

  const [address, setAddress] = useState<Address | null>(null);

  const [departments, setDepartments] = useState<Department[]>([]);
  const [branches, setBranches] = useState<Branch[]>([]);
  const [systemRole, setSystemRole] = useState<SystemRole | null>(null);

  const [error, setError] = useState("");
  const [fieldError, setFieldError] = useState<FieldKey | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (location.state?.address) {
      setAddress(location.state.address);
      window.history.replaceState({}, document.title);
    }
  }, [location]);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!firstName.trim()) {
      setFieldError("firstName");
      setError("First name is required");
      return;
    }
    if (!lastName.trim()) {
      setFieldError("lastName");
      setError("Last name is required");
      return;
    }
    if (!email.trim()) {
      setFieldError("email");
      setError("Email is required");
      return;
    }
    if (!gender) {
      setFieldError("gender");
      setError("Gender is required");
      return;
    }
    if (!phoneNumber.trim()) {
      setFieldError("phoneNumber");
      setError("Phone number is required");
      return;
    }
    if (!birthDate.trim()) {
      setFieldError("birthDate");
      setError("Birth date is required");
      return;
    }
    if (!systemRole) {
      setFieldError("systemRole");
      setError("System role is required");
      return;
    }

    setError("");
    setFieldError(null);
    setIsSubmitting(true);

    try {
      const genderValue = gender.label as "Male" | "Female" | "Other";

      let response = await createAccount({
        first_name: firstName,
        last_name: lastName,
        email: email,
        gender: genderValue,
        phone_number: `${phoneDial}${phoneNumber}`,
        birthday_date: birthDate,
      });

      console.log("Account creation response:", response);

      // navigate("/");
    } catch (err: any) {
      setError(
        err.response?.data?.message ||
          "Failed to create account. Please try again.",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const formatAddress = (addr: Address) => {
    const parts = [
      addr.country,
      addr.postalCode,
      addr.city,
      `ul. ${addr.street} ${addr.houseNumber}`,
    ];
    return parts.join(", ");
  };

  return (
    <PageCard>
      <form
        onSubmit={onSubmit}
        className="flex flex-col w-full min-h-[calc(100vh-220px)] px-12"
      >
        <div className="flex flex-col items-center">
          <h1 className="font-semibold text-2xl">Add new user</h1>

          {error && (
            <div className="w-full pt-6 mb-4">
              <div className="w-full rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700 flex items-start gap-3">
                <ExclamationCircleIcon className="h-5 w-5 text-red-700 mt-0.5 flex-shrink-0" />
                <span>{error}</span>
              </div>
            </div>
          )}

          <div className={fieldError === "firstName" ? "w-full" : "w-full"}>
            <CustomTextInput
              label="First name"
              value={firstName}
              onChange={(v) => {
                setFirstName(v);
                if (fieldError === "firstName") setFieldError(null);
                if (error && fieldError === "firstName") setError("");
              }}
              placeholder="Charles"
              isErr={fieldError === "firstName"}
            />
          </div>

          <div className="w-full">
            <CustomTextInput
              label="Last name"
              value={lastName}
              onChange={(v) => {
                setLastName(v);
                if (fieldError === "lastName") setFieldError(null);
                if (error && fieldError === "lastName") setError("");
              }}
              placeholder="Leclerc"
              isErr={fieldError === "lastName"}
            />
          </div>

          <div className="w-full">
            <CustomTextInput
              label="Email"
              value={email}
              onChange={(v) => {
                setEmail(v);
                if (fieldError === "email") setFieldError(null);
                if (error && fieldError === "email") setError("");
              }}
              placeholder="charles.leclerc@ferrari.com"
              isErr={fieldError === "email"}
            />
          </div>

          <div className="w-full">
            <CustomSelect
              label="Gender"
              options={genderOptions}
              value={gender}
              onChange={(v) => {
                setGender(v);
                if (fieldError === "gender") setFieldError(null);
                if (error && fieldError === "gender") setError("");
              }}
              placeholder="Select gender"
              isErr={fieldError === "gender"}
            />
          </div>

          <div className="w-full">
            <CustomPhoneInput
              label="Phone number"
              countryCode={phoneDial}
              onCountryCodeChange={(v) => {
                setPhoneDial(v);
                if (fieldError === "phoneNumber") setFieldError(null);
                if (error && fieldError === "phoneNumber") setError("");
              }}
              value={phoneNumber}
              onChange={(v) => {
                setPhoneNumber(v);
                if (fieldError === "phoneNumber") setFieldError(null);
                if (error && fieldError === "phoneNumber") setError("");
              }}
              placeholder="123 456 789"
              isErr={fieldError === "phoneNumber"}
            />
          </div>

          <div className="w-full">
            <CustomDateInput
              label="Birth date"
              value={birthDate}
              onChange={(v) => {
                setBirthDate(v);
                if (fieldError === "birthDate") setFieldError(null);
                if (error && fieldError === "birthDate") setError("");
              }}
              isErr={fieldError === "birthDate"}
            />
          </div>

          <div className="w-full py-3">
            <div className="flex items-center justify-between gap-10 text-lg">
              <label className="font-normal text-black">
                Residential address
              </label>

              <div className="flex items-center gap-3 w-[28rem]">
                <div className="h-14 flex-1 rounded-2xl border border-black bg-white px-6 flex items-center text-base">
                  {address ? (
                    <span className="truncate text-black">
                      {formatAddress(address)}
                    </span>
                  ) : (
                    <span className="text-black/50">brak</span>
                  )}
                </div>
                <button
                  type="button"
                  onClick={() =>
                    navigate("/users/add-address", { state: { address } })
                  }
                  className="h-14 w-14 rounded-2xl border-1 border-black bg-white hover:bg-gray-50 active:scale-[0.99] flex items-center justify-center flex-shrink-0"
                >
                  {address ? (
                    <PencilIcon className="h-6 w-6 text-black" />
                  ) : (
                    <PlusIcon className="h-6 w-6 text-black" />
                  )}
                </button>
              </div>
            </div>
          </div>

          <div className="w-full">
            <CustomMultiSelect
              label="Departments"
              options={departmentOptions}
              value={departments}
              onChange={(v) => {
                setDepartments(v);
              }}
              placeholder="Sales"
            />
          </div>

          <div className="w-full">
            <CustomMultiSelect
              label="Branches"
              options={branchOptions}
              value={branches}
              onChange={(v) => {
                setBranches(v);
              }}
              placeholder="Wroclaw"
            />
          </div>

          <div className="w-full">
            <CustomSelect
              label="System role"
              options={systemRoleOptions}
              value={systemRole}
              onChange={(v) => {
                setSystemRole(v);
                if (fieldError === "systemRole") setFieldError(null);
                if (error && fieldError === "systemRole") setError("");
              }}
              placeholder="Employee"
              isErr={fieldError === "systemRole"}
            />
          </div>
        </div>

        <div className="mt-auto pt-5">
          <div className="pt-4">
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => navigate(-1)}
                className="w-full h-11 rounded-xl border-2 border-black bg-white text-black hover:bg-gray-50 active:scale-[0.99]"
              >
                Back
              </button>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full h-11 rounded-xl bg-black text-white hover:opacity-90 active:scale-[0.99] disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? "Sending..." : "Send verification code"}
              </button>
            </div>
          </div>
        </div>
      </form>
    </PageCard>
  );
}
