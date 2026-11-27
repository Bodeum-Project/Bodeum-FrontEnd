import { ReceiptIcon } from "@/components/moderation/ModerationIcons";
import ChevronRightIcon from "@/assets/icons/ChevronRight.svg?react";
import { useCanCaptureReceipt } from "@/hooks/useCanCaptureReceipt";
import { PhoneIcon } from "@/pages/info/ReviewWrite/ReceiptVerifyCard";

interface Props {
  onStart: () => void;
}

/**
 * 정보 상세 > 후기 영역의 영수증 리뷰 배너 (데모 목업 모드에서만 노출).
 * 모바일·태블릿은 바로 촬영 흐름으로, PC는 휴대폰에서 인증하도록 안내.
 */
export default function ReceiptReviewBanner({ onStart }: Props) {
  const canCapture = useCanCaptureReceipt();

  if (!canCapture) {
    return (
      <div className="mb-[12px] flex items-center gap-[12px] rounded-md bg-surface-subtle px-[16px] py-[12px] sm:px-[25px]">
        <span className="flex h-[36px] w-[36px] shrink-0 items-center justify-center rounded-lg bg-surface text-brand">
          <PhoneIcon />
        </span>
        <p className="min-w-0 flex-1 text-h6-list text-secondary">
          <span className="font-bold text-primary">휴대폰으로 영수증을 찍으면</span> 후기에 ‘영수증 인증’ 배지가 붙어요
        </p>
      </div>
    );
  }

  return (
    <button
      type="button"
      onClick={onStart}
      className="group mb-[12px] flex w-full cursor-pointer items-center gap-[12px] rounded-md bg-brand-soft px-[16px] py-[12px] text-left transition-colors hover:bg-brand-tint/60"
    >
      <span className="flex h-[40px] w-[40px] shrink-0 items-center justify-center rounded-lg bg-surface text-brand">
        <ReceiptIcon />
      </span>
      <span className="min-w-0 flex-1">
        <span className="block text-[15px] font-bold leading-[22px] text-primary">영수증 인증하고 후기 쓰기</span>
        <span className="block text-body-sub text-secondary">인증 배지가 붙은 후기는 더 믿음을 줘요</span>
      </span>
      <ChevronRightIcon aria-hidden="true" className="h-[13px] w-[9px] shrink-0 text-brand" />
    </button>
  );
}
