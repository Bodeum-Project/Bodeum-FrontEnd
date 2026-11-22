import type { ReactNode } from "react";

interface BaseInfoCardProps {
  icon: ReactNode;
  left: ReactNode;
  right: ReactNode;
  onClick?: () => void;
  pressedBorderColor?: string;
}

export default function BaseInfoCard({
  icon,
  left,
  right,
  onClick,
  pressedBorderColor = "peer-active:border-background-300",
}: BaseInfoCardProps) {
  const isClickable = Boolean(onClick);

  return (
    <article className="group relative isolate flex min-h-[96px] w-full items-center justify-between gap-[8px] rounded-[16px] px-[14px] py-[14px] sm:h-[102px] sm:px-[20px]">
      {isClickable && (
        <button
          type="button"
          onClick={onClick}
          className="peer absolute inset-0 z-10 cursor-pointer rounded-[16px] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-main-400"
        />
      )}

      <div
        aria-hidden="true"
        className={`pointer-events-none absolute inset-0 -z-10 rounded-[16px] border border-background-250 bg-background-100 transition ${
          isClickable
            ? `group-hover:bg-background-200 peer-active:bg-background-250 ${pressedBorderColor}`
            : ""
        }`}
      />

      <div className="flex min-w-0 flex-1 items-center gap-3 sm:gap-4">
        {icon}
        {left}
      </div>

      {right}
    </article>
  );
}