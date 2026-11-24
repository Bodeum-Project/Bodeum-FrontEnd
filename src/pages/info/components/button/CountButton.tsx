import ChevronDownIcon from "@/assets/icons/ChevronDown.svg?react";
import FilterButton from "./FilterButton";
import { infoCategoryMap } from "@/constants/infoCategory";
import type { ParentCategory } from "@/types/info";

type CountButtonVariant = "default" | "display";

interface CountButtonProps {
  category: ParentCategory;
  count: number;
  active?: boolean;
  disabled?: boolean;
  variant?: CountButtonVariant;
  onClick?: () => void;
}

export default function CountButton({
  category,
  count,
  disabled = false,
  variant = "default",
  onClick,
}: CountButtonProps) {
  const { label, buttonClass } = infoCategoryMap[category];

  if (variant === "display") {
    return (
      <div
        className="inline-flex h-[44px] items-center rounded-md bg-surface-subtle px-[12px]"
      >
        <span className="text-h2-list text-secondary">
          {label} +{count}
        </span>
      </div>
    );
  }

  return (
    <FilterButton
      variant="category"
      disabled={disabled}
      onClick={onClick}
      className={buttonClass}
    >
      <span>{label}</span>

      {!disabled && <ChevronDownIcon />}
    </FilterButton>
  );
}