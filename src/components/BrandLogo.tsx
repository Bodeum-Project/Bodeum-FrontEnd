import logoSrc from "@/assets/images/logo-bodeum.png";

interface BrandLogoProps {
  className?: string;
}

// 임시 로고 (보듬보듬). 높이만 지정하면 비율에 맞춰 너비가 정해진다.
export default function BrandLogo({ className = "h-[28px]" }: BrandLogoProps) {
  return <img src={logoSrc} alt="보듬보듬" draggable={false} className={`w-auto select-none ${className}`} />;
}
