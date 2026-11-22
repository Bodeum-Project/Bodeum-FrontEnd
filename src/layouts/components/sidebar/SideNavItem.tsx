import ChevronRightIcon from "@/assets/icons/ChevronRight.svg?react";

interface SideNavItemProps {
  icon: React.ReactNode;
  label: string;

  active?: boolean;     
  expanded?: boolean;   
  disabled?: boolean;

  children?: React.ReactNode;

  onClick?: () => void;
}

export default function SideNavItem({
  icon,
  label,
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
          flex w-full items-center justify-between rounded-[10px] px-[15px] py-[9.5px] transition-colors text-h3-category-sub cursor-pointer
          ${active
            ? "bg-main-150 text-main-400"
            : `
              text-background-500
              hover:bg-background-200
              hover:text-background-600
              active:bg-background-250
            `
          }
        `}
      >
        <div className="flex items-center gap-[10px]">
          {icon}
          <span>{label}</span>
        </div>

        {children && <ChevronRightIcon />}
      </button>

      {expanded && <div className="mt-4 ml-12">{children}</div>}
    </div>
  );
};