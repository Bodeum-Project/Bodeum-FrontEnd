import DetailBackButton from "@/components/button/DetailBackButton";
import RightIcon from "@/assets/icons/ChevronRight.svg?react";

import { useBreadcrumb } from "@/contexts/BreadcrumbContext";

export default function BackTopBar() {
  const { breadcrumb } = useBreadcrumb();
  
  return (
    <header className="flex h-[56px] shrink-0 items-center border-b border-background-250/70 bg-background-100/70 px-[16px] backdrop-blur-[16px] backdrop-saturate-150 py-[10px] lg:h-[72px] lg:px-[48px] lg:py-[12px]">
      <DetailBackButton />

      <div className="ml-[12px] flex min-w-0 items-center overflow-hidden whitespace-nowrap lg:ml-[20px]">
        {breadcrumb.map((item, index) => (
          <div key={index} className={`flex min-w-0 items-center ${index < breadcrumb.length - 1 ? "max-lg:hidden" : ""}`}>
            {index > 0 && (
              <RightIcon className="max-lg:hidden mx-[11.25px] h-[7px] w-[3.5px] text-background-300" />
            )}

            {item.onClick ? (
              <button
                onClick={item.onClick}
                className="truncate text-h6-list text-background-500 cursor-pointer"
              >
                {item.label}
              </button>
            ) : (
              <span className="truncate text-h6-list text-background-500">
                {item.label}
              </span>
            )}
          </div>
        ))}
      </div>
    </header>
  );
}