'use client';

import { useEffect, useState } from 'react';
import { supabase } from '../supabase';

export default function AdminPage() {
  const [settings, setSettings] = useState(null);

  // ophalen van settings
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

  // update functie
  async function updateSetting(key, value) {
    const updated = { ...settings, [key]: value };
    setSettings(updated);

    await supabase
      .from('site_settings')
      .update({ [key]: value })
      .eq('id', 1);
  }

  if (!settings) return <p style={{ padding: 40 }}>Loading...</p>;

  return (
<main className="admin-control-page">
  <h1>Admin controls</h1>
  <h2>Tekst aanpassen</h2>

<div>
  <label>CTA titel</label>
  <input
    type="text"
    value={settings.cta_title || ''}
    onChange={(e) => updateSetting('cta_title', e.target.value)}
  />
</div>

<div>
  <label>Instagram handle</label>
  <input
    type="text"
    value={settings.cta_handle || ''}
    onChange={(e) => updateSetting('cta_handle', e.target.value)}
  />
</div>

<div>
  <label>Hashtag</label>
  <input
    type="text"
    value={settings.cta_hashtag || ''}
    onChange={(e) => updateSetting('cta_hashtag', e.target.value)}
  />
</div>

<h2>Beeld aanpassen</h2>

<div>
  <label>Logo url</label>
  <input
    type="text"
    value={settings.logo_url || ''}
    onChange={(e) => updateSetting('logo_url', e.target.value)}
  />
</div>

<div>
  <label>Achtergrond afbeelding url</label>
  <input
    type="text"
    value={settings.background_url || ''}
    onChange={(e) => updateSetting('background_url', e.target.value)}
  />
</div>

<div>
  <label>YouTube trailer url</label>
  <input
    type="text"
    value={settings.background_youtube_url || ''}
    onChange={(e) => updateSetting('background_youtube_url', e.target.value)}
  />
</div>
<h2>Tekst aanpassen</h2>

<div>
  <label>CTA titel</label>
  <input
    type="text"
    value={settings.cta_title || ''}
    onChange={(e) => updateSetting('cta_title', e.target.value)}
  />
</div>

<div>
  <label>Instagram handle</label>
  <input
    type="text"
    value={settings.cta_handle || ''}
    onChange={(e) => updateSetting('cta_handle', e.target.value)}
  />
</div>

<div>
  <label>Hashtag</label>
  <input
    type="text"
    value={settings.cta_hashtag || ''}
    onChange={(e) => updateSetting('cta_hashtag', e.target.value)}
  />
</div>

<h2>Beeld aanpassen</h2>

<div>
  <label>Logo url</label>
  <input
    type="text"
    value={settings.logo_url || ''}
    onChange={(e) => updateSetting('logo_url', e.target.value)}
  />
</div>

<div>
  <label>Achtergrond url</label>
  <input
    type="text"
    value={settings.background_url || ''}
    onChange={(e) => updateSetting('background_url', e.target.value)}
  />
</div>

<div>
  <label>YouTube trailer url</label>
  <input
    type="text"
    value={settings.background_youtube_url || ''}
    onChange={(e) => updateSetting('background_youtube_url', e.target.value)}
  />
</div>
      <h2>Logo positie</h2>

      <div>
        <label>Top: {settings.brand_top}</label>
        <input
          type="range"
          min="0"
          max="100"
          value={settings.brand_top || 0}
          onChange={(e) =>
            updateSetting('brand_top', Number(e.target.value))
          }
        />
      </div>

      <div>
        <label>Left: {settings.brand_left}</label>
        <input
          type="range"
          min="0"
          max="100"
          value={settings.brand_left || 0}
          onChange={(e) =>
            updateSetting('brand_left', Number(e.target.value))
          }
        />
      </div>

      <h2>CTA positie</h2>

      <div>
        <label>Top: {settings.cta_top}</label>
        <input
          type="range"
          min="0"
          max="100"
          value={settings.cta_top || 0}
          onChange={(e) =>
            updateSetting('cta_top', Number(e.target.value))
          }
        />
      </div>

      <div>
        <label>Left: {settings.cta_left}</label>
        <input
          type="range"
          min="0"
          max="100"
          value={settings.cta_left || 0}
          onChange={(e) =>
            updateSetting('cta_left', Number(e.target.value))
          }
        />
      </div>
<h2>Stories blok</h2>

<div>
  <label>Top: {settings.stories_top}</label>
  <input
    type="range"
    min="0"
    max="100"
    value={settings.stories_top || 0}
    onChange={(e) =>
      updateSetting('stories_top', Number(e.target.value))
    }
  />
</div>

<div>
  <label>Left: {settings.stories_left}</label>
  <input
    type="range"
    min="0"
    max="100"
    value={settings.stories_left || 0}
    onChange={(e) =>
      updateSetting('stories_left', Number(e.target.value))
    }
  />
</div>

<div>
  <label>Width: {settings.stories_width}</label>
  <input
    type="range"
    min="40"
    max="100"
    value={settings.stories_width || 90}
    onChange={(e) =>
      updateSetting('stories_width', Number(e.target.value))
    }
  />
</div>
    </main>
  );
}
