import HomeIcon from "@/assets/icons/Home.svg?react";
import ChatIcon from "@/assets/icons/Chat.svg?react";
import InfoIcon from "@/assets/icons/Info.svg?react";
import NewsIcon from "@/assets/icons/News.svg?react";
import CommunityIcon from "@/assets/icons/Community.svg?react";
import type { ComponentType, SVGProps } from "react";
import { useLocation, useNavigate } from "react-router-dom";

type TabItem = {
  label: string;
  to: string;
  icon: ComponentType<SVGProps<SVGSVGElement>>;
  isActive: (pathname: string) => boolean;
};

const tabs: TabItem[] = [
  { label: "홈", to: "/", icon: HomeIcon, isActive: (p) => p === "/" },
  {
    label: "정보",
    to: "/info?category=INSTITUTION",
    icon: InfoIcon,
    isActive: (p) => p.startsWith("/info"),
  },
  {
    label: "AI 챗봇",
    to: "/aichat",
    icon: ChatIcon,
    isActive: (p) => p.startsWith("/aichat"),
  },
  { label: "소식", to: "/news", icon: NewsIcon, isActive: (p) => p.startsWith("/news") },
  {
    label: "커뮤니티",
    to: "/community",
    icon: CommunityIcon,
    isActive: (p) => p.startsWith("/community"),
  },
];

// 모바일(lg 미만)에서만 보이는 하단 탭 내비게이션
export default function MobileTabBar() {
  const navigate = useNavigate();
  const { pathname } = useLocation();

  return (
    <nav
      aria-label="주요 메뉴"
      className="fixed inset-x-0 bottom-0 z-40 border-t border-background-250 bg-background-100/95 pb-[env(safe-area-inset-bottom)] backdrop-blur lg:hidden"
    >
      <ul className="mx-auto flex h-[64px] max-w-[640px] items-stretch">
        {tabs.map(({ label, to, icon: Icon, isActive }) => {
          const active = isActive(pathname);

          return (
            <li key={label} className="flex-1">
              <button
                type="button"
                aria-current={active ? "page" : undefined}
                onClick={() => navigate(to)}
                className={`flex h-full w-full cursor-pointer flex-col items-center justify-center gap-[4px] text-body-label transition-colors ${
                  active ? "text-main-400" : "text-background-500 active:text-background-600"
                }`}
              >
                <Icon aria-hidden="true" className="bodeum-icon-color h-[22px] w-[22px]" />
                <span>{label}</span>
              </button>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
