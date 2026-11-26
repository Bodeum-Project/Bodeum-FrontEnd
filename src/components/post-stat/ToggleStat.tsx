import { useState, type ReactNode } from "react";
import type { MouseEvent } from "react";

interface ToggleStatProps {
  type: "heart" | "scrap";
  isActive: boolean;
  count?: number;
  onClick: (e?: MouseEvent<HTMLButtonElement>) => void;
  outlineIcon: ReactNode;
  filledIcon: ReactNode;
  pressedIcon?: ReactNode;
  ariaLabel: string;
  disabled?: boolean;
  label?: string;
}

const TOGGLE_STAT_COLOR_CLASS_NAME = {
  heart: {
    default: "text-secondary",
    enabled: "text-like",
    pressed: "text-like-soft",
  },
  scrap: {
    default: "text-secondary",
    enabled: "text-primary",
  },
} as const;

function ToggleStat({
  type,
  isActive,
  count,
  onClick,
  outlineIcon,
  filledIcon,
  pressedIcon,
  ariaLabel,
  disabled = false,
  label,
}: ToggleStatProps) {
  const [isPressed, setIsPressed] = useState(false);

  // 켜질 때만 아이콘이 톡 튀고, 숫자는 바뀔 때 한 칸 굴러감 (첫 화면에서는 움직이지 않음)
  const [prevActive, setPrevActive] = useState(isActive);
  const [bumpKey, setBumpKey] = useState(0);
  const [prevCount, setPrevCount] = useState(count);
  const [countKey, setCountKey] = useState(0);

  if (prevActive !== isActive) {
    setPrevActive(isActive);
    if (isActive) setBumpKey((key) => key + 1);
  }

  if (prevCount !== count) {
    setPrevCount(count);
    setCountKey((key) => key + 1);
  }
  const icon = isPressed && pressedIcon ? pressedIcon : isActive ? filledIcon : outlineIcon;
  const colorClassName =
    isPressed && type === "heart"
      ? TOGGLE_STAT_COLOR_CLASS_NAME[type].pressed
      : isActive
        ? TOGGLE_STAT_COLOR_CLASS_NAME[type].enabled
        : TOGGLE_STAT_COLOR_CLASS_NAME[type].default;

  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={ariaLabel}
      aria-pressed={isActive}
      disabled={disabled}
      onPointerDown={() => setIsPressed(true)}
      onPointerUp={() => setIsPressed(false)}
      onPointerLeave={() => setIsPressed(false)}
      onPointerCancel={() => setIsPressed(false)}
      className={`inline-flex h-5 items-center gap-1 cursor-pointer disabled:cursor-not-allowed disabled:opacity-50 ${colorClassName}`}
    >
      <span
        key={`icon-${bumpKey}`}
        className={`pointer-events-none inline-flex shrink-0 items-center ${bumpKey > 0 ? "motion-bump" : ""}`}
      >
        {icon}
      </span>
      <span className="inline-flex translate-y-[-0.5px] items-center overflow-hidden text-h4-list leading-none">
        <span key={`count-${countKey}`} className={countKey > 0 && label === undefined ? "motion-count" : undefined}>
          {label ?? count?.toLocaleString()}
        </span>
      </span>
    </button>
  );
}

export default ToggleStat;
