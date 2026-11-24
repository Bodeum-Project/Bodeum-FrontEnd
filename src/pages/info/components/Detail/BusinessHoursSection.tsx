import ClockIcon from "@/assets/icons/Clock.svg?react";
import type { BusinessHour } from "@/types/info";
import Section from "./Section";

interface BusinessHoursSectionProps {
  hours: BusinessHour[];
}

export default function BusinessHoursSection({
  hours,
}: BusinessHoursSectionProps) {
  if (!hours || hours.length === 0) {
    return null;
  }
  
  return (
    <Section
      title="운영 시간"
      icon={<ClockIcon className="h-[16px] w-[16px] text-primary" />}
      headerTop={
        <div className="rounded-[5px] bg-brand-soft px-[8px] py-[6px] text-body-sub text-brand-strong">
          해당 병원의 진료시간은 공공데이터를 기반으로 제공되어 실제와 다를 수
          있습니다. 방문 전 병원에 문의해주세요.
        </div>
      }
    >
      
      <div className="flex flex-col gap-y-[10px] overflow-hidden rounded-sm ">
        {hours.map(({ dayOfWeek, openTime, closeTime }) => (
          <div
            key={dayOfWeek}
            className="flex items-center justify-between py-[7px] border-b border-default"
          >
            <span className="text-h4-list text-secondary">{dayOfWeek}</span>

            {openTime === "휴무" ? (
              <span className="text-h6 text-danger">휴무</span>
            ) : (
                <span className="text-h6 text-primary">{openTime} ~ {closeTime}</span>
            )}
          </div>
        ))}
      </div>

      <p className="mt-3 text-body-label text-tertiary">
        ※ 공휴일은 휴무입니다. 점심시간 PM 12:30 ~ 1:30
      </p>
    </Section>
  );
}