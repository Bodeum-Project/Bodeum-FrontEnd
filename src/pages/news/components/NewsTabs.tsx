import { useLayoutEffect, useRef, useState } from "react";

export type NewsTabValue = "activity" | "region";

const newsTabs: { value: NewsTabValue; label: string }[] = [
  { value: "activity", label: "활동소식" },
  { value: "region", label: "지역소식" },
];

interface NewsTabsProps {
  value: NewsTabValue;
  onChange: (value: NewsTabValue) => void;
}

/** 목록 섹션 제목을 겸하는 글자 탭: 고른 쪽만 진한 글씨 + 밑줄(고른 탭으로 미끄러지듯 이동) */
export default function NewsTabs({ value, onChange }: NewsTabsProps) {
  const tabRefs = useRef<Partial<Record<NewsTabValue, HTMLButtonElement | null>>>({});
  const [indicator, setIndicator] = useState<{ left: number; width: number } | null>(null);

  useLayoutEffect(() => {
    const measure = () => {
      const tab = tabRefs.current[value];
      if (tab) setIndicator({ left: tab.offsetLeft, width: tab.offsetWidth });
    };
    measure();
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, [value]);

  return (
    <div role="tablist" aria-label="소식 종류" className="relative flex items-end gap-[20px] border-b border-background-250">
      {newsTabs.map((tab) => {
        const selected = tab.value === value;

        return (
          <button
            key={tab.value}
            ref={(node) => {
              tabRefs.current[tab.value] = node;
            }}
            type="button"
            role="tab"
            aria-selected={selected}
            onClick={() => onChange(tab.value)}
            className={`relative -mb-px cursor-pointer pb-[10px] text-[18px] leading-[26px] tracking-[-0.02em] transition-colors duration-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-main-400 ${
              selected
                ? "font-bold text-background-600"
                : "font-semibold text-background-400 hover:text-background-500"
            }`}
          >
            {tab.label}
          </button>
        );
      })}
      {indicator && (
        <span
          aria-hidden="true"
          className="motion-slide-indicator pointer-events-none absolute -bottom-px left-0 h-[2px] rounded-full bg-background-600 transition-[transform,width] duration-200 ease-[cubic-bezier(0.22,1,0.36,1)]"
          style={{ width: indicator.width, transform: `translateX(${indicator.left}px)` }}
        />
      )}
    </div>
  );
}
