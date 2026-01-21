import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import PageCard from "../../components/page-card";
import CustomSelect, { type Option } from "../../components/custom-select";
import CustomTextInput from "../../components/custom-text-input";
import { ExclamationCircleIcon } from "@heroicons/react/24/solid";

export type Address = {
  country: string;
  state?: string;
  postalCode: string;
  city: string;
  street: string;
  houseNumber: string;
  apartment?: string;
};

type Country = Option<string>;

type FieldKey = "country" | "postalCode" | "city" | "street" | "houseNumber";

const countryOptions: Country[] = [
  { value: "Poland", label: "Poland" },
  { value: "Germany", label: "Germany" },
  { value: "France", label: "France" },
  { value: "United Kingdom", label: "United Kingdom" },
  { value: "United States", label: "United States" },
  { value: "Spain", label: "Spain" },
  { value: "Italy", label: "Italy" },
  { value: "Netherlands", label: "Netherlands" },
  { value: "Belgium", label: "Belgium" },
  { value: "Switzerland", label: "Switzerland" },
];

export default function AddAddress() {
  const navigate = useNavigate();
  const location = useLocation();
  const initialAddress = location.state?.address as Address | undefined;

  const [country, setCountry] = useState<Country | null>(null);
  const [state, setState] = useState("");
  const [postalCode, setPostalCode] = useState("");
  const [city, setCity] = useState("");
  const [street, setStreet] = useState("");
  const [houseNumber, setHouseNumber] = useState("");
  const [apartment, setApartment] = useState("");

  const [error, setError] = useState("");
  const [fieldError, setFieldError] = useState<FieldKey | null>(null);

  useEffect(() => {
    if (initialAddress) {
      const selectedCountry = countryOptions.find(
        (c) => c.value === initialAddress.country,
      );
      setCountry(selectedCountry || null);
      setState(initialAddress.state || "");
      setPostalCode(initialAddress.postalCode);
      setCity(initialAddress.city);
      setStreet(initialAddress.street);
      setHouseNumber(initialAddress.houseNumber);
      setApartment(initialAddress.apartment || "");
    }
  }, [initialAddress]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!country) {
      setFieldError("country");
      setError("Country is required");
      return;
    }
    if (!postalCode.trim()) {
      setFieldError("postalCode");
      setError("Postal code is required");
      return;
    }
    if (!city.trim()) {
      setFieldError("city");
      setError("City is required");
      return;
    }
    if (!street.trim()) {
      setFieldError("street");
      setError("Street is required");
      return;
    }
    if (!houseNumber.trim()) {
      setFieldError("houseNumber");
      setError("House number is required");
      return;
    }

    setError("");
    setFieldError(null);

    const newAddress: Address = {
      country: country.value,
      state: state || undefined,
      postalCode,
      city,
      street,
      houseNumber,
      apartment: apartment || undefined,
    };

    navigate("/add-user", { state: { address: newAddress } });
  };

  return (
    <PageCard>
      <form
        onSubmit={handleSubmit}
        className="flex flex-col w-full min-h-[calc(100vh-220px)] px-12"
      >
        <div className="flex flex-col items-center">
          <h1 className="font-semibold text-2xl">Add address</h1>

          {error && (
            <div className="w-full pt-6 mb-4">
              <div className="w-full rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700 flex items-start gap-3">
                <ExclamationCircleIcon className="h-5 w-5 text-red-700 mt-0.5 flex-shrink-0" />
                <span>{error}</span>
              </div>
            </div>
          )}

          <div className="w-full">
            <CustomSelect
              label="Country"
              options={countryOptions}
              value={country}
              onChange={(v) => {
                setCountry(v);
                if (fieldError === "country") setFieldError(null);
                if (error && fieldError === "country") setError("");
              }}
              placeholder="Select country"
              isErr={fieldError === "country"}
            />
          </div>

          <div className="w-full">
            <CustomTextInput
              label="State (optional)"
              value={state}
              onChange={setState}
              placeholder=""
              isErr={false}
            />
          </div>

          <div className="w-full">
            <CustomTextInput
              label="Postal code"
              value={postalCode}
              onChange={(v) => {
                setPostalCode(v);
                if (fieldError === "postalCode") setFieldError(null);
                if (error && fieldError === "postalCode") setError("");
              }}
              placeholder=""
              isErr={fieldError === "postalCode"}
            />
          </div>

          <div className="w-full">
            <CustomTextInput
              label="City"
              value={city}
              onChange={(v) => {
                setCity(v);
                if (fieldError === "city") setFieldError(null);
                if (error && fieldError === "city") setError("");
              }}
              placeholder=""
              isErr={fieldError === "city"}
            />
          </div>

          <div className="w-full">
            <CustomTextInput
              label="Street"
              value={street}
              onChange={(v) => {
                setStreet(v);
                if (fieldError === "street") setFieldError(null);
                if (error && fieldError === "street") setError("");
              }}
              placeholder=""
              isErr={fieldError === "street"}
            />
          </div>

          <div className="w-full">
            <CustomTextInput
              label="House number"
              value={houseNumber}
              onChange={(v) => {
                setHouseNumber(v);
                if (fieldError === "houseNumber") setFieldError(null);
                if (error && fieldError === "houseNumber") setError("");
              }}
              placeholder=""
              isErr={fieldError === "houseNumber"}
            />
          </div>

          <div className="w-full">
            <CustomTextInput
              label="Apartment (optional)"
              value={apartment}
              onChange={setApartment}
              placeholder=""
              isErr={false}
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
                className="w-full h-11 rounded-xl bg-black text-white hover:opacity-90 active:scale-[0.99]"
              >
                Add
              </button>
            </div>
          </div>
        </div>
      </form>
    </PageCard>
  );
}
