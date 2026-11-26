import { useCallback, useRef } from "react";

/**
 * 마우스 휠(세로)로 가로 스크롤 영역을 넘길 수 있게 한다.
 * - 트랙패드 가로 제스처는 그대로 둔다.
 * - 끝에 닿으면 페이지 세로 스크롤로 자연스럽게 넘긴다.
 * 콜백 ref라서 조건부로 렌더되는 요소에도 붙는다.
 */
export function useHorizontalWheel<T extends HTMLElement>() {
  const cleanup = useRef<(() => void) | null>(null);

  return useCallback((el: T | null) => {
    cleanup.current?.();
    cleanup.current = null;
    if (!el) return;

    const onWheel = (event: WheelEvent) => {
      if (event.ctrlKey) return;
      if (Math.abs(event.deltaX) >= Math.abs(event.deltaY)) return;
      if (el.scrollWidth <= el.clientWidth + 1) return;

      const atStart = el.scrollLeft <= 0;
      const atEnd = el.scrollLeft + el.clientWidth >= el.scrollWidth - 1;
      if ((event.deltaY < 0 && atStart) || (event.deltaY > 0 && atEnd)) return;

      event.preventDefault();
      const delta = event.deltaMode === 1 ? event.deltaY * 16 : event.deltaY;
      el.scrollBy({ left: delta, behavior: Math.abs(delta) >= 40 ? "smooth" : "auto" });
    };

    el.addEventListener("wheel", onWheel, { passive: false });
    cleanup.current = () => el.removeEventListener("wheel", onWheel);
  }, []);
}
