import { useCallback, useEffect, useRef, useState } from "react";

const prefersReducedMotion = () =>
  typeof window !== "undefined" &&
  window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;

/**
 * open=false 가 되어도 닫힘 애니메이션 동안 잠깐 더 그려 두기 위한 훅.
 * isClosing 일 때 data-closing="true" 를 붙이면 motion-* 클래스가 닫힘 모션을 재생한다.
 */
export function usePresence(open: boolean, exitMs = 200) {
  const [mounted, setMounted] = useState(open);

  if (open && !mounted) setMounted(true);

  useEffect(() => {
    if (open || !mounted) return;
    const timer = window.setTimeout(
      () => setMounted(false),
      prefersReducedMotion() ? 120 : exitMs,
    );
    return () => window.clearTimeout(timer);
  }, [open, mounted, exitMs]);

  return { isMounted: open || mounted, isClosing: !open && mounted };
}

/**
 * 부모가 조건부로 렌더링하는 시트·모달용: 닫기를 누르면 닫힘 모션을 먼저 보여준 뒤 onClose 호출.
 */
export function useDelayedClose(onClose: () => void, exitMs = 200) {
  const [isClosing, setIsClosing] = useState(false);
  const onCloseRef = useRef(onClose);
  const timerRef = useRef<number | null>(null);

  useEffect(() => {
    onCloseRef.current = onClose;
  }, [onClose]);

  useEffect(
    () => () => {
      if (timerRef.current !== null) window.clearTimeout(timerRef.current);
    },
    [],
  );

  const close = useCallback(() => {
    if (timerRef.current !== null) return;
    setIsClosing(true);
    timerRef.current = window.setTimeout(
      () => {
        timerRef.current = null;
        onCloseRef.current();
      },
      prefersReducedMotion() ? 120 : exitMs,
    );
  }, [exitMs]);

  return { isClosing, close };
}
