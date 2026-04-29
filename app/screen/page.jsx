'use client';

import { useEffect, useState } from 'react';
import { Brand, CTA, StoryGrid } from '../components';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

export default function ScreenPage() {
  const [stories, setStories] = useState([]);
  const [settings, setSettings] = useState(null);

  async function fetchStories() {
    const { data } = await supabase
      .from('stories')
      .select('*')
      .eq('status', 'approved')
      .order('created_at', { ascending: false });

    if (data) setStories(data);
  }

  async function fetchSettings() {
    const { data } = await supabase
      .from('site_settings')
      .select('*')
      .eq('id', 1)
      .single();

    if (data) setSettings(data);
  }

  useEffect(() => {
    fetchStories();
    fetchSettings();

    const interval = setInterval(fetchStories, 3000);
    return () => clearInterval(interval);
  }, []);

   return (
    <main className="app screen">
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

      <div className="screen-shell">
<Brand settings={settings} />
        <div className="cta-wrapper cinematic-cta">
<CTA settings={settings} />        </div>

        <div className="stories-lower">
          <StoryGrid stories={stories} />
        </div>
      </div>
    </main>
  );
}
