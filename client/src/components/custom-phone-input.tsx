type CountryOption = {
  code: string;
  dial: string;
  label: string;
};

type CustomPhoneInputProps = {
  label: string;

  countryCode: string;
  onCountryCodeChange: (dial: string) => void;

  value: string;
  onChange: (value: string) => void;

  placeholder?: string;
  countries?: CountryOption[];

  isErr: boolean;
};

const defaultCountries: CountryOption[] = [
  { code: "PL", dial: "+48", label: "Polska" },
  { code: "DE", dial: "+49", label: "Niemcy" },
  { code: "GB", dial: "+44", label: "Wielka Brytania" },
  { code: "US", dial: "+1", label: "USA" },
  { code: "FR", dial: "+33", label: "Francja" },
  { code: "ES", dial: "+34", label: "Hiszpania" },
  { code: "IT", dial: "+39", label: "Włochy" },
  { code: "NL", dial: "+31", label: "Holandia" },
  { code: "SE", dial: "+46", label: "Szwecja" },
  { code: "NO", dial: "+47", label: "Norwegia" },
  { code: "CZ", dial: "+420", label: "Czechy" },
  { code: "SK", dial: "+421", label: "Słowacja" },
];

export default function CustomPhoneInput({
  label,
  countryCode,
  onCountryCodeChange,
  value,
  onChange,
  placeholder = "",
  countries = defaultCountries,
  isErr = false,
}: CustomPhoneInputProps) {
  const baseId = label.replace(/\s+/g, "-").toLowerCase();
  const selectId = `phone-country-${baseId}`;
  const inputId = `phone-number-${baseId}`;

  const borderClass = isErr ? "border-red-600" : "border-black";
  const ringClass = isErr ? "focus:ring-red-600/20" : "focus:ring-black/20";

  return (
    <div className="w-full py-3">
      <div className="flex items-center justify-between gap-10 text-lg">
        <label
          htmlFor={inputId}
          className={`font-normal ${isErr ? "text-red-600" : "text-black"}`}
        >
          {label}
        </label>

        <div className="flex items-center gap-6 w-md">
          <div className="relative">
            <select
              id={selectId}
              value={countryCode}
              onChange={(e) => onCountryCodeChange(e.target.value)}
              className={`h-14 w-32 appearance-none rounded-2xl border bg-white px-6 pr-12 text-lg outline-none focus:ring-2 ${ringClass}`}
              aria-label={`${label} - kraj`}
            >
              {countries.map((c) => (
                <option key={`${c.code}-${c.dial}`} value={c.dial}>
                  {c.dial}
                </option>
              ))}
            </select>

            <span className="pointer-events-none absolute right-5 top-1/2 -translate-y-1/2 text-black">
              ▼
            </span>
          </div>

          <input
            id={inputId}
            type="tel"
            inputMode="tel"
            autoComplete="tel"
            value={value}
            placeholder={placeholder}
            onChange={(e) => onChange(e.target.value)}
            className={`h-14 w-full rounded-2xl border bg-white px-6 text-lg outline-none focus:ring-2 ${borderClass} ${ringClass}`}
          />
        </div>
      </div>
    </div>
  );
}
