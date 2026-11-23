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
        <div className="mr-[4px] flex h-[64px] w-[64px] shrink-0 items-center justify-center rounded-[18px] bg-main-200 text-main-500 sm:mr-[8px] sm:h-[78px] sm:w-[78px] sm:rounded-[20px]">
          <InfoItemNewsIcon className="h-[32px] w-[32px] sm:h-[38px] sm:w-[38px]" />
        </div>
      }
      left={
        <div className="flex min-w-0 flex-col py-[2px]">
          {/* 토스처럼 딱지를 제목 위로: 카테고리(민트) + 지역(연한 그레이) */}
          <div className={`flex min-w-0 items-center gap-[6px] ${rightLabel ? "sm:pr-[96px]" : ""}`}>
            <span
              className={`shrink-0 rounded-[6px] ${newsCategoryStyle.bgColor} px-[7px] py-[3px] text-[11px] font-medium leading-[14px] ${newsCategoryStyle.textColor}`}
            >
              {categoryLabel}
            </span>
            {address && (
              <span className="min-w-0 truncate rounded-[6px] bg-background-200 px-[7px] py-[3px] text-[11px] font-medium leading-[14px] text-background-500">
                {address}
              </span>
            )}
          </div>

          <h3 className="mt-[10px] truncate text-[16px] font-semibold leading-[22px] tracking-[-0.02em] text-background-600">
            {name}
          </h3>

          {serviceText && (
            <p className="mt-[6px] truncate pr-[84px] text-[13px] leading-[19px] text-background-400 sm:pr-[110px]">{serviceText}</p>
          )}
        </div>
      }
      right={
        <>
          {/* 모집 상태 등은 우측 상단, 조회·스크랩은 우측 하단에 고정 (모바일에서 두 줄로 쌓이지 않게) */}
          {rightLabel && (
            <div className="absolute right-[16px] top-[16px] hidden sm:block sm:right-[24px] sm:top-[18px]">
              <Chip variant={chipText ? chipVariant : "default"} className="min-w-[72px]">
                {rightLabel}
              </Chip>
            </div>
          )}
          <div className="absolute bottom-[14px] right-[16px] flex items-center gap-[8px] sm:bottom-[18px] sm:right-[24px]">
            <ViewStat count={viewCount} />
            <span className="relative z-20 inline-flex h-5 items-center">
              <ScrapStat count={scrapCount} isActive={isScrapped} onClick={onScrapClick} />
            </span>
          </div>
        </>
      }
    />
  );
}
