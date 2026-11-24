import type { ReactNode } from "react";

interface PostListItemProps {
  title: string;
  /** 지역(회색) 또는 카테고리(민트) 칩 */
  tag: string;
  tagTone?: "gray" | "mint";
  likes?: number;
  talks?: number;
  views?: number;
  rightSlot?: ReactNode;
  onClick?: () => void;
}

export default function PostListItem({
  title,
  tag,
  tagTone = "gray",
  likes,
  talks,
  views,
  rightSlot,
  onClick,
}: PostListItemProps) {
  const stats = [
    likes !== undefined && `좋아요 ${likes.toLocaleString()}`,
    talks !== undefined && `댓글 ${talks.toLocaleString()}`,
    views !== undefined && `조회 ${views.toLocaleString()}`,
  ].filter(Boolean);

  return (
    <button
      onClick={onClick}
      className="press group flex w-full cursor-pointer items-center gap-[12px] border-b border-default py-[14px] text-left last:border-b-0 active:opacity-70"
    >
      <div className="min-w-0 flex-1">
        <p className="truncate text-[15px] font-medium tracking-[-0.02em] text-primary transition-colors group-hover:text-brand-strong">{title}</p>
        <div className="mt-[6px] flex min-w-0 items-center gap-[6px] text-[12px] text-tertiary">
          {tag && (
            <span
              className={`shrink-0 rounded-xs px-[7px] py-[3px] text-[11px] font-medium leading-[14px] ${
                tagTone === "mint" ? "bg-brand-soft text-brand-strong" : "bg-surface-subtle text-secondary"
              }`}
            >
              {tag}
            </span>
          )}
          {stats.length > 0 && <span className="truncate">{stats.join(" · ")}</span>}
        </div>
      </div>
      {rightSlot}
    </button>
  );
}
