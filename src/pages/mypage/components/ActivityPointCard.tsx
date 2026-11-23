import { RowsSkeleton } from "@/components/skeleton/Skeleton";
import BadgeIcon from "@/assets/icons/Badge.svg?react";
import BadgeHelpIcon from "@/assets/icons/BadgeHelp.svg?react";
import type { UserPointActivity } from "@/types/mypage";

interface ActivityPointCardProps {
  totalPoint: number;
  activities: UserPointActivity[];
  isLoading: boolean;
  errorMessage?: string;
  onRetry: () => void;
  onOpenBadgeGrade: () => void;
  onOpenBadgeHelp: () => void;
}

export default function ActivityPointCard({
  totalPoint,
  activities,
  isLoading,
  errorMessage,
  onRetry,
  onOpenBadgeGrade,
  onOpenBadgeHelp,
}: ActivityPointCardProps) {
  return (
    <aside>
      <section className="rounded-[20px] border border-background-250 bg-background-100 px-[20px] py-[20px]">
        <h2 className="text-[14px] font-semibold text-background-500">나의 활동 포인트</h2>
        <p className="mt-[4px] text-[24px] font-bold leading-[32px] tracking-[-0.02em] text-main-500">
          {totalPoint.toLocaleString()}
          <span className="ml-[2px] text-[16px] font-semibold">pt</span>
        </p>

        <div className="mt-[14px] flex flex-col divide-y divide-background-250 border-t border-background-250">
          {isLoading && (
            <RowsSkeleton count={3} label="포인트 내역을 불러오는 중입니다." />
          )}

          {errorMessage && (
            <div className="flex flex-col items-center gap-[8px] py-[12px] text-h4-list text-background-500">
              <p>{errorMessage}</p>
              <button
                type="button"
                onClick={onRetry}
                className="cursor-pointer text-main-400 underline"
              >
                다시 시도
              </button>
            </div>
          )}

          {!isLoading && !errorMessage && activities.map((activity) => (
            <div
              key={activity.pointType}
              className="flex items-center justify-between py-[12px]"
            >
              <span className="text-[13px] text-background-500">
                {activity.label}
                <span className="ml-[4px] text-background-400">+{activity.pointPerAction}pt</span>
              </span>
              <span className="text-[14px] font-semibold text-background-600">
                {activity.earnedPoint}pt
                <span className="ml-[6px] text-[12px] font-medium text-background-400">{activity.activityCount}회</span>
              </span>
            </div>
          ))}
        </div>
      </section>

      <div className="mt-[12px] grid grid-cols-2 gap-[10px]">
        <button
          type="button"
          onClick={onOpenBadgeGrade}
          className="flex h-[76px] cursor-pointer flex-col items-center justify-center gap-[6px] rounded-[16px] bg-main-150 text-[13px] font-semibold text-background-600 transition-colors hover:bg-main-200"
        >
          <BadgeIcon className="h-[20px] w-[20px]" aria-hidden="true" />
          보듬 뱃지 등급 안내
        </button>
        <button
          type="button"
          onClick={onOpenBadgeHelp}
          className="flex h-[76px] cursor-pointer flex-col items-center justify-center gap-[6px] rounded-[16px] bg-main-150 text-[13px] font-semibold text-background-600 transition-colors hover:bg-main-200"
        >
          <BadgeHelpIcon className="h-[24px] w-[24px]" aria-hidden="true" />
          보듬 뱃지란?
        </button>
      </div>
    </aside>
  );
}
