import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { createRoot } from 'react-dom/client';
import { commitments, features, guides, legalLinks, reviewAsset } from './content';
import { ProductPreview } from './ProductPreview';
import logo from './logo-bodeum.png';
import { LandingActions, LandingHeader } from './LandingHeader';
import { LaunchDialog } from './LaunchDialog';
import './v2-tokens.css';
import './landing.css';

function LandingPage({ onSubscribe }: { onSubscribe: () => void }) {
  useEffect(() => {
    if (!('IntersectionObserver' in window)) return;
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('revealed');
        observer.unobserve(entry.target);
      });
    }, { threshold: 0.12 });
    document.querySelectorAll('[data-reveal]').forEach(element => observer.observe(element));
    return () => observer.disconnect();
  }, []);

  return <main id="content" tabIndex={-1}>
      <section id="top" className="hero" aria-labelledby="hero-title">
        <div className="wrap hero-layout">
          <div className="hero-copy">
            <p className="label">아이와 보호자를 위한 복지 정보</p>
            <h1 id="hero-title">
              <span>아이를 위한 고민이</span>{' '}
              <span>하나쯤은 줄어들도록</span>
            </h1>
            <p>모든 고민을 대신할 수는 없지만, 필요한 정보를 찾는 일은 함께 하겠습니다</p>
            <LandingActions onSubscribe={onSubscribe} />
          </div>
          <img className="landing-photo hero-photo" src={reviewAsset('hero.webp')} alt="동네 공원에서 손잡고 걷는 아이와 보호자" fetchPriority="high" />
          <a className="scroll-link" href="#story"><span aria-hidden="true">↓</span> 우리의 이야기</a>
        </div>
      </section>

      <section id="story" className="section wrap" aria-labelledby="story-title">
        <div className="intro" data-reveal>
          <p className="label">우리의 이야기</p>
          <h2 id="story-title">아이에게 맞는 도움,<br />어디서부터 알아볼까요?</h2>
          <p>지원 제도부터 가까운 기관까지, 매번 처음부터 알아봐야 하는 일을 줄이고 싶었습니다</p>
        </div>
        <div className="story-grid" data-reveal>
          <article className="story-card">
            <svg viewBox="0 0 110 92" fill="none" aria-hidden="true">
              <rect x="21" y="20" width="52" height="60" rx="9" fill="#8fdcdf"/><rect x="29" y="11" width="49" height="61" rx="9" fill="white"/><path d="M40 29h24M40 39h19M40 49h13" stroke="#0e9198" strokeWidth="3.5" strokeLinecap="round"/><circle cx="75" cy="59" r="13" fill="#dff5f5" stroke="#0e9198" strokeWidth="4"/><path d="m85 69 9 9" stroke="#0e9198" strokeWidth="4" strokeLinecap="round"/>
            </svg>
            <div><h3>어떤 지원을 받을 수 있을까요?</h3><p>흩어진 복지 제도와 신청 조건을 한곳에서 살펴볼 수 있습니다</p></div>
          </article>
          <article className="story-card">
            <svg viewBox="0 0 110 92" fill="none" aria-hidden="true">
              <rect x="14" y="20" width="79" height="59" rx="15" fill="#c5e1fb"/><path d="M51 18a6 6 0 0 1 6 0l24 14c3 2 2 6-2 6H29c-4 0-5-4-2-6z" fill="#3182f6"/><rect x="34" y="44" width="8" height="23" rx="3" fill="#3182f6"/><rect x="50" y="44" width="8" height="23" rx="3" fill="#3182f6"/><rect x="66" y="44" width="8" height="23" rx="3" fill="#3182f6"/><rect x="28" y="69" width="53" height="7" rx="3.5" fill="#245f9f"/>
            </svg>
            <div><h3>어떤 기관을 찾아가면 좋을까요?</h3><p>아이에게 맞는 기관을 가까운 지역부터 찾아볼 수 있습니다</p></div>
          </article>
          <article className="story-card">
            <svg viewBox="0 0 110 92" fill="none" aria-hidden="true">
              <path d="M17 19h46a9 9 0 0 1 9 9v23a9 9 0 0 1-9 9H36L22 71V60h-5a9 9 0 0 1-9-9V28a9 9 0 0 1 9-9Z" fill="#f4b4bf"/><path d="M52 37h40a9 9 0 0 1 9 9v19a9 9 0 0 1-9 9h-4v10L75 74H52a9 9 0 0 1-9-9V46a9 9 0 0 1 9-9Z" fill="white"/><path d="M57 51h28M57 61h20" stroke="#b55369" strokeWidth="3.5" strokeLinecap="round"/>
            </svg>
            <div><h3>이 고민을 누구에게 물어볼까요?</h3><p>비슷한 고민을 해 본 보호자의 경험을 읽고 이야기를 나눌 수 있습니다</p></div>
          </article>
        </div>
        <p className="story-close" data-reveal>정보를 찾는 일이 또 하나의 고민이 되지 않도록</p>
      </section>

      <section className="section inverse" aria-labelledby="beginning-title">
        <div className="wrap intro" data-reveal>
          <h2 id="beginning-title">그래서 보듬보듬을 만들었어요</h2>
          <p>모든 고민에 답할 수는 없지만, 필요한 정보를 찾는 일은 더 쉬워질 수 있다고 생각했습니다</p>
          <p>복잡한 제도는 쉽게 풀고 흩어진 소식은 한곳에 모았습니다<br />비슷한 고민을 나눌 수 있는 공간도 마련했습니다</p>
          <div className="name-story">
            <p>아이를 보듬는 마음과,<br />그 마음을 보듬는 마음</p>
            <img className="name-story-logo" src={logo} alt="보듬보듬" data-reveal />
          </div>
        </div>
      </section>

      <section id="service" className="section subtle" aria-labelledby="service-title">
        <div className="wrap">
          <div className="intro" data-reveal>
            <p className="label">서비스 소개</p>
            <h2 id="service-title">필요한 정보를 한곳에서 만나보세요</h2>
            <p>복지 정보를 찾고, 궁금한 점을 묻고, 비슷한 경험을 나눌 수 있습니다</p>
          </div>
          <div className="overview-screen" data-reveal><ProductPreview screen="home" /></div>
        </div>
      </section>

      <section className="section wrap features" aria-label="핵심 기능">
        {features.map(feature => <article key={feature.id} id={`feature-${feature.id}`} className="feature" data-reveal>
          <div>
            <p className="label">{feature.label}</p>
            <h2>{feature.title[0]}<br />{feature.title[1]}</h2>
            <p>{feature.body}</p>
          </div>
          <ProductPreview screen={feature.id} />
        </article>)}
      </section>

      <section className="section subtle" aria-labelledby="trust-title">
        <div className="wrap">
          <div className="intro" data-reveal>
            <p className="label">신뢰에 대한 약속</p>
            <h2 id="trust-title">아이를 위한 정보니까<br />한 번 더 살펴요</h2>
            <p>어디서 나온 정보인지 확인하고, 확실하게 알기 어려울 때는 조심스럽게 안내합니다</p>
          </div>
          <ul className="commitments" data-reveal>{commitments.map(([title, body], index) =>
            <li key={title}><span aria-hidden="true">{['✓', '↗', '◇', '◎'][index]}</span><h3>{title}</h3><p>{body}</p></li>)}</ul>
        </div>
      </section>

      <section className="section vision" aria-labelledby="vision-title">
        <div className="wrap vision-layout" data-reveal>
          <div>
            <h2 id="vision-title">어디에 살든<br />필요한 도움을 함께 찾아요</h2>
            <p>정보에 쏟는 시간을 덜고, 아이와 보내는 시간에 더 마음을 쓸 수 있기를 바랍니다</p>
          </div>
          <img className="landing-photo closing-photo" src={reviewAsset('closing-caregiver.webp')} alt="도서관에서 등을 보인 아이의 그림을 바라보는 보호자" loading="lazy" />
        </div>
      </section>

      <section className="section" aria-labelledby="start-title">
        <div className="wrap intro" data-reveal>
          <h2 id="start-title">아이를 위한 정보를 찾을 때<br />보듬보듬이 함께할게요</h2>
          <p>어떤 정보를 찾을 수 있는지 데모에서 먼저 살펴보실 수 있습니다</p>
          <p className="closing-brand">보듬보듬</p>
          <LandingActions onSubscribe={onSubscribe} />
        </div>
      </section>
    </main>;
}

function GuidePage({ guide, onSubscribe }: { guide: typeof guides[number]; onSubscribe: () => void }) {
  const feature = features.find(item => item.id === guide.id)!;
  return <main id="content" className="guide" tabIndex={-1}>
    <section className="guide-hero">
      <div className="wrap">
        <a className="guide-back" href="#service">서비스 소개</a>
        <div className="guide-layout">
          <div>
            <h1>{guide.label}</h1>
            <p>{feature.title.join(' ')}</p>
            <p>{feature.body}</p>
          </div>
          <ProductPreview screen={guide.id} />
        </div>
      </div>
    </section>
    <section className="section wrap" aria-labelledby="guide-steps">
      <h2 id="guide-steps">이렇게 써 보세요</h2>
      <ol className="guide-steps">{guide.steps.map(([title, description]) =>
        <li key={title}><h3>{title}</h3><p>{description}</p></li>)}</ol>
      <LandingActions onSubscribe={onSubscribe} />
    </section>
    <nav className="wrap guide-links" aria-label="다른 기능 안내">
      {guides.filter(item => item.id !== guide.id).map(item =>
        <a key={item.id} href={`#/guide/${item.id}`}>{item.label}</a>)}
    </nav>
  </main>;
}

function App() {
  const dialog = useRef<HTMLDialogElement>(null);
  const [hash, setHash] = useState(location.hash);
  const guide = guides.find(item => hash === `#/guide/${item.id}`);
  const openSignup = () => dialog.current?.showModal();

  useEffect(() => {
    const updateRoute = () => setHash(location.hash);
    window.addEventListener('hashchange', updateRoute);
    return () => window.removeEventListener('hashchange', updateRoute);
  }, []);

  useLayoutEffect(() => {
    document.title = guide ? `${guide.label} 이용 안내 | 보듬보듬` : '보듬보듬 | 아이를 위한 고민이 하나쯤은 줄어들도록';
    if (guide) {
      window.scrollTo({ top: 0, behavior: 'instant' });
      document.getElementById('content')?.focus({ preventScroll: true });
    } else {
      document.getElementById(location.hash.slice(1))?.scrollIntoView({ behavior: 'instant' });
    }
  }, [guide]);

  return <>
    <a className="skip" href="#content" onClick={event => {
      event.preventDefault();
      document.getElementById('content')?.focus();
    }}>본문으로 건너뛰기</a>
    <LandingHeader onSubscribe={openSignup} />
    {guide ? <GuidePage guide={guide} onSubscribe={openSignup} /> : <LandingPage onSubscribe={openSignup} />}
    <footer className="subtle">
      <div className="wrap footer-row">
        <a className="brand" href="#top"><img src={logo} alt="보듬보듬" /></a>
        <a href="#service">서비스 소개</a>
        <a href={legalLinks.terms}>이용약관</a>
        <a href={legalLinks.privacy}>개인정보처리방침</a>
        <small>© 보듬보듬</small>
      </div>
    </footer>
    <LaunchDialog dialog={dialog} />
  </>;
}

createRoot(document.getElementById('root')!).render(<App />);
