'use client';

import { useEffect, useMemo, useState } from 'react';
import { supabase } from './supabase';
import { Brand, CTA, StoryGrid } from './components';

function StoryPreview({ story, controls = false }) {
  const isVideo =
    story.media_type === 'video' ||
    story.image_url?.includes('.mp4') ||
    story.image_url?.includes('video');

  return (
    <div className="story-preview">
      {isVideo ? (
        <video src={story.image_url} controls={controls} muted playsInline />
      ) : (
        <img src={story.image_url} alt="Story" />
      )}
    </div>
  );
}

export default function AdminPage() {
  const [settings, setSettings] = useState({});
  const [stories, setStories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  async function loadStories() {
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

  async function loadSettings() {
    const { data, error } = await supabase
      .from('site_settings')
      .select('*')
      .eq('id', 1)
      .single();

    if (error) {
      setMessage(error.message);
      return;
    }

    setSettings(data || {});
  }

  async function handleBackgroundImageUpload(e) {
    const file = e.target.files?.[0];
    if (!file) return;

    const fileName = `backgrounds/bg-${Date.now()}-${file.name}`;

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

    setSettings((prev) => ({
      ...prev,
      background_url: data.publicUrl,
      background_video_url: '',
    }));
  }

  async function handleBackgroundVideoUpload(e) {
    const file = e.target.files?.[0];
    if (!file) return;

    const fileName = `backgrounds/video-${Date.now()}-${file.name}`;

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

    setSettings((prev) => ({
      ...prev,
      background_video_url: data.publicUrl,
    }));
  }

  async function handleLogoUpload(e) {
    const file = e.target.files?.[0];
    if (!file) return;

    const fileName = `logos/logo-${Date.now()}-${file.name}`;

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

    setSettings((prev) => ({
      ...prev,
      logo_url: data.publicUrl,
    }));
  }

  async function saveSettings() {
    const { error } = await supabase
      .from('site_settings')
      .upsert({ ...settings, id: 1 });

    if (error) {
      alert(error.message);
      return;
    }

    alert('Instellingen opgeslagen');
  }

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

async function deleteStory(id) {
  const confirmed = window.confirm(
    'Weet je zeker dat je deze story definitief wilt verwijderen?'
  );

  if (!confirmed) return;

  setLoading(true);

  const { error } = await supabase
    .from('stories')
    .delete()
    .eq('id', id);

  if (error) setMessage(error.message);

  await loadStories();
  setLoading(false);
}

  useEffect(() => {
    loadStories();
    loadSettings();

    const interval = setInterval(loadStories, 2500);
    return () => clearInterval(interval);
  }, []);

  const approved = useMemo(
    () => stories.filter((story) => story.status === 'approved'),
    [stories]
  );

  const incoming = useMemo(
    () =>
      stories.filter(
        (story) => story.status === 'new' || story.status === 'pending'
      ),
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
            url(${settings?.background_url || '/motu-bg.jpg'})
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
            <a href="/screen" target="_blank" rel="noreferrer">
              Open bioscoopscherm
            </a>
          </nav>
        </header>

        {message ? <div className="notice">{message}</div> : null}

        <section className="admin-stats">
          <div>
            <span>Nieuw</span>
            <strong>{stats.new}</strong>
          </div>
          <div>
            <span>Goedgekeurd</span>
            <strong>{stats.approved}</strong>
          </div>
          <div>
            <span>Afgewezen</span>
            <strong>{stats.rejected}</strong>
          </div>
        </section>


      

        <section className="admin-layout">
          <div className="admin-panel">
            <h2 className="panel-subtitle">Nieuw</h2>

            {incoming.map((story) => (
              <div className="moderation-item" key={story.id}>
                <StoryPreview story={story} controls />

                <strong>{story.username || '@gast'}</strong>

                <button
                  disabled={loading}
                  onClick={() => setStatus(story.id, 'approved')}
                >
                  Goed
                </button>

  <button
  disabled={loading}
  onClick={() => setStatus(story.id, 'rejected')}
>
  Afwijs
</button>

<button
  disabled={loading}
  onClick={() => setStatus(story.id, 'pending')}
>
  Terughalen
</button>

<button
  className="delete-button"
  disabled={loading}
  onClick={() => deleteStory(story.id)}
>
  Verwijder
</button>
              </div>
            ))}

            <h2 className="panel-subtitle">Goedgekeurd</h2>

            {approved.map((story) => (
              <div className="moderation-item compact" key={story.id}>
                <StoryPreview story={story} />

                <strong>{story.username || '@gast'}</strong>

                <button
                  disabled={loading}
                  onClick={() => setStatus(story.id, 'pending')}
                >
                  Terughalen
                </button>
              </div>
            ))}

            <h2 className="panel-subtitle">Afgewezen</h2>

            {rejected.map((story) => (
              <div className="moderation-item compact" key={story.id}>
                <StoryPreview story={story} />

                <strong>{story.username || '@gast'}</strong>

                <button
                  disabled={loading}
                  onClick={() => setStatus(story.id, 'pending')}
                >
                  Terugzetten
                </button>
              </div>
            ))}
          </div>

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
