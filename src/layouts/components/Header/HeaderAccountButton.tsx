import { Bone } from "@/components/skeleton/Skeleton";
import { useNavigate } from "react-router-dom";
import { useUserBrief } from "@/hooks/useUser";
import ProfileIcon from "@/assets/icons/Profile.svg?react";

// 데스크톱 헤더 우측 계정 버튼. 비로그인: 로그인/회원가입, 로그인: 프로필 → 마이페이지
export default function HeaderAccountButton() {
  const navigate = useNavigate();
  const { data: brief, isError, isPending } = useUserBrief();

  if (isPending && !isError) return <Bone className="h-[44px] w-[132px] rounded-[12px]" />;

  const isLoggedIn = !isError && brief?.isLoggedIn === true;
  const base =
    "flex h-[44px] shrink-0 cursor-pointer items-center gap-[8px] rounded-[12px] border border-[#DCE1E8] bg-background-100 px-[18px] text-[15px] font-semibold text-background-600 transition-colors hover:bg-background-200";

  if (!isLoggedIn) {
    return (
      <button type="button" className={base} onClick={() => navigate("/auth")}>
        로그인/회원가입
      </button>
    );
  }

  if (!brief.onboardingCompleted) {
    return (
      <button type="button" className={base} onClick={() => navigate("/auth?flow=onboarding&source=profile")}>
        맞춤 프로필 만들기
      </button>
    );
  }

  return (
    <button type="button" className={`${base} pl-[8px]`} onClick={() => navigate("/mypage")}>
      {brief.profileImageUrl ? (
        <img src={brief.profileImageUrl} alt="" className="h-[30px] w-[30px] rounded-full object-cover" />
      ) : (
        <ProfileIcon className="h-[30px] w-[30px]" />
      )}
      <span className="max-w-[120px] truncate">{brief.nickname ?? "마이페이지"}님</span>
    </button>
  );
}
