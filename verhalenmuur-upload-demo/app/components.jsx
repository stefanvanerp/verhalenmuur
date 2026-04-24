'use client';

import { useEffect, useMemo, useState } from 'react';
import { startStories } from './data';

const STORAGE_KEY = 'verhalenmuur_stories_v1';

export function useStories() {
  const [stories, setStoriesState] = useState(startStories);

  useEffect(() => {
    try {
      const saved = window.localStorage.getItem(STORAGE_KEY);
      if (saved) setStoriesState(JSON.parse(saved));
    } catch {}
  }, []);

  function setStories(next) {
    setStoriesState((current) => {
      const value = typeof next === 'function' ? next(current) : next;
      try {
        window.localStorage.setItem(STORAGE_KEY, JSON.stringify(value));
        window.dispatchEvent(new Event('verhalenmuur:update'));
      } catch {}
      return value;
    });
  }

  useEffect(() => {
    function refresh() {
      try {
        const saved = window.localStorage.getItem(STORAGE_KEY);
        if (saved) setStoriesState(JSON.parse(saved));
      } catch {}
    }
    window.addEventListener('storage', refresh);
    window.addEventListener('verhalenmuur:update', refresh);
    const interval = setInterval(refresh, 1500);
    return () => {
      window.removeEventListener('storage', refresh);
      window.removeEventListener('verhalenmuur:update', refresh);
      clearInterval(interval);
    };
  }, []);

  return [stories, setStories];
}

export function Brand() {
  return (
    <section className="brand">
      <div className="live"><span />LIVE vanuit Pathé Tuschinski</div>
      <div className="eyebrow">WITNESS HOW HE BECAME HE-MAN</div>
      <img className="logo" src="/motu-logo.png" alt="Masters of the Universe" />
      <div className="date"><span>4 JUNI</span> IN DE BIOSCOOP</div>
    </section>
  );
}

export function CTA() {
  return (
    <section className="cta">
      <div className="insta">◎</div>
      <div>
        <h1>ZIE JEZELF OP HET GROTE DOEK</h1>
        <p>Maak je story, tag <span>@sonypicturesnl</span> en upload via QR</p>
      </div>
    </section>
  );
}

export function StoryCard({ story }) {
  return (
    <article className="story-card">
      <img src={story.image} alt="" />
      <div className="story-top">
        <div className="avatar" />
        <div>
          <div className="username">{story.user}</div>
          <div className="time">{story.time}</div>
        </div>
        <div className="story-icon">◎</div>
      </div>
      <div className="caption">
        {story.caption}
        <span>@sonypicturesnl</span>
      </div>
    </article>
  );
}

export function StoryGrid({ stories }) {
  return (
    <section className="story-grid">
      {stories.slice(0, 4).map((story) => <StoryCard key={story.id} story={story} />)}
    </section>
  );
}

export function ScreenView() {
  const [stories] = useStories();
  const approved = stories.filter((story) => story.status === 'approved');
  return (
    <main className="app screen">
      <div className="background" />
      <div className="glow" />
      <div className="screen-shell">
        <Brand />
        <CTA />
        <StoryGrid stories={approved} />
      </div>
    </main>
  );
}

export function AdminView() {
  const [stories, setStories] = useStories();
  const stats = useMemo(() => ({
    new: stories.filter((story) => story.status === 'new').length,
    approved: stories.filter((story) => story.status === 'approved').length,
    rejected: stories.filter((story) => story.status === 'rejected').length
  }), [stories]);

  function setStatus(id, status) {
    setStories((items) => items.map((item) => item.id === id ? { ...item, status } : item));
  }

  function resetDemo() {
    setStories(startStories);
  }

  return (
    <main className="app admin">
      <div className="background" />
      <div className="glow" />
      <div className="admin-shell">
        <header className="admin-header">
          <div>
            <div className="kicker">Verhalenmuur</div>
            <h1>Premiere Stories Wall</h1>
            <p>Moderatie dashboard, uploadflow en bioscoopweergave voor filmpremières.</p>
          </div>
          <nav className="admin-controls">
            <a href="/upload" target="_blank" rel="noreferrer">Open uploadpagina</a>
            <a href="/screen" target="_blank" rel="noreferrer">Open bioscoopscherm</a>
            <button onClick={resetDemo}>Reset demo</button>
          </nav>
        </header>

        <section className="admin-stats">
          <div><span>Nieuw</span><strong>{stats.new}</strong></div>
          <div><span>Goedgekeurd</span><strong>{stats.approved}</strong></div>
          <div><span>Afgewezen</span><strong>{stats.rejected}</strong></div>
        </section>

        <section className="admin-layout">
          <div className="admin-panel">
            <h2>Nieuw binnen</h2>
            <StoryList stories={stories.filter((story) => story.status === 'new')} onStatus={setStatus} />
          </div>
          <div className="admin-panel">
            <h2>Goedgekeurd</h2>
            <StoryList stories={stories.filter((story) => story.status === 'approved')} onStatus={setStatus} />
          </div>
          <div className="admin-panel">
            <h2>Afgewezen</h2>
            <StoryList stories={stories.filter((story) => story.status === 'rejected')} onStatus={setStatus} />
          </div>
        </section>
      </div>
    </main>
  );
}

function StoryList({ stories, onStatus }) {
  if (!stories.length) return <p className="empty">Geen stories.</p>;
  return (
    <div className="story-list">
      {stories.map((story) => (
        <div className="queue-card" key={story.id}>
          <img src={story.image} alt="" />
          <div>
            <strong>{story.user}</strong>
            <p>{story.caption}</p>
            <div className="queue-actions">
              <button onClick={() => onStatus(story.id, 'approved')}>Goedkeuren</button>
              <button onClick={() => onStatus(story.id, 'rejected')}>Afwijzen</button>
              <button onClick={() => onStatus(story.id, 'new')}>Terug</button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

export function UploadView() {
  const [, setStories] = useStories();
  const [user, setUser] = useState('');
  const [caption, setCaption] = useState('');
  const [preview, setPreview] = useState('');
  const [done, setDone] = useState(false);

  function onFile(event) {
    const file = event.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => setPreview(String(reader.result));
    reader.readAsDataURL(file);
  }

  function submit(event) {
    event.preventDefault();
    if (!preview) return;
    const newStory = {
      id: Date.now(),
      user: user.replace('@', '') || 'gast',
      time: 'nu',
      status: 'new',
      image: preview,
      caption: caption || 'Klaar voor de première!'
    };
    setStories((items) => [newStory, ...items]);
    setDone(true);
  }

  return (
    <main className="upload-page">
      <div className="upload-card">
        <img src="/motu-logo.png" alt="Masters of the Universe" />
        {done ? (
          <div className="thanks">
            <h1>Thanks!</h1>
            <p>Je upload staat klaar voor moderatie. Als hij wordt goedgekeurd zie je hem op het grote doek.</p>
            <a href="/upload">Nog een upload doen</a>
          </div>
        ) : (
          <form onSubmit={submit}>
            <h1>Zie jezelf op het grote doek</h1>
            <p>Maak je story, tag @sonypicturesnl en upload je foto of screenshot hier.</p>
            <label>Instagram naam</label>
            <input value={user} onChange={(event) => setUser(event.target.value)} placeholder="@jouwnaam" />
            <label>Caption</label>
            <input value={caption} onChange={(event) => setCaption(event.target.value)} placeholder="Bijvoorbeeld: Movie night!" />
            <label>Foto of screenshot</label>
            <input type="file" accept="image/*" onChange={onFile} />
            {preview && <img className="upload-preview" src={preview} alt="Preview" />}
            <button type="submit" disabled={!preview}>Insturen voor scherm</button>
          </form>
        )}
      </div>
    </main>
  );
}
