import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import svgr from "vite-plugin-svgr";
import tsconfigPaths from "vite-tsconfig-paths";

// 데모 목업 모드: VITE_USE_MOCK=true 이거나, Vercel에서 demo/ 로 시작하는 브랜치를 빌드할 때만 켜집니다.
// 그 외(운영·다른 브랜치) 빌드에서는 항상 꺼져 있어 실제 API를 그대로 사용합니다.
const buildEnv =
  (globalThis as { process?: { env: Record<string, string | undefined> } }).process?.env ?? {};
const useMock =
  buildEnv.VITE_USE_MOCK === "true" ||
  (buildEnv.VERCEL_GIT_COMMIT_REF ?? "").startsWith("demo/");

export default defineConfig({
  plugins: [react(), tailwindcss(), svgr(), tsconfigPaths(),],
  define: {
    "import.meta.env.VITE_USE_MOCK": JSON.stringify(useMock ? "true" : "false"),
  },
})
