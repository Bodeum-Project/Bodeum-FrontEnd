import type { ComponentType, SVGProps } from "react";

type Variant = "dark" | "soft" | "primarySoft" | "dangerSoft";

interface DetailActionButtonProps {
  label: string;
  icon?: ComponentType<SVGProps<SVGSVGElement>>;
  iconPosition?: "left" | "right";
  variant?: Variant;
  pressed?: boolean;
  disabled?: boolean;
  onClick?: () => void;
  className?: string;
}

const VARIANT_CLASS: Record<Variant, string> = {
  dark: "btn-dark disabled:bg-background-250 disabled:bg-none disabled:text-background-400 disabled:filter-none",
  soft: "bg-background-200 text-background-600 hover:bg-[#DFE3EA] active:bg-[#D6DBE3]",
  primarySoft: "bg-main-150 text-main-500 hover:bg-main-200",
  dangerSoft: "bg-[#FFEFF1] text-[#E5495B] hover:bg-[#FFE2E6]",
};

/** 상세 페이지(정보·소식·커뮤니티) 공통 액션 버튼: 높이 40, 둥근 12, 그림자·테두리 없음 */
export default function DetailActionButton({
  label,
  icon: Icon,
  iconPosition = "left",
  variant = "soft",
  pressed,
  disabled,
  onClick,
  className = "",
}: DetailActionButtonProps) {
  const icon = Icon ? <Icon aria-hidden="true" className="bodeum-icon-color h-[16px] w-[16px] shrink-0" /> : null;

  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      aria-pressed={pressed}
      className={`inline-flex h-[40px] cursor-pointer items-center justify-center gap-[6px] rounded-[12px] px-[16px] text-[14px] font-semibold transition-colors disabled:cursor-not-allowed disabled:opacity-70 ${VARIANT_CLASS[variant]} ${className}`}
    >
      {iconPosition === "left" && icon}
      {label}
      {iconPosition === "right" && icon}
    </button>
  );
}
