import { useEffect, useRef } from "react";
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

  // 마우스를 살짝 늦게 따라다니는 흐릿한 원 (데스크톱 마우스에서만)
  const target = useRef({ x: 0, y: 0 });
  const current = useRef({ x: 0, y: 0 });
  const frame = useRef<number | null>(null);

  useEffect(() => {
    return () => {
      if (frame.current !== null) cancelAnimationFrame(frame.current);
    };
  }, []);

  const tick = () => {
    const glow = glowRef.current;
    if (!glow) return;
    const dx = target.current.x - current.current.x;
    const dy = target.current.y - current.current.y;
    current.current.x += dx * 0.06;
    current.current.y += dy * 0.06;
    glow.style.transform = `translate3d(${current.current.x}px, ${current.current.y}px, 0) translate(-50%, -50%)`;
    frame.current = Math.abs(dx) + Math.abs(dy) > 0.5 ? requestAnimationFrame(tick) : null;
  };

  const handlePointerEnter = (event: React.PointerEvent<HTMLElement>) => {
    if (event.pointerType !== "mouse" || !sectionRef.current) return;
    const rect = sectionRef.current.getBoundingClientRect();
    // 처음 들어올 때는 커서 위치에서 시작해 튀지 않게
    current.current = { x: event.clientX - rect.left, y: event.clientY - rect.top };
    target.current = { ...current.current };
  };

  const handlePointerMove = (event: React.PointerEvent<HTMLElement>) => {
    if (event.pointerType !== "mouse") return;
    const section = sectionRef.current;
    const glow = glowRef.current;
    if (!section || !glow) return;
    const rect = section.getBoundingClientRect();
    target.current = { x: event.clientX - rect.left, y: event.clientY - rect.top };
    glow.style.opacity = "1";
    if (frame.current === null) frame.current = requestAnimationFrame(tick);
  };

  const handlePointerLeave = () => {
    if (glowRef.current) glowRef.current.style.opacity = "0";
  };

  return (
    <section
      ref={sectionRef}
      onPointerEnter={handlePointerEnter}
      onPointerMove={handlePointerMove}
      onPointerLeave={handlePointerLeave}
      className="relative isolate -mx-[16px] -mt-[16px] overflow-hidden bg-[linear-gradient(180deg,#F0FCFC_72%,#FFFFFF)] px-[20px] lg:bg-none lg:bg-[#F0FCFC] pb-[28px] pt-[32px] md:-mx-[24px] md:px-[28px] lg:mx-0 lg:mt-0 lg:rounded-[28px] lg:px-[40px] lg:pb-[40px] lg:pt-[44px]"
    >
      {/* 은은한 블러 원: 무게가 좌측 상단에 실리도록 두 원 모두 좌상단 모서리 쪽에 둔다 */}
      <span aria-hidden="true" className="hero-blob pointer-events-none absolute -left-[110px] -top-[130px] -z-10 h-[320px] w-[320px]" />
      <span aria-hidden="true" className="hero-blob pointer-events-none absolute -left-[340px] -top-[420px] -z-10 h-[820px] w-[820px]" />
      <span
        ref={glowRef}
        aria-hidden="true"
        className="hero-blob pointer-events-none absolute left-0 top-0 -z-10 hidden h-[360px] w-[360px] opacity-0 transition-opacity duration-700 lg:block"
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
