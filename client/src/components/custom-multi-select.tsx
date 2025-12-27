import { useEffect, useMemo, useRef, useState } from "react";

export type Option<V extends string = string> = { value: V; label: string };

export type CustomMultiSelectProps<T extends Option> = {
  label: string;
  options: T[];
  value: T[];
  onChange: (next: T[]) => void;
  placeholder?: string;
};

export default function CustomMultiSelect<T extends Option>({
  label,
  options,
  value,
  onChange,
  placeholder = "Select...",
}: CustomMultiSelectProps<T>) {
  const id = `multi-${label.replace(/\s+/g, "-").toLowerCase()}`;
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

  const selectedValueSet = useMemo(() => {
    return new Set(value.map((v) => v.value));
  }, [value]);

  const selected = useMemo(() => {
    const labelByValue = new Map(options.map((o) => [o.value, o.label]));
    return value.map((v) => ({
      ...v,
      label: labelByValue.get(v.value) ?? v.label,
    }));
  }, [options, value]);

  const toggleOption = (opt: T) => {
    if (selectedValueSet.has(opt.value)) {
      onChange(value.filter((x) => x.value !== opt.value));
    } else {
      onChange([...value, opt]);
    }
  };

  const removeByValue = (v: T["value"]) => {
    onChange(value.filter((x) => x.value !== v));
  };

  return (
    <div className="w-full py-3">
      <div className="flex items-center justify-between gap-10 text-lg">
        <label htmlFor={id} className="font-normal text-black">
          {label}
        </label>

        <div ref={boxRef} className="relative w-[28rem]">
          <button
            id={id}
            type="button"
            onClick={() => setOpen((s) => !s)}
            className="flex h-14 w-full items-center gap-3 rounded-2xl border border-black bg-white px-4 pr-12 text-left outline-none focus:ring-2 focus:ring-black/20"
            aria-haspopup="listbox"
            aria-expanded={open}
          >
            <div className="flex min-w-0 flex-1 flex-wrap items-center gap-3">
              {selected.length === 0 ? (
                <span className="text-black/50">{placeholder}</span>
              ) : (
                selected.map((s) => (
                  <span
                    key={s.value}
                    className="flex items-center gap-3 rounded-2xl bg-black px-5 py-2 text-base text-white"
                  >
                    {s.label}
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        removeByValue(s.value);
                      }}
                      className="text-white/80 hover:text-white"
                      aria-label={`Remove ${s.label}`}
                    >
                      x
                    </button>
                  </span>
                ))
              )}
            </div>

            <span className="pointer-events-none absolute right-5 top-1/2 -translate-y-1/2 text-black mr-2">
              ▼
            </span>
          </button>

          {open && (
            <div className="absolute z-50 mt-2 w-full">
              <div className="overflow-hidden rounded-2xl border border-black bg-white shadow">
                <div
                  role="listbox"
                  aria-multiselectable="true"
                  className="max-h-60 w-full overflow-auto p-2"
                >
                  {options.map((o) => {
                    const isSelected = selectedValueSet.has(o.value);
                    return (
                      <button
                        key={o.value}
                        type="button"
                        onClick={() => toggleOption(o)}
                        className="flex w-full items-center justify-between rounded-xl px-4 py-3 text-left text-base hover:bg-black/5"
                        role="option"
                        aria-selected={isSelected}
                      >
                        <span>{o.label}</span>
                        <span className="text-black/60">
                          {isSelected ? "✓" : ""}
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
