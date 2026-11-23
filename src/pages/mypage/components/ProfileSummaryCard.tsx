import type { UserDashboard } from "@/types/mypage";
import ProfileIcon from "@/assets/icons/Profile.svg?react";
import SettingIcon from "@/assets/icons/Setting.svg?react";
import DetailActionButton from "@/components/button/DetailActionButton";
import { sidoDisplayNameByRegion } from "@/constants/regions";
import { myPageTabs } from "../myPageTabConfig";
import type { MyPageTabKey } from "@/types/mypage";

interface ProfileSummaryCardProps {
  dashboard: UserDashboard;
  counts: Record<MyPageTabKey, number>;
  onSettingsClick: () => void;
}

function getChildAge(birth: string | null | undefined) {
  const [birthYear = "", birthMonth = ""] = birth?.split("-") ?? [];

  if (!birthYear) {
    return null;
  }

  const today = new Date();
  const year = Number(birthYear);
  const month = Number(birthMonth);

  if (!Number.isFinite(year)) {
    return null;
  }

  const hasBirthdayPassed = !month || today.getMonth() + 1 >= month;

  return Math.max(0, today.getFullYear() - year - (hasBirthdayPassed ? 0 : 1));
}

export default function ProfileSummaryCard({
  dashboard,
  counts,
  onSettingsClick,
}: ProfileSummaryCardProps) {
  const diagnosisLabel =
    dashboard.childProfile?.disabilityTypes.map(({ label }) => label).join(", ") ||
    "집중 케어 미등록";
  const childAge = getChildAge(dashboard.childProfile?.birth);
  const district =
    dashboard.regionLevel2 !== dashboard.regionLevel1 ? dashboard.regionLevel2 : null;
  const region = [
    dashboard.regionLevel1
      ? (sidoDisplayNameByRegion[dashboard.regionLevel1] ?? dashboard.regionLevel1)
      : null,
    district,
  ]
    .filter(Boolean)
    .join(" ");
  const displayNickname = dashboard.nickname;

  return (
    <section className="relative isolate w-full overflow-hidden rounded-[24px] bg-[#F0FCFC] px-[20px] py-[22px] sm:px-[32px] sm:py-[28px]">
      <span aria-hidden="true" className="hero-blob pointer-events-none absolute -left-[120px] -top-[160px] -z-10 h-[360px] w-[360px]" />

      <div className="flex items-center gap-[14px] sm:gap-[18px]">
        {dashboard.profileImageUrl ? (
          <img
            src={dashboard.profileImageUrl}
            alt="프로필"
            className="h-[56px] w-[56px] shrink-0 rounded-full object-cover sm:h-[72px] sm:w-[72px]"
          />
        ) : (
          <ProfileIcon className="h-[56px] w-[56px] shrink-0 sm:h-[72px] sm:w-[72px]" aria-label="보듬 부모님 프로필" />
        )}

        <div className="min-w-0 flex-1">
          <h1 className="truncate text-[20px] font-bold leading-[28px] tracking-[-0.02em] text-background-600 sm:text-[22px]">
            {displayNickname}
          </h1>
          <p className="mt-[4px] break-keep text-[13px] leading-[19px] text-background-500">
            LEVEL {dashboard.level} · {diagnosisLabel} ·{" "}
            {childAge === null ? "연령 미등록" : `${childAge}세 아이`} · {region || "지역 미등록"}
          </p>
        </div>

        <DetailActionButton
          label="설정"
          icon={SettingIcon}
          onClick={onSettingsClick}
          className="shrink-0 !bg-background-100/80 hover:!bg-background-100"
        />
      </div>

      <div className="mt-[20px] grid grid-cols-3 gap-[8px] sm:gap-[12px]">
        {myPageTabs.map((tab) => (
          <div
            key={tab.key}
            className="rounded-[16px] bg-background-100/80 px-[8px] py-[14px] text-center shadow-[0_8px_40px_rgb(180_207_207_/_0.2)]"
          >
            <strong className="block text-[20px] font-bold leading-[26px] text-background-600">
              {counts[tab.key]}
            </strong>
            <span className="mt-[2px] block text-[12px] text-background-500 sm:text-[13px]">{tab.label}</span>
          </div>
        ))}
      </div>
    </section>
  );
}
