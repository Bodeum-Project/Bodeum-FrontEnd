import CommentStat from "@/components/post-stat/CommentStat";
import HeartStat from "@/components/post-stat/HeartStat";
import ViewStat from "@/components/post-stat/ViewStat";

interface CommunityPostCardProps {
  categoryLabel: string;
  title: string;
  content: string;
  likes: number;
  comments: number;
  views: number;
  createdAt: string;
  initialIsLiked?: boolean;
  onClick?: () => void;
}

export default function CommunityPostCard({
  categoryLabel,
  title,
  content,
  likes,
  comments,
  views,
  createdAt,
  initialIsLiked = false,
  onClick,
}: CommunityPostCardProps) {
  return (
    <article
      role="link"
      tabIndex={0}
      onClick={(event) => {
        if ((event.target as HTMLElement).closest("button")) return;
        onClick?.();
      }}
      onKeyDown={(event) => {
        if ((event.target as HTMLElement).closest("button")) return;
        if (event.key === "Enter" || event.key === " ") {
          event.preventDefault();
          onClick?.();
        }
      }}
      className="press group relative flex min-h-[112px] w-full min-w-0 cursor-pointer flex-col rounded-[16px] border border-background-250 bg-background-100 px-[18px] py-[16px] transition-colors hover:bg-background-200 active:bg-background-250 sm:px-[22px] sm:py-[18px]"
    >
      <div className="flex min-w-0 items-center gap-[6px] pr-[80px]">
        <span className="shrink-0 rounded-[6px] bg-main-150 px-[7px] py-[3px] text-[11px] font-medium leading-[14px] text-main-500">
          {categoryLabel}
        </span>
      </div>
      <span className="absolute right-[18px] top-[18px] text-[12px] leading-[14px] text-background-400 sm:right-[22px] sm:top-[20px]">
        {createdAt}
      </span>

      <p className="mt-[10px] line-clamp-1 text-[16px] font-semibold leading-[22px] tracking-[-0.02em] text-background-600 transition-colors group-hover:text-main-500">
        {title}
      </p>
      {/* 본문이 길면 통계와 겹치기 전에 말줄임 */}
      <p className="mt-[6px] truncate pr-[150px] text-[13px] leading-[19px] text-background-500">{content}</p>

      <div className="absolute bottom-[16px] right-[18px] flex items-center gap-[10px] sm:bottom-[18px] sm:right-[22px]">
        <HeartStat count={likes} isActive={initialIsLiked} />
        <CommentStat count={comments} />
        <ViewStat count={views} />
      </div>
    </article>
  );
}
