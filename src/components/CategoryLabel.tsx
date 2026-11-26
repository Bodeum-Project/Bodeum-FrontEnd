import { infoCategoryMap } from "@/constants/infoCategory";
import type { ParentCategory } from "@/types/info";

interface CategoryLabelProps {
  category: ParentCategory;
}

export default function CategoryLabel({
  category,
}: CategoryLabelProps) {
  const { label, bgColor, textColor } = infoCategoryMap[category];

  return (
    <span
      className={`shrink-0 rounded-xs ${bgColor} px-[6px] py-[4px] text-body-label font-semibold leading-none ${textColor}`}
    >
      {label}
    </span>
  );
}