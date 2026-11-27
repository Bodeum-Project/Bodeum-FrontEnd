import { ReceiptIcon } from "@/components/moderation/ModerationIcons";
import { showToast } from "@/components/Toast";
import ChevronRightIcon from "@/assets/icons/ChevronRight.svg?react";
import { IS_MOCK_MODE } from "@/mocks/isMockMode";
import { useCanCaptureReceipt } from "@/hooks/useCanCaptureReceipt";
import {
  formatReceiptDate,
  type ReceiptInfo,
} from "../receipt/receiptTypes";

interface Props {
  receipt?: ReceiptInfo | null;
  onStart?: () => void;
  onRemove?: () => void;
}

/**
 * 후기 작성 화면의 영수증 방문 인증 카드.
 * - 모바일·태블릿: 누르면 영수증 촬영 흐름으로 이동, 인증 후에는 완료 상태로 바뀜
 * - PC: 모바일에서 인증하도록 안내
 * - 서버 API 가 없는 일반 빌드에서는 "준비 중" 안내만 노출 (데모 목업 모드에서만 흐름이 열림)
 */
export default function ReceiptVerifyCard({ receipt, onStart, onRemove }: Props) {
  const canCapture = useCanCaptureReceipt();

  return (
    <div className="mt-[20px]">
      <div className="mb-[12px] flex items-center gap-[4px]">
        <span className="text-h3-onboard text-secondary">방문 인증</span>
        <span className="text-h3-onboard text-tertiary">(선택)</span>
      </div>

      {receipt ? (
        <div className="flex items-center gap-[12px] rounded-[14px] border border-brand/40 bg-brand-soft px-[14px] py-[12px] sm:px-[18px]">
          <span className="flex h-[48px] w-[40px] shrink-0 items-center justify-center overflow-hidden rounded-sm bg-surface text-brand">
            {receipt.imageUrl ? (
              <img src={receipt.imageUrl} alt="" className="h-full w-full object-cover" />
            ) : (
              <ReceiptIcon />
            )}
          </span>
          <span className="min-w-0 flex-1">
            <span className="flex items-center gap-[4px] text-[15px] font-bold leading-[22px] text-brand-strong">
              <svg viewBox="0 0 12 12" width="12" height="12" aria-hidden="true">
                <path d="M2.5 6.2l2.2 2.2 4.8-4.8" stroke="currentColor" strokeWidth="1.8" fill="none" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              영수증 인증 완료
            </span>
            <span className="mt-[2px] block truncate text-body-sub text-secondary">
              {receipt.storeName} · {formatReceiptDate(receipt.visitedAt).slice(0, 10)}
            </span>
          </span>
          <button
            type="button"
            onClick={onRemove}
            className="shrink-0 cursor-pointer rounded-sm px-[8px] py-[6px] text-[13px] font-bold text-secondary hover:bg-surface"
          >
            인증 취소
          </button>
        </div>
      ) : IS_MOCK_MODE && !canCapture ? (
        <div className="flex items-center gap-[12px] rounded-[14px] bg-surface-subtle px-[14px] py-[14px] sm:px-[18px]">
          <span className="flex h-[44px] w-[44px] shrink-0 items-center justify-center rounded-lg bg-surface text-brand">
            <PhoneIcon />
          </span>
          <span className="min-w-0 flex-1">
            <span className="block text-[15px] font-bold leading-[22px] text-primary">
              영수증 인증은 휴대폰에서 할 수 있어요
            </span>
            <span className="mt-[2px] block text-body-sub text-secondary">
              휴대폰으로 보듬보듬에 접속해 영수증을 찍으면 후기에 ‘영수증 인증’ 배지가 붙어요
            </span>
          </span>
        </div>
      ) : (
        <button
          type="button"
          onClick={() =>
            IS_MOCK_MODE && onStart
              ? onStart()
              : showToast("blue", "영수증 방문 인증은 준비 중이에요. 조금만 기다려 주세요!")
          }
          className="group flex w-full cursor-pointer items-center gap-[12px] rounded-[14px] border border-dashed border-brand/50 bg-[#F6FDFD] px-[14px] py-[14px] text-left transition-colors hover:bg-brand-soft sm:px-[18px]"
        >
          <span className="flex h-[44px] w-[44px] shrink-0 items-center justify-center rounded-lg bg-brand-soft text-brand group-hover:bg-surface">
            <ReceiptIcon />
          </span>
          <span className="min-w-0 flex-1">
            <span className="flex flex-wrap items-center gap-[6px]">
              <span className="text-[15px] font-bold leading-[22px] text-primary">
                영수증으로 방문 인증하기
              </span>
              {!IS_MOCK_MODE && (
                <span className="rounded-xs bg-surface-muted px-[6px] py-[1px] text-[11px] font-bold leading-[16px] text-secondary">
                  준비 중
                </span>
              )}
            </span>
            <span className="mt-[2px] block text-body-sub text-secondary">
              인증하면 후기에 ‘영수증 인증’ 배지가 붙어요
            </span>
          </span>
          <ChevronRightIcon aria-hidden="true" className="h-[13px] w-[9px] shrink-0 text-brand" />
        </button>
      )}
    </div>
  );
}

export function PhoneIcon() {
  return (
    <svg viewBox="0 0 24 24" width="24" height="24" aria-hidden="true">
      <rect x="6" y="2.5" width="12" height="19" rx="3" fill="currentColor" fillOpacity="0.25" />
      <path d="M10.5 18h3" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" />
    </svg>
  );
}
