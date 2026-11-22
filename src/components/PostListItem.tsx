import type { ReactNode } from "react";

import HeartIcon from "@/assets/icons/HeartDisabled.svg?react";
import TalkIcon from "@/assets/icons/Community.svg?react";
import ViewIcon from "@/assets/icons/Views.svg?react";
import RegionLabel from "@/components/RegionLabel";

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
  return (
    <button
      onClick={onClick}
      className="flex w-full flex-col items-start gap-[8px] rounded-[10px] bg-background-200 px-[14px] py-[12px] text-left cursor-pointer transition-colors active:bg-background-250 sm:flex-row sm:items-center sm:justify-between sm:gap-[12px] sm:px-[16px]"
    >
      <div className="flex w-full min-w-0 items-center gap-3 sm:w-auto">
        <RegionLabel region={region} />

        <p className="truncate text-h4-list text-gray-800">{title}</p>
      </div>

      <div className="flex shrink-0 items-center gap-[8px] text-h4-list text-background-500">
        {likes !== undefined && (
          <div className="flex items-center gap-1">
            <HeartIcon className="w-[12px] h-[12px]" />
            <span>{likes.toLocaleString()}</span>
          </div>
        )}

        {talks !== undefined && (
          <div className="flex items-center gap-1">
            <TalkIcon className="w-[12px] h-[12px]" />
            <span>{talks.toLocaleString()}</span>
          </div>
        )}

        {views !== undefined && (
          <div className="flex items-center gap-1">
            <ViewIcon className="w-[12px] h-[12px]" />
            <span>{views.toLocaleString()}</span>
          </div>
        )}

        {rightSlot}
      </div>
    </button>
  );
}
