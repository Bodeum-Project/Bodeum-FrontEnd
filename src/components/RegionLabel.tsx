interface RegionLabelProps {
  region: string;
}

export default function RegionLabel({
  region
}: RegionLabelProps) {
  return (
    <div
      className="shrink-0 inline-flex h-[20px] items-center justify-center rounded-[6px] bg-main-150 px-[6px]"
    >
      <span className="text-body-label font-semibold text-main-500">
        {region}
      </span>
    </div>
  );
}