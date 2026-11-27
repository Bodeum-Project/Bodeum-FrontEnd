import { Outlet } from "react-router-dom";
import BackTopBar from "./components/Header/BackTopBar";
import { BreadcrumbProvider } from "@/contexts/BreadcrumbContext";

export default function DetailLayout() {
  return (
    <BreadcrumbProvider>
      <div className="fixed inset-0 flex flex-col overflow-hidden">
        <div className="shrink-0 lg:pl-[var(--frame-gutter)]">
          <BackTopBar />
        </div>

        <main className="min-h-0 flex-1 overflow-y-auto">
          <Outlet />
        </main>
      </div>
    </BreadcrumbProvider>
  );
}
