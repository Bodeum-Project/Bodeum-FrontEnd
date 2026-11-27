import { useRef, useState } from 'react';
import { reviewAsset, serviceUrl } from './content';

const demos = {
  home: { label: '홈', path: '/' },
  info: { label: '정보', path: '/info' },
  ai: { label: 'AI 챗봇', path: '/aichat' },
  news: { label: '소식', path: '/news' },
  community: { label: '커뮤니티', path: '/community' },
} as const;
type Screen = keyof typeof demos;
type FeatureScreen = Exclude<Screen, 'home'>;
const shortcuts = [
  { screen: 'ai', top: 27.3 },
  { screen: 'info', top: 36.6 },
  { screen: 'news', top: 46.0 },
  { screen: 'community', top: 55.4 },
] as const;

/** PC에서는 데스크톱 화면, 모바일 폭에서는 모바일 화면 캡처를 보여줍니다 */
function ScreenImage({ screen }: { screen: Screen }) {
  return <picture>
    <source media="(width < 768px)" srcSet={reviewAsset('demo-' + screen + '-mobile.webp')} />
    <img className="product-capture" src={reviewAsset('demo-' + screen + '.webp')}
      alt={'보듬보듬 ' + demos[screen].label + ' 화면'} loading="lazy" />
  </picture>;
}

export function DemoLink({ screen }: { screen: Screen }) {
  const demo = demos[screen];
  return <a className="product-link" href={new URL(demo.path, serviceUrl).href}>
    {screen === 'home' ? '데모 둘러보기' : demo.label + ' 데모 열기'}
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true"><path d="m6 3.5 4.5 4.5L6 12.5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" /></svg>
  </a>;
}

function Frame({ screen, children }: { screen: Screen; children: React.ReactNode }) {
  return <figure className={'product product-' + screen}>
    <figcaption aria-hidden="true"><i /><i /><i /></figcaption>
    <div className="product-viewport" aria-live={screen === 'home' ? undefined : 'polite'}>{children}</div>
  </figure>;
}

function HomePreview() {
  const [screen, setScreen] = useState<Screen>('home');
  const controls = useRef<HTMLDivElement>(null);
  function selectHotspot(next: FeatureScreen) {
    setScreen(next);
    controls.current?.querySelector<HTMLButtonElement>('[data-preview="' + next + '"]')?.focus({ preventScroll: true });
  }
  return <div className="product-preview">
    <div ref={controls} className="product-preview-tabs" role="group" aria-label="제품 화면 미리보기">
      {(['home', 'info', 'ai', 'news', 'community'] as const).map(item => <button type="button" key={item} data-preview={item}
        aria-pressed={screen === item} onClick={() => setScreen(item)}>{demos[item].label}</button>)}
    </div>
    <Frame screen={screen}>
      {screen === 'home' ? <div className="home-capture">
        <ScreenImage screen="home" />
        {shortcuts.map(item => <button className="screenshot-hotspot" type="button" key={item.screen} style={{ top: item.top + '%' }}
          aria-label={demos[item.screen].label + ' 화면 미리보기'} onClick={() => selectHotspot(item.screen)} />)}
        <button className="screenshot-hotspot screenshot-categories" type="button" aria-label="정보 분류 미리보기" onClick={() => selectHotspot('info')} />
      </div> : <ScreenImage key={screen} screen={screen} />}
    </Frame>
    <div className="product-links"><DemoLink screen={screen} /></div>
  </div>;
}

export function ProductPreview({ screen }: { screen: Screen }) {
  if (screen === 'home') return <HomePreview />;
  return <div className="product-preview">
    <Frame screen={screen}><ScreenImage screen={screen} /></Frame>
    <div className="product-links"><DemoLink screen={screen} /></div>
  </div>;
}
