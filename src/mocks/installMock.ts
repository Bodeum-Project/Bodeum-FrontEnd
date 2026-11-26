import type { AxiosInstance } from "axios";

import { IS_MOCK_MODE } from "./isMockMode";

/** 목업 모드일 때만 axios 요청을 샘플 데이터 어댑터로 돌립니다. */
export function installMockAdapter(instance: AxiosInstance) {
  if (!IS_MOCK_MODE) return;

  instance.defaults.adapter = async (config) => {
    const { default: mockAdapter } = await import("./mockAdapter");
    return mockAdapter(config);
  };
}

const MOCK_LOGGED_OUT_KEY = "bodeum-mock-logged-out";

/** 데모 화면이 로그인 상태로 보이도록 가짜 토큰을 넣어 둡니다. */
export function seedMockSession() {
  if (!IS_MOCK_MODE) return;
  if (sessionStorage.getItem(MOCK_LOGGED_OUT_KEY)) return;
  if (localStorage.getItem("accessToken")) return;

  localStorage.setItem("tokenType", "Bearer");
  localStorage.setItem("accessToken", "mock-access-token");
  localStorage.setItem("refreshToken", "mock-refresh-token");
}

export function markMockLoggedOut() {
  if (IS_MOCK_MODE) sessionStorage.setItem(MOCK_LOGGED_OUT_KEY, "1");
}

export function clearMockLoggedOut() {
  if (IS_MOCK_MODE) sessionStorage.removeItem(MOCK_LOGGED_OUT_KEY);
}
