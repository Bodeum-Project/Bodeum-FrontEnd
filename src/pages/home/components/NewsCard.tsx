import { formatRegionDisplayLabel } from "@/constants/regions";
import MegaphoneIcon from "@/assets/icons/Megaphone.svg?react";
import { useNavigate } from "react-router-dom";

interface NewsCardProps {
  newsId: number;
  title: string;
  regionLevel1: string;
  regionLevel2: string;
  status: string;
  dDay: string;
  viewCount: number;
  thumbnailUrl?: string;
  onClick?: () => void;
}

export default function NewsCard({
  newsId,
  title,
  regionLevel1,
  regionLevel2,
  status,
  dDay,
  viewCount,
  thumbnailUrl,
}: NewsCardProps) {
  const navigate = useNavigate();
  const tag = dDay != null ? `D-${dDay}` : status;

  return (
    <button
      onClick={() => navigate(`/news/${newsId}`)}
      className="press group flex w-[200px] shrink-0 cursor-pointer flex-col self-start text-left sm:w-[220px]"
    >
      <div className="relative h-[128px] overflow-hidden rounded-xl bg-surface-subtle">
        {thumbnailUrl ? (
          // 포스터는 보통 제목이 위쪽에 있어서, 꽉 채우되 윗부분 기준으로 자른다
          <img
            src={thumbnailUrl}
            alt={title}
            loading="lazy"
            className="h-full w-full object-cover object-top transition-transform duration-300 group-hover:scale-[1.03]"
          />
        ) : (
          <div
            className="flex h-full w-full items-center justify-center text-brand"
            style={{ backgroundImage: "var(--gradient-accent-soft)" }}
          >
            <MegaphoneIcon className="h-[36px] w-[36px]" />
          </div>
        )}
        {tag && (
          <span className="absolute bottom-[10px] left-[10px] rounded-sm bg-cta/80 px-[7px] py-[3px] text-[11px] font-semibold text-inverse backdrop-blur">
            {tag}
          </span>
        )}
      </div>

      <p className="mt-[10px] line-clamp-2 text-[15px] font-semibold leading-[21px] tracking-[-0.02em] text-primary transition-colors group-hover:text-brand-strong">
        {title}
      </p>
      <p className="mt-[4px] truncate text-[12px] text-tertiary">
        {formatRegionDisplayLabel([regionLevel1, regionLevel2].filter(Boolean).join(" ")) || "전국"} · 조회 {viewCount.toLocaleString()}
      </p>
    </button>
  );
}
