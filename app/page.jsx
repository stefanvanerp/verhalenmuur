'use client';

import { useEffect, useMemo, useState } from 'react';
import { STORAGE_KEY, startStories } from './data';
import { Brand, CTA, QRFloating, StoryGrid } from './components';

function loadStories() {
  if (typeof window === 'undefined') return startStories;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : startStories;
  } catch {
    return startStories;
  }
}

export default function AdminPage() {
  const [stories, setStories] = useState(startStories);

  useEffect(() => {
    setStories(loadStories());
  }, []);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(stories));
  }, [stories]);

  const approved = useMemo(() => stories.filter((story) => story.status === 'approved'), [stories]);
  const stats = {
    new: stories.filter((story) => story.status === 'new').length,
    approved: stories.filter((story) => story.status === 'approved').length,
    rejected: stories.filter((story) => story.status === 'rejected').length
  };

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
            <p>Moderatie dashboard en bioscoopweergave voor filmpremières.</p>
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
            {stories.filter((story) => story.status === 'new').length === 0 && <p className="empty">Geen nieuwe inzendingen.</p>}
            {stories.filter((story) => story.status === 'new').map((story) => (
              <div className="moderation-item" key={story.id}>
                <img src={story.image} alt="" />
                <div><strong>{story.user}</strong><p>{story.caption}</p></div>
                <button onClick={() => setStatus(story.id, 'approved')}>Goed</button>
                <button onClick={() => setStatus(story.id, 'rejected')}>Afwijs</button>
              </div>
            ))}
          </div>

          <div className="admin-preview">
            <Brand />
            <CTA />
            <QRFloating />
            <StoryGrid stories={approved} />
          </div>
        </section>
      </div>
    </main>
  );
}
