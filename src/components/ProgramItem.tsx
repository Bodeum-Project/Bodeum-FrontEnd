import Chip, { type ChipVariant } from "@/components/Chips";
import ViewStat from "@/components/post-stat/ViewStat";
import ScrapStat from "@/components/post-stat/ScrapStat";
import BaseInfoCard from "./BaseInfoCard";

import InfoItemNewsIcon from "@/assets/icons/InfoItem-news.svg?react";

const newsCategoryStyle = {
  bgColor: "bg-main-150",
  textColor: "text-main-500",
} as const;

interface ProgramItemProps {
  name: string;
  address: string | null;
  services: Array<string | null> | null;
  categoryLabel: string;
  chipText?: string;
  chipVariant?: ChipVariant;
  contact?: string | null;
  viewCount: number;
  scrapCount: number;
  isScrapped?: boolean;
  onClick?: () => void;
  onScrapClick?: () => void;
}

export default function ProgramItem({
  name,
  address,
  services,
  categoryLabel,
  chipText,
  chipVariant,
  contact,
  viewCount,
  scrapCount,
  isScrapped = false,
  onClick,
  onScrapClick,
}: ProgramItemProps) {
  const serviceText = services?.filter(Boolean).join(", ");
  const rightLabel = chipText || contact;

  return (
    <BaseInfoCard
      pressedBorderColor="peer-active:border-main-400"
      onClick={onClick}
      icon={
        <div className="flex h-[56px] w-[56px] shrink-0 items-center justify-center rounded-[16px] bg-main-200 text-main-500 sm:h-[64px] sm:w-[64px]">
          <InfoItemNewsIcon className="h-[30px] w-[30px] sm:h-[34px] sm:w-[34px]" />
        </div>
      }
      left={
        <div className="flex min-w-0 flex-col">
          {/* 토스처럼 딱지를 제목 위로: 카테고리(민트) + 지역(연한 그레이) */}
          <div className="flex min-w-0 items-center gap-[6px]">
            <span
              className={`shrink-0 rounded-[8px] ${newsCategoryStyle.bgColor} px-[8px] py-[4px] text-[12px] font-medium leading-[16px] ${newsCategoryStyle.textColor}`}
            >
              {categoryLabel}
            </span>
            {address && (
              <span className="min-w-0 truncate rounded-[8px] bg-background-200 px-[8px] py-[4px] text-[12px] font-medium leading-[16px] text-background-500">
                {address}
              </span>
            )}
          </div>

          <h3 className="mt-[8px] truncate text-[16px] font-semibold leading-[22px] tracking-[-0.02em] text-background-600">
            {name}
          </h3>

          {serviceText && (
            <p className="mt-[2px] truncate text-[13px] leading-[19px] text-background-400">{serviceText}</p>
          )}
        </div>
      }
      right={
        <div className="flex h-[64px] w-auto shrink-0 flex-col items-end justify-center gap-[11px] sm:w-[130px]">
          <div className="hidden h-[33px] w-full items-end justify-center sm:flex">
            {rightLabel && (
              <Chip variant={chipText ? chipVariant : "default"} className="min-w-[100px]">
                {rightLabel}
              </Chip>
            )}
          </div>

          <div className="flex w-full flex-col items-end justify-center gap-[6px] sm:h-5 sm:flex-row sm:items-center sm:gap-2">
            <ViewStat count={viewCount} />
            <span className="relative z-20 inline-flex h-5 items-center">
              <ScrapStat count={scrapCount} isActive={isScrapped} onClick={onScrapClick} />
            </span>
          </div>
        </div>
      }
    />
  );
}
