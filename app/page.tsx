"use client";

import Image from "next/image";
import { useEffect, useRef, useState, type CSSProperties } from "react";
import { chapters, closing, memories, songs } from "./content";

const promises = [
  { title: "Speak with honesty", word: "Honesty", text: "I want to learn how to tell you when I’m overwhelmed, when I need reassurance, when I need you to stay, and when I need some time." },
  { title: "Care for your trust", word: "Care", text: "I want you to know that your heart is safe with me and that I’m going to be more careful with the things that could hurt your trust in me." },
  { title: "Show up, consistently", word: "Actions", text: "I don’t want to just promise you with words. I want to show you through my actions, slowly and consistently." },
  { title: "Give you time", word: "Patience", text: "I know forgiveness doesn’t mean the hurt disappears immediately, and I don’t expect you to suddenly be okay just because I said sorry." },
];

const chapterSeals = ["✦", "❀", "∞", "☾", "♡"];

const whatsappNumber = "601156642949";
const whatsappMessages = {
  forgive: "Hi Mina, I’ve read everything. I forgive you, and I’m willing to work through this together. Thank you for being honest and for putting your heart into this. Let’s heal, grow, and be better for each other. 🤍",
  time: "Hi Mina, I’ve read everything. I truly appreciate your apology and the effort you put into this, but I still need some time to process how I feel. Please give me a little space. I’ll reach out when I’m ready. Thank you for understanding.",
};

const whatsappLinks = {
  forgive: `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(whatsappMessages.forgive)}`,
  time: `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(whatsappMessages.time)}`,
};

const transitionFlowers = Array.from({ length: 36 }, (_, index) => {
  const column = index % 6;
  const row = Math.floor(index / 6);
  const distanceFromCenter = Math.hypot(column - 2.5, row - 2.5);
  return {
    id: index,
    x: `${(column - 2.5) * 20}vw`,
    y: `${(row - 2.5) * 20}vh`,
    rotation: `${(index * 71) % 360 - 180}deg`,
    scale: `${0.9 + ((index * 17) % 34) / 100}`,
    delay: `${Math.min(0.24, distanceFromCenter * 0.032)}s`,
  };
});

function Heart({ className = "" }: { className?: string }) {
  return <svg className={className} viewBox="0 0 40 40" fill="none" aria-hidden="true"><path d="M20 34S5 24 5 14a8 8 0 0 1 15-3 8 8 0 0 1 15 3c0 10-15 20-15 20Z" stroke="currentColor" strokeWidth="1.4"/></svg>;
}

function Flower({ bloom = false }: { bloom?: boolean }) {
  return <svg className={bloom ? "flower bloomed" : "flower"} viewBox="0 0 100 100" aria-hidden="true">
    {[0,72,144,216,288].map(angle => <ellipse key={angle} cx="50" cy="30" rx="12" ry="22" transform={`rotate(${angle} 50 50)`}/>)}
    <circle cx="50" cy="50" r="8"/>
  </svg>;
}

function Player({ audioRef }: { audioRef: React.RefObject<HTMLAudioElement | null> }) {
  const [playing, setPlaying] = useState(false);
  const [track, setTrack] = useState(0);
  const [expanded, setExpanded] = useState(false);
  const [notice, setNotice] = useState("");
  const panelRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    const play = () => { setPlaying(true); setNotice(""); };
    const pause = () => setPlaying(false);
    const failed = () => { setPlaying(false); setNotice("This song could not load. Try the other song."); };
    audio.addEventListener("play", play);
    audio.addEventListener("pause", pause);
    audio.addEventListener("error", failed);
    return () => { audio.removeEventListener("play", play); audio.removeEventListener("pause", pause); audio.removeEventListener("error", failed); };
  }, [audioRef]);
  useEffect(() => {
    if (!expanded) return;
    const dismiss = (event: PointerEvent) => { if (!panelRef.current?.contains(event.target as Node)) setExpanded(false); };
    const key = (event: KeyboardEvent) => { if (event.key === "Escape") { setExpanded(false); panelRef.current?.querySelector<HTMLButtonElement>("button")?.focus(); } };
    document.addEventListener("pointerdown", dismiss);
    document.addEventListener("keydown", key);
    return () => { document.removeEventListener("pointerdown", dismiss); document.removeEventListener("keydown", key); };
  }, [expanded]);
  const play = () => { void audioRef.current?.play().catch(() => setNotice("Tap play to try again.")); };
  const change = (index: number) => {
    const audio = audioRef.current;
    if (!audio) return;
    setTrack(index);
    audio.src = songs[index].src;
    audio.load();
    play();
  };
  return <div className="music" ref={panelRef}>
    <button className="music-toggle" aria-expanded={expanded} aria-controls="music-panel" onClick={() => setExpanded(!expanded)}>
      <span className={playing ? "equalizer playing" : "equalizer"} aria-hidden="true"><i/><i/><i/><i/></span><span>Our soundtrack</span><span aria-hidden="true">⌄</span>
    </button>
    {expanded && <div className="music-panel" id="music-panel">
      <p className="eyebrow">A little company while you read</p>
      <div className="track"><span className={playing ? "record spinning" : "record"} aria-hidden="true">♡</span><div><strong>{songs[track].title}</strong><small>{songs[track].artist}</small></div></div>
      <div className="music-controls">
        <button aria-label="Previous song" onClick={() => change((track + 1) % songs.length)}>←</button>
        <button className="play-control" aria-label={playing ? "Pause music" : "Play music"} onClick={() => playing ? audioRef.current?.pause() : play()}>{playing ? "Pause" : "Play"}</button>
        <button aria-label="Next song" onClick={() => change((track + 1) % songs.length)}>→</button>
      </div>
      <label className="volume">Volume <input aria-label="Music volume" type="range" min="0" max="1" step=".05" defaultValue=".35" onChange={e => { if (audioRef.current) audioRef.current.volume = Number(e.target.value); }}/></label>
      <p className="player-note" role="status">{notice || `Song ${track + 1} of 2 · You can pause at any time`}</p>
    </div>}
  </div>;
}

function Letter() {
  const [chapter, setChapter] = useState(0);
  const [all, setAll] = useState(false);
  const [visited, setVisited] = useState<number[]>([0]);
  const heading = useRef<HTMLHeadingElement>(null);
  const turn = (index: number) => {
    setChapter(index);
    setVisited(current => current.includes(index) ? current : [...current, index]);
    requestAnimationFrame(() => { heading.current?.focus({ preventScroll: true }); heading.current?.scrollIntoView({ behavior: "smooth", block: "start" }); });
  };
  return <section className="section letter-section" id="letter" aria-labelledby="letter-heading">
    <div className="section-intro"><span className="eyebrow">01 / A letter from my heart</span><h2 id="letter-heading">The things I need<br/>you to <em>know.</em></h2><p>Take your time, baby. These words are here whenever you’re ready.</p></div>
    <div className="letter-layout">
      <aside className="letter-index">
        <span className="small-label">Five little chapters <i>· tap a sealed letter</i></span>
        <div className="chapter-progress" role="progressbar" aria-label="Chapters opened" aria-valuemin={0} aria-valuemax={chapters.length} aria-valuenow={visited.length}><span style={{ "--chapter-progress": `${(visited.length / chapters.length) * 100}%` } as CSSProperties}/><small>{visited.length} / {chapters.length} opened</small></div>
        {chapters.map((item, i) => {
          const selected = chapter === i && !all;
          const opened = visited.includes(i);
          return <button key={item.title} className={`chapter-link${selected ? " selected" : ""}${opened ? " opened" : ""}`} aria-current={selected ? "step" : undefined} onClick={() => { setAll(false); turn(i); }}>
            <span className="chapter-number">0{i + 1}</span>
            <span className="chapter-seal" aria-hidden="true">{chapterSeals[i]}</span>
            <span className="chapter-copy"><strong>{item.title}</strong><small>{item.subtitle}</small></span>
            <span className="chapter-status">{opened ? "Read with love" : "Sealed"}</span>
            <span className="chapter-arrow" aria-hidden="true">↗</span>
          </button>;
        })}
        <button className="text-button read-all" onClick={() => { setAll(!all); heading.current?.scrollIntoView({ behavior: "smooth", block: "start" }); }}>{all ? "Read one chapter at a time" : "Read the whole letter"} <span aria-hidden="true">↗</span></button>
        <div className="margin-note">Written with love.<br/>And a little courage.<span>— Mina</span></div>
      </aside>
      <article className="letter-paper">
        <span className="letter-corner-bloom" aria-hidden="true"/>
        <span className="paper-keepsake" aria-hidden="true">made with courage · kept with love</span>
        <div className="paper-top"><span>MINA → AFIF</span><Heart/><span>JUST FOR YOU</span></div>
        <h3 ref={heading} tabIndex={-1} className="letter-title">{all ? "My letter to you" : chapters[chapter].title}</h3>
        <p className="letter-subtitle">{all ? "Every word, from my heart." : chapters[chapter].subtitle}</p>
        <div className="letter-body" key={all ? "all" : chapter}>
          {(all ? chapters.flatMap(item => item.paragraphs) : chapters[chapter].paragraphs).map((paragraph, i) => <p key={i} style={{ "--delay": `${Math.min(i, 5) * 130}ms` } as CSSProperties}>{paragraph}</p>)}
          {(all || chapter === 4) && <div className="signature">Always, Mina <span>♡</span></div>}
        </div>
        {!all && <div className="page-turner"><button className="text-button" disabled={chapter === 0} onClick={() => turn(chapter - 1)}>← Previous</button><span>{chapter + 1} / {chapters.length}</span>{chapter < 4 ? <button className="text-button" onClick={() => turn(chapter + 1)}>Next chapter →</button> : <a className="text-button" href="#memories">Our memories →</a>}</div>}
      </article>
    </div>
  </section>;
}

function Memories() {
  const [index, setIndex] = useState(0);
  const startX = useRef<number | null>(null);
  const change = (direction: number) => setIndex(current => (current + direction + memories.length) % memories.length);
  return <section className="section memories-section" id="memories" aria-labelledby="memories-heading">
    <div className="memory-copy"><span className="eyebrow">02 / The little things, the big feelings</span><h2 id="memories-heading">Still my<br/><em>favourite person.</em></h2><p>Five little reminders of the person<br className="desktop-break"/> my heart keeps choosing.</p><div className="memory-thumbnails">{memories.map((photo, i) => <button key={photo.src} aria-label={`View memory ${i + 1}`} aria-pressed={index === i} onClick={() => setIndex(i)}><Image src={photo.src} alt="" width={60} height={74}/></button>)}</div><p className="small-label">Choose a photograph. Stay a little.</p></div>
    <div className="memory-stage" onTouchStart={event => { startX.current = event.touches[0].clientX; }} onTouchEnd={event => { if (startX.current !== null) { const distance = event.changedTouches[0].clientX - startX.current; if (Math.abs(distance) > 50) change(distance > 0 ? -1 : 1); } startX.current = null; }}>
      <div className="photo-behind behind-one" aria-hidden="true"/><div className="photo-behind behind-two" aria-hidden="true"/>
      <figure className="polaroid" key={index}>
        <span className="photo-tape" aria-hidden="true"/>
        <div className="photo-window" style={{ aspectRatio: memories[index].frameRatio }}><Image src={memories[index].src} alt={`A personal photograph chosen by Mina for Afif, memory ${index + 1}`} fill sizes="(max-width: 700px) 85vw, 420px" style={{ objectPosition: memories[index].position }}/></div>
        <figcaption aria-live="polite">{memories[index].caption}</figcaption>
        <span className="photo-number">A LITTLE PIECE OF US · 0{index + 1}</span>
      </figure>
      <div className="gallery-controls"><button aria-label="Previous memory" onClick={() => change(-1)}>←</button><span>0{index + 1} <i>/ 05</i></span><button aria-label="Next memory" onClick={() => change(1)}>→</button></div>
    </div>
  </section>;
}

function Promises() {
  const [revealed, setRevealed] = useState<number[]>([]);
  const [active, setActive] = useState<number | null>(null);
  return <section className="section promises-section" id="promises" aria-labelledby="promises-heading">
    <div className="section-intro"><span className="eyebrow">03 / Little promises, real actions</span><h2 id="promises-heading">Love grows in<br/><em>the little things.</em></h2><p>Tap each flower to unfold a promise.<br/>Something I want to practise, every day.</p></div>
    <div className="promise-garden">{promises.map((promise, i) => <button key={promise.title} aria-expanded={active === i} aria-controls="promise-message" className={revealed.includes(i) ? "promise-flower revealed" : "promise-flower"} onClick={() => { setActive(i); setRevealed(current => current.includes(i) ? current : [...current, i]); }}><span className="flower-circle"><Flower bloom={revealed.includes(i)}/></span><span className="small-label">0{i + 1}</span><strong>{promise.word}</strong></button>)}</div>
    <div className="promise-message" id="promise-message" aria-live="polite">
      {active === null ? <div className="promise-placeholder"><Heart/><p>Not just words. A place to begin.</p></div> : <div key={active} className="promise-reveal"><span className="eyebrow">My promise to you</span><h3>{promises[active].title}</h3><p>“{promises[active].text}”</p><span className="signature">Mina</span></div>}
    </div>
    <p className="garden-note">{revealed.length === 4 ? "Four small promises. A little more care, every day." : `${revealed.length} of 4 promises unfolded`} <span aria-hidden="true">♡</span></p>
  </section>;
}

function Ending() {
  const [response, setResponse] = useState<"forgive" | "time" | null>(null);
  const resultRef = useRef<HTMLDivElement>(null);
  const choose = (choice: "forgive" | "time") => {
    setResponse(choice);
    requestAnimationFrame(() => { resultRef.current?.focus({ preventScroll: true }); resultRef.current?.scrollIntoView({ behavior: "smooth", block: "center" }); });
  };
  return <section className="section ending-section" id="always" aria-labelledby="ending-heading">
    <span className="eyebrow">04 / Whatever you feel, there is room for it</span>
    <h2 id="ending-heading">At your pace.<br/><em>With all my love.</em></h2>
    <div className="closing-letter">{closing.split(/[\n\u2028]+/).filter(Boolean).map((paragraph, i) => <p key={i}>{paragraph}</p>)}</div>
    <div className="signature">Yours, Mina <span>♡</span></div>
    <div className="response-area">
      <p className="small-label">Only if you feel ready</p>
      <div className="response-buttons">
        <a className="button" href={whatsappLinks.forgive} target="_blank" rel="noopener noreferrer" onClick={() => choose("forgive")}>I forgive you 🤍</a>
        <a className="button secondary" href={whatsappLinks.time} target="_blank" rel="noopener noreferrer" onClick={() => choose("time")}>I still need some time</a>
      </div>
      <p className="response-note">Your choice opens a prepared WhatsApp message. You can review it before sending.</p>
      {response && <div ref={resultRef} tabIndex={-1} className={`response-result ${response}`} role="status">
        <div key={response} className="result-inner">
          <Heart/>
          <h3>{response === "forgive" ? "Thank you for choosing us, my beloved baby. ♡" : "It’s okay, take all the time you need. I’ll still be here."}</h3>
          <p>{response === "forgive" ? "Here’s to us learning, healing, growing and loving each other better." : "I won’t rush you to feel okay just because I’m ready to move on."}</p>
          {response === "forgive" && <div className="gentle-hearts" aria-hidden="true">{Array.from({ length: 9 }, (_, i) => <span key={i} style={{ "--i": i } as CSSProperties}>♡</span>)}</div>}
        </div>
      </div>}
    </div>
    <footer><span>M ♡ A</span><p>A little place for us.<br/>Made with love, from Mina to Afif.</p><a href="#letter">Back to the letter ↑</a></footer>
  </section>;
}

export default function Home() {
  const [introVisible, setIntroVisible] = useState(true);
  const [introLeaving, setIntroLeaving] = useState(false);
  const [opened, setOpened] = useState(false);
  const [opening, setOpening] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);
  const timers = useRef<ReturnType<typeof setTimeout>[]>([]);
  useEffect(() => {
    const previousOverflow = document.body.style.overflow;
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let pageReady = document.readyState === "complete";
    let minimumReady = false;
    let ending = false;
    let removeTimer: ReturnType<typeof setTimeout> | undefined;
    document.body.style.overflow = "hidden";

    const finish = () => {
      if (!pageReady || !minimumReady || ending) return;
      ending = true;
      setIntroLeaving(true);
      removeTimer = setTimeout(() => {
        setIntroVisible(false);
        document.body.style.overflow = previousOverflow;
      }, reducedMotion ? 50 : 680);
    };
    const onLoad = () => { pageReady = true; finish(); };
    window.addEventListener("load", onLoad, { once: true });
    const minimumTimer = setTimeout(() => { minimumReady = true; finish(); }, reducedMotion ? 120 : 1750);
    const fallbackTimer = setTimeout(() => { pageReady = true; minimumReady = true; finish(); }, reducedMotion ? 350 : 4500);

    finish();
    return () => {
      window.removeEventListener("load", onLoad);
      clearTimeout(minimumTimer);
      clearTimeout(fallbackTimer);
      if (removeTimer) clearTimeout(removeTimer);
      document.body.style.overflow = previousOverflow;
    };
  }, []);
  useEffect(() => () => { timers.current.forEach(clearTimeout); }, []);
  const open = () => {
    if (opening) return;
    setOpening(true);
    if (audioRef.current) { audioRef.current.volume = .35; void audioRef.current.play().catch(() => {}); }
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const reveal = () => {
      setOpened(true);
      requestAnimationFrame(() => {
        window.scrollTo({ top: 0, behavior: "instant" });
        const target = document.getElementById("letter-heading");
        target?.setAttribute("tabindex", "-1");
        target?.focus({ preventScroll: true });
      });
    };
    if (reduced) { reveal(); setOpening(false); return; }
    const mobile = window.matchMedia("(max-width: 800px)").matches;
    timers.current.push(setTimeout(reveal, mobile ? 1650 : 1300));
    timers.current.push(setTimeout(() => setOpening(false), mobile ? 3650 : 2900));
  };
  return <>
    {introVisible && <div className={`site-loader${introLeaving ? " is-leaving" : ""}`} role="status" aria-live="polite" aria-label="Preparing Mina's letter for Afif">
      <div className="loader-bloom bloom-left" aria-hidden="true"/>
      <div className="loader-bloom bloom-right" aria-hidden="true"/>
      <div className="loader-content">
        <span className="loader-monogram">m <i>♡</i> a</span>
        <div className="loader-envelope" aria-hidden="true"><span>♡</span></div>
        <p>Preparing something<br/><em>from the heart.</em></p>
        <div className="loader-progress" aria-hidden="true"><span/></div>
        <small>FROM MINA · FOR AFIF</small>
      </div>
    </div>}
    <audio ref={audioRef} src={songs[0].src} preload="none" loop/>
    <a className="skip-link" href={opened ? "#letter" : "#open-letter"}>Skip to content</a>
    <header className="site-header"><a className="monogram" href={opened ? "#letter" : "#home"} aria-label={opened ? "Mina and Afif, back to the letter" : "Mina and Afif, back to beginning"}>m<span>&</span>a<span className="brand-caption">a little place for us</span></a>{opened && <nav aria-label="Our story"><a href="#letter">The letter</a><a href="#memories">Our moments</a><a href="#promises">My promises</a></nav>}<Player audioRef={audioRef}/></header>
    <main>
      {!opened && <section className={`hero ${opening ? "is-opening" : ""}`} id="home" aria-labelledby="hero-heading">
        <div className="hero-copy"><span className="eyebrow"><span className="tiny-star">✧</span> For Afif Aiman, with all my heart</span><h1 id="hero-heading">I made something<br/>for you,<br/><em>my beloved baby.</em></h1><p className="hero-description">A little place for the words I owe you,<br/>and the love I want to show you.</p><button id="open-letter" className="button open-button" onClick={open} disabled={opening}>{opening ? "Opening my heart…" : "Open this when you’re ready"}<span aria-hidden="true">↗</span></button><span className="hero-note">No rush. Just you, me, and a little honesty.</span><div className="hero-signature">With love, <span>Mina</span></div></div>
        <div className="hero-art"><div className="art-frame"><Image src="/art/letter-still-life.webp" alt="An ivory envelope with a rose wax seal, blush ribbon and magnolia flowers" fill sizes="(max-width: 800px) 95vw, 52vw" preload/><div className="art-caption"><span>A LETTER FOR</span><strong>my beloved baby</strong><span>FROM MINA, ALWAYS ♡</span></div><span className="art-stamp" aria-hidden="true">M<br/><small>♡</small><br/>A</span></div><span className="art-side-note">some words are worth keeping.</span><span className="hero-sparkle sparkle-one" aria-hidden="true">✧</span><span className="hero-sparkle sparkle-two" aria-hidden="true">♡</span></div>
        <div className="hero-bottom"><span>ONE HEART. A FEW HONEST WORDS.</span><span>MINA & AFIF <i>·</i> ALWAYS</span></div>
      </section>}
      {opening && <div className="flower-curtain active" aria-hidden="true">
        <div className="flower-transition-backdrop" />
        <div className="transition-message"><span>From my heart, to yours.</span><small>A little honesty, opening for you.</small></div>
        {transitionFlowers.map(flower => <span className="transition-bloom" key={flower.id} style={{ "--flower-x": flower.x, "--flower-y": flower.y, "--flower-rotation": flower.rotation, "--flower-scale": flower.scale, "--flower-delay": flower.delay } as CSSProperties}/>) }
      </div>}
      {opened && <div className="story"><div className="story-divider"><span/>♡<span/></div><Letter/><Memories/><Promises/><Ending/></div>}
    </main>
  </>;
}
