import { Select, type SelectProps } from "@/components/Select";

interface ProfileSelectProps extends SelectProps {
  changed: boolean;
  selected: boolean;
}

export default function ProfileSelect({
  changed,
  selected,
  disabled,
  triggerClassName,
  ...props
}: ProfileSelectProps) {
  const stateClassName = disabled
    ? "!border-default !bg-surface-subtle !text-secondary"
    : changed
      ? "!border-brand !bg-surface !text-secondary"
      : selected
        ? ""
        : "!border-default !bg-surface-subtle !text-secondary aria-expanded:!border-brand aria-expanded:!bg-surface aria-expanded:!text-secondary";

  return (
    <Select
      {...props}
      disabled={disabled}
      triggerClassName={`h-[44px] ${stateClassName} ${triggerClassName ?? ""}`}
    />
  );
}
