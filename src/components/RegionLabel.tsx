interface RegionLabelProps {
  region: string;
}

export default function RegionLabel({
  region
}: RegionLabelProps) {
  return (
    <div
      className="shrink-0 inline-flex h-[20px] items-center justify-center rounded-xs bg-brand-soft px-[6px]"
    >
      <span className="text-body-label font-semibold text-brand-strong">
        {region}
      </span>
    </div>
  );
}