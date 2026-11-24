import ChevronLeftIcon from "@/assets/icons/ChevronLeft.svg?react";
import type { ComponentType, SVGProps } from "react";
import { useNavigate } from "react-router-dom";

type IconComponent = ComponentType<SVGProps<SVGSVGElement>>;
type DetailBackButtonTone = "default" | "danger";

interface DetailBackButtonProps {
  icon?: IconComponent | null;
  label?: string;
  onClick?: () => void;
  tone?: DetailBackButtonTone;
  selected?: boolean;
  selectedClassName?: string;
  className?: string;
  disabled?: boolean;
}

function DetailBackButton({
  icon: Icon = ChevronLeftIcon,
  label = "뒤로가기",
  onClick,
  tone = "default",
  selected,
  selectedClassName,
  className,
  disabled = false,
}: DetailBackButtonProps) {
  const navigate = useNavigate();

  const handleClick = () => {
    if (onClick) {
      onClick();
      return;
    }

    navigate(-1);
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      disabled={disabled}
      aria-pressed={selected}
      className={`inline-flex cursor-pointer items-center gap-2 rounded-md border px-4 py-2 text-h4-list transition-colors hover:bg-surface-subtle disabled:cursor-not-allowed disabled:opacity-60 disabled:shadow-none ${
        selected && selectedClassName
          ? selectedClassName
          : tone === "danger"
            ? "border-danger bg-surface text-danger active:bg-danger active:border-background-100 active:text-inverse"
            : "border-strong bg-surface text-secondary active:border-cta active:text-primary"
      } ${className ?? ""}`}
    >
      {Icon && <Icon aria-hidden="true" className="bodeum-icon-color relative top-[1px] h-4 w-4" />}
      {label}
    </button>
  );
}

export default DetailBackButton;
