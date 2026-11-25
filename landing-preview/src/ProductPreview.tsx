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
type CapturedScreen = Exclude<Screen, 'ai'>;
const shortcuts = [
  { screen: 'ai', top: 27.3 },
  { screen: 'info', top: 36.6 },
  { screen: 'news', top: 46.0 },
  { screen: 'community', top: 55.4 },
] as const;

function ScreenImage({ screen }: { screen: CapturedScreen }) {
  return <img className="product-capture" src={reviewAsset('demo-' + screen + '.webp')}
    alt={'보듬보듬 ' + demos[screen].label + ' 화면'} loading="lazy" />;
}

function DemoLink({ screen }: { screen: FeatureScreen }) {
  const demo = demos[screen];
  return <a className="product-link" href={new URL(demo.path, serviceUrl).href}>{demo.label} 데모 열기</a>;
}

function ChatDemoLink() {
  return <div className="product-chat-link"><DemoLink screen="ai" /></div>;
}

function HomePreview() {
  const [screen, setScreen] = useState<Screen>('home');
  const controls = useRef<HTMLDivElement>(null);
  function selectHotspot(next: FeatureScreen) {
    setScreen(next);
    controls.current?.querySelector<HTMLButtonElement>('[data-preview="' + next + '"]')?.focus({ preventScroll: true });
  }
  return <div className="product-preview">
    <figure className="product product-home">
      <figcaption><strong>보듬보듬</strong></figcaption>
      <div className="product-viewport" aria-live="polite">
        {screen === 'home' ? <div className="home-capture">
          <ScreenImage screen="home" />
          {shortcuts.map(item => <button className="screenshot-hotspot" type="button" key={item.screen} style={{ top: item.top + '%' }}
            aria-label={demos[item.screen].label + ' 화면 미리보기'} onClick={() => selectHotspot(item.screen)} />)}
          <button className="screenshot-hotspot screenshot-categories" type="button" aria-label="정보 분류 미리보기" onClick={() => selectHotspot('info')} />
        </div> : screen === 'ai' ? <ChatDemoLink /> : <ScreenImage screen={screen} />}
      </div>
    </figure>
    <div ref={controls} className="product-preview-tabs" role="group" aria-label="제품 화면 미리보기">
      {(['home', 'info', 'ai', 'news', 'community'] as const).map(item => <button type="button" key={item} data-preview={item}
        aria-pressed={screen === item} onClick={() => setScreen(item)}>{demos[item].label}</button>)}
    </div>
    <nav className="product-links" aria-label="기능별 실제 데모 바로가기">
      <DemoLink screen="info" /><DemoLink screen="ai" /><DemoLink screen="news" /><DemoLink screen="community" />
    </nav>
  </div>;
}

export function ProductPreview({ screen }: { screen: Screen }) {
  if (screen === 'home') return <HomePreview />;
  return <div className="product-preview">
    <figure className={'product product-' + screen}>
      <figcaption><strong>보듬보듬</strong></figcaption>
      <div className="product-viewport">{screen === 'ai' ? <ChatDemoLink /> : <ScreenImage screen={screen} />}</div>
    </figure>
    {screen !== 'ai' && <div className="product-links"><DemoLink screen={screen} /></div>}
  </div>;
}
