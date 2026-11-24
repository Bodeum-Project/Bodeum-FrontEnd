import { infoCategoryMap } from "@/constants/infoCategory";
import type { ParentCategory } from "@/types/info";

interface InfoCategoryProps {
  type: ParentCategory;
  count: number;
  selected?: boolean;
  onClick: () => void;
}

export default function InfoCategoryCard({
  type,
  count,
  selected = false,
  onClick,
}: InfoCategoryProps) {
  const { label, icon: Icon, bgColor, textColor } = infoCategoryMap[type];

  return (
    <button
      onClick={onClick}
      className={`press-sm flex min-w-0 shrink-0 cursor-pointer flex-col items-center gap-[6px] rounded-[8px] border bg-white px-[4px] py-[10px] transition-colors hover:bg-background-200 sm:w-[150px] sm:flex-row sm:gap-[12px] sm:px-[16px] sm:py-[9px] ${
        selected
          ? "border-background-500"
          : "border-background-250 active:border-background-500"
      } shadow-[#00000026]`}
    >
      <div
        className={`flex h-[40px] w-[40px] items-center justify-center rounded-[10px] ${bgColor} ${textColor}`}
      >
        <Icon className="h-[22px] w-[22px]" />
      </div>

      <div className="flex flex-col items-center gap-[3px] sm:items-start">
        <span className="text-h2-list text-background-600 leading-none">{label}</span>
        <span className="text-body-sub text-background-400 leading-none sm:text-h4-list">+{count}</span>
      </div>
    </button>
  );
}