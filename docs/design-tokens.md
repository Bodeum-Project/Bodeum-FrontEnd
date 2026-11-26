# 보듬보듬 디자인 토큰

모든 토큰은 `src/index.css` 한 파일에 있습니다. 색이나 크기를 바꿀 때는 이 파일만 고치면 전체 화면에 반영됩니다.

## 새 화면을 만들 때 규칙

1. **의미 토큰만 씁니다.** `text-primary`, `bg-surface-subtle`, `border-default`, `bg-brand`처럼 역할 이름을 씁니다. `#2A3546` 같은 hex, `rgb(...)`, `bg-white`는 쓰지 않습니다.
2. **예전 이름은 쓰지 않습니다.** `main-*`, `background-*`, `accent-*`, `sub-*`는 별칭으로 남아 있을 뿐입니다. 개발 코드와 합친 뒤 지웁니다.
3. **공통 컴포넌트를 먼저 찾습니다.** 모달은 `Modal`/`CloseModalFrame`, 목록 위 필터는 `ListToolbar`, 탭은 `TextTabs`/`SegmentedTabs`, 알림은 `showToast`, 로딩은 `Skeleton`을 씁니다.
4. **같은 속성 클래스를 한 요소에 두 개 붙이지 않습니다.** Tailwind는 클래스를 쓴 순서가 아니라 CSS 안의 순서(대부분 이름순)로 이깁니다. 예를 들어 `rounded-xs rounded-full`은 `rounded-xs`가 이깁니다. 바꿀 값은 삼항식으로 하나만 붙이세요.
   ```tsx
   // X  기본값 + 덮어쓰기
   className={`bg-surface ${active ? "bg-brand-soft" : ""}`}
   // O  하나만
   className={active ? "bg-brand-soft" : "bg-surface"}
   ```
5. **움직임은 `motion-*`, 눌림은 `press`/`press-sm`** 클래스를 씁니다. 직접 `animation`을 쓰지 않습니다.

## 구조

| 단계 | 어디에 | 예 | 컴포넌트에서 |
| --- | --- | --- | --- |
| 1. 원시값 | `:root`의 `--palette-*` | `--palette-mint-500: #1BB8BC` | 쓰지 않음 (클래스도 안 생김) |
| 2. 의미 토큰 | `@theme` | `--color-brand`, `--text-color-primary` | 씀 (`bg-brand`, `text-primary`) |
| 3. 컴포넌트 토큰 | `@utility` | `btn-primary`, `toast-surface`, `modal-backdrop` | 씀 |

## 색

### 브랜드·CTA

| 클래스 | 값 | 용도 |
| --- | --- | --- |
| `bg-brand` `text-brand` `border-brand` | #1BB8BC | 포인트, 민트 버튼, 선택 테두리 |
| `*-brand-strong` | #0E9198 | 민트 글자 강조, 눌림 |
| `*-brand-muted` | #8FDCDF | 연한 민트 선·포커스 |
| `*-brand-tint` | #DDF3F4 | 민트 아이콘 바탕 |
| `*-brand-soft` | #E9F7F8 | 선택된 칩·메뉴 바탕 |
| `bg-cta` `border-cta` | #2A3546 | 다크 버튼, 선택된 탭 밑줄 |
| `bg-cta-hover` | #3B475B | 다크 버튼 호버 |

### 글자

| 클래스 | 값 | 용도 |
| --- | --- | --- |
| `text-primary` | #2A3546 | 제목, 본문 강조 |
| `text-secondary` | #566173 | 본문 |
| `text-tertiary` | #6B7689 | 보조, 메타 |
| `text-disabled` | #A4AEBC | 비활성, 플레이스홀더 |
| `text-inverse` | #FFFFFF | 어두운 바탕 위 |

### 바탕

| 클래스 | 값 | 용도 |
| --- | --- | --- |
| `bg-surface` | #FFFFFF | 기본 바탕, 카드 |
| `bg-surface-subtle` | #F5F7FA | 회색 카드, 입력창, 툴바, 호버 |
| `bg-surface-muted` | #EAEDF2 | 회색 버튼 바탕 |
| `bg-surface-hero` | #F0FCFC | 홈 히어로 |
| `bg-surface-inverse` | #2A3546 | 다크 표면 (토스트는 `toast-surface`) |
| `bg-state-hover` | #DFE3EA | 회색 버튼 호버 |
| `bg-state-pressed` | #D6DBE3 | 회색 버튼 눌림 |
| `bg-skeleton` | #EEF1F5 | 로딩 뼈대 |

### 테두리

| 클래스 | 값 | 용도 |
| --- | --- | --- |
| `border-default` `divide-default` | #EAEDF2 | 구분선, 카드 테두리 |
| `border-strong` | #B3BBC8 | 진한 테두리 (선택 전 체크박스 등) |

### 상태·분류

| 클래스 | 값 | 용도 |
| --- | --- | --- |
| `*-danger` / `*-danger-soft` | #F04452 / #FFEEF0 | 삭제, 신고, 오류 |
| `*-danger-muted` | #F4707E | 부드러운 경고 (토스트 점) |
| `*-warning` | #F5A524 | 주의 (토스트 점) |
| `*-like` / `*-like-soft` | #F04452 / #FFEEF0 | 좋아요 하트 |
| `*-category-agency` (+ `-soft`) | #3182F6 / #E8F3FF | 기관 |
| `*-category-hospital` (+ `-soft`) | #23A97B / #E4F8EE | 병원 |
| `*-category-welfare` (+ `-soft`) | #F4707E / #FFEFF1 | 복지 |
| `*-category-job` (+ `-soft`) | #7B61FF / #F1EEFF | 취업 |
| `*-category-edu` (+ `-soft`) | #FF7A1A / #FFF1E6 | 교육 |
| `*-tag-recruit` (+ `-soft`) | #0EA345 / #F0FFF6 | 모집 중 딱지 |
| `*-tag-dday` (+ `-soft`) | #F04452 / #FFEEF0 | D-day 딱지 |

## 타이포

폰트는 `--font-sans` 하나입니다. Pretendard(CDN)가 없으면 Noto Sans KR(패키지)이 나옵니다. 굵기는 regular(400)·medium(500)·semibold(600)·bold(700)만 씁니다.

| 클래스 | 크기 / 행간 (px) | 굵기 | 용도 |
| --- | --- | --- | --- |
| `text-display` | 28 / 38 | bold | 홈 히어로 제목 (모바일은 `text-[24px]` 등으로 줄임) |
| `text-title-1` | 22 / 30 | bold | 페이지 제목 |
| `text-title-2` | 20 / 28 | bold | 섹션 제목 |
| `text-title-3` | 18 / 26 | semibold | 모달·시트 제목, 텍스트 탭 |
| `text-heading` | 16 / 24 | semibold | 카드 묶음 제목 |
| `text-body-1` | 15 / 22 | medium | 목록 카드 제목 |
| `text-body-2` | 14 / 21 | regular | 본문, 버튼, 토스트 |
| `text-body-3` | 13 / 19 | regular | 설명, 칩 |
| `text-caption` | 12 / 18 | regular | 지역·날짜 메타 |
| `text-micro` | 11 / 16 | medium | 배지, 개수 |

지금 화면에는 아직 예전 이름(`text-h3-onboard` 등 51개)과 `text-[14px]` 같은 숫자 113곳이 남아 있습니다. 1~2px이 바뀌기 때문에 12/1 제출 이후 4단계에서 위 10단계로 옮깁니다. 새 화면은 처음부터 위 10단계를 씁니다.

## 간격·라운드·그림자

**간격**은 Tailwind 기본 4px 단위(`p-4` = 16px, `gap-2.5` = 10px)를 씁니다. 레이아웃 값은 페이지 좌우 여백 모바일 16 / 데스크톱 48, 헤더 72, 목록 툴바 34~40입니다.

**라운드**: Tailwind 기본값을 덮어썼습니다.

| 클래스 | 값 | 용도 |
| --- | --- | --- |
| `rounded-xs` | 6px | 작은 딱지, 뼈대 |
| `rounded-sm` | 8px | 칩, 카테고리 딱지 |
| `rounded-md` | 10px | 작은 버튼, 드롭다운 |
| `rounded-lg` | 12px | 툴바 필터, 입력창, 버튼 |
| `rounded-xl` | 16px | 카드, 토스트 |
| `rounded-2xl` | 20px | 모달, 바텀시트 윗변, 배너 |
| `rounded-full` | | 알약 모양 |

**그림자**: 호버 그림자는 쓰지 않습니다.

| 클래스 | 용도 |
| --- | --- |
| `shadow-soft` | 카테고리 카드의 넓고 흐린 그림자 |
| `shadow-float` | 떠 있는 패널 |
| `shadow-toast` | 다크 토스트 |
| `shadow-bar` | 모바일 하단 탭바 위쪽 |

## 레이어 (z-index)

| 클래스 | 값 | 쓰는 곳 |
| --- | --- | --- |
| `z-10`, `z-20` | 10, 20 | 컴포넌트 안에서만 (카드 위 버튼 등) |
| `z-header` | 30 | 헤더 |
| `z-tabbar` | 40 | 모바일 하단 탭바 |
| `z-overlay` | 50 | 검색 결과 드롭다운, 모바일 메뉴, `CloseModalFrame` 시트 |
| `z-modal` | 60 | `Modal`, 확인 모달 배경 |
| `z-modal-nested` | 70 | 모달 위 확인 창 |
| `z-modal-top` | 80 | 신고·차단 시트 |
| `z-picker` | 90 | 지역·카테고리 선택 시트 |
| `z-toast` | 9999 | 토스트 |

## 모션

모든 움직임은 `src/index.css` 맨 아래 `motion-*` 클래스와 `--motion-*` 변수로 합니다. 움직임 줄이기 설정이면 전부 짧은 페이드로 바뀝니다.

| 토큰 | 값 | 용도 |
| --- | --- | --- |
| `--motion-fast` | 120ms | 눌림, 색 변화 |
| `--motion-base` | 200ms | 모달 등장, 페이지, 탭 |
| `--motion-slow` | 280ms | 바텀시트 등장 |
| `ease-out-soft` | cubic-bezier(0.22, 1, 0.36, 1) | 등장 |
| `ease-standard` | cubic-bezier(0.4, 0, 0.2, 1) | 상태 변화 |

| 클래스 | 붙이는 곳 |
| --- | --- |
| `motion-backdrop` + `motion-pop` / `motion-sheet` | 모달 배경 + 가운데 모달 / 바텀시트 (닫을 때 `data-closing="true"`) |
| `motion-stagger` | 목록 컨테이너 (카드가 40ms씩 순서대로 떠오름) |
| `motion-page` | 페이지 본문 |
| `motion-drop` | 드롭다운 |
| `motion-collapse` | 접고 펴는 영역 (`data-open="true"`) |
| `press` / `press-sm` | 누를 수 있는 카드 / 작은 버튼·칩 |

## 컴포넌트 토큰

| 컴포넌트 | 토큰 |
| --- | --- |
| 민트 버튼 | `btn-primary` (`bg-brand` + 가장자리 흰 광택, 호버 밝게, 눌림 0.98) |
| 다크 버튼 | `btn-dark` (`bg-cta` + 광택) |
| 회색 버튼 | `bg-surface-muted text-secondary hover:bg-state-hover active:bg-state-pressed` |
| 모달·시트 배경 | `modal-backdrop` (네이비 28% + 블러 4px) |
| 모달 (`Modal`) | `z-modal`, 카드 `rounded-2xl`, `motion-pop` |
| 시트 (`CloseModalFrame`) | `z-overlay`, 모바일 윗변 `rounded-2xl`, 최대 너비 624px, 여백 20 / 44px, `motion-sheet` |
| 토스트 (`showToast`) | `toast-surface` (네이비 94% + 블러 12px + `shadow-toast` + `rounded-xl`). 종류: blue = 축하(마스코트), green = 성공(민트 체크), red = 오류(`danger-muted` 느낌표), yellow = 주의(`warning` 느낌표) |
| 목록 툴바 (`ListToolbar`) | 높이 34, `rounded-full`, 선택 `bg-brand-soft text-brand-strong`, 기본 `border-default bg-surface` |
| 텍스트 탭 (`TextTabs`) | 18 / 26px, 선택 `text-primary` + 밑줄 2px `bg-cta`, 기본 `text-tertiary` |
| 세그먼트 탭 (`SegmentedTabs`) | 바탕 `bg-surface-subtle`, 선택 칸 `bg-surface`, 그림자 없음 |
| 카드 (`BaseInfoCard` 등) | `rounded-xl border-default bg-surface`, 호버 시 제목 `text-brand-strong` 또는 바탕 `bg-surface-subtle`, `press` |
| 로딩 (`Skeleton`) | `skeleton` (바탕 `bg-skeleton` + 흰 빛 1.4초) |

## 예전 이름에서 옮기기

`scripts/migrate-tokens.mjs`가 예전 이름을 값이 똑같은 의미 토큰으로 바꿉니다. 개발 코드와 합친 뒤 한 번 더 돌리면 됩니다.

```bash
node scripts/migrate-tokens.mjs --dry   # 바뀔 개수만 보기
node scripts/migrate-tokens.mjs         # 바꾸기
```

| 예전 | 새 이름 |
| --- | --- |
| `text-background-600` / `500` / `400` / `100` | `text-primary` / `secondary` / `tertiary` / `inverse` |
| `bg-background-100` / `200` / `250`, `bg-main-100` | `bg-surface` / `surface-subtle` / `surface-muted`, `bg-surface-subtle` |
| `border-background-250` / `300` | `border-default` / `border-strong` |
| `*-main-400` / `500` / `300` / `200` / `150` | `*-brand` / `brand-strong` / `brand-muted` / `brand-tint` / `brand-soft` |
| `bg-accent-900`, `bg-background-600` | `bg-cta` |
| `*-sub-blue/mint/pink/purple/orange` (정보 카테고리) | `*-category-agency/hospital/welfare/job/edu` |
| `*-sub-red` | `*-danger` (좋아요는 `*-like`, D-day는 `*-tag-dday`) |
| `rounded-[6/8/10/12/16/20px]` | `rounded-xs/sm/md/lg/xl/2xl` |
| `z-30/40/50`, `z-[60/70/80/90/9999]` | `z-header/tabbar/overlay`, `z-modal/modal-nested/modal-top/picker/toast` |

## 남은 정리 (4단계, 12/1 제출 이후)

화면이 1~2px 바뀌는 작업이라 확인을 받고 진행합니다.

- 타이포: 예전 이름 51개와 `text-[Npx]` 113곳을 10단계로.
- 라운드: 3·4·5·9·14·18·24px 등 남은 값 37곳을 7단계로.
- 그림자: 남은 `shadow-[...]` 13곳을 4개로.
- 하드코딩 색: hex 22곳, rgb 10곳 (카카오 로그인 노랑처럼 남겨야 하는 것 제외).
- 버튼 5종(`MainButton`, `ButtonFill`, `ButtonOutline`, `OnboardButton`, 모달 버튼)을 `Button` 하나로 합치고 `!important` 80곳을 없앰.
- 온보딩(`OnboardBoxFrame`)의 예전 색 이름 112곳, 그 밖 41곳.
- 정의 없이 쓰이는 `bg-background-150`, `text-background-700`, `text-h5`를 고침 (지금은 아무 색도 안 나옴).
- 노랑(`sub-yellow`)을 AI 답변 말풍선·온보딩에서 뺄지 결정.
- 브랜드 민트를 #1BB8BC 하나로: 히어로 블러 원(#28BDC0)과 그림자 한 곳(#17B5C0).
- 별칭(`main-*`, `background-*`, `accent-*`, `sub-*`, 예전 타이포) 삭제.
