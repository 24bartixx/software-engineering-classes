type CustomTextInputProps = {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  isErr: boolean;
};

export default function CustomTextInput({
  label,
  value,
  onChange,
  placeholder = "",
  isErr = false,
}: CustomTextInputProps) {
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

        <input
          id={id}
          type="text"
          value={value}
          placeholder={placeholder}
          onChange={(e) => onChange(e.target.value)}
          className={`h-14 w-md rounded-2xl border bg-white px-6 text-lg outline-none focus:ring-2 ${
            isErr
              ? "border-red-600 focus:ring-red-600/20"
              : "border-black focus:ring-black/20"
          }`}
        />
      </div>
    </div>
  );
}
