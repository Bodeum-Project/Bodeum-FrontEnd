import Chip from "@/components/Chips";
import ViewStat from "@/components/post-stat/ViewStat";
import ScrapStat from "@/components/post-stat/ScrapStat";
import { infoCategoryMap } from "@/constants/infoCategory";
import BaseInfoCard from "../../../components/BaseInfoCard";
import { formatRegionDisplayLabel } from "@/constants/regions";

import InfoItemInstitutionIcon from "@/assets/icons/InfoItem-institution.svg?react";
import InfoItemHospitalIcon from "@/assets/icons/InfoItem-hospital.svg?react";
import InfoItemWelfareIcon from "@/assets/icons/InfoItem-welfare.svg?react";
import InfoItemEmploymentIcon from "@/assets/icons/InfoItem-employment.svg?react";
import InfoItemEducationIcon from "@/assets/icons/Infoitem-education.svg?react";

import type { ParentCategory } from "@/types/info";
import type { ComponentType, SVGProps } from "react";

const noop = () => {};

const infoItemIconMap = {
  INSTITUTION: InfoItemInstitutionIcon,
  HOSPITAL: InfoItemHospitalIcon,
  WELFARE: InfoItemWelfareIcon,
  EDUCATION: InfoItemEducationIcon,
  EMPLOYMENT: InfoItemEmploymentIcon,
} satisfies Record<
  ParentCategory,
  ComponentType<SVGProps<SVGSVGElement>>
>;

interface InfoItemProps {
  mainCategory: ParentCategory;
  name: string;
  address: string;
  sido?: string;
  sigungu?: string;
  phone?: string;
  subCategoryKo: string;
  viewCount: number;
  scrapCount: number;
  isScrapped?: boolean;
  onClick?: () => void;
  onScrapClick?: () => void;
  clickable?: boolean;
}

export default function InfoItem({
  mainCategory,
  name,
  address,
  sido,
  sigungu,
  phone,
  subCategoryKo,
  viewCount,
  scrapCount,
  isScrapped = false,
  onClick,
  onScrapClick,
  clickable = true,
}: InfoItemProps) {
  const Icon = infoItemIconMap[mainCategory];
  const { bgColor, textColor } = infoCategoryMap[mainCategory];
  const region = [sido, sigungu].filter(Boolean).join(" ");
  const regionLabel = region ? formatRegionDisplayLabel(region) : "";
  // 지역은 딱지로 보여주므로 주소 앞의 시/도·시/군/구는 떼고 도로명부터
  const streetAddress = region && address.startsWith(region) ? address.slice(region.length).trim() : address;

  return (
    <BaseInfoCard
      onClick={clickable ? onClick : undefined}
      icon={
        <div className={`mr-[4px] flex h-[64px] w-[64px] shrink-0 items-center justify-center rounded-[18px] sm:mr-[8px] sm:h-[78px] sm:w-[78px] sm:rounded-[20px] ${bgColor} ${textColor}`}>
          <Icon className="h-[32px] w-[32px] sm:h-[38px] sm:w-[38px]" />
        </div>
      }
      left={
        <div className="flex min-w-0 flex-col py-[2px]">
          {/* 정보·소식 공통 3줄: 제목 → 주소 → 딱지(세부 분류·지역), 통계는 우측 하단 */}
          <h3 className={`truncate text-[16px] font-semibold leading-[22px] tracking-[-0.02em] text-background-600 ${phone ? "sm:pr-[120px]" : ""}`}>
            {name}
          </h3>

          {streetAddress && (
            <p className="mt-[4px] truncate text-[13px] leading-[19px] text-background-500">{streetAddress}</p>
          )}

          <div className="mt-[8px] flex min-w-0 items-center gap-[6px] pr-[84px] sm:pr-[110px]">
            <span className={`shrink-0 ${bgColor} rounded-[6px] px-[7px] py-[3px] text-[11px] font-medium leading-[14px] ${textColor}`}>{subCategoryKo}</span>
            {regionLabel && (
              <span className="min-w-0 truncate bg-background-200 rounded-[6px] px-[7px] py-[3px] text-[11px] font-medium leading-[14px] text-background-500">
                {regionLabel}
              </span>
            )}
          </div>
        </div>
      }
      right={
        <>
          {phone && (
            <div className="absolute right-[16px] top-[16px] hidden sm:block sm:right-[24px] sm:top-[18px]">
              <Chip variant="default" className="min-w-[100px]">
                {phone}
              </Chip>
            </div>
          )}
          <div className="absolute bottom-[14px] right-[16px] flex items-center gap-[8px] sm:bottom-[18px] sm:right-[24px]">
            <ViewStat count={viewCount} />
            <span className="relative z-20 inline-flex h-5 items-center">
              <ScrapStat
                count={scrapCount}
                isActive={isScrapped}
                onClick={onScrapClick ?? noop}
              />
            </span>
          </div>
        </>
      }
    />
  );
}