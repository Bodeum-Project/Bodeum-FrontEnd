import { ReceiptIcon } from "@/components/moderation/ModerationIcons";
import { showToast } from "@/components/Toast";
import ChevronRightIcon from "@/assets/icons/ChevronRight.svg?react";

/**
 * 영수증 방문 인증 진입 카드 (후기 작성 화면).
 * 영수증 인증 API 가 준비되기 전까지는 "준비 중" 안내만 노출한다.
 */
export default function ReceiptVerifyCard() {
  return (
    <div className="mt-[20px]">
      <div className="mb-[12px] flex items-center gap-[4px]">
        <span className="text-h3-onboard text-background-500">방문 인증</span>
        <span className="text-h3-onboard text-background-400">(선택)</span>
      </div>

      <button
        type="button"
        onClick={() =>
          showToast("blue", "영수증 방문 인증은 준비 중이에요. 조금만 기다려 주세요!")
        }
        className="group flex w-full cursor-pointer items-center gap-[12px] rounded-[14px] border border-dashed border-main-400/50 bg-[#F6FDFD] px-[14px] py-[14px] text-left transition-colors hover:bg-main-150 sm:px-[18px]"
      >
        <span className="flex h-[44px] w-[44px] shrink-0 items-center justify-center rounded-[12px] bg-main-150 text-main-400 group-hover:bg-background-100">
          <ReceiptIcon />
        </span>
        <span className="min-w-0 flex-1">
          <span className="flex flex-wrap items-center gap-[6px]">
            <span className="text-[15px] font-bold leading-[22px] text-background-600">
              영수증으로 방문 인증하기
            </span>
            <span className="rounded-[6px] bg-background-250 px-[6px] py-[1px] text-[11px] font-bold leading-[16px] text-background-500">
              준비 중
            </span>
          </span>
          <span className="mt-[2px] block text-body-sub text-background-500">
            인증하면 후기에 '방문 인증' 표시가 붙어요
          </span>
        </span>
        <ChevronRightIcon aria-hidden="true" className="h-[13px] w-[9px] shrink-0 text-main-400" />
      </button>
    </div>
  );
}
