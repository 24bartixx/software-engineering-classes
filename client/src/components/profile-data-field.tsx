type ProfileDataFieldProps = {
  label: string;
  value: string | string[];
};

export default function ProfileDataField({
  label,
  value,
}: ProfileDataFieldProps) {
  const displayValue = Array.isArray(value) ? value.join(", ") : value;

  return (
    <div className="flex flex-col gap-1">
      <div className="text-sm text-black/60">{label}</div>
      <div className="text-base font-semibold text-black">{displayValue}</div>
    </div>
  );
}
