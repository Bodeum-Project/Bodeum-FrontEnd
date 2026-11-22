import { Outlet, useLocation, useMatches, useNavigationType } from "react-router-dom";
import SideBar from "./components/sidebar/SideBar";
import SearchTopBar from "./components/Header/SearchTopBar";
import BackTopBar from "./components/Header/BackTopBar";
import { BreadcrumbProvider } from "@/contexts/BreadcrumbContext";
import { useEffect, useRef, useState } from "react";
import MobileTabBar from "./components/mobile/MobileTabBar";
import MobileDrawer from "./components/mobile/MobileDrawer";

export default function MainLayout() {
  const navigationType = useNavigationType();
  const matches = useMatches();
  const current = matches[matches.length - 1];

  const header = (current.handle as { header?: string })?.header;

  const mainRef = useRef<HTMLElement>(null);
  const location = useLocation();
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  // 페이지 이동 시 모바일 메뉴 닫기
  useEffect(() => {
    setIsDrawerOpen(false);
  }, [location.pathname, location.search]);

  // 현재 스크롤 위치 저장
  useEffect(() => {
    const main = mainRef.current;

    if (!main) return;

    const handleScroll = () => {
      sessionStorage.setItem(
        `scroll:${location.pathname}`,
        String(main.scrollTop),
      );
    };

    main.addEventListener("scroll", handleScroll);

    return () => {
      main.removeEventListener("scroll", handleScroll);
    };
  }, [location.pathname]);

  // 페이지 이동 시 스크롤 처리
  useEffect(() => {
    const main = mainRef.current;

    if (!main) return;

    // 뒤로가기/앞으로가기는 저장된 위치 복원
    if (navigationType === "POP") {
      const savedPosition = sessionStorage.getItem(
        `scroll:${location.pathname}`,
      );

      if (savedPosition) {
        requestAnimationFrame(() => {
          main.scrollTo({
            top: Number(savedPosition),
            behavior: "instant",
          });
        });
      }

      return;
    }

    // 새로운 페이지로 이동하면 맨 위
    main.scrollTo({
      top: 0,
      behavior: "instant",
    });
  }, [location.pathname, navigationType]);

  return (
    <BreadcrumbProvider>
      <div className="fixed inset-0 flex overflow-hidden">
        <div className="hidden lg:flex">
          <SideBar />
        </div>

        <div className="flex min-h-0 min-w-0 flex-1 flex-col">
          {header === "back" ? (
            <BackTopBar />
          ) : (
            <SearchTopBar onMenuClick={() => setIsDrawerOpen(true)} />
          )}

          <main
            ref={mainRef}
            className="min-h-0 flex-1 overflow-x-hidden overflow-y-auto pb-[calc(64px+env(safe-area-inset-bottom))] lg:pb-0"
          >
            <div className="mx-auto w-full">
              <Outlet />
            </div>
          </main>

          <MobileTabBar />
        </div>
      </div>

      <MobileDrawer open={isDrawerOpen} onClose={() => setIsDrawerOpen(false)}>
        <SideBar />
      </MobileDrawer>
    </BreadcrumbProvider>
  );
}
