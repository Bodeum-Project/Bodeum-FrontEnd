#!/usr/bin/env node
/**
 * 디자인 토큰 이름 일괄 치환 (예전 이름 → 의미 토큰)
 *
 * 사용법:  node scripts/migrate-tokens.mjs          # src/ 전체 치환
 *          node scripts/migrate-tokens.mjs --dry    # 바뀔 개수만 출력
 *
 * 값이 정확히 같은 것만 바꿉니다. 그래서 돌린 뒤에도 화면은 그대로여야 합니다.
 * 개발자 코드와 합친 뒤 한 번 더 돌리면 새로 들어온 예전 이름도 정리됩니다.
 * 규칙에 없는 예전 이름(온보딩 색 등)은 index.css 의 '별칭'으로 계속 동작합니다.
 */
import { readFileSync, writeFileSync, readdirSync, statSync } from "node:fs";
import { join, relative } from "node:path";

const ROOT = new URL("../src/", import.meta.url).pathname;
const DRY = process.argv.includes("--dry");

// 4단계(버튼 통합)에서 통째로 다시 짤 파일이라 지금은 건드리지 않음
const SKIP = ["components/OnboardBoxFrame.tsx"];

// [속성 접두어들, 예전 이름, 새 이름]
const COLOR_RULES = [
  // 글자
  [["text"], "background-600", "primary"],
  [["text"], "background-500", "secondary"],
  [["text"], "background-400", "tertiary"],
  [["text"], "background-100", "inverse"],
  [["text"], "white", "inverse"],
  [["text"], "[#A4AEBC]", "disabled"],
  // 배경
  [["bg"], "background-100", "surface"],
  [["bg"], "white", "surface"],
  [["bg"], "background-200", "surface-subtle"],
  [["bg"], "main-100", "surface-subtle"],
  [["bg"], "background-250", "surface-muted"],
  [["bg"], "[#F0FCFC]", "surface-hero"],
  [["bg"], "[#DFE3EA]", "state-hover"],
  [["bg"], "[#D6DBE3]", "state-pressed"],
  [["bg"], "[rgb(42_53_70_/_0.94)]", "surface-inverse/94"],
  [["bg"], "background-600", "cta"],
  [["bg"], "accent-900", "cta"],
  [["bg"], "[#F5A524]", "warning"],
  // 테두리·구분선
  [["border", "border-t", "border-b", "border-l", "border-r", "border-x", "border-y", "divide"], "background-250", "default"],
  [["border", "border-t", "border-b", "border-l", "border-r", "border-x", "border-y"], "background-300", "strong"],
  [["border", "border-t", "border-b", "outline"], "background-600", "cta"],
  // 브랜드 (모든 속성)
  [["text", "bg", "border", "border-t", "border-b", "outline", "ring", "fill", "stroke", "decoration"], "main-400", "brand"],
  [["text", "bg", "border", "border-t", "border-b", "outline", "ring", "fill", "stroke", "decoration"], "main-500", "brand-strong"],
  [["text", "bg", "border", "outline", "ring"], "main-300", "brand-muted"],
  [["text", "bg", "border", "outline", "ring"], "main-200", "brand-tint"],
  [["text", "bg", "border", "outline", "ring"], "main-150", "brand-soft"],
  // 정보 카테고리
  ...["text", "bg"].flatMap((p) => [
    [[p], "sub-blue", "category-agency"], [[p], "sub-blue-2", "category-agency-soft"],
    [[p], "sub-purple", "category-job"], [[p], "sub-purple-2", "category-job-soft"],
    [[p], "sub-orange", "category-edu"], [[p], "sub-orange-2", "category-edu-soft"],
    [[p], "sub-pink", "category-welfare"], [[p], "sub-pink-2", "category-welfare-soft"],
  ]),
  // 삭제·신고·오류
  [["text", "bg", "border"], "sub-red", "danger"],
  [["text", "bg", "border"], "sub-red-2", "danger-soft"],
];

// 파일별로 의미가 정해지는 색 (같은 값이라도 다른 역할)
const FILE_RULES = {
  "constants/infoCategory.ts": [
    [/(?<![\w-])(text|bg)-sub-mint-2(?![\w-])/g, "$1-category-hospital-soft"],
    [/(?<![\w-])(text|bg)-sub-mint(?![\w-])/g, "$1-category-hospital"],
  ],
  "components/Chips.tsx": [
    [/(?<![\w-])(text|bg)-danger-soft(?![\w-])/g, "$1-tag-dday-soft"],
    [/(?<![\w-])(text|bg)-danger(?![\w-])/g, "$1-tag-dday"],
    [/(?<![\w-])(text|bg)-sub-green-2(?![\w-])/g, "$1-tag-recruit-soft"],
    [/(?<![\w-])(text|bg)-sub-green(?![\w-])/g, "$1-tag-recruit"],
  ],
  "components/post-stat/ToggleStat.tsx": [
    [/(?<![\w-])text-danger-soft(?![\w-])/g, "text-like-soft"],
    [/(?<![\w-])text-danger(?![\w-])/g, "text-like"],
  ],
};

// 라운드: 값이 같은 것만 (rounded-[10px] → rounded-md)
const RADIUS = { 6: "xs", 8: "sm", 10: "md", 12: "lg", 16: "xl", 20: "2xl" };

// 그림자: 값이 같은 것만
const SHADOW_RULES = [
  ["shadow-[0_8px_100px_rgb(180_207_207_/_0.2)]", "shadow-soft"],
  ["shadow-[0_8px_24px_rgb(30_40_60_/_0.14)]", "shadow-float"],
  ["shadow-[0_10px_30px_rgb(42_53_70_/_0.18)]", "shadow-toast"],
  ["shadow-[0_-4px_20px_rgb(20_23_31_/_0.06)]", "shadow-bar"],
];

// 레이어
const Z_RULES = [
  ["z-[9999]", "z-toast"], ["z-[90]", "z-picker"], ["z-[80]", "z-modal-top"],
  ["z-[70]", "z-modal-nested"], ["z-[60]", "z-modal"], ["z-50", "z-overlay"],
  ["z-40", "z-tabbar"], ["z-30", "z-header"],
];

const esc = (s) => s.replace(/[.*+?^${}()|[\]\\/]/g, "\\$&");
const word = (s) => new RegExp(`(?<![\\w\\-\\[])${esc(s)}(?![\\w\\-])`, "gi");

const RULES = [];
for (const [prefixes, from, to] of COLOR_RULES) {
  for (const p of prefixes) RULES.push([word(`${p}-${from}`), `${p}-${to}`]);
}
for (const [px, name] of Object.entries(RADIUS)) {
  RULES.push([new RegExp(`(?<![\\w-])rounded(-(?:t|b|l|r|tl|tr|bl|br|s|e|ss|se|es|ee))?-\\[${px}px\\](?![\\w-])`, "g"), `rounded$1-${name}`]);
}
for (const [from, to] of SHADOW_RULES) RULES.push([word(from), to]);
for (const [from, to] of Z_RULES) RULES.push([word(from), to]);

function walk(dir) {
  return readdirSync(dir).flatMap((f) => {
    const p = join(dir, f);
    return statSync(p).isDirectory() ? walk(p) : /\.(tsx?|jsx?)$/.test(f) ? [p] : [];
  });
}

let total = 0;
for (const file of walk(ROOT)) {
  const rel = relative(ROOT, file);
  if (SKIP.includes(rel)) continue;
  let src = readFileSync(file, "utf8");
  let count = 0;
  for (const [re, to] of [...RULES, ...(FILE_RULES[rel] ?? [])]) {
    src = src.replace(re, (...m) => {
      count++;
      return to.replace(/\$(\d)/g, (_, i) => m[+i] ?? "");
    });
  }
  if (count) {
    total += count;
    console.log(`${String(count).padStart(4)}  ${rel}`);
    if (!DRY) writeFileSync(file, src);
  }
}
console.log(`${DRY ? "[dry] " : ""}바뀐 곳 ${total}`);
