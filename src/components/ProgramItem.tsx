import { useState } from "react";
import Chip, { type ChipVariant } from "@/components/Chips";
import ViewStat from "@/components/post-stat/ViewStat";
import ScrapStat from "@/components/post-stat/ScrapStat";
import BaseInfoCard from "./BaseInfoCard";
import { formatRegionDisplayLabel } from "@/constants/regions";

import InfoItemNewsIcon from "@/assets/icons/InfoItem-news.svg?react";

const newsCategoryStyle = {
  bgColor: "bg-brand-soft",
  textColor: "text-brand-strong",
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
  /** 소식 포스터 썸네일. 없거나 불러오지 못하면 아이콘으로 대체 */
  thumbnailUrl?: string | null;
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
  thumbnailUrl,
}: ProgramItemProps) {
  const [thumbnailFailed, setThumbnailFailed] = useState(false);
  const showThumbnail = Boolean(thumbnailUrl) && !thumbnailFailed;
  const serviceText = services?.filter(Boolean).join(", ");
  const rightLabel = chipText || contact;

  return (
    <BaseInfoCard
      pressedBorderColor="peer-active:border-brand"
      onClick={onClick}
      icon={
        <div className="mr-[4px] flex h-[64px] w-[64px] shrink-0 items-center justify-center overflow-hidden rounded-[18px] bg-brand-tint text-brand-strong sm:mr-[8px] sm:h-[78px] sm:w-[78px] sm:rounded-2xl">
          {showThumbnail ? (
            // 포스터는 제목이 위쪽에 있는 경우가 많아 윗부분 기준으로 자름
            <img
              src={thumbnailUrl ?? undefined}
              alt=""
              loading="lazy"
              onError={() => setThumbnailFailed(true)}
              className="h-full w-full object-cover object-top"
            />
          ) : (
            <InfoItemNewsIcon className="h-[32px] w-[32px] sm:h-[38px] sm:w-[38px]" />
          )}
        </div>
      }
      left={
        <div className="flex min-w-0 flex-col py-[2px]">
          {/* 정보·소식 공통 3줄: 제목 → 기관명 → 딱지(카테고리·지역), 통계는 우측 하단 */}
          <h3 className={`truncate text-[16px] font-semibold leading-[22px] tracking-[-0.02em] text-primary ${rightLabel ? "sm:pr-[88px]" : ""}`}>
            {name}
          </h3>

          {serviceText && (
            <p className="mt-[4px] truncate text-[13px] leading-[19px] text-secondary">{serviceText}</p>
          )}

          <div className="mt-[8px] flex min-w-0 items-center gap-[6px] pr-[84px] sm:pr-[110px]">
            <span className={`shrink-0 ${newsCategoryStyle.bgColor} rounded-xs px-[7px] py-[3px] text-[11px] font-medium leading-[14px] ${newsCategoryStyle.textColor}`}>
              {categoryLabel}
            </span>
            {address && (
              <span className="min-w-0 truncate bg-surface-subtle rounded-xs px-[7px] py-[3px] text-[11px] font-medium leading-[14px] text-secondary">
                {formatRegionDisplayLabel(address)}
              </span>
            )}
          </div>
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
