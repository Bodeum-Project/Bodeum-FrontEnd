import ImagePlaceholder from "@/assets/images/news-img.svg";
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
      <div className="relative overflow-hidden rounded-[16px] bg-background-200">
        <img
          src={thumbnailUrl || ImagePlaceholder}
          alt={title}
          className="h-[128px] w-full object-cover transition-transform duration-300 group-hover:scale-[1.03]"
        />
        {tag && (
          <span className="absolute left-[10px] top-[10px] rounded-[8px] bg-accent-900/80 px-[7px] py-[3px] text-[11px] font-semibold text-background-100 backdrop-blur">
            {tag}
          </span>
        )}
      </div>

      <p className="mt-[10px] line-clamp-2 text-[15px] font-semibold leading-[21px] tracking-[-0.02em] text-background-600">
        {title}
      </p>
      <p className="mt-[4px] truncate text-[12px] text-background-400">
        {[regionLevel1, regionLevel2].filter(Boolean).join(" ") || "전국"} · 조회 {viewCount.toLocaleString()}
      </p>
    </button>
  );
}
