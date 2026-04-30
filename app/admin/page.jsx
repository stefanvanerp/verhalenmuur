'use client';

import { useEffect, useState } from 'react';
import { supabase } from '../supabase';

export default function AdminPage() {
  const [settings, setSettings] = useState(null);
  const [saved, setSaved] = useState(false);
  const [backgroundFile, setBackgroundFile] = useState(null);
const [logoFile, setLogoFile] = useState(null);

  async function fetchSettings() {
    const { data } = await supabase
      .from('site_settings')
      .select('*')
      .eq('id', 1)
      .single();

    if (data) setSettings(data);
  }

  useEffect(() => {
    fetchSettings();
  }, []);

  function updateLocal(key, value) {
    setSettings((current) => ({
      ...current,
      [key]: value,
    }));

    setSaved(false);
  }
async function uploadFile(file, folder) {
  if (!file) return null;

  const fileExt = file.name.split('.').pop();
  const fileName = `${folder}-${Date.now()}.${fileExt}`;
  const filePath = `${folder}/${fileName}`;

  const { error } = await supabase.storage
    .from('uploads')
    .upload(filePath, file, {
      upsert: true,
    });

  if (error) {
    alert('Upload mislukt');
    console.error(error);
    return null;
  }

  const { data } = supabase.storage
    .from('uploads')
    .getPublicUrl(filePath);

  return data.publicUrl;
async function saveSettings() {
  let nextSettings = { ...settings };

  if (backgroundFile) {
    const backgroundUrl = await uploadFile(backgroundFile, 'backgrounds');
    if (backgroundUrl) {
      nextSettings.background_url = backgroundUrl;
    }
  }

  if (logoFile) {
    const logoUrl = await uploadFile(logoFile, 'logos');
    if (logoUrl) {
      nextSettings.logo_url = logoUrl;
    }
  }

  const { error } = await supabase
    .from('site_settings')
    .update(nextSettings)
    .eq('id', 1);

  if (!error) {
    setSettings(nextSettings);
    setBackgroundFile(null);
    setLogoFile(null);
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  }
}

  return (
    <main className="admin-control-page">
      <header className="admin-control-header">
        <div>
          <p className="admin-kicker">Verhalenmuur</p>
          <h1>Admin controls</h1>
          <p>Pas tekst, beeld en positie aan voor het bioscoopscherm.</p>
        </div>

        <a className="admin-screen-button" href="/screen" target="_blank">
          Open bioscoopscherm
        </a>
      </header>

      <section className="admin-control-grid">
        <div className="admin-card">
          <h2>Tekst</h2>

          <label>CTA titel</label>
          <input
            type="text"
            value={settings.cta_title || ''}
            onChange={(e) => updateLocal('cta_title', e.target.value)}
          />

          <label>Instagram handle</label>
          <input
            type="text"
            value={settings.cta_handle || ''}
            onChange={(e) => updateLocal('cta_handle', e.target.value)}
          />

          <label>Hashtag</label>
          <input
            type="text"
            value={settings.cta_hashtag || ''}
            onChange={(e) => updateLocal('cta_hashtag', e.target.value)}
          />
        </div>

        <div className="admin-card">
          <h2>Beeld</h2>

          <label>Logo url</label>
          <input
            type="text"
            value={settings.logo_url || ''}
            onChange={(e) => updateLocal('logo_url', e.target.value)}
          />
<label>Achtergrond uploaden</label>
<input
  type="file"
  accept="image/*"
  onChange={(e) => setBackgroundFile(e.target.files[0])}
/>

<label>Logo uploaden</label>
<input
  type="file"
  accept="image/*"
  onChange={(e) => setLogoFile(e.target.files[0])}
/>
          <label>Achtergrond afbeelding url</label>
          <input
            type="text"
            value={settings.background_url || ''}
            onChange={(e) => updateLocal('background_url', e.target.value)}
          />

          <label>YouTube trailer url</label>
          <input
            type="text"
            value={settings.background_youtube_url || ''}
            onChange={(e) => updateLocal('background_youtube_url', e.target.value)}
          />
        </div>

        <div className="admin-card">
          <h2>Logo positie</h2>

          <Slider
            label="Boven"
            value={settings.brand_top || 0}
            onChange={(value) => updateLocal('brand_top', value)}
          />

          <Slider
            label="Links"
            value={settings.brand_left || 0}
            onChange={(value) => updateLocal('brand_left', value)}
          />
        </div>

        <div className="admin-card">
          <h2>CTA positie</h2>

          <Slider
            label="Boven"
            value={settings.cta_top || 0}
            onChange={(value) => updateLocal('cta_top', value)}
          />

          <Slider
            label="Links"
            value={settings.cta_left || 0}
            onChange={(value) => updateLocal('cta_left', value)}
          />
        </div>

        <div className="admin-card">
          <h2>Stories positie</h2>

          <Slider
            label="Boven"
            value={settings.stories_top || 0}
            onChange={(value) => updateLocal('stories_top', value)}
          />

          <Slider
            label="Links"
            value={settings.stories_left || 0}
            onChange={(value) => updateLocal('stories_left', value)}
          />

          <Slider
            label="Breedte"
            value={settings.stories_width || 90}
            min={40}
            max={100}
            onChange={(value) => updateLocal('stories_width', value)}
          />
        </div>
      </section>

      <div className="admin-save-bar">
        <button onClick={saveSettings}>
          Opslaan
        </button>

        {saved && <span>Opgeslagen</span>}
      </div>
    </main>
  );
}

function Slider({ label, value, onChange, min = 0, max = 100 }) {
  return (
    <div className="admin-slider">
      <div>
        <label>{label}</label>
        <strong>{value}</strong>
      </div>

      <input
        type="range"
        min={min}
        max={max}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
      />
    </div>
  );
}
