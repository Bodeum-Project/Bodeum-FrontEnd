import MegaphoneIcon from "@/assets/icons/Megaphone.svg?react";
import RightIcon from "@/assets/icons/ChevronRight.svg?react";
import { useHomeBanner } from "@/hooks/useHome";
import { useNavigate } from "react-router-dom";

export default function NoticeBanner() {
  const { data: banner, isLoading } = useHomeBanner();
  const navigate = useNavigate();

  if (isLoading || !banner) return null;

  return (
    <button
      type="button"
      onClick={() => navigate(`/news/${banner.newsId}`)}
      className="flex w-full cursor-pointer items-center gap-[12px] rounded-[16px] bg-background-200 px-[16px] py-[14px] hover:bg-background-250/60 lg:gap-[16px] lg:rounded-[20px] lg:px-[24px] lg:py-[18px] text-left transition-colors active:bg-background-250"
    >
      <span className="flex h-[36px] w-[36px] shrink-0 items-center justify-center rounded-full bg-background-100 lg:h-[44px] lg:w-[44px] lg:rounded-[14px] text-main-500">
        <MegaphoneIcon className="h-[18px] w-[18px]" />
      </span>

      <span className="min-w-0 flex-1">
        <span className="flex items-center gap-[6px]">
          <span className="truncate text-[14px] font-semibold text-background-600">
            {banner.title}
          </span>
          {banner.dDay != null && (
            <span className="shrink-0 rounded-[6px] bg-main-200 px-[6px] py-[2px] text-[11px] font-semibold text-main-500">
              D-{banner.dDay}
            </span>
          )}
        </span>
        <span className="mt-[2px] block truncate text-[12px] text-background-400">
          {banner.summary ?? "공지사항을 확인해 주세요."}
        </span>
      </span>

      <RightIcon className="h-[10px] w-[7px] shrink-0 text-background-300" />
    </button>
  );
}
