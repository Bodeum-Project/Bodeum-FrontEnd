import { useState } from 'react';
import { features, reviewAsset, serviceUrl } from './content';

type Screen = 'home' | typeof features[number]['id'];

function InfoPreview() {
  const [category, setCategory] = useState('전체');
  const [region, setRegion] = useState('지역 전체');
  const entries = [
    { category: '복지', region: '서울', title: '발달재활서비스 안내', detail: '대상 · 신청 방법 · 문의처' },
    { category: '병원', region: '경기', title: '소아 재활 진료기관', detail: '진료 항목 · 이용 시간' },
    { category: '교육', region: '서울', title: '특수교육 지원기관', detail: '이용 대상 · 상담 안내' },
  ];
  const results = entries.filter(item =>
    (category === '전체' || item.category === category) &&
    (region === '지역 전체' || item.region === region));
  return <>
    <div className="filters" role="group" aria-label="정보 유형">
      {['전체', '복지', '병원', '교육'].map(label =>
        <button key={label} aria-pressed={category === label} onClick={() => setCategory(label)}>{label}</button>)}
    </div>
    <label className="region">지역 <select value={region} onChange={event => setRegion(event.target.value)}>
      <option>지역 전체</option><option>서울</option><option>경기</option>
    </select></label>
    <div className="screen-list" aria-live="polite">
      {results.map(item => <details key={item.title}>
        <summary><strong>{item.title}</strong><small>{item.category} · {item.region}</small></summary>
        <p>{item.detail}</p>
      </details>)}
      {!results.length && <p>지금 고른 조건에 맞는 정보가 없어요<br />다른 지역이나 분야를 골라 보세요</p>}
    </div>
  </>;
}

function ChatPreview() {
  const [showAnswer, setShowAnswer] = useState(false);
  const question = '발달재활서비스는 어디에서 확인할 수 있나요?';
  return <div className="chat">
    <p className="chat-question">{question}</p>
    <button className="demo-button" onClick={() => setShowAnswer(value => !value)} aria-expanded={showAnswer} aria-controls="demo-answer">
      {showAnswer ? '예시 답변 접기' : '예시 질문 보내 볼래요'}
    </button>
    <div id="demo-answer" aria-live="polite">
      {showAnswer && <div className="chat-answer">
        <strong>확인할 수 있는 곳</strong>
        <p>복지로에서 ‘발달재활서비스’를 검색하면 지원 대상과 신청 방법을 확인할 수 있어요</p>
        <a className="source-card" href="https://www.bokjiro.go.kr/">출처 · 복지로</a>
      </div>}
    </div>
  </div>;
}

export function ProductPreview({ screen }: { screen: Screen }) {
  const rows = {
    news: [['지역 프로그램', '아이와 함께하는 주말 체험', '모집 중 · 신청 기간 예시'], ['지원사업', '가족 지원 프로그램', '모집 예정 · 일정 예시']],
    community: [['정보 · 질문 광장', '첫 기관 방문 전에 무엇을 준비하셨나요?', '익명 예시'], ['치료 · 성장 기록', '오늘은 아이가 먼저 산책을 제안했어요', '익명 예시']],
  };
  const title = { home: '우리 아이에게 필요한 정보', info: '정보 탐색', ai: 'AI 복지 안내', news: '지역 및 복지 소식', community: '보호자 커뮤니티' };
  const body = <div className="screen-body">
      <h3>{title[screen]}</h3>
      {screen === 'home' && <>
        <div className="home-tiles">{features.map(feature =>
          <a key={feature.id} href={`#feature-${feature.id}`}>{feature.label}</a>)}</div>
        <div className="screen-list">
          <div><strong>추천 소식</strong><small>지역별 프로그램과 지원사업</small></div>
          <div><strong>보호자 커뮤니티</strong><small>정보와 일상을 나누는 이야기</small></div>
        </div>
      </>}
      {screen === 'info' && <InfoPreview />}
      {screen === 'ai' && <><ChatPreview /><a className="source-card" href={new URL('aichat', serviceUrl).href}>데모에서 AI 챗봇 열기</a></>}
      {(screen === 'news' || screen === 'community') && <div className="screen-list">
        {rows[screen].map(([category, name, description]) => <div key={name}>
          <small>{category}</small><strong>{name}</strong><small>{description}</small>
        </div>)}
      </div>}
    </div>;
  return <figure className={`product product-${screen}`}>
    <figcaption><span>보듬보듬</span><span>{screen === 'ai' ? '대화 흐름 예시' : 'V2 데모 화면'}</span></figcaption>
    {screen !== 'ai' && <img className="product-capture" src={reviewAsset(`demo-${screen}.webp`)} alt={`보듬보듬 데모의 ${title[screen]} 화면`} loading="lazy" />}
    {screen === 'info' ? <details className="product-details"><summary>정보 필터 체험하기</summary>{body}</details> : body}
  </figure>;
}
