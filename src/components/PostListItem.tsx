import type { ReactNode } from "react";

interface PostListItemProps {
  title: string;
  region: string;
  likes?: number;
  talks?: number;
  views?: number;
  rightSlot?: ReactNode;
  onClick?: () => void;
}

export default function PostListItem({
  title,
  region,
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
      className="group flex w-full cursor-pointer items-center gap-[12px] border-b border-background-250 py-[14px] text-left last:border-b-0 active:opacity-70"
    >
      <div className="min-w-0 flex-1">
        <p className="truncate text-[15px] font-medium tracking-[-0.02em] text-background-600 transition-colors group-hover:text-main-500">{title}</p>
        <p className="mt-[4px] truncate text-[12px] text-background-400">
          <span className="font-medium text-main-500">{region}</span>
          {stats.length > 0 && <span> · {stats.join(" · ")}</span>}
        </p>
      </div>
      {rightSlot}
    </button>
  );
}
