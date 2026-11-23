import { myPageTabs } from "../myPageTabConfig";
import type { MyPageTabKey } from "@/types/mypage";

interface MyPageTabsProps {
  activeTab: MyPageTabKey;
  counts: Record<MyPageTabKey, number>;
  onChange: (tab: MyPageTabKey) => void;
}

export default function MyPageTabs({ activeTab, counts, onChange }: MyPageTabsProps) {
  return (
    <div className="flex rounded-[14px] bg-background-200 p-[4px]" role="tablist">
      {myPageTabs.map((tab) => {
        const isActive = activeTab === tab.key;

        return (
          <button
            key={tab.key}
            type="button"
            role="tab"
            aria-selected={isActive}
            onClick={() => onChange(tab.key)}
            className={`h-[36px] flex-1 cursor-pointer rounded-[10px] text-[14px] transition-colors ${
              isActive
                ? "bg-background-100 font-semibold text-background-600"
                : "font-medium text-background-400 hover:text-background-500"
            }`}
          >
            {tab.label}{" "}
            <span className={isActive ? "text-main-500" : ""}>{counts[tab.key]}</span>
          </button>
        );
      })}
    </div>
  );
}
