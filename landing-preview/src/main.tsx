import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { createRoot } from 'react-dom/client';
import { commitments, features, founderChapters, guides, legalLinks, stories } from './content';
import { ProductPreview } from './ProductPreview';
import logo from './logo-bodeum.png';
import { LandingActions, LandingHeader } from './LandingHeader';
import { LaunchDialog } from './LaunchDialog';
import './v2-tokens.css';
import './landing.css';

function MediaSlot({ description }: { description: string }) {
  return <figure className="media-slot" aria-label={`이미지 자리: ${description}`}>
    <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4">
      <rect x="3" y="4" width="18" height="16" rx="2"/><circle cx="9" cy="9" r="1.5"/><path d="m4 17 5-5 4 4 3-3 5 5"/>
    </svg>
    <figcaption>{description}<small>이미지 자리</small></figcaption>
  </figure>;
}

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
            <p className="label">장애아동과 보호자를 위한 복지 정보</p>
            <h1 id="hero-title">
              <span>아이를 위한 정보,</span>{' '}
              <span>찾는 일은 더 쉽게</span>
            </h1>
            <p>어떤 지원을 받을 수 있을지 막막할 때,<br />보듬보듬에서 함께 찾아봐요</p>
            <LandingActions onSubscribe={onSubscribe} />
          </div>
          <MediaSlot description="손을 잡고 걷는 아이와 보호자" />
          <a className="scroll-link" href="#story"><span aria-hidden="true">↓</span> 우리의 이야기</a>
        </div>
      </section>

      <section id="story" className="section wrap" aria-labelledby="story-title">
        <div className="intro" data-reveal>
          <p className="label">우리의 이야기</p>
          <h2 id="story-title">아이에게 맞는 도움을 찾고 싶은데,<br />어디서부터 알아봐야 할까요?</h2>
          <p>어떤 지원이 있는지, 어디로 가야 하는지, 누구에게 물어보면 좋을지<br />아이를 위한 선택 앞엔 늘 새로운 질문이 생겨요</p>
        </div>
        <div className="stories">{stories.map(([question, detail, image]) =>
          <article key={question} className="story-row" data-reveal>
            <div><h3>{question}</h3><p>{detail}</p></div>
            <MediaSlot description={image} />
          </article>)}</div>
        <p className="story-close" data-reveal>정보를 찾는 일이 또 하나의 고민이 되지 않도록</p>
      </section>

      <section className="section inverse" aria-labelledby="beginning-title">
        <div className="wrap intro" data-reveal>
          <h2 id="beginning-title">그래서 보듬보듬을 만들었어요</h2>
          <p>모든 고민에 답할 수는 없어요<br />그래도 필요한 정보를 찾는 일은 더 쉬워질 수 있으니까요</p>
          <p>복잡한 제도는 쉽게 풀고, 흩어진 소식은 한곳에 모았어요<br />비슷한 고민을 나눌 수 있는 공간도 만들었어요</p>
          <a className="founder-link" href="#/founder">보듬보듬을 만든 이야기</a>
          <div className="name-story">
            <p>아이를 보듬는 마음과,<br />그 마음을 보듬는 마음</p>
            <strong aria-label="보듬보듬"><span data-reveal>보듬</span><span data-reveal>보듬</span></strong>
          </div>
        </div>
      </section>

      <section id="service" className="section subtle" aria-labelledby="service-title">
        <div className="wrap">
          <div className="intro" data-reveal>
            <p className="label">서비스 소개</p>
            <h2 id="service-title">필요한 정보를 한곳에서 만나보세요</h2>
            <p>우리 동네 소식을 찾아보고, 헷갈리는 복지 제도는 물어보세요<br />비슷한 경험을 한 보호자와 이야기도 나눌 수 있어요</p>
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
            <p>어디서 나온 정보인지 확인하고,<br />확실하게 알기 어려울 때는 조심스럽게 안내해요</p>
          </div>
          <ul className="commitments" data-reveal>{commitments.map(([title, body], index) =>
            <li key={title}><span aria-hidden="true">{['✓', '↗', '◇', '◎'][index]}</span><h3>{title}</h3><p>{body}</p></li>)}</ul>
        </div>
      </section>

      <section className="section vision" aria-labelledby="vision-title">
        <div className="wrap vision-layout" data-reveal>
          <div>
            <h2 id="vision-title">어디에 살든<br />필요한 도움을 찾을 수 있도록</h2>
            <p>정보를 찾기 어렵다는 이유로 아이에게 필요한 기회를 놓치지 않았으면 해요</p>
            <p>보듬보듬이 바라보는 세상이에요</p>
          </div>
          <MediaSlot description="자연광 속에서 함께 시간을 보내는 가족" />
        </div>
      </section>

      <section className="section" aria-labelledby="start-title">
        <div className="wrap intro" data-reveal>
          <h2 id="start-title">아이를 위한 정보를 찾을 때<br />보듬보듬이 함께할게요</h2>
          <p>어떤 정보를 찾을 수 있는지<br />데모에서 먼저 살펴보세요</p>
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
  const founder = hash === '#/founder';
  const openSignup = () => dialog.current?.showModal();

  useEffect(() => {
    const updateRoute = () => setHash(location.hash);
    window.addEventListener('hashchange', updateRoute);
    return () => window.removeEventListener('hashchange', updateRoute);
  }, []);

  useLayoutEffect(() => {
    document.title = founder ? '파운더 스토리 | 보듬보듬' : guide ? `${guide.label} 이용 안내 | 보듬보듬` : '보듬보듬 | 아이를 위한 정보, 찾는 일은 더 쉽게';
    if (guide || founder) {
      window.scrollTo({ top: 0, behavior: 'instant' });
      document.getElementById('content')?.focus({ preventScroll: true });
    } else {
      document.getElementById(location.hash.slice(1))?.scrollIntoView({ behavior: 'instant' });
    }
  }, [guide, founder]);

  return <>
    <a className="skip" href="#content" onClick={event => {
      event.preventDefault();
      document.getElementById('content')?.focus();
    }}>본문으로 건너뛰기</a>
    <LandingHeader onSubscribe={openSignup} />
    {founder ? <FounderPage onSubscribe={openSignup} /> : guide ? <GuidePage guide={guide} onSubscribe={openSignup} /> : <LandingPage onSubscribe={openSignup} />}
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

function FounderPage({ onSubscribe }: { onSubscribe: () => void }) {
  return <main id="content" tabIndex={-1}>
    <section className="guide-hero">
      <div className="wrap">
        <a className="guide-back" href="#story">우리의 이야기</a>
        <p className="label">파운더 스토리</p>
        <h1>우리가 보듬보듬을 만든 이유</h1>
        <p>아이를 위한 선택 앞에서, 정보를 찾는 일이 또 하나의 어려움이 되지 않도록</p>
      </div>
    </section>
    <div className="section wrap founder-story">
      {founderChapters.map(chapter => <section className="founder-chapter" key={chapter.title}>
        <h2>{chapter.title}</h2>
        {chapter.paragraphs.map(paragraph => <p key={paragraph}>{paragraph}</p>)}
      </section>)}
      <LandingActions onSubscribe={onSubscribe} />
    </div>
  </main>;
}

createRoot(document.getElementById('root')!).render(<App />);
