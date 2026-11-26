import axios from "axios";
import { IS_MOCK_MODE } from "@/mocks/isMockMode";
import { installMockAdapter } from "@/mocks/installMock";

const baseUrl =
  import.meta.env.VITE_BASE_URL || (IS_MOCK_MODE ? "https://mock.bodeum.local" : "");

if (!baseUrl) {
  throw new Error("VITE_BASE_URL이 설정되지 않았습니다.");
}

const refreshApi = axios.create({
  baseURL: baseUrl,
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

installMockAdapter(refreshApi);

export default refreshApi;