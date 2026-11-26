import ShareIcon from "@/assets/icons/Share.svg?react";
import GoIcon from "@/assets/icons/arrow-up-right.svg?react"
import ScrapIcon from "@/assets/icons/Scrap.svg?react"
import ViewStat from "@/components/post-stat/ViewStat";
import ScrapStat from "@/components/post-stat/ScrapStat";
import CommentStat from "@/components/post-stat/CommentStat";
import { getInfoShareUrl, toggleInfoScrap } from "@/apis/infoApi";
import { showToast } from "@/components/Toast";
import { useState } from "react";
import DetailActionButton from "@/components/button/DetailActionButton";

interface SummaryCardProps {
  infoItemId: number;
  name: string;
  mainCategory: string;
  subCategory: string;
  homepageUrl?: string;
  viewCount: number;
  scrapCount: number;
  reviewCount: number;
  isScrapped: boolean;
  address: string;
  sido: string;
  sigungu: string;
  phone: string;
}

interface InfoRowProps {
  label: string;
  value: string;
}

function InfoRow({ label, value }: InfoRowProps) {
  if (!value) return null;

  return (
    <div className="flex items-start gap-[12px] py-[10px]">
      <div className="w-[64px] shrink-0 text-[13px] leading-[20px] text-tertiary">{label}</div>
      <div className="min-w-0 flex-1 break-keep text-[14px] leading-[20px] text-primary">{value}</div>
    </div>
  );
}

export default function SummaryCard({
  infoItemId,
  name,
  subCategory,
  homepageUrl,
  viewCount,
  scrapCount,
  reviewCount,
  address,
  sido,
  sigungu,
  phone,
  isScrapped,
}: SummaryCardProps) {
  const [scrapped, setScrapped] = useState(isScrapped);
  const [scrapCountState, setScrapCountState] = useState(scrapCount);

  const handleShare = async () => {
    try {
      const { shareUrl } = await getInfoShareUrl(infoItemId);

      await navigator.clipboard.writeText(shareUrl);

      showToast("green", "링크를 복사했어요");
    } catch {
      showToast("red", "링크를 복사하지 못했어요");
    }
  };

  const handleScrap = async () => {
    const accessToken = localStorage.getItem("accessToken");
    const refreshToken = localStorage.getItem("refreshToken");

    if (!accessToken && !refreshToken) {
      showToast("blue", "로그인하면 스크랩할 수 있어요", { action: "login" });
      return;
    }

    try {
      const result = await toggleInfoScrap(infoItemId);

      setScrapped(result.isScrapped);

      setScrapCountState((prev) =>
        result.isScrapped ? prev + 1 : prev - 1
      );

      showToast(
        "green",
        result.isScrapped ? "스크랩했어요" : "스크랩을 취소했어요",
      );
    } catch {
      showToast("red", "스크랩하지 못했어요. 잠시 후 다시 시도해 주세요");
    }
  };

  return (
    <div className="relative overflow-hidden rounded-2xl border border-default bg-surface">
      <div className="px-[20px] py-[22px] sm:px-[28px] sm:py-[26px]">
        {/* 조회·스크랩·리뷰는 레이아웃과 상관없이 우측 상단에 고정 */}
        <div className="absolute right-[20px] top-[22px] flex items-center gap-[10px] sm:right-[28px] sm:top-[26px]">
          <ViewStat count={viewCount} />
          <ScrapStat count={scrapCountState} isActive={scrapped} />
          <CommentStat count={reviewCount} />
        </div>

        <span className="inline-block rounded-xs bg-surface-subtle px-[7px] py-[3px] text-[11px] font-medium leading-[14px] text-secondary">
          {subCategory}
        </span>

        <h1 className="mt-[10px] break-keep text-[22px] font-bold leading-[30px] tracking-[-0.02em] text-primary">
          {name}
        </h1>

        <div className="mt-[18px] flex flex-wrap gap-[8px]">
          <DetailActionButton
            label="홈페이지"
            icon={GoIcon}
            iconPosition="right"
            variant="dark"
            disabled={!homepageUrl}
            onClick={() => {
              if (homepageUrl) window.open(homepageUrl, "_blank", "noopener,noreferrer");
            }}
          />
          <DetailActionButton
            label={scrapped ? "스크랩됨" : "스크랩"}
            icon={ScrapIcon}
            variant={scrapped ? "primarySoft" : "soft"}
            pressed={scrapped}
            onClick={handleScrap}
          />
          <DetailActionButton label="공유" icon={ShareIcon} onClick={handleShare} />
        </div>

        <div className="mt-[28px] border-t border-default pt-[18px]">
          <h2 className="text-[16px] font-semibold text-primary">기본 정보</h2>
          <div className="mt-[6px]">
            <InfoRow label="주소" value={address} />
            <InfoRow label="지역" value={`${sido ?? ""} ${sigungu ?? ""}`.trim()} />
            <InfoRow label="전화번호" value={phone} />
          </div>
        </div>
      </div>
    </div>
  );
}
