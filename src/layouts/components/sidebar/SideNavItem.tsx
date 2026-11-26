import ChevronRightIcon from "@/assets/icons/ChevronRight.svg?react";

interface SideNavItemProps {
  icon: React.ReactNode;
  label: string;
  labelClassName?: string;

  active?: boolean;     
  expanded?: boolean;   
  disabled?: boolean;

  children?: React.ReactNode;

  onClick?: () => void;
}

export default function SideNavItem({
  icon,
  label,
  labelClassName = "",
  active = false,
  expanded = false,
  disabled = false,
  children,
  onClick,
}: SideNavItemProps) {
  return (
    <div>
      <button
        onClick={onClick}
        disabled={disabled}
        className={`
          flex w-full items-center justify-between rounded-md px-[15px] py-[9.5px] transition-colors text-h3-category-sub cursor-pointer
          ${active
            ? "bg-brand-soft text-brand"
            : `
              text-secondary
              hover:bg-surface-subtle
              hover:text-primary
              active:bg-surface-muted
            `
          }
        `}
      >
        <div className="flex items-center gap-[10px]">
          {icon}
          <span className={labelClassName}>{label}</span>
        </div>

        {children && (
          <ChevronRightIcon
            className={`transition-transform duration-200 motion-reduce:transition-none ${expanded ? "rotate-90" : ""}`}
          />
        )}
      </button>

      {children && (
        // 하위 메뉴가 높이째 부드럽게 펼쳐짐
        <div className="motion-collapse" data-open={expanded} inert={!expanded}>
          <div>
            <div className="mt-4 ml-12">{children}</div>
          </div>
        </div>
      )}
    </div>
  );
};