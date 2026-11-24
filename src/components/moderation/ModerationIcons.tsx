import type { SVGProps } from "react";

/** 신고(사이렌) 아이콘 — solid two-tone, currentColor 기반 */
export function ReportIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true" {...props}>
      <path d="M5 18v-6a7 7 0 0 1 14 0v6z" fill="currentColor" fillOpacity="0.28" />
      <path
        d="M12 9.5v4M4 21h16M12 2.5v1.5M4.2 5.2l1.1 1.1M19.8 5.2l-1.1 1.1M5 18v-6a7 7 0 0 1 14 0v6"
        stroke="currentColor"
        strokeWidth="1.9"
        strokeLinecap="round"
        fill="none"
      />
    </svg>
  );
}

/** 차단 아이콘 — solid two-tone */
export function BlockIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true" {...props}>
      <circle cx="12" cy="12" r="9" fill="currentColor" fillOpacity="0.22" />
      <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.9" fill="none" />
      <path d="M5.8 5.8l12.4 12.4" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" />
    </svg>
  );
}

/** 영수증 아이콘 — solid two-tone */
export function ReceiptIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" width="24" height="24" aria-hidden="true" {...props}>
      <path d="M5 2.5h14v19l-2.8-1.8-2.1 1.8-2.1-1.8-2.1 1.8-2.1-1.8L5 21.5z" fill="currentColor" fillOpacity="0.25" />
      <path
        d="M8.5 8h7M8.5 12h7M8.5 16h4"
        stroke="currentColor"
        strokeWidth="1.9"
        strokeLinecap="round"
      />
    </svg>
  );
}

/** 준비 중(시계) 아이콘 — solid two-tone */
export function ComingSoonIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" width="28" height="28" aria-hidden="true" {...props}>
      <circle cx="12" cy="12" r="10" fill="currentColor" fillOpacity="0.25" />
      <path d="M12 7v5.2l3.2 2" stroke="currentColor" strokeWidth="2.1" strokeLinecap="round" strokeLinejoin="round" fill="none" />
    </svg>
  );
}
