'use client';

import { useEffect, useMemo, useState } from 'react';
import { startStories } from './data';
import { supabase, supabaseConfigured } from './supabase';
import { Brand, CTA, StoryGrid } from './components';

export default function AdminPage() {
  const [stories, setStories] = useState(startStories);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  async function loadStories() {
    if (!supabaseConfigured) {
      setMessage('Supabase keys ontbreken in Vercel. Demo data wordt getoond.');
      return;
    }

    const { data, error } = await supabase
      .from('stories')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      setMessage(error.message);
      return;
    }

    setStories(data && data.length ? data : startStories);
  }

  useEffect(() => {
    loadStories();
    const interval = setInterval(loadStories, 2500);
    return () => clearInterval(interval);
  }, []);

  async function setStatus(id, status) {
    if (String(id).startsWith('demo-')) return;
    setLoading(true);
    const { error } = await supabase
      .from('stories')
      .update({ status })
      .eq('id', id);

    if (error) setMessage(error.message);
    await loadStories();
    setLoading(false);
  }

  const approved = useMemo(() => stories.filter((story) => story.status === 'approved'), [stories]);
  const incoming = stories.filter((story) => story.status === 'new');
  const rejected = stories.filter((story) => story.status === 'rejected');
  const stats = {
    new: incoming.length,
    approved: approved.length,
    rejected: rejected.length
  };

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
          </nav>
        </header>

        {message ? <div className="notice">{message}</div> : null}

        <section className="admin-stats">
          <div><span>Nieuw</span><strong>{stats.new}</strong></div>
          <div><span>Goedgekeurd</span><strong>{stats.approved}</strong></div>
          <div><span>Afgewezen</span><strong>{stats.rejected}</strong></div>
        </section>

        <section className="admin-layout">
          <div className="admin-panel">
            <h2>Nieuw binnen</h2>
            {incoming.length === 0 ? <p className="empty">Nog geen nieuwe uploads.</p> : null}
            {incoming.map((story) => (
              <div className="moderation-item" key={story.id}>
                <img src={story.image_url} alt="" />
                <div><strong>{story.user_name || '@gast'}</strong><p>{story.caption}</p></div>
                <button disabled={loading} onClick={() => setStatus(story.id, 'approved')}>Goed</button>
                <button disabled={loading} onClick={() => setStatus(story.id, 'rejected')}>Afwijs</button>
              </div>
            ))}

            <h2 className="panel-subtitle">Afgewezen</h2>
            {rejected.map((story) => (
              <div className="moderation-item compact" key={story.id}>
                <img src={story.image_url} alt="" />
                <div><strong>{story.user_name || '@gast'}</strong><p>{story.caption}</p></div>
                <button disabled={loading} onClick={() => setStatus(story.id, 'approved')}>Terugzetten</button>
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
