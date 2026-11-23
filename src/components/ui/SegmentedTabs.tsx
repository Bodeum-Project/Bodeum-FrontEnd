interface SegmentedTabsProps<T extends string> {
  value: T;
  options: { value: T; label: string }[];
  onChange: (value: T) => void;
  className?: string;
}

export default function SegmentedTabs<T extends string>({
  value,
  options,
  onChange,
  className = "",
}: SegmentedTabsProps<T>) {
  return (
    <div
      role="tablist"
      className={`flex rounded-full bg-background-200 p-[4px] ${className}`}
    >
      {options.map((option) => {
        const selected = option.value === value;

        return (
          <button
            key={option.value}
            type="button"
            role="tab"
            aria-selected={selected}
            onClick={() => onChange(option.value)}
            className={`h-[36px] flex-1 cursor-pointer rounded-full text-[14px] transition-colors ${
              selected
                ? "bg-background-100 font-semibold text-background-600"
                : "font-medium text-background-400"
            }`}
          >
            {option.label}
          </button>
        );
      })}
    </div>
  );
}
