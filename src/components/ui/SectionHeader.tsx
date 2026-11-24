import type { ReactNode } from "react";
import RightIcon from "@/assets/icons/ChevronRight.svg?react";

interface SectionHeaderProps {
  title: string;
  description?: string;
  moreLabel?: string;
  onMoreClick?: () => void;
  right?: ReactNode;
}

export default function SectionHeader({
  title,
  description,
  moreLabel = "전체보기",
  onMoreClick,
  right,
}: SectionHeaderProps) {
  return (
    <div className="mb-[14px] flex items-end justify-between gap-[12px]">
      <div className="min-w-0">
        <h2 className="text-[20px] font-bold leading-[28px] tracking-[-0.02em] text-primary">
          {title}
        </h2>
        {description && (
          <p className="mt-[2px] text-[13px] leading-[19px] text-tertiary">{description}</p>
        )}
      </div>

      {right ??
        (onMoreClick && (
          <button
            type="button"
            onClick={onMoreClick}
            className="flex shrink-0 cursor-pointer items-center gap-[2px] text-[13px] font-medium text-tertiary active:text-secondary"
          >
            {moreLabel}
            <RightIcon className="ml-[2px] h-[10px] w-[7px]" />
          </button>
        ))}
    </div>
  );
}
