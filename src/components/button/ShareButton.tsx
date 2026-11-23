import ShareIcon from "@/assets/icons/Share.svg?react";
import { showToast } from "@/components/Toast";
import ButtonOutline from "@/components/button/ButtonOutline";
import DetailActionButton from "@/components/button/DetailActionButton";

interface ShareButtonProps {
  url: string;
  className?: string;
  /** soft: 상세 페이지 공통 회색 버튼 */
  appearance?: "outline" | "soft";
}

export default function ShareButton({ url, className, appearance = "outline" }: ShareButtonProps) {
  const handleShare = async () => {
    try {
      if (!navigator.clipboard?.writeText) {
        throw new Error("Clipboard API is not available.");
      }

      await navigator.clipboard.writeText(url);
      showToast("green", "링크가 성공적으로 복사되었습니다.");
    } catch {
      showToast("red", "링크를 복사하지 못했습니다.");
    }
  };

  if (appearance === "soft") {
    return (
      <DetailActionButton label="공유" icon={ShareIcon} onClick={() => void handleShare()} className={className} />
    );
  }

  return (
    <ButtonOutline
      label="공유"
      tone="black"
      icon={ShareIcon}
      iconPosition="left"
      onClick={() => void handleShare()}
      className={className}
    />
  );
}
