import { useNavigate } from "react-router-dom";
import AIMsgIcon from "@/assets/icons/AIMsg.svg?react";

export default function AIChatButton() {
  const navigate = useNavigate();

  return (
    <button
      type="button"
      onClick={() => navigate("/aichat")}
      className="flex h-[80px] w-full items-center justify-start gap-[10px] rounded-sm bg-brand-tint px-[30px] py-2 text-left cursor-pointer transition-colors hover:bg-brand-soft"
    >
      <span className="flex h-8 w-8 shrink-0 items-center justify-center">
        <AIMsgIcon className="h-8 w-8" aria-hidden="true" />
      </span>

      <span className="flex flex-col gap-1 whitespace-normal">
        <span className="text-h6 text-brand">
          빠르고 간단한 정보 관련 안내는 AI 큐레이션에게
        </span>

        <span className="text-h3-category-sub text-primary">
          AI 챗봇을 통해 질문해보세요
        </span>
      </span>
    </button>
  );
}