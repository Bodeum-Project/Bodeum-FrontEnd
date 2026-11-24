import { useEffect, useId, useRef, useState } from "react";
import { useDelayedClose } from "@/hooks/usePresence";
import { createPortal } from "react-dom";

import { ComingSoonIcon } from "./ModerationIcons";
import {
  ETC_REASON,
  blockReasons,
  moderationTargetLabel,
  reportReasons,
  type ModerationAction,
  type ModerationTarget,
} from "./moderationReasons";

const focusableSelector = [
  "a[href]",
  "button:not([disabled])",
  "input:not([disabled])",
  "textarea:not([disabled])",
  '[tabindex]:not([tabindex="-1"])',
].join(",");

const ETC_MAX_LENGTH = 200;

interface ModerationModalProps {
  open: boolean;
  action: ModerationAction;
  target: ModerationTarget;
  onClose: () => void;
}

/**
 * 신고·차단 사유 선택 모달.
 * 모바일: 바텀시트 / sm 이상: 중앙 모달.
 * 서버 API 가 준비되기 전까지는 사유 선택 후 "준비 중" 안내로 전환된다.
 */
export default function ModerationModal(props: ModerationModalProps) {
  if (!props.open) return null;
  // open 될 때마다 내부 상태를 새로 시작하도록 별도 컴포넌트로 마운트
  return createPortal(<ModerationModalContent {...props} />, document.body);
}

function ModerationModalContent({ action, target, onClose: closeNow }: ModerationModalProps) {
  // 닫을 때 시트가 내려가는 모션을 보여준 뒤 닫음
  const { isClosing, close: onClose } = useDelayedClose(closeNow, 200);
  const [step, setStep] = useState<"select" | "comingSoon">("select");
  const [selectedReasons, setSelectedReasons] = useState<string[]>([]);
  const [etcText, setEtcText] = useState("");
  const dialogRef = useRef<HTMLDivElement>(null);
  const onCloseRef = useRef(onClose);
  const titleId = useId();
  const descId = useId();

  const isReport = action === "report";
  const reasons = isReport ? reportReasons : blockReasons;
  const actionLabel = isReport ? "신고" : "차단";
  const targetLabel = moderationTargetLabel[target];
  const isEtc = selectedReasons.includes(ETC_REASON);
  const canSubmit = selectedReasons.length > 0 && (!isEtc || etcText.trim().length > 0);

  const toggleReason = (value: string) => {
    setSelectedReasons((current) =>
      current.includes(value)
        ? current.filter((item) => item !== value)
        : [...current, value],
    );
  };

  useEffect(() => {
    onCloseRef.current = onClose;
  }, [onClose]);

  // 스크롤 잠금 · ESC 닫기 · 포커스 트랩 · 닫힐 때 포커스 복귀
  useEffect(() => {
    const previouslyFocused =
      document.activeElement instanceof HTMLElement ? document.activeElement : null;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const getFocusable = () =>
      Array.from(dialogRef.current?.querySelectorAll<HTMLElement>(focusableSelector) ?? []);

    const frame = window.requestAnimationFrame(() => {
      dialogRef.current?.focus();
    });

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        onCloseRef.current();
        return;
      }
      if (event.key !== "Tab") return;

      const focusable = getFocusable();
      if (focusable.length === 0) return;
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      const active = document.activeElement;

      if (!dialogRef.current?.contains(active) || active === dialogRef.current) {
        event.preventDefault();
        (event.shiftKey ? last : first).focus();
      } else if (event.shiftKey && active === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && active === last) {
        event.preventDefault();
        first.focus();
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => {
      window.cancelAnimationFrame(frame);
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = previousOverflow;
      previouslyFocused?.focus();
    };
  }, []);

  return (
    <div
      data-closing={isClosing}
      className="fixed inset-0 z-[80] flex items-end justify-center modal-backdrop motion-backdrop sm:items-center sm:px-[20px]"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        aria-describedby={descId}
        tabIndex={-1}
        data-closing={isClosing}
        className="motion-sheet max-h-[88dvh] w-full overflow-y-auto rounded-t-[22px] bg-background-100 px-[20px] pb-[calc(20px+env(safe-area-inset-bottom))] pt-[10px] outline-none sm:max-w-[440px] sm:rounded-[20px] sm:px-[24px] sm:pb-[24px] sm:pt-[24px]"
      >
        {step === "select" ? (
          <>
            <div aria-hidden="true" className="mx-auto mb-[16px] h-[4px] w-[40px] rounded-full bg-background-300 sm:hidden" />
            <h2 id={titleId} className="text-[18px] font-bold leading-[26px] text-background-600">
              {isReport ? `${targetLabel} 신고 사유를 선택해 주세요` : "차단 사유를 선택해 주세요"}
            </h2>
            <p id={descId} className="mt-[4px] text-body-sub text-background-500">
              {isReport
                ? "신고 내용은 운영 정책에 따라 검토돼요. 해당하는 사유를 모두 선택해 주세요."
                : "차단하면 이 사용자의 글과 댓글이 더 이상 보이지 않아요. 해당하는 사유를 모두 선택해 주세요."}
            </p>

            <fieldset className="mt-[16px] flex flex-col gap-[8px]">
              <legend className="sr-only">{actionLabel} 사유</legend>
              {reasons.map((item) => {
                const selected = selectedReasons.includes(item.value);
                return (
                  <label
                    key={item.value}
                    className={`flex cursor-pointer items-center gap-[10px] rounded-[12px] border px-[14px] py-[12px] text-[14px] leading-[20px] transition-colors ${
                      selected
                        ? "border-main-400 bg-main-150 font-bold text-background-600"
                        : "border-background-250 text-background-600 hover:bg-background-200"
                    }`}
                  >
                    <input
                      type="checkbox"
                      name={`moderation-reason-${titleId}`}
                      value={item.value}
                      checked={selected}
                      onChange={() => toggleReason(item.value)}
                      className="sr-only"
                    />
                    <span
                      aria-hidden="true"
                      className={`flex h-[18px] w-[18px] shrink-0 items-center justify-center rounded-[5px] border-2 transition-colors ${
                        selected
                          ? "border-main-400 bg-main-400 text-background-100"
                          : "border-background-300 bg-transparent text-transparent"
                      }`}
                    >
                      <svg viewBox="0 0 12 12" width="10" height="10" aria-hidden="true">
                        <path
                          d="M2.5 6.2l2.2 2.2 4.8-4.8"
                          stroke="currentColor"
                          strokeWidth="1.8"
                          fill="none"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    </span>
                    {item.label}
                  </label>
                );
              })}
            </fieldset>

            {isEtc && (
              <div className="mt-[10px]">
                <textarea
                  value={etcText}
                  maxLength={ETC_MAX_LENGTH}
                  onChange={(event) => setEtcText(event.target.value)}
                  placeholder={`${actionLabel} 사유를 입력해 주세요`}
                  aria-label={`기타 ${actionLabel} 사유`}
                  rows={3}
                  className="w-full resize-none rounded-[12px] border border-background-250 px-[14px] py-[12px] text-[14px] leading-[20px] text-background-600 outline-none placeholder:text-background-400 focus:border-main-400"
                />
                <p className="mt-[2px] text-right text-body-sub text-background-400">
                  {etcText.length}/{ETC_MAX_LENGTH}
                </p>
              </div>
            )}

            <div className="mt-[18px] flex gap-[8px]">
              <button
                type="button"
                onClick={onClose}
                className="h-[48px] flex-1 cursor-pointer rounded-[12px] bg-background-250 text-[15px] font-bold text-background-500 hover:bg-background-300"
              >
                취소
              </button>
              <button
                type="button"
                disabled={!canSubmit}
                onClick={() => setStep("comingSoon")}
                className={`h-[48px] flex-1 rounded-[12px] text-[15px] font-bold text-background-100 transition-[filter] disabled:cursor-not-allowed disabled:bg-background-300 disabled:bg-none ${
                  isReport
                    ? "cursor-pointer bg-sub-red hover:brightness-105"
                    : "btn-dark cursor-pointer"
                }`}
              >
                {isReport ? "신고하기" : "차단하기"}
              </button>
            </div>
          </>
        ) : (
          <div className="flex flex-col items-center pt-[14px] text-center sm:pt-0">
            <div className="flex h-[56px] w-[56px] items-center justify-center rounded-[18px] bg-main-150 text-main-400">
              <ComingSoonIcon />
            </div>
            <h2 id={titleId} className="mt-[14px] text-[18px] font-bold leading-[26px] text-background-600">
              {actionLabel} 기능은 준비 중이에요
            </h2>
            <p id={descId} className="mt-[8px] text-[14px] leading-[22px] text-background-500">
              더 안전한 커뮤니티를 위해 열심히 만들고 있어요.
              <br />
              조금만 기다려 주세요!
            </p>
            <button
              type="button"
              onClick={onClose}
              className="btn-dark mt-[22px] h-[48px] w-full cursor-pointer rounded-[12px] text-[15px] font-bold"
            >
              확인
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
