import ShareIcon from "@/assets/icons/Share.svg?react";
import GoIcon from "@/assets/icons/arrow-up-right.svg?react"
import ScrapIcon from "@/assets/icons/Scrap.svg?react"
import ViewStat from "@/components/post-stat/ViewStat";
import ScrapStat from "@/components/post-stat/ScrapStat";
import CommentStat from "@/components/post-stat/CommentStat";
import { getInfoShareUrl, toggleInfoScrap } from "@/apis/infoApi";
import { showToast } from "@/components/Toast";
import { useState } from "react";

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
      <div className="w-[64px] shrink-0 text-[13px] leading-[20px] text-background-400">{label}</div>
      <div className="min-w-0 flex-1 break-keep text-[14px] leading-[20px] text-background-600">{value}</div>
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

      showToast("green", "공유 링크가 복사되었습니다.");
    } catch {
      showToast("red", "공유 링크를 가져오지 못했습니다.");
    }
  };

  const handleScrap = async () => {
    const accessToken = localStorage.getItem("accessToken");
    const refreshToken = localStorage.getItem("refreshToken");

    if (!accessToken && !refreshToken) {
      showToast("blue", "로그인/회원가입 후 만나보세요");
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
        result.isScrapped
          ? "스크랩되었습니다."
          : "스크랩이 취소되었습니다.",
      );
    } catch {
      showToast("red", "스크랩에 실패했습니다.");
    }
  };

  const secondaryButton =
    "inline-flex h-[40px] cursor-pointer items-center justify-center gap-[6px] rounded-[12px] px-[16px] text-[14px] font-semibold transition-colors";

  return (
    <div className="relative overflow-hidden rounded-[20px] border border-background-250 bg-background-100">
      <div className="px-[20px] py-[22px] sm:px-[28px] sm:py-[26px]">
        {/* 조회·스크랩·리뷰는 레이아웃과 상관없이 우측 상단에 고정 */}
        <div className="absolute right-[20px] top-[22px] flex items-center gap-[10px] sm:right-[28px] sm:top-[26px]">
          <ViewStat count={viewCount} />
          <ScrapStat count={scrapCountState} isActive={scrapped} />
          <CommentStat count={reviewCount} />
        </div>

        <span className="inline-block rounded-[6px] bg-background-200 px-[7px] py-[3px] text-[11px] font-medium leading-[14px] text-background-500">
          {subCategory}
        </span>

        <h1 className="mt-[10px] break-keep text-[22px] font-bold leading-[30px] tracking-[-0.02em] text-background-600">
          {name}
        </h1>

        <div className="mt-[18px] flex flex-wrap gap-[8px]">
          <button
            type="button"
            disabled={!homepageUrl}
            onClick={() => {
              if (homepageUrl) window.open(homepageUrl, "_blank", "noopener,noreferrer");
            }}
            className={`${secondaryButton} btn-dark disabled:cursor-not-allowed disabled:bg-background-250 disabled:bg-none disabled:text-background-400`}
          >
            홈페이지
            <GoIcon className="h-[14px] w-[14px]" />
          </button>
          <button
            type="button"
            onClick={handleScrap}
            aria-pressed={scrapped}
            className={`${secondaryButton} ${
              scrapped
                ? "bg-main-150 text-main-500 hover:bg-main-200"
                : "bg-background-200 text-background-600 hover:bg-[#DFE3EA]"
            }`}
          >
            <ScrapIcon className="h-[16px] w-[16px]" />
            {scrapped ? "스크랩됨" : "스크랩"}
          </button>
          <button
            type="button"
            onClick={handleShare}
            className={`${secondaryButton} bg-background-200 text-background-600 hover:bg-[#DFE3EA]`}
          >
            <ShareIcon className="h-[16px] w-[16px]" />
            공유
          </button>
        </div>

        <div className="mt-[28px] border-t border-background-250 pt-[18px]">
          <h2 className="text-[16px] font-semibold text-background-600">기본 정보</h2>
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
