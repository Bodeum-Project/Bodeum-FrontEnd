/**
 * 데모(증빙 캡처)용 목업 모드.
 * VITE_USE_MOCK=true 로 빌드했을 때만 켜지며, 켜지면 모든 API 요청을
 * 서버로 보내지 않고 src/mocks 의 샘플 데이터로 응답합니다.
 * 운영 빌드에서는 이 값이 false 로 고정되어 목업 코드가 번들에서 제거됩니다.
 */
export const IS_MOCK_MODE = import.meta.env.VITE_USE_MOCK === "true";
