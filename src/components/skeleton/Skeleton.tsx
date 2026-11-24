import type { ReactNode } from "react";

/** 기본 뼈대 블록. 크기·모양은 className으로 지정 */
export function Bone({ className = "" }: { className?: string }) {
  // 라운드를 넘기면 그 값만 쓰고, 없을 때만 기본 rounded-xs (Tailwind는 클래스 순서가 아니라 이름순으로 이겨서 둘 다 붙이면 안 됨)
  const radius = /(^|\s)(\w+:)*rounded-/.test(className) ? "" : "rounded-xs";
  return <span aria-hidden="true" className={`skeleton block ${radius} ${className}`} />;
}

/** 스크린리더에는 "불러오는 중" 문구만 전달하고, 화면에는 뼈대만 보여줌 */
function SkeletonRoot({
  label = "불러오는 중입니다",
  className = "",
  children,
}: {
  label?: string;
  className?: string;
  children: ReactNode;
}) {
  return (
    <div role="status" aria-live="polite" aria-busy="true" className={className}>
      <span className="sr-only">{label}</span>
      {children}
    </div>
  );
}

/** 정보·소식 목록 카드(BaseInfoCard)와 같은 크기의 뼈대 */
export function ListCardSkeleton({ icon = true }: { icon?: boolean }) {
  return (
    <div className="relative flex min-h-[96px] items-center gap-[12px] rounded-xl border border-default bg-surface px-[14px] py-[14px] sm:min-h-[102px] sm:gap-[16px] sm:px-[20px]">
      {icon && (
        <Bone className="h-[64px] w-[64px] shrink-0 rounded-[18px] sm:h-[78px] sm:w-[78px] sm:rounded-2xl" />
      )}
      <div className="flex min-w-0 flex-1 flex-col">
        <div className="flex gap-[6px]">
          <Bone className="h-[20px] w-[44px]" />
          <Bone className="h-[20px] w-[56px]" />
        </div>
        <Bone className="mt-[10px] h-[18px] w-[70%]" />
        <Bone className="mt-[8px] h-[14px] w-[45%]" />
      </div>
    </div>
  );
}

export function ListCardsSkeleton({ count = 6, icon = true }: { count?: number; icon?: boolean }) {
  return (
    <div className="grid grid-cols-1 gap-x-[20px] gap-y-[10px] md:grid-cols-2 md:gap-y-[12px]">
      {Array.from({ length: count }, (_, index) => (
        <ListCardSkeleton key={index} icon={icon} />
      ))}
    </div>
  );
}

/** 목록 페이지 전체: 제목 → 필터 → 카드 목록 */
export function ListPageSkeleton({ label, icon = true }: { label?: string; icon?: boolean }) {
  return (
    <SkeletonRoot
      label={label}
      className="flex min-h-[calc(100vh-72px)] flex-col gap-[14px] bg-surface px-[16px] py-[16px] md:px-[24px] lg:gap-[20px] lg:px-[48px] lg:py-[36px]"
    >
      <div className="flex flex-col gap-[8px] pt-[4px]">
        <Bone className="h-[24px] w-[180px]" />
        <Bone className="h-[24px] w-[240px]" />
      </div>
      <div className="flex items-center gap-[8px]">
        <Bone className="h-[36px] w-[96px] rounded-md" />
        <Bone className="h-[36px] w-[84px] rounded-md" />
        <Bone className="ml-auto h-[36px] w-[104px] rounded-md" />
      </div>
      <div className="flex gap-[8px] overflow-hidden">
        {["w-[56px]", "w-[72px]", "w-[64px]", "w-[80px]", "w-[60px]"].map((width) => (
          <Bone key={width} className={`h-[34px] shrink-0 rounded-full ${width}`} />
        ))}
      </div>
      <ListCardsSkeleton count={8} icon={icon} />
    </SkeletonRoot>
  );
}

/** 상세 페이지: 요약 카드 + 섹션 두 개 */
export function DetailPageSkeleton({ label }: { label?: string }) {
  return (
    <SkeletonRoot
      label={label}
      className="flex justify-center px-[16px] py-[16px] md:px-[24px] lg:px-[48px] lg:py-[36px]"
    >
      <div className="w-full max-w-[760px] space-y-[12px]">
        <div className="rounded-2xl border border-default bg-surface px-[20px] py-[22px] sm:px-[28px] sm:py-[26px]">
          <Bone className="h-[20px] w-[56px]" />
          <Bone className="mt-[12px] h-[26px] w-[60%]" />
          <div className="mt-[20px] flex gap-[8px]">
            <Bone className="h-[40px] w-[96px] rounded-lg" />
            <Bone className="h-[40px] w-[84px] rounded-lg" />
            <Bone className="h-[40px] w-[72px] rounded-lg" />
          </div>
          <div className="mt-[28px] space-y-[14px] border-t border-default pt-[20px]">
            <Bone className="h-[16px] w-[72px]" />
            <Bone className="h-[14px] w-[80%]" />
            <Bone className="h-[14px] w-[50%]" />
            <Bone className="h-[14px] w-[40%]" />
          </div>
        </div>
        {[0, 1].map((index) => (
          <div
            key={index}
            className="space-y-[12px] rounded-2xl border border-default bg-surface px-[20px] py-[20px] sm:px-[28px] sm:py-[24px]"
          >
            <Bone className="h-[16px] w-[88px]" />
            <Bone className="h-[14px] w-full" />
            <Bone className="h-[14px] w-[90%]" />
            <Bone className="h-[14px] w-[65%]" />
          </div>
        ))}
      </div>
    </SkeletonRoot>
  );
}

/** 추천 소식 TOP5 같은 가로 썸네일 카드 줄 */
export function CardRowSkeleton({ count = 5, label }: { count?: number; label?: string }) {
  return (
    <SkeletonRoot label={label} className="flex items-start gap-[12px] overflow-hidden">
      {Array.from({ length: count }, (_, index) => (
        <div key={index} className="w-[200px] shrink-0 sm:w-[220px]">
          <Bone className="h-[128px] w-full rounded-xl" />
          <Bone className="mt-[12px] h-[16px] w-[90%]" />
          <Bone className="mt-[6px] h-[16px] w-[60%]" />
          <Bone className="mt-[8px] h-[12px] w-[40%]" />
        </div>
      ))}
    </SkeletonRoot>
  );
}

/** 댓글·관련 소식·포인트 내역처럼 짧은 줄이 이어지는 영역 */
export function RowsSkeleton({
  count = 3,
  label,
  avatar = false,
  className = "",
}: {
  count?: number;
  label?: string;
  avatar?: boolean;
  className?: string;
}) {
  return (
    <SkeletonRoot label={label} className={`flex flex-col gap-[16px] py-[8px] ${className}`}>
      {Array.from({ length: count }, (_, index) => (
        <div key={index} className="flex items-start gap-[12px]">
          {avatar && <Bone className="h-[36px] w-[36px] shrink-0 rounded-full" />}
          <div className="flex min-w-0 flex-1 flex-col gap-[8px]">
            <Bone className="h-[14px] w-[35%]" />
            <Bone className={`h-[14px] ${index % 2 === 0 ? "w-[85%]" : "w-[65%]"}`} />
          </div>
        </div>
      ))}
    </SkeletonRoot>
  );
}

/** 마이페이지: 프로필 카드 + 활동 카드 */
export function MyPageSkeleton({ label }: { label?: string }) {
  return (
    <SkeletonRoot
      label={label}
      className="min-h-[calc(100vh-72px)] bg-surface-subtle px-[16px] py-[16px] md:px-[24px] lg:px-[48px] lg:py-[36px]"
    >
      <div className="mx-auto flex w-full max-w-[1000px] flex-col gap-[12px]">
        <div className="flex items-center gap-[16px] rounded-2xl bg-surface px-[20px] py-[22px]">
          <Bone className="h-[64px] w-[64px] shrink-0 rounded-full" />
          <div className="flex flex-1 flex-col gap-[8px]">
            <Bone className="h-[20px] w-[120px]" />
            <Bone className="h-[14px] w-[180px]" />
          </div>
        </div>
        <div className="grid grid-cols-1 gap-[12px] md:grid-cols-3">
          {[0, 1, 2].map((index) => (
            <div key={index} className="rounded-2xl bg-surface px-[20px] py-[20px]">
              <Bone className="h-[16px] w-[80px]" />
              <Bone className="mt-[12px] h-[24px] w-[60px]" />
            </div>
          ))}
        </div>
        <div className="rounded-2xl bg-surface px-[20px] py-[20px]">
          <RowsSkeleton count={4} />
        </div>
      </div>
    </SkeletonRoot>
  );
}
