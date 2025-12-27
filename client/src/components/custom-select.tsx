import { useEffect, useMemo, useRef, useState } from "react";

export type Option<V extends string = string> = { value: V; label: string };

export type CustomSelectProps<T extends Option> = {
  label: string;
  options: T[];
  value: T | null;
  onChange: (next: T | null) => void;
  placeholder?: string;
  isErr: boolean;
};

export default function CustomSelect<T extends Option>({
  label,
  options,
  value,
  onChange,
  placeholder = "Select...",
  isErr = false,
}: CustomSelectProps<T>) {
  const id = `select-${label.replace(/\s+/g, "-").toLowerCase()}`;
  const [open, setOpen] = useState(false);
  const boxRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const onDocDown = (e: MouseEvent) => {
      if (!boxRef.current) return;
      if (!boxRef.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", onDocDown);
    return () => document.removeEventListener("mousedown", onDocDown);
  }, []);

  const selected = useMemo(() => {
    if (!value) return null;
    const labelByValue = new Map(options.map((o) => [o.value, o.label]));
    return { ...value, label: labelByValue.get(value.value) ?? value.label };
  }, [options, value]);

  const isSelected = (opt: T) => value?.value === opt.value;

  const pick = (opt: T) => {
    onChange(opt);
    setOpen(false);
  };

  const borderClass = isErr ? "border-red-600" : "border-black";
  const ringClass = isErr ? "focus:ring-red-600/20" : "focus:ring-black/20";
  const labelTextClass = isErr ? "text-red-600" : "text-black";
  const caretClass = isErr ? "text-red-600" : "text-black";

  return (
    <div className="w-full py-3">
      <div className="flex items-center justify-between gap-10 text-lg">
        <label htmlFor={id} className={`font-normal ${labelTextClass}`}>
          {label}
        </label>

        <div ref={boxRef} className="relative w-[28rem]">
          <button
            id={id}
            type="button"
            onClick={() => setOpen((s) => !s)}
            className={`flex h-14 w-full items-center rounded-2xl border bg-white px-4 pr-12 text-left outline-none focus:ring-2 ${borderClass} ${ringClass}`}
            aria-haspopup="listbox"
            aria-expanded={open}
          >
            <span className="min-w-0 flex-1 truncate text-base">
              {!selected ? (
                <span className={isErr ? "text-red-600/60" : "text-black/50"}>
                  {placeholder}
                </span>
              ) : (
                <span className={isErr ? "text-red-600" : "text-black"}>
                  {selected.label}
                </span>
              )}
            </span>

            <span
              className={`pointer-events-none absolute right-5 top-1/2 -translate-y-1/2 mr-2 ${caretClass}`}
            >
              ▼
            </span>
          </button>

          {open && (
            <div className="absolute z-50 mt-2 w-full">
              <div
                className={`overflow-hidden rounded-2xl border bg-white shadow ${borderClass}`}
              >
                <div
                  role="listbox"
                  className="max-h-60 w-full overflow-auto p-2"
                >
                  {options.map((o) => {
                    const selectedNow = isSelected(o);
                    return (
                      <button
                        key={o.value}
                        type="button"
                        onClick={() => pick(o)}
                        className="flex w-full items-center justify-between rounded-xl px-4 py-3 text-left text-base hover:bg-black/5"
                        role="option"
                        aria-selected={selectedNow}
                      >
                        <span className={isErr ? "text-red-600" : "text-black"}>
                          {o.label}
                        </span>
                        <span
                          className={
                            isErr ? "text-red-600/70" : "text-black/60"
                          }
                        >
                          {selectedNow ? "✓" : ""}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
