import Chip from "@/components/Chips";
import ViewStat from "@/components/post-stat/ViewStat";
import ScrapStat from "@/components/post-stat/ScrapStat";
import { infoCategoryMap } from "@/constants/infoCategory";
import BaseInfoCard from "../../../components/BaseInfoCard";

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

  return (
    <BaseInfoCard
      onClick={clickable ? onClick : undefined}
      icon={
        <div className={`mr-[4px] flex h-[64px] w-[64px] shrink-0 items-center justify-center rounded-[18px] sm:mr-[8px] sm:h-[78px] sm:w-[78px] sm:rounded-[20px] ${bgColor} ${textColor}`}>
          <Icon className="h-[32px] w-[32px] sm:h-[38px] sm:w-[38px]" />
        </div>
      }
      left={
        <div className="min-w-0 py-[2px]">
          {/* 카테고리는 한 번에 하나만 보이므로 제목 앞 딱지는 생략 */}
          <h3 className={`truncate text-[16px] font-semibold leading-[22px] tracking-[-0.02em] text-background-600 ${phone ? "sm:pr-[120px]" : ""}`}>
            {name}
          </h3>

          <p className="mt-[6px] truncate text-[13px] leading-[19px] text-background-500">
            {address}
          </p>

          <p className="mt-[4px] truncate pr-[84px] text-[12px] leading-[17px] text-background-400 sm:pr-[110px]">
            {subCategoryKo}
          </p>
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