import SparkleIcon from "@/assets/icons/Sparkle.svg?react";
import { useNavigate } from "react-router-dom";

export default function AiPromoCard() {
  const navigate = useNavigate();

  return (
    <button
      type="button"
      onClick={() => navigate("/aichat")}
      className="relative flex w-full cursor-pointer items-center gap-[14px] overflow-hidden rounded-[20px] px-[18px] py-[18px] text-left transition-transform lg:gap-[16px] lg:px-[24px] lg:py-[20px] active:scale-[0.99]"
      style={{ backgroundImage: "var(--gradient-accent-soft)" }}
    >
      <span className="flex h-[44px] w-[44px] shrink-0 items-center justify-center rounded-[14px] bg-background-100 text-main-400 shadow-[0_4px_12px_rgb(23_181_192_/_0.18)]">
        <SparkleIcon className="h-[24px] w-[24px]" />
      </span>

      <span className="min-w-0 flex-1">
        <span className="block text-[16px] font-semibold tracking-[-0.02em] text-background-600">
          AI 챗봇에게 물어보세요
        </span>
        <span className="mt-[2px] block text-[13px] text-background-500">
          맞춤 기관·정보를 추천해요
        </span>
      </span>

      <span className="shrink-0 rounded-full btn-dark px-[12px] py-[7px] text-[12px] font-semibold text-background-100">
        질문하기
      </span>
    </button>
  );
}
