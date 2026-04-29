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

 const [settings, setSettings] = useState({
  cta_kicker: 'ZIE JEZELF OP HET GROTE DOEK',
  cta_title: 'MAAK JE STORY EN TAG',
  cta_handle: '@SONYPICTURESNL',
  cta_hashtag: '#MASTERSOFTHEUNIVERSE',
  logo_url: '/motu-logo.png',
  background_url: '/background.jpg',
});

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
    <div
      className="background"
      style={{
        backgroundImage: `
          linear-gradient(90deg, rgba(3,3,7,.88), rgba(10,7,16,.62), rgba(3,3,7,.88)),
          url(${settings.background_url || '/motu-bg.jpg'})
        `,
      }}
    />

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

        {message ? <div className="notice">{message}</div> : null}

        <section className="admin-stats">
  <div><span>Nieuw</span><strong>{stats.new}</strong></div>
  <div><span>Goedgekeurd</span><strong>{stats.approved}</strong></div>
  <div><span>Afgewezen</span><strong>{stats.rejected}</strong></div>
</section>

<section className="settings-panel">
  <h2>Teksten aanpassen</h2>

  <input
    value={settings.cta_kicker}
    onChange={(e) => setSettings({ ...settings, cta_kicker: e.target.value })}
    placeholder="Kleine tekst"
  />

  <input
    value={settings.cta_title}
    onChange={(e) => setSettings({ ...settings, cta_title: e.target.value })}
    placeholder="Hoofdtitel"
  />

  <input
    value={settings.cta_handle}
    onChange={(e) => setSettings({ ...settings, cta_handle: e.target.value })}
    placeholder="Instagram handle"
  />

  <input
    value={settings.cta_hashtag}
    onChange={(e) => setSettings({ ...settings, cta_hashtag: e.target.value })}
    placeholder="Hashtag"
  />

  <input
    value={settings.logo_url}
    onChange={(e) => setSettings({ ...settings, logo_url: e.target.value })}
    placeholder="Logo URL, bv /motu-logo.png"
  />

  <input
    value={settings.background_url}
    onChange={(e) => setSettings({ ...settings, background_url: e.target.value })}
    placeholder="Achtergrond URL, bv /motu-bg.jpg"
  />

  <p>Upload achtergrond</p>
  <input
    type="file"
    accept="image/*"
    onChange={async (e) => {
      const file = e.target.files[0];
      if (!file) return;

      const fileName = `bg-${Date.now()}-${file.name}`;

      const { error } = await supabase.storage
        .from('artwork')
        .upload(fileName, file);

      if (error) {
        alert('Upload mislukt');
        return;
      }

      const { data } = supabase.storage
        .from('artwork')
        .getPublicUrl(fileName);

      setSettings({
        ...settings,
        background_url: data.publicUrl,
      });
    }}
  />

  <p>Upload logo</p>
  <input
    type="file"
    accept="image/*"
    onChange={async (e) => {
      const file = e.target.files[0];
      if (!file) return;

      const fileName = `logo-${Date.now()}-${file.name}`;

      const { error } = await supabase.storage
        .from('artwork')
        .upload(fileName, file);

      if (error) {
        alert('Upload mislukt');
        return;
      }

      const { data } = supabase.storage
        .from('artwork')
        .getPublicUrl(fileName);

      setSettings({
        ...settings,
        logo_url: data.publicUrl,
      });
    }}
  />

  <button
    onClick={async () => {
      const { error } = await supabase
        .from('site_settings')
        .upsert({ ...settings, id: 1 });

      setMessage(error ? error.message : 'Instellingen opgeslagen');
    }}
  >
    Opslaan
  </button>
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
          <div className="admin-preview">
            <Brand settings={settings} />
            <CTA settings={settings} />
            <StoryGrid stories={approved} />
          </div>
        </section>
      </div>
    </main>
  );
}
