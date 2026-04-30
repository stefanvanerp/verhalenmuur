'use client';

import { useEffect, useState } from 'react';
import { Brand, CTA, StoryGrid } from '../components';
import { supabase } from '../supabase';

function getYouTubeId(url) {
  if (!url) return null;

  const match = url.match(
    /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([^&?/]+)/
  );

  return match ? match[1] : null;
}

export default function ScreenPage() {
  const [stories, setStories] = useState([]);
  const [settings, setSettings] = useState(null);

  const youtubeId = getYouTubeId(settings?.background_youtube_url);

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

  useEffect(() => {
    const channel = supabase
      .channel('settings-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'site_settings',
        },
        () => {
          fetchSettings();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  return (
    <main className="app screen">
    {/* YouTube background disabled for production layout */}

      {!youtubeId && settings?.background_video_url && (
        <video
          className="video-background"
          src={settings.background_video_url}
          autoPlay
          muted
          loop
          playsInline
        />
      )}

    <div
  className="production-bg"
  style={{
    backgroundImage: `url(${settings?.background_url || '/motu-bg.jpg'})`,
  }}
/>
<div className="production-bg-overlay" />

      <div className="glow" />

      <div className="screen-shell">
  <div
    className="layer brand-layer"
    style={{
      top: settings?.brand_top || '40px',
      left: settings?.brand_left || '40px',
    }}
  >
    <Brand settings={settings} />
  </div>

  <div
    className="layer cta-layer"
    style={{
      top: settings?.cta_top || '80px',
      left: settings?.cta_left || '50%',
      transform: 'translateX(-50%)',
    }}
  >
    <div className="cta-bar">
      <div className="cta-main">
        {settings?.cta_title || 'MAAK JE STORY EN TAG'}
      </div>

      <div className="cta-meta">
        <span>{settings?.cta_handle || '@SONYPICTURESNL'}</span>
        <span>{settings?.cta_hashtag || '#MASTERSOFTHEUNIVERSE'}</span>
      </div>
    </div>
  </div>

  <div className="stories-lower">
    <StoryGrid stories={stories} />
  </div>
</div>
</main>
);
}
