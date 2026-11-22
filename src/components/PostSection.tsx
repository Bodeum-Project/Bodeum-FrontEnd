import type { ReactNode } from "react";

import RightIcon from "@/assets/icons/ChevronRight.svg?react";

interface PostSectionProps {
  title: string;
  children: ReactNode;
  onMoreClick?: () => void;
}

export default function PostSection({
  title,
  children,
  onMoreClick,
}: PostSectionProps) {
  return (
    <section className="w-full">
      <div className="mb-[4px] flex items-center justify-between">
        <h2 className="text-[16px] font-bold text-background-600">{title}</h2>

        <button
          onClick={onMoreClick}
          className="flex cursor-pointer items-center gap-[4px] text-[13px] text-background-400"
        >
          더보기
          <RightIcon className="h-[10px] w-[7px]" />
        </button>
      </div>

      <div className="flex flex-col">{children}</div>
    </section>
  );
}
