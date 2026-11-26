import ArrowUpRightIcon from "@/assets/icons/arrow-up-right.svg?react";
import ScrapIcon from "@/assets/icons/Scrap.svg?react";
import DetailActionButton from "@/components/button/DetailActionButton";
import ShareButton from "@/components/button/ShareButton";
import ScrapStat from "@/components/post-stat/ScrapStat";
import ViewStat from "@/components/post-stat/ViewStat";
import type { NewsDetail } from "@/types/news";
import type { NewsStatusPresentation } from "@/utils/newsStatus";

interface NewsDetailHeaderProps {
  news: NewsDetail;
  status?: NewsStatusPresentation;
  isScrapPending: boolean;
  onToggleScrap: () => void;
}

const STATUS_CHIP_CLASS: Record<NewsStatusPresentation["variant"], string> = {
  default: "bg-surface-subtle text-secondary",
  dday: "bg-[#FFEFF1] text-[#E5495B]",
  recruit: "bg-sub-mint-2 text-sub-mint",
};

const chipBase = "inline-block rounded-xs px-[7px] py-[3px] text-[11px] font-medium leading-[14px]";

// 정보 상세(SummaryCard)와 같은 구조: 칩 → 제목 → 요약 → 액션 버튼, 통계는 우측 상단 고정
export default function NewsDetailHeader({
  news,
  status,
  isScrapPending,
  onToggleScrap,
}: NewsDetailHeaderProps) {
  return (
    <article className="relative overflow-hidden rounded-2xl border border-default bg-surface">
      <div className="px-[20px] py-[22px] sm:px-[28px] sm:py-[26px]">
        <div className="absolute right-[20px] top-[22px] flex items-center gap-[10px] sm:right-[28px] sm:top-[26px]">
          <ViewStat count={news.viewCount} />
          <ScrapStat count={news.scrapCount} isActive={news.scrapped} />
        </div>

        <div className="flex flex-wrap items-center gap-[6px] pr-[110px]">
          <span className={`${chipBase} bg-brand-soft text-brand-strong`}>{news.categoryLabel}</span>
          {status && (
            <span className={`${chipBase} ${STATUS_CHIP_CLASS[status.variant]}`}>{status.label}</span>
          )}
        </div>

        <h1 className="mt-[10px] break-keep text-[22px] font-bold leading-[30px] tracking-[-0.02em] text-primary">
          {news.title}
        </h1>
        {news.summary && (
          <p className="mt-[8px] break-keep text-[14px] leading-[22px] text-secondary">{news.summary}</p>
        )}
        {news.publishedAt && (
          <p className="mt-[10px] text-[12px] text-tertiary">게시일 {news.publishedAt}</p>
        )}

        <div className="mt-[18px] flex flex-wrap gap-[8px]">
          <DetailActionButton
            label="홈페이지"
            icon={ArrowUpRightIcon}
            iconPosition="right"
            variant="dark"
            disabled={!news.originalUrl}
            onClick={() => {
              if (news.originalUrl) {
                window.open(news.originalUrl, "_blank", "noopener,noreferrer");
              }
            }}
          />
          <DetailActionButton
            label={news.scrapped ? "스크랩됨" : "스크랩"}
            icon={ScrapIcon}
            variant={news.scrapped ? "primarySoft" : "soft"}
            pressed={news.scrapped}
            disabled={isScrapPending}
            onClick={onToggleScrap}
          />
          <ShareButton url={window.location.href} appearance="soft" />
        </div>
      </div>
    </article>
  );
}
