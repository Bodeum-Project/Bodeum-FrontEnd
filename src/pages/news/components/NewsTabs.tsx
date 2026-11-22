import SegmentedTabs from "@/components/ui/SegmentedTabs";

export type NewsTabValue = "activity" | "region";

const newsTabs: { value: NewsTabValue; label: string }[] = [
  { value: "activity", label: "활동소식" },
  { value: "region", label: "지역소식" },
];

interface NewsTabsProps {
  value: NewsTabValue;
  onChange: (value: NewsTabValue) => void;
}

export default function NewsTabs({ value, onChange }: NewsTabsProps) {
  return <SegmentedTabs value={value} onChange={onChange} options={newsTabs} />;
}
