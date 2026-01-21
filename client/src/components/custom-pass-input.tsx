import { useState } from "react";
import { EyeIcon, EyeSlashIcon } from "@heroicons/react/24/solid";

type CustomPassInputProps = {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  isErr: boolean;
};

export default function CustomPassInput({
  label,
  value,
  onChange,
  placeholder = "",
  isErr = false,
}: CustomPassInputProps) {
  const [showPassword, setShowPassword] = useState(false);
  const id = `input-${label.replace(/\s+/g, "-").toLowerCase()}`;

  return (
    <div className="w-full py-3">
      <div className="flex items-center justify-between gap-10 text-lg">
        <label
          htmlFor={id}
          className={`font-normal ${isErr ? "text-red-600" : "text-black"}`}
        >
          {label}
        </label>

        <div className="relative w-md">
          <input
            id={id}
            type={showPassword ? "text" : "password"}
            value={value}
            placeholder={placeholder}
            onChange={(e) => onChange(e.target.value)}
            className={`h-14 w-full rounded-2xl border bg-white px-6 pr-14 text-lg outline-none focus:ring-2 ${
              isErr
                ? "border-red-600 focus:ring-red-600/20"
                : "border-black focus:ring-black/20"
            }`}
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-4 top-1/2 -translate-y-1/2"
          >
            {showPassword ? (
              <EyeSlashIcon className="h-5 w-5 text-black" />
            ) : (
              <EyeIcon className="h-5 w-5 text-black" />
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
