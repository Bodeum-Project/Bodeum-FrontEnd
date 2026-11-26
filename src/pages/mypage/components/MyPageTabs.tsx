import { myPageTabs } from "../myPageTabConfig";
import type { MyPageTabKey } from "@/types/mypage";

interface MyPageTabsProps {
  activeTab: MyPageTabKey;
  counts: Record<MyPageTabKey, number>;
  onChange: (tab: MyPageTabKey) => void;
}

export default function MyPageTabs({ activeTab, counts, onChange }: MyPageTabsProps) {
  const selectedIndex = Math.max(
    0,
    myPageTabs.findIndex((tab) => tab.key === activeTab),
  );

  return (
    <div className="relative flex rounded-[14px] bg-surface-subtle p-[4px]" role="tablist">
      {/* 흰 선택 배경이 고른 탭으로 미끄러지듯 이동 */}
      <span
        aria-hidden="true"
        className="motion-slide-indicator pointer-events-none absolute inset-y-[4px] left-[4px] rounded-md bg-surface shadow-[0_1px_4px_rgb(42_53_70_/_0.08)] transition-transform duration-200 ease-[cubic-bezier(0.22,1,0.36,1)]"
        style={{
          width: `calc((100% - 8px) / ${myPageTabs.length})`,
          transform: `translateX(${selectedIndex * 100}%)`,
        }}
      />
      {myPageTabs.map((tab) => {
        const isActive = activeTab === tab.key;

        return (
          <button
            key={tab.key}
            type="button"
            role="tab"
            aria-selected={isActive}
            onClick={() => onChange(tab.key)}
            className={`relative h-[36px] flex-1 cursor-pointer rounded-md text-[14px] transition-colors duration-200 ${
              isActive
                ? "font-semibold text-primary"
                : "font-medium text-tertiary hover:text-secondary"
            }`}
          >
            {tab.label}{" "}
            <span className={isActive ? "text-brand-strong" : ""}>{counts[tab.key]}</span>
          </button>
        );
      })}
    </div>
  );
}
