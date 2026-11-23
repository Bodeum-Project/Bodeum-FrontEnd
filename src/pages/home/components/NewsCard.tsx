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
      className="group w-[200px] shrink-0 cursor-pointer text-left sm:w-[220px]"
    >
      <div className="relative h-[128px] overflow-hidden rounded-[16px] bg-background-200">
        {thumbnailUrl ? (
          <>
            {/* 포스터 비율이 제각각이라: 같은 이미지를 흐리게 깔고, 위에 잘리지 않게 원본을 올린다 */}
            <img
              src={thumbnailUrl}
              alt=""
              aria-hidden="true"
              loading="lazy"
              className="absolute inset-0 h-full w-full scale-125 object-cover opacity-70 blur-[18px] saturate-[1.1]"
            />
            <img
              src={thumbnailUrl}
              alt={title}
              loading="lazy"
              className="relative h-full w-full object-contain transition-transform duration-300 group-hover:scale-[1.03]"
            />
          </>
        ) : (
          <div
            className="flex h-full w-full items-center justify-center text-main-400"
            style={{ backgroundImage: "var(--gradient-accent-soft)" }}
          >
            <MegaphoneIcon className="h-[36px] w-[36px]" />
          </div>
        )}
        {tag && (
          <span className="absolute left-[10px] top-[10px] rounded-[8px] bg-accent-900/80 px-[7px] py-[3px] text-[11px] font-semibold text-background-100 backdrop-blur">
            {tag}
          </span>
        )}
      </div>

      <p className="mt-[10px] line-clamp-2 text-[15px] font-semibold leading-[21px] tracking-[-0.02em] text-background-600 transition-colors group-hover:text-main-500">
        {title}
      </p>
      <p className="mt-[4px] truncate text-[12px] text-background-400">
        {[regionLevel1, regionLevel2].filter(Boolean).join(" ") || "전국"} · 조회 {viewCount.toLocaleString()}
      </p>
    </button>
  );
}
