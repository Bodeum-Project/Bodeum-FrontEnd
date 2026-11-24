import type { ReactNode } from "react";

interface SectionProps {
  title: ReactNode;
  icon?: ReactNode;
  children: ReactNode;
  className?: string;
  headerTop?: ReactNode; 
}

export default function Section({
  title,
  icon,
  children,
  headerTop,
  className = "",
}: SectionProps) {
  return (
    <section
      className={`w-full rounded-2xl border border-default bg-surface px-[20px] py-[20px] sm:px-[28px] sm:py-[24px] ${className}`}
    >
      {headerTop && <div className="mb-[14px]">{headerTop}</div>}
      <div className="mb-[14px] flex items-center gap-[8px]">
        {icon}
        {typeof title === "string" ? (
          <h2 className="text-[16px] font-semibold text-primary">{title}</h2>
        ) : (
          title
        )}
      </div>
      {children}
    </section>
  );
}