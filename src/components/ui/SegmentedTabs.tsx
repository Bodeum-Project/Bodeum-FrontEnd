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
  const selectedIndex = Math.max(
    0,
    options.findIndex((option) => option.value === value),
  );

  return (
    <div
      role="tablist"
      className={`relative flex rounded-full bg-background-200 p-[4px] ${className}`}
    >
      {/* 흰 선택 배경이 고른 탭으로 미끄러지듯 이동 */}
      <span
        aria-hidden="true"
        className="motion-slide-indicator pointer-events-none absolute inset-y-[4px] left-[4px] rounded-full bg-background-100 transition-transform duration-200 ease-[cubic-bezier(0.22,1,0.36,1)]"
        style={{
          width: `calc((100% - 8px) / ${options.length})`,
          transform: `translateX(${selectedIndex * 100}%)`,
        }}
      />
      {options.map((option) => {
        const selected = option.value === value;

        return (
          <button
            key={option.value}
            type="button"
            role="tab"
            aria-selected={selected}
            onClick={() => onChange(option.value)}
            className={`relative h-[36px] flex-1 cursor-pointer rounded-full text-[14px] transition-colors duration-200 ${
              selected
                ? "font-semibold text-background-600"
                : "font-medium text-background-400 hover:text-background-500"
            }`}
          >
            {option.label}
          </button>
        );
      })}
    </div>
  );
}
