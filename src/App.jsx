import { Component, useEffect, useState } from 'react'
import { ArrowRight, CalendarDays, ChevronLeft, Heart, Sparkles } from 'lucide-react'
import { letter, memories } from './data/memories'

const positions = [
  { left: '18%', top: '78%' }, { left: '68%', top: '66%' }, { left: '28%', top: '49%' },
  { left: '72%', top: '34%' }, { left: '46%', top: '14%' },
]

function Stars() {
  return <div className="stars" aria-hidden="true">{Array.from({ length: 28 }, (_, i) => <i key={i} />)}</div>
}

function PlaceholderPhoto({ index }) {
  return <div className={`photo-placeholder tone-${index}`}><span>照片 {index + 1}</span><small>在 memories.js 中替换</small></div>
}

function Welcome({ onStart }) {
  return <main className="welcome screen-enter">
    <div className="orbit orbit-one" />
    <div className="orbit orbit-two" />
    <div className="welcome-copy">
      <Sparkles className="title-sparkle" size={18} />
      <h1>妈妈，<br />生日快乐</h1>
      <p>有一些小小的时光，<br />想和你再走一遍。</p>
    </div>
    <div className="horizon" aria-hidden="true"><span className="figure figure-small" /><span className="figure figure-tall" /></div>
    <button className="primary" onClick={onStart}>开启我们的回忆 <ArrowRight size={17} /></button>
    <span className="hint">轻轻点击，进入我们的记忆小宇宙</span>
  </main>
}

function MemoryMap({ unlocked, onSelect }) {
  const progress = String(Math.min(unlocked + 1, memories.length)).padStart(2, '0')
  return <main className="map-view screen-enter">
    <header><div><small>我们的回忆轨迹</small><h2>下一站，在哪里？</h2></div><span className="progress">{progress} / 05</span></header>
    <p className="map-hint">沿着星光，点击发亮的坐标</p>
    <div className="map-canvas">
      <svg className="path" viewBox="0 0 320 580" preserveAspectRatio="none" aria-hidden="true"><path d="M58 455 C178 414 246 386 204 312 S60 245 116 185 S248 122 150 62" /></svg>
      {positions.map((pos, index) => {
        const available = index <= unlocked
        return <button key={index} style={pos} className={`coordinate ${index === unlocked ? 'active' : ''} ${available ? '' : 'locked'}`} onClick={() => available && onSelect(index)} aria-label={`打开第 ${index + 1} 段回忆`}><span>{String(index + 1).padStart(2, '0')}</span></button>
      })}
      <div className="tiny-planet" aria-hidden="true" />
    </div>
  </main>
}

class ErrorBoundary extends Component {
  constructor(props) {
    super(props)
    this.state = { hasError: false }
  }
  static getDerivedStateFromError() { return { hasError: true } }
  render() {
    if (this.state.hasError) return <main className="fallback-view"><h2>回忆星球暂时迷路了</h2><p>请刷新页面，再轻轻开启一次。</p><button className="primary" onClick={() => window.location.reload()}>重新出发</button></main>
    return this.props.children
  }
}

function Memory({ index, onBack, onNext }) {
  const memory = memories[index]
  return <main className="memory-view screen-enter">
    <button className="back" onClick={onBack} aria-label="返回星图"><ChevronLeft size={20} /> 返回星图</button>
    <div className="memory-count">第 {index + 1} 站 · 共 {memories.length} 站</div>
    <article className="memory-card">
      <div className="tape" aria-hidden="true" />
      {memory.image ? <img src={memory.image} alt={memory.title} /> : <PlaceholderPhoto index={index} />}
      <div className="memory-body">
        <time><CalendarDays size={14} /> {memory.date}</time>
        <h2>{memory.title}</h2>
        <p>{memory.note}</p>
      </div>
    </article>
    <button className="primary memory-next" onClick={onNext}>{index === memories.length - 1 ? '收下最后的心意' : '继续前往'} <ArrowRight size={17} /></button>
  </main>
}

function Letter({ onReplay }) {
  return <main className="letter-view screen-enter">
    <div className="letter-heading"><Heart size={18} fill="currentColor" /><h1>写给妈妈的一封信</h1><span /></div>
    <div className="envelope">
      <article className="letter-paper">
        <p>{letter.greeting}</p>
        {letter.paragraphs.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
        <p className="signoff">{letter.signoff}<br /><time>2026.08.21</time></p>
      </article>
      <div className="envelope-front"><Heart size={22} fill="currentColor" /></div>
    </div>
    <p className="closing">生日快乐。愿你的每一天，都有星光和爱。</p>
    <button className="text-button" onClick={onReplay}>再走一遍我们的回忆</button>
  </main>
}

export default function App() {
  const [view, setView] = useState('welcome')
  const [selected, setSelected] = useState(0)
  const [unlocked, setUnlocked] = useState(0)

  useEffect(() => window.scrollTo({ top: 0, behavior: 'smooth' }), [view, selected])
  const openMemory = (index) => { setSelected(index); setView('memory') }
  const next = () => {
    if (selected === memories.length - 1) return setView('letter')
    setUnlocked((value) => Math.max(value, selected + 1)); setView('map')
  }

  return <div className="app-shell"><Stars /><ErrorBoundary>
    {view === 'welcome' && <Welcome onStart={() => setView('map')} />}
    {view === 'map' && <MemoryMap unlocked={unlocked} onSelect={openMemory} />}
    {view === 'memory' && <Memory index={selected} onBack={() => setView('map')} onNext={next} />}
    {view === 'letter' && <Letter onReplay={() => { setUnlocked(0); setView('welcome') }} />}
    </ErrorBoundary>
  </div>
}
