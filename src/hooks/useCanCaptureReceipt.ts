import { useEffect, useState } from "react";

/** 영수증 촬영 흐름을 열 수 있는 기기인지 (모바일·태블릿 = 터치 기기 또는 1024px 미만) */
const QUERY = "(pointer: coarse), (max-width: 1023px)";

export function useCanCaptureReceipt() {
  const [canCapture, setCanCapture] = useState(
    () => typeof window !== "undefined" && window.matchMedia(QUERY).matches,
  );

  useEffect(() => {
    const media = window.matchMedia(QUERY);
    const update = () => setCanCapture(media.matches);
    update();
    media.addEventListener("change", update);
    return () => media.removeEventListener("change", update);
  }, []);

  return canCapture;
}
