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
  const smallGlowRef = useRef<HTMLSpanElement>(null);

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
  // 작은 원: 큰 원보다 빠르게(마우스보다는 느리게) 따라옴
  const smallCurrent = useRef({ x: 0, y: 0 });
  const frame = useRef<number | null>(null);

  useEffect(() => {
    return () => {
      if (frame.current !== null) cancelAnimationFrame(frame.current);
    };
  }, []);

  const follow = (
    element: HTMLElement | null,
    position: { x: number; y: number },
    ease: number,
  ) => {
    const dx = target.current.x - position.x;
    const dy = target.current.y - position.y;
    position.x += dx * ease;
    position.y += dy * ease;
    if (element) {
      element.style.transform = `translate3d(${position.x}px, ${position.y}px, 0) translate(-50%, -50%)`;
    }
    return Math.abs(dx) + Math.abs(dy);
  };

  const tick = () => {
    const bigRemaining = follow(glowRef.current, current.current, 0.06);
    const smallRemaining = follow(smallGlowRef.current, smallCurrent.current, 0.16);
    frame.current = bigRemaining + smallRemaining > 0.5 ? requestAnimationFrame(tick) : null;
  };

  const handlePointerEnter = (event: React.PointerEvent<HTMLElement>) => {
    if (event.pointerType !== "mouse" || !sectionRef.current) return;
    const rect = sectionRef.current.getBoundingClientRect();
    // 처음 들어올 때는 커서 위치에서 시작해 튀지 않게
    current.current = { x: event.clientX - rect.left, y: event.clientY - rect.top };
    smallCurrent.current = { ...current.current };
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
    if (smallGlowRef.current) smallGlowRef.current.style.opacity = "1";
    if (frame.current === null) frame.current = requestAnimationFrame(tick);
  };

  const handlePointerLeave = () => {
    if (glowRef.current) glowRef.current.style.opacity = "0";
    if (smallGlowRef.current) smallGlowRef.current.style.opacity = "0";
  };

  return (
    <section
      ref={sectionRef}
      onPointerEnter={handlePointerEnter}
      onPointerMove={handlePointerMove}
      onPointerLeave={handlePointerLeave}
      className="relative isolate -mx-[16px] -mt-[72px] overflow-hidden bg-[linear-gradient(180deg,#F0FCFC_72%,#FFFFFF)] px-[20px] lg:bg-none lg:bg-surface-hero pb-[28px] pt-[88px] md:-mx-[24px] md:px-[28px] lg:mx-0 lg:mt-0 lg:rounded-[28px] lg:px-[40px] lg:pb-[40px] lg:pt-[44px]"
    >
      {/* 은은한 블러 원: 무게가 좌측 상단에 실리도록 두 원 모두 좌상단 모서리 쪽에 둔다 */}
      <span aria-hidden="true" className="hero-blob pointer-events-none absolute -left-[110px] -top-[130px] -z-10 h-[320px] w-[320px]" />
      <span aria-hidden="true" className="hero-blob pointer-events-none absolute -left-[340px] -top-[420px] -z-10 h-[820px] w-[820px]" />
      <span
        ref={glowRef}
        aria-hidden="true"
        className="hero-blob pointer-events-none absolute left-0 top-0 -z-10 hidden h-[360px] w-[360px] opacity-0 transition-opacity duration-700 lg:block"
      />
      <span
        ref={smallGlowRef}
        aria-hidden="true"
        className="hero-blob hero-blob-strong pointer-events-none absolute left-0 top-0 -z-10 hidden h-[170px] w-[170px] opacity-0 transition-opacity duration-500 lg:block"
      />

      {/* 누구를 위한 어떤 서비스인지 첫 화면에서 바로 알 수 있게 */}
      <p className="text-[14px] font-semibold text-brand-strong">발달이 느린 아이 가족을 위한 정보 플랫폼</p>
      <h1 className="mt-[8px] text-[24px] font-bold leading-[34px] tracking-[-0.02em] text-primary lg:text-[28px] lg:leading-[40px]">
        흩어진 기관·병원·복지 정보,
        <br />
        보듬보듬에서 한 번에 찾아요
      </h1>

      <div className="mt-[28px] grid grid-cols-5 gap-[8px] sm:flex sm:gap-[14px]">
        {categories.map((type) => {
          const { label, icon: Icon, textColor } = infoCategoryMap[type];

          return (
            <button
              key={type}
              type="button"
              onClick={() => navigate(`/info?category=${type}`)}
              className="press-sm group flex min-w-0 cursor-pointer flex-col items-center gap-[10px] sm:w-[76px]"
            >
              <span
                className={`flex aspect-square w-full max-w-[64px] items-center justify-center rounded-[18px] bg-surface/80 shadow-soft transition-[transform,background-color] group-hover:bg-surface group-active:scale-95 ${textColor}`}
              >
                <Icon className="h-[30px] w-[30px]" />
              </span>
              <span className="flex flex-col items-center leading-none">
                <span className="text-[14px] font-medium text-primary">{label}</span>
                <span className="mt-[5px] text-[11px] text-tertiary">
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
