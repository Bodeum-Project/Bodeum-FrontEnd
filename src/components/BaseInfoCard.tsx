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
  pressedBorderColor = "peer-active:border-strong",
}: BaseInfoCardProps) {
  const isClickable = Boolean(onClick);

  return (
    <article className={`group relative isolate flex min-h-[96px] w-full items-center justify-between gap-[8px] rounded-xl px-[14px] py-[14px] sm:min-h-[102px] sm:px-[20px] ${isClickable ? "press" : ""}`}>
      {isClickable && (
        <button
          type="button"
          onClick={onClick}
          className="peer absolute inset-0 z-10 cursor-pointer rounded-xl focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand"
        />
      )}

      <div
        aria-hidden="true"
        className={`pointer-events-none absolute inset-0 -z-10 rounded-xl border border-default bg-surface transition ${
          isClickable
            ? `group-hover:bg-surface-subtle peer-active:bg-surface-muted ${pressedBorderColor}`
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