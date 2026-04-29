'use client';

import { useEffect, useState } from 'react';
import { Brand, CTA, StoryGrid } from '../components';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

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
        <Brand settings={settings} />

     <div className="cinema-headline">
  <span>DEEL JE STORIES MET</span>
</div>

<div className="cta-bar">
  <strong>{settings?.cta_title || 'MAAK JE STORY EN TAG'}</strong>
  <span>{settings?.cta_handle || '@SONYPICTURESNL'}</span>
  <span>{settings?.cta_hashtag || '#MASTERSOFTHEUNIVERSE'}</span>
</div>

        <div className="stories-lower">
          <StoryGrid stories={stories} />
        </div>
      </div>
    </main>
  );
}
