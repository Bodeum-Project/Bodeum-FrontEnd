export type NewsTabValue = "activity" | "region";

const newsTabs: { value: NewsTabValue; label: string }[] = [
  { value: "activity", label: "활동소식" },
  { value: "region", label: "지역소식" },
];

interface NewsTabsProps {
  value: NewsTabValue;
  onChange: (value: NewsTabValue) => void;
}

/** 목록 섹션 제목을 겸하는 글자 탭: 고른 쪽만 진한 글씨 + 밑줄 */
export default function NewsTabs({ value, onChange }: NewsTabsProps) {
  return (
    <div role="tablist" aria-label="소식 종류" className="flex items-end gap-[20px] border-b border-background-250">
      {newsTabs.map((tab) => {
        const selected = tab.value === value;

        return (
          <button
            key={tab.value}
            type="button"
            role="tab"
            aria-selected={selected}
            onClick={() => onChange(tab.value)}
            className={`relative -mb-px cursor-pointer pb-[10px] text-[18px] leading-[26px] tracking-[-0.02em] transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-main-400 ${
              selected
                ? "font-bold text-background-600 after:absolute after:inset-x-0 after:bottom-0 after:h-[2px] after:rounded-full after:bg-background-600"
                : "font-semibold text-background-400 hover:text-background-500"
            }`}
          >
            {tab.label}
          </button>
        );
      })}
    </div>
  );
}
