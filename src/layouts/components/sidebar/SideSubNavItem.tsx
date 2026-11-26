interface SideSubNavItemProps {
  label: string;
  selected?: boolean;
  onClick?: () => void;
}

export default function SideSubNavItem({
  label,
  selected = false,
  onClick,
}: SideSubNavItemProps) {
  return (
    <button
      onClick={onClick}
      className={`
        w-full text-left transition-colors
        ${
          selected
            ? "text-h6 text-primary"
            : "text-h6-list text-secondary"
        }
      `}
    >
      {label}
    </button>
  );
}