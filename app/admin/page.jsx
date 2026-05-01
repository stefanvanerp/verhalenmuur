'use client';

import { useEffect, useState } from 'react';
import { supabase } from '../supabase';

const PRESETS = {
  cinema: {
    brand_top: 5,
    brand_left: 5,
    cta_top: 8,
    cta_left: 38,
    stories_top: 38,
    stories_left: 5,
    stories_width: 90,
  },
  compact: {
    brand_top: 4,
    brand_left: 4,
    cta_top: 12,
    cta_left: 32,
    stories_top: 44,
    stories_left: 8,
    stories_width: 84,
  },
  fullscreen: {
    brand_top: 4,
    brand_left: 4,
    cta_top: 6,
    cta_left: 50,
    stories_top: 34,
    stories_left: 3,
    stories_width: 94,
  },
};

export default function AdminPage() {
};
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
 async function updatePosition(key, value) {
  setSettings((current) => ({
    ...current,
    [key]: value,
  }));
async function applyPreset(name) {
  const preset = PRESETS[name];

  setSettings((current) => ({
    ...current,
    ...preset,
  }));

  await supabase
    .from('site_settings')
    .update(preset)
    .eq('id', 1);
}

async function resetLogo() {
  const reset = {
    brand_top: PRESETS.cinema.brand_top,
    brand_left: PRESETS.cinema.brand_left,
  };

  setSettings((current) => ({
    ...current,
    ...reset,
  }));

  await supabase.from('site_settings').update(reset).eq('id', 1);
}

async function resetCta() {
  const reset = {
    cta_top: PRESETS.cinema.cta_top,
    cta_left: PRESETS.cinema.cta_left,
  };

  setSettings((current) => ({
    ...current,
    ...reset,
  }));

  await supabase.from('site_settings').update(reset).eq('id', 1);
}

async function resetStories() {
  const reset = {
    stories_top: PRESETS.cinema.stories_top,
    stories_left: PRESETS.cinema.stories_left,
    stories_width: PRESETS.cinema.stories_width,
  };

  setSettings((current) => ({
    ...current,
    ...reset,
  }));

  await supabase.from('site_settings').update(reset).eq('id', 1);
}
  await supabase
    .from('site_settings')
    .update({ [key]: value })
    .eq('id', 1);
  }
async function uploadFile(file, folder) {
  if (!file) return null;

  const fileExt = file.name.split('.').pop();
  const fileName = `${folder}-${Date.now()}.${fileExt}`;
  const filePath = `${folder}/${fileName}`;

  const { error } = await supabase.storage
    .from('artwork')
    .upload(filePath, file, {
      upsert: true,
    });

  if (error) {
    alert('Upload mislukt');
    console.error(error);
    return null;
  }

  const { data } = supabase.storage
    .from('artwork')
    .getPublicUrl(filePath);

  return data.publicUrl;
}

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
if (!settings) {
  return <p className="admin-loading">Loading...</p>;
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
    onChange={(value) => updatePosition('brand_top', value)}
  />

  <Slider
    label="Links"
    value={settings.brand_left || 0}
    onChange={(value) => updatePosition('brand_left', value)}
  />
</div>

<div className="admin-card">
  <h2>CTA positie</h2>

  <Slider
    label="Boven"
    value={settings.cta_top || 0}
    onChange={(value) => updatePosition('cta_top', value)}
  />

  <Slider
    label="Links"
    value={settings.cta_left || 0}
    onChange={(value) => updatePosition('cta_left', value)}
  />
</div>

<div className="admin-card">
  <h2>Stories positie</h2>

  <Slider
    label="Boven"
    value={settings.stories_top || 0}
    onChange={(value) => updatePosition('stories_top', value)}
  />

  <Slider
    label="Links"
    value={settings.stories_left || 0}
    onChange={(value) => updatePosition('stories_left', value)}
  />

  <Slider
    label="Breedte"
    value={settings.stories_width || 90}
    min={40}
    max={100}
    onChange={(value) => updatePosition('stories_width', value)}
  />
</div>      </section>

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
