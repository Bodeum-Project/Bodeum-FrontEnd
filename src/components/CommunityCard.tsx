import HeartIcon from "@/assets/icons/HeartDisabled.svg?react";
import CommentIcon from "@/assets/icons/Community.svg?react";
import ViewIcon from "@/assets/icons/Views.svg?react";
import PostTag from "@/components/PostTag";
import { getRelativeTime } from "@/utils/time";
import { useNavigate } from "react-router-dom";

interface CommunityCardProps {
  postId: number;
  categoryName: string;
  authorDisplay: string;
  title: string;
  content: string;
  likeCount: number;
  commentCount: number;
  viewCount: number;
  createdAt: string;
  onClick?: () => void;
}

export default function CommunityCard({
  postId,
  authorDisplay,
  title,
  content,
  likeCount,
  commentCount,
  viewCount,
  createdAt,
  categoryName,
  onClick,
}: CommunityCardProps) {
  const navigate = useNavigate();

  return (
    <button
      onClick={() => (onClick ? onClick() : navigate(`/community/${postId}`))}
      className="press group flex w-[272px] shrink-0 cursor-pointer flex-col rounded-[18px] border border-default bg-surface p-[16px] text-left transition-colors hover:bg-surface-subtle active:bg-surface-muted sm:w-[320px]"
    >
      <div className="mb-[8px] flex w-full justify-between ">
        <div className="flex w-full items-center gap-2">
          <PostTag
            type="ETC"
            label={categoryName}
          />
          <span className="text-body-sub text-secondary">{authorDisplay}</span>
        </div>

        <span className="ml-auto shrink-0 text-body-sub text-secondary">{getRelativeTime(createdAt)}</span>
      </div>

      <h3 className="mb-[6px] line-clamp-1 text-[15px] font-semibold tracking-[-0.02em] text-primary transition-colors group-hover:text-brand-strong">{title}</h3>

      <p className="min-h-[38px] line-clamp-2 flex-1 text-[13px] leading-[19px] text-secondary">{content}</p>

      <div className="mt-[12px] flex w-full items-center gap-[12px] text-[12px] text-tertiary">
        <div className="flex items-center gap-1">
          <HeartIcon className="h-[12px] w-[12px]" />
          <span>{likeCount}</span>
        </div>

        <div className="flex items-center gap-1">
          <CommentIcon className="h-[12px] w-[12px]" />
          <span>{commentCount}</span>
        </div>

        <div className="flex items-center gap-1">
          <ViewIcon className="h-[12px] w-[12px]" />
          <span>{viewCount.toLocaleString()}</span>
        </div>
      </div>
    </button>
  );
}
