/* eslint-disable react-refresh/only-export-components */
import { useEffect, useRef } from "react";
import { createRoot } from "react-dom/client";
import type { Root } from "react-dom/client";


export type ToastColor = "blue" | "green" | "red" | "yellow";

type ToastProps = {
  color: ToastColor;
  message: string;
};

/** 토스트 오른쪽 글자 버튼. login은 로그인 화면으로 이동 */
export type ToastAction = "login" | { label: string; onClick: () => void };

export type ToastOptions = {
  action?: ToastAction;
};

type ToastAnimationStatus = "entering" | "visible" | "closing";

type ToastItem = {
  id: number;
  color: ToastColor;
  message: string;
  action?: ToastAction;
  status: ToastAnimationStatus;
};

const MASCOT_SRC = `${import.meta.env.BASE_URL}favicon-mascot.png`;

const CheckGlyph = () => (
  <svg viewBox="0 0 16 16" className="h-[12px] w-[12px]" aria-hidden="true">
    <path d="M3 8.5l3.2 3L13 4.5" fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const BangGlyph = () => (
  <svg viewBox="0 0 16 16" className="h-[11px] w-[11px]" aria-hidden="true">
    <path d="M8 3v6M8 12.6v.4" stroke="currentColor" strokeWidth="2.8" strokeLinecap="round" />
  </svg>
);

const PersonGlyph = () => (
  <svg viewBox="0 0 16 16" className="h-[12px] w-[12px]" aria-hidden="true">
    <circle cx="8" cy="5.8" r="3" fill="currentColor" />
    <path d="M2.5 14c.8-2.6 3-4 5.5-4s4.7 1.4 5.5 4" fill="currentColor" />
  </svg>
);

function ToastLeading({ color, action }: { color: ToastColor; action?: ToastAction }) {
  if (action === "login") {
    return (
      <span className="flex size-[22px] shrink-0 items-center justify-center rounded-full bg-background-500 text-inverse">
        <PersonGlyph />
      </span>
    );
  }

  if (color === "blue") {
    // 축하·환영 등 좋은 소식: 마스코트
    return <img src={MASCOT_SRC} alt="" aria-hidden="true" className="motion-mascot-hop -my-[3px] size-[28px] shrink-0" />;
  }

  const dotClass: Record<Exclude<ToastColor, "blue">, string> = {
    green: "bg-brand",
    red: "bg-category-welfare",
    yellow: "bg-warning",
  };

  return (
    <span className={`flex size-[22px] shrink-0 items-center justify-center rounded-full text-inverse ${dotClass[color]}`}>
      {color === "green" ? <CheckGlyph /> : <BangGlyph />}
    </span>
  );
}

const joinClassNames = (...classNames: Array<string | false | undefined>) =>
  classNames.filter(Boolean).join(" ");

const MAX_TOAST_COUNT = 5;
const TOAST_DURATION_MS = 2400;
const TOAST_WITH_ACTION_DURATION_MS = 4000;
const TOAST_EXIT_MS = 220;

let nextToastId = 0;
let toastRoot: Root | null = null;
let toastRootElement: HTMLDivElement | null = null;
let toasts: ToastItem[] = [];

const toastTimers = new Map<
  number,
  Array<ReturnType<typeof window.setTimeout>>
>();

function ensureToastRoot() {
  if (typeof document === "undefined") {
    return;
  }

  if (!toastRootElement) {
    toastRootElement = document.createElement("div");
    toastRootElement.id = "bodeum-toast-root";
    document.body.appendChild(toastRootElement);
    toastRoot = createRoot(toastRootElement);
  }
}

function renderToastRoot() {
  ensureToastRoot();
  toastRoot?.render(<ToastViewport toasts={toasts} onClose={closeToast} />);
}

function clearToastTimers(id: number) {
  const timers = toastTimers.get(id);

  if (timers) {
    timers.forEach((timer) => window.clearTimeout(timer));
    toastTimers.delete(id);
  }
}

function removeToast(id: number) {
  clearToastTimers(id);
  toasts = toasts.filter((toast) => toast.id !== id);
  renderToastRoot();
}

function closeToast(id: number) {
  clearToastTimers(id);
  toasts = toasts.map((toast) =>
    toast.id === id ? { ...toast, status: "closing" } : toast,
  );
  renderToastRoot();

  const removeTimer = window.setTimeout(() => {
    removeToast(id);
  }, TOAST_EXIT_MS);

  toastTimers.set(id, [removeTimer]);
}

export function showToast(color: ToastColor, message: string, options: ToastOptions = {}) {
  const id = nextToastId + 1;
  nextToastId = id;

  const overflowCount = Math.max(0, toasts.length - (MAX_TOAST_COUNT - 1));
  const removedToasts = toasts.slice(0, overflowCount);

  removedToasts.forEach((toast) => clearToastTimers(toast.id));

  toasts = [
    ...toasts.slice(overflowCount),
    {
      id,
      color,
      message,
      action: options.action,
      status: "entering",
    },
  ];
  renderToastRoot();

  const enterTimer = window.setTimeout(() => {
    toasts = toasts.map((toast) =>
      toast.id === id ? { ...toast, status: "visible" } : toast,
    );
    renderToastRoot();
  }, 20);

  const durationTimer = window.setTimeout(() => {
    closeToast(id);
  }, options.action ? TOAST_WITH_ACTION_DURATION_MS : TOAST_DURATION_MS);

  toastTimers.set(id, [enterTimer, durationTimer]);

  return id;
}

function ToastViewport({
  toasts,
  onClose,
}: {
  toasts: ToastItem[];
  onClose: (id: number) => void;
}) {
  return (
    <div className="pointer-events-none fixed inset-x-0 bottom-[calc(80px+env(safe-area-inset-bottom))] z-toast flex flex-col-reverse items-center gap-[8px] px-[16px] lg:bottom-[40px]">
      {toasts.map((toast) => (
        <ToastCard
          key={toast.id}
          color={toast.color}
          message={toast.message}
          action={toast.action}
          status={toast.status}
          onClose={() => onClose(toast.id)}
        />
      ))}
    </div>
  );
}

function runAction(action: ToastAction) {
  if (action === "login") {
    window.location.assign(`${import.meta.env.BASE_URL.replace(/\/$/, "")}/auth`);
    return;
  }

  action.onClick();
}

// 다크 플로팅 토스트: 글자 길이만큼만 차는 남색 캡슐, 닫기 버튼 없이 자동으로 사라짐
function ToastCard({
  color,
  message,
  action,
  onClose,
  status,
}: ToastProps & {
  action?: ToastAction;
  status: ToastAnimationStatus;
  onClose: () => void;
}) {
  const actionLabel = action === "login" ? "로그인" : action?.label;

  return (
    <div
      role={color === "red" ? "alert" : "status"}
      data-color={color}
      onClick={action ? undefined : onClose}
      className={joinClassNames(
        "pointer-events-auto flex max-w-[min(480px,100%)] items-center gap-[10px] rounded-xl bg-surface-inverse/94 py-[12px] pl-[14px] text-inverse shadow-toast backdrop-blur-[12px]",
        actionLabel ? "pr-[8px]" : "cursor-pointer pr-[18px]",
        "transition-[opacity,translate,scale] duration-[220ms] ease-[cubic-bezier(0.22,1,0.36,1)] will-change-transform motion-reduce:translate-y-0 motion-reduce:scale-100",
        status === "visible"
          ? "translate-y-0 scale-100 opacity-100"
          : status === "closing"
            ? "translate-y-[8px] scale-[0.98] opacity-0"
            : "translate-y-[12px] scale-[0.96] opacity-0",
      )}
    >
      <ToastLeading color={color} action={action} />

      <p className="min-w-0 break-keep text-[14px] font-semibold leading-[20px] tracking-[-0.01em] sm:text-[15px]">
        {message}
      </p>

      {action && actionLabel && (
        <button
          type="button"
          onClick={() => {
            onClose();
            runAction(action);
          }}
          className="ml-[2px] shrink-0 cursor-pointer rounded-md px-[10px] py-[6px] text-[14px] font-bold text-brand-muted transition-colors hover:bg-surface/10 focus-visible:outline focus-visible:outline-2 focus-visible:outline-brand-muted"
        >
          {actionLabel}
        </button>
      )}
    </div>
  );
}

export default function Toast({ color, message }: ToastProps) {
  const toastIds = useRef<Set<number>>(new Set());

  useEffect(() => {
    const id = showToast(color, message);
    toastIds.current.add(id);
  }, [color, message]);

  useEffect(() => {
    const currentToastIds = toastIds.current;

    return () => {
      currentToastIds.forEach((id) => removeToast(id));
      currentToastIds.clear();
    };
  }, []);

  return null;
}
