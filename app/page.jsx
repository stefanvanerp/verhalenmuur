'use client';

import { useMemo, useState } from 'react';

const startStories = [
  { id: 1, user: 'filmfan_97', time: '2m', status: 'new', image: '/masters-artwork.jpg', caption: 'Klaar voor vanavond! #MastersoftheUniverse' },
  { id: 2, user: 'heman_fan', time: '3m', status: 'approved', image: 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?q=80&w=900&auto=format&fit=crop', caption: 'De kracht is terug! 💪 #MastersoftheUniverse' },
  { id: 3, user: 'retrocollector', time: '5m', status: 'approved', image: 'https://images.unsplash.com/photo-1518709268805-4e9042af2176?q=80&w=900&auto=format&fit=crop', caption: 'He-Man terug op het grote doek!' },
  { id: 4, user: 'cinemadude', time: '6m', status: 'approved', image: 'https://images.unsplash.com/photo-1585647347483-22b66260dfff?q=80&w=900&auto=format&fit=crop', caption: 'Movie night! 🍿' },
  { id: 5, user: 'premieregirl', time: '8m', status: 'approved', image: 'https://images.unsplash.com/photo-1524985069026-dd778a71c7b4?q=80&w=900&auto=format&fit=crop', caption: 'Zie je zo in de zaal!' },
  { id: 6, user: 'moviereporter', time: '10m', status: 'rejected', image: 'https://images.unsplash.com/photo-1478720568477-152d9b164e26?q=80&w=900&auto=format&fit=crop', caption: 'Test story' }
];

function StoryCard({ story }) {
  return (
    <article className="story">
      <img src={story.image} alt={story.user} />
      <div className="user">
        <div className="avatar" />
        <div>
          <div className="username">{story.user}</div>
          <div className="time">{story.time}</div>
        </div>
        <div className="badge">◎</div>
      </div>
      <div className="caption">
        {story.caption}
        <span className="tag">@sonypicturesnl</span>
      </div>
    </article>
  );
}

export default function Page() {
  const [mode, setMode] = useState('cinema');
  const [cta, setCta] = useState('Maak je story en tag @sonypicturesnl');
  const [subtitle, setSubtitle] = useState('Deel jouw moment. Zie jezelf op het grote doek!');
  const [stories, setStories] = useState(startStories);

  const approved = useMemo(() => stories.filter(s => s.status === 'approved').slice(0, 4), [stories]);
  const stats = {
    new: stories.filter(s => s.status === 'new').length,
    approved: stories.filter(s => s.status === 'approved').length,
    rejected: stories.filter(s => s.status === 'rejected').length
  };

  function setStatus(id, status) {
    setStories(items => items.map(item => item.id === id ? { ...item, status } : item));
  }

  return (
    <main className={`app ${mode === 'cinema' ? 'display-only' : ''}`}>
      <div className="background" />
      <div className="glow" />
      <div className="content">
        <header className="top">
          <div>
            <div className="brand-eyebrow">Witness how he became He-Man</div>
            <h1 className="title">Masters of the Universe</h1>
            <div className="date"><span>4 juni</span> in de bioscoop</div>
          </div>
          <nav className="controls">
            <button className={mode === 'moderation' ? 'active' : ''} onClick={() => setMode('moderation')}>Moderatie</button>
            <button className={mode === 'cinema' ? 'active' : ''} onClick={() => setMode('cinema')}>Cinema</button>
            <button onClick={() => document.documentElement.requestFullscreen?.()}>Fullscreen</button>
          </nav>
        </header>

        <section className="cta">
          <div className="insta">◎</div>
          <div>
            <h2>{cta.replace('@sonypicturesnl', '')}<span>@sonypicturesnl</span></h2>
            <p>{subtitle}</p>
          </div>
        </section>

        <section className="main">
          <aside className="panel">
            <h3>Event instellingen</h3>
            <div className="field">
              <label>Call to action</label>
              <input value={cta} onChange={e => setCta(e.target.value)} />
            </div>
            <div className="field">
              <label>Subregel</label>
              <input value={subtitle} onChange={e => setSubtitle(e.target.value)} />
            </div>
            <h3>Moderatie</h3>
            <div className="mini-list">
              {stories.map(story => (
                <div className="mini-item" key={story.id}>
                  <span>@{story.user}</span>
                  <span className="mini-actions">
                    <button onClick={() => setStatus(story.id, 'approved')}>✓</button>
                    <button onClick={() => setStatus(story.id, 'rejected')}>×</button>
                  </span>
                </div>
              ))}
            </div>
          </aside>

          <section className="story-grid">
            {approved.map(story => <StoryCard key={story.id} story={story} />)}
          </section>
        </section>

        <footer className="bottom">
          <div className="stat"><div className="stat-label">Nieuw binnen</div><div className="stat-value">{stats.new}</div></div>
          <div className="stat"><div className="stat-label">Goedgekeurd</div><div className="stat-value">{stats.approved}</div></div>
          <div className="stat"><div className="stat-label">Afgewezen</div><div className="stat-value">{stats.rejected}</div></div>
          <div className="stat"><div className="stat-label">Laatste update</div><div className="stat-value">10:24</div></div>
        </footer>
      </div>
    </main>
  );
}
