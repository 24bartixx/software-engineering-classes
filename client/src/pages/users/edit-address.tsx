import { useState, useEffect } from "react";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import PageCard from "../../components/page-card";
import CustomSelect, { type Option } from "../../components/custom-select";
import CustomTextInput from "../../components/custom-text-input";
import { ExclamationCircleIcon } from "@heroicons/react/24/solid";
import type { Address } from "../../types/address";
import {
  getAddress,
  removeAddressFromUser,
} from "../../services/api/users-api";

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

export default function EditAddress() {
  const navigate = useNavigate();
  const location = useLocation();
  const { id } = useParams<{ id: string }>();
  const isAddingNew = location.state?.isAddingNew || false;

  const [country, setCountry] = useState<Country | null>(null);
  const [state, setState] = useState("");
  const [postalCode, setPostalCode] = useState("");
  const [city, setCity] = useState("");
  const [street, setStreet] = useState("");
  const [houseNumber, setHouseNumber] = useState("");
  const [apartment, setApartment] = useState("");
  const [addressId, setAddressId] = useState<number | null>(null);
  const [error, setError] = useState("");
  const [fieldError, setFieldError] = useState<FieldKey | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [hasNoAddress, setHasNoAddress] = useState(false);
  const [shouldAnimate, setShouldAnimate] = useState(false);

  useEffect(() => {
    const fetchAddress = async () => {
      if (!id) return;

      // Skip fetching if we're adding a new address
      if (isAddingNew) {
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true);
        const addressData = await getAddress(Number.parseInt(id));

        if (!addressData || !addressData.address_id) {
          setHasNoAddress(true);
          setIsLoading(false);
          return;
        }

        if (addressData) {
          const selectedCountry = countryOptions.find(
            (c) => c.value === addressData.country,
          );
          setAddressId(addressData.address_id || null);
          setCountry(selectedCountry || null);
          setState(addressData.state || "");
          setPostalCode(addressData.postalCode);
          setCity(addressData.city);
          setStreet(addressData.street);
          setHouseNumber(addressData.houseNumber);
          setApartment(addressData.apartment || "");
        }
      } catch (err) {
        console.error("Failed to fetch address data:", err);
        setError("Failed to load address data");
      } finally {
        setIsLoading(false);
      }
    };

    fetchAddress();
  }, [id, isAddingNew]);

  useEffect(() => {
    const fromEditUser = sessionStorage.getItem("fromEditUser") === "true";
    if (fromEditUser) {
      setShouldAnimate(true);
      sessionStorage.removeItem("fromEditUser");
    }
  }, []);

  const handleRemoveAddress = async () => {
    if (!window.confirm("Are you sure you want to remove this address?")) {
      return;
    }

    try {
      await removeAddressFromUser(Number.parseInt(id!));
      sessionStorage.setItem("fromEditAddress", "true");
      navigate(-1);
    } catch (err) {
      setError("Failed to remove address");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
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

    const updatedAddress: Address = {
      country: country.value,
      state: state || undefined,
      postalCode,
      city,
      street,
      houseNumber,
      apartment: apartment || undefined,
    };

    // TODO: Make API call to update address
    // Example:
    // try {
    //   await fetch(`/api/users/${id}/address`, {
    //     method: 'PATCH',
    //     headers: { 'Content-Type': 'application/json' },
    //     body: JSON.stringify(updatedAddress),
    //   });
    //   navigate(-1);
    // } catch (err) {
    //   setError("Failed to update address");
    // }

    console.log("Update address for user:", id, updatedAddress);
    sessionStorage.setItem("fromEditAddress", "true");
    navigate(-1);
  };

  if (isLoading) {
    const loadingContent = (
      <PageCard>
        <div className="flex items-center justify-center min-h-[calc(100vh-220px)]">
          <p className="text-gray-500">Loading address data...</p>
        </div>
      </PageCard>
    );

    if (shouldAnimate) {
      return (
        <motion.div
          initial={{ x: "100%", opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          exit={{ x: "100%", opacity: 0 }}
          transition={{ duration: 0.3, ease: "easeOut" }}
        >
          {loadingContent}
        </motion.div>
      );
    }
    return loadingContent;
  }

  if (hasNoAddress && !isAddingNew) {
    const noAddressContent = (
      <PageCard>
        <div className="flex flex-col items-center justify-center min-h-[calc(100vh-220px)] px-12 gap-6">
          <div className="text-center">
            <h1 className="font-semibold text-2xl mb-2">No Address Found</h1>
            <p className="text-gray-600">
              This user does not have an address assigned yet.
            </p>
          </div>
          <button
            type="button"
            className="w-64 h-11 rounded-xl border-2 border-black bg-white text-black hover:bg-gray-50 active:scale-[0.99]"
            onClick={() => {
              sessionStorage.setItem("fromEditAddress", "true");
              navigate(-1);
            }}
          >
            Back to user
          </button>
        </div>
      </PageCard>
    );

    if (shouldAnimate) {
      return (
        <motion.div
          initial={{ x: "100%", opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          exit={{ x: "100%", opacity: 0 }}
          transition={{ duration: 0.3, ease: "easeOut" }}
        >
          {noAddressContent}
        </motion.div>
      );
    }
    return noAddressContent;
  }

  const content = (
    <PageCard>
      <form
        onSubmit={handleSubmit}
        className="flex flex-col w-full min-h-[calc(100vh-220px)] px-12"
      >
        <div className="flex flex-col items-center">
          <h1 className="font-semibold text-2xl">
            {isAddingNew ? "Add address" : "Edit address"}
          </h1>

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
            <div
              className={`grid ${isAddingNew ? "grid-cols-2" : "grid-cols-3"} gap-3`}
            >
              <button
                type="button"
                className="w-full h-11 rounded-xl border-2 border-black bg-white text-black hover:bg-gray-50 active:scale-[0.99]"
                onClick={() => {
                  sessionStorage.setItem("fromEditAddress", "true");
                  navigate(-1);
                }}
              >
                Back
              </button>

              {!isAddingNew && (
                <button
                  type="button"
                  className="w-full h-11 rounded-xl border-2 border-black bg-white text-black hover:bg-gray-50 active:scale-[0.99]"
                  onClick={handleRemoveAddress}
                >
                  Remove address
                </button>
              )}

              <button
                type="submit"
                className="w-full h-11 rounded-xl bg-black text-white hover:opacity-90 active:scale-[0.99]"
              >
                {isAddingNew ? "Add" : "Edit"}
              </button>
            </div>
          </div>
        </div>
      </form>
    </PageCard>
  );

  if (shouldAnimate) {
    return (
      <motion.div
        initial={{ x: "100%", opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        exit={{ x: "100%", opacity: 0 }}
        transition={{ duration: 0.3, ease: "easeOut" }}
      >
        {content}
      </motion.div>
    );
  }

  return content;
}
