type CustomDateInputProps = {
  label: string;
  value: string; // "YYYY-MM-DD"
  onChange: (value: string) => void;
  isErr: boolean;
};

export default function CustomDateInput({
  label,
  value,
  onChange,
  isErr = false,
}: CustomDateInputProps) {
  const id = `date-${label.replace(/\s+/g, "-").toLowerCase()}`;

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
          type="date"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className={`h-14 w-[28rem] rounded-2xl border bg-white px-6 text-lg outline-none focus:ring-2 ${
            isErr
              ? "border-red-600 text-red-600 focus:ring-red-600/20"
              : "border-black text-black focus:ring-black/20"
          }`}
        />
      </div>
    </div>
  );
}
