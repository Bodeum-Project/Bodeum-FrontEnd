import TextTabs from "@/components/ui/TextTabs";

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
  return <TextTabs value={value} onChange={onChange} options={newsTabs} ariaLabel="소식 종류" />;
}
