import { useRef } from "react";
import { useNavigate } from "react-router-dom";
import type { ParentCategory } from "@/types/info";
import { infoCategoryMap } from "@/constants/infoCategory";
import { useInfoItemCounts } from "@/hooks/useHome";

const categories: ParentCategory[] = [
  "INSTITUTION",
  "HOSPITAL",
  "WELFARE",
  "EMPLOYMENT",
  "EDUCATION",
];

export default function RequiredInfoSection() {
  const navigate = useNavigate();
  const sectionRef = useRef<HTMLElement>(null);
  const glowRef = useRef<HTMLSpanElement>(null);
  const { data: counts } = useInfoItemCounts();

  const countMap: Record<ParentCategory, number> = {
    INSTITUTION: counts?.institution ?? 0,
    HOSPITAL: counts?.hospital ?? 0,
    WELFARE: counts?.welfare ?? 0,
    EMPLOYMENT: counts?.employment ?? 0,
    EDUCATION: counts?.education ?? 0,
  };

  // 마우스를 따라다니는 흐릿한 원 (데스크톱 hover 기기에서만)
  const handlePointerMove = (event: React.PointerEvent<HTMLElement>) => {
    if (event.pointerType !== "mouse") return;
    const section = sectionRef.current;
    const glow = glowRef.current;
    if (!section || !glow) return;
    const rect = section.getBoundingClientRect();
    glow.style.transform = `translate3d(${event.clientX - rect.left}px, ${event.clientY - rect.top}px, 0) translate(-50%, -50%)`;
    glow.style.opacity = "1";
  };

  const handlePointerLeave = () => {
    if (glowRef.current) glowRef.current.style.opacity = "0";
  };

  return (
    <section
      ref={sectionRef}
      onPointerMove={handlePointerMove}
      onPointerLeave={handlePointerLeave}
      className="relative isolate -mx-[16px] -mt-[16px] overflow-hidden bg-[linear-gradient(180deg,#F0FCFC_72%,#FFFFFF)] px-[20px] lg:bg-none lg:bg-[#F0FCFC] pb-[28px] pt-[32px] md:-mx-[24px] md:px-[28px] lg:mx-0 lg:mt-0 lg:rounded-[28px] lg:px-[40px] lg:pb-[40px] lg:pt-[44px]"
    >
      {/* 은은한 블러 원: 좌측 상단 모서리 + 좌측 전체를 덮는 큰 원 */}
      <span aria-hidden="true" className="hero-blob pointer-events-none absolute -left-[120px] -top-[140px] -z-10 h-[340px] w-[340px]" />
      <span aria-hidden="true" className="hero-blob pointer-events-none absolute -left-[360px] top-1/2 -z-10 h-[900px] w-[900px] -translate-y-1/2" />
      <span
        ref={glowRef}
        aria-hidden="true"
        className="hero-blob pointer-events-none absolute left-0 top-0 -z-10 hidden h-[360px] w-[360px] opacity-0 transition-opacity duration-500 lg:block"
      />

      <p className="text-[14px] font-medium text-background-400">우리 아이를 위한 정보</p>
      <h1 className="mt-[8px] text-[24px] font-bold leading-[34px] tracking-[-0.02em] text-background-600 lg:text-[28px] lg:leading-[40px]">
        필요한 정보를
        <br />
        한 번에 찾아보세요
      </h1>

      <div className="mt-[28px] grid grid-cols-5 gap-[8px] sm:flex sm:gap-[14px]">
        {categories.map((type) => {
          const { label, icon: Icon, textColor } = infoCategoryMap[type];

          return (
            <button
              key={type}
              type="button"
              onClick={() => navigate(`/info?category=${type}`)}
              className="group flex min-w-0 cursor-pointer flex-col items-center gap-[10px] sm:w-[76px]"
            >
              <span
                className={`flex aspect-square w-full max-w-[64px] items-center justify-center rounded-[18px] bg-background-100/80 shadow-[0_8px_100px_rgb(180_207_207_/_0.2)] transition-[transform,background-color] group-hover:bg-background-100 group-active:scale-95 ${textColor}`}
              >
                <Icon className="h-[30px] w-[30px]" />
              </span>
              <span className="flex flex-col items-center leading-none">
                <span className="text-[14px] font-medium text-background-600">{label}</span>
                <span className="mt-[5px] text-[11px] text-background-400">
                  {countMap[type].toLocaleString()}곳
                </span>
              </span>
            </button>
          );
        })}
      </div>
    </section>
  );
}
