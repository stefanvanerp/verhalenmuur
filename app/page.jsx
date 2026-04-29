'use client';

import { useEffect, useMemo, useState } from 'react';
import { startStories } from './data';
import { supabase, supabaseConfigured } from './supabase';
import { Brand, CTA, StoryGrid } from './components';

function StoryPreview({ story, controls = false }) {
  const isVideo =
    story.media_type === 'video' ||
    story.image_url?.includes('.mp4') ||
    story.image_url?.includes('video');

  return (
    <div className="story-preview">
      {isVideo ? (
        <video
          src={story.image_url}
          controls={controls}
          muted
          playsInline
        />
      ) : (
        <img src={story.image_url} alt="Story" />
      )}
    </div>
  );
}

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

    setStories(data || []);
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

  const approved = useMemo(
    () => stories.filter((story) => story.status === 'approved'),
    [stories]
  );

  const incoming = useMemo(
    () => stories.filter((story) => story.status === 'new' || story.status === 'pending'),
    [stories]
  );

  const rejected = useMemo(
    () => stories.filter((story) => story.status === 'rejected'),
    [stories]
  );

  const stats = {
    new: incoming.length,
    approved: approved.length,
    rejected: rejected.length,
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
            <h2 className="panel-subtitle">Nieuw</h2>

            {incoming.map((story) => (
              <div className="moderation-item" key={story.id}>
                <StoryPreview story={story} controls />

                <strong>{story.username || '@gast'}</strong>

                <button disabled={loading} onClick={() => setStatus(story.id, 'approved')}>
                  Goed
                </button>

                <button disabled={loading} onClick={() => setStatus(story.id, 'rejected')}>
                  Afwijs
                </button>
              </div>
            ))}

            <h2 className="panel-subtitle">Goedgekeurd</h2>

            {approved.map((story) => (
              <div className="moderation-item compact" key={story.id}>
                <StoryPreview story={story} />

                <strong>{story.username || '@gast'}</strong>

                <button disabled={loading} onClick={() => setStatus(story.id, 'pending')}>
                  Terughalen
                </button>
              </div>
            ))}

            <h2 className="panel-subtitle">Afgewezen</h2>

            {rejected.map((story) => (
              <div className="moderation-item compact" key={story.id}>
                <StoryPreview story={story} />

                <strong>{story.username || '@gast'}</strong>

                <button disabled={loading} onClick={() => setStatus(story.id, 'pending')}>
                  Terugzetten
                </button>
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
