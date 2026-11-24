type DateDividerProps = {
  date: string;
  dateTime?: string;
  className?: string;
};

export default function DateDivider({
  date,
  dateTime,
  className,
}: DateDividerProps) {
  return (
    <div
      className={`flex w-full flex-col items-center justify-center gap-[16px] py-[12px] ${className ?? ""}`}
    >
      <div aria-hidden="true" className="h-px w-full bg-surface-muted" />
      <time
        dateTime={dateTime}
        className="flex shrink-0 items-center justify-center rounded-md bg-surface-muted px-[20px] py-[8px] text-center text-h2-onboard text-secondary"
      >
        {date}
      </time>
    </div>
  );
}
