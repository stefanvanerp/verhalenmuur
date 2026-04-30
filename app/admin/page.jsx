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
    <main style={{ padding: 40 }}>
      <h1>Admin controls</h1>

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
    </main>
  );
}
