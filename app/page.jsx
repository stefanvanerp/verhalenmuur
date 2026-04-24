'use client';

import { useMemo, useState } from 'react';
import { startStories } from './data';
import { Brand, CTA, StoryGrid } from './components';

export default function AdminPage() {
  const [stories, setStories] = useState(startStories);
  const approved = useMemo(() => stories.filter((story) => story.status === 'approved'), [stories]);
  const stats = {
    new: stories.filter((story) => story.status === 'new').length,
    approved: stories.filter((story) => story.status === 'approved').length,
    rejected: stories.filter((story) => story.status === 'rejected').length
  };

  function setStatus(id, status) {
    setStories((items) => items.map((item) => item.id === id ? { ...item, status } : item));
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
            <a href="/screen" target="_blank" rel="noreferrer">Open bioscoopscherm</a>
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
            <StoryGrid stories={approved} />
          </div>
        </section>
      </div>
    </main>
  );
}
