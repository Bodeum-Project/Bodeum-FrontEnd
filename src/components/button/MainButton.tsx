import type { ButtonHTMLAttributes, ReactNode } from 'react';

export type MainButtonSize = 'L' | 'M' | 'S';

type MainButtonBaseProps = Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'children' | 'disabled'> & {
  children: ReactNode;
  disabled?: boolean;
};

type MainButtonProps = MainButtonBaseProps &
  (
    | {
        size: Exclude<MainButtonSize, 'S'>;
        stroke?: never;
      }
    | {
        size: 'S';
        stroke?: boolean;
      }
  );

const sizeClasses: Record<MainButtonSize, string> = {
  L: 'h-[50px] w-full max-w-[536px] rounded-md text-h2-onboard',
  M: 'h-[50px] w-[260px] rounded-md text-h2-onboard',
  S: 'h-[25px] w-[66px] rounded-[5px] text-h6',
};

const filledEnabledClasses =
  'btn-dark';
const filledDisabledClasses: Record<MainButtonSize, string> = {
  L: 'bg-surface-muted text-secondary',
  M: 'bg-surface-muted text-secondary',
  S: 'bg-background-300 text-secondary',
};
const strokeEnabledClasses =
  'border-brand bg-surface text-brand hover:border-brand-strong hover:text-brand-strong active:border-brand active:bg-brand active:text-inverse';
const strokeDisabledClasses =
  'border-background-500 bg-surface text-secondary';

const joinClassNames = (...classNames: Array<string | false | undefined>) =>
  classNames.filter(Boolean).join(' ');

export default function MainButton({
  children,
  size,
  stroke = false,
  disabled = false,
  className,
  type = 'button',
  ...buttonProps
}: MainButtonProps) {
  const isStroke = size === 'S' && stroke;

  return (
    <button
      type={type}
      disabled={disabled}
      data-size={size}
      data-state={disabled ? 'disabled' : '기본'}
      className={joinClassNames(
        'inline-flex shrink-0 items-center justify-center whitespace-nowrap px-0 py-0 text-center',
        'transition-[background-color,color,border-color,box-shadow] duration-150 ease-out',
        'focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand',
        sizeClasses[size],
        isStroke ? 'border' : 'border-0',
        isStroke
          ? disabled
            ? strokeDisabledClasses
            : strokeEnabledClasses
          : disabled
            ? filledDisabledClasses[size]
            : filledEnabledClasses,
        disabled ? 'cursor-not-allowed' : 'cursor-pointer',
        className,
      )}
      {...buttonProps}
    >
      {children}
    </button>
  );
}
