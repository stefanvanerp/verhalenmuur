'use client';

import { useEffect, useState } from 'react';
import { Brand, CTA, StoryGrid } from '../components';
import { createClient } from '@supabase/supabase-js';
function getYouTubeId(url) {
  if (!url) return null;

  const match = url.match(
    /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([^&?/]+)/
  );

  return match ? match[1] : null;
}
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
const youtubeId = getYouTubeId(settings?.background_youtube_url);
return (
  <main className="app screen">
    {youtubeId && (
      <iframe
        className="youtube-background"
        src={`https://www.youtube.com/embed/${youtubeId}?autoplay=1&mute=1&loop=1&playlist=${youtubeId}&controls=0&showinfo=0&modestbranding=1&playsinline=1`}
        allow="autoplay; encrypted-media"
      />
    )}

    {!youtubeId && (
      <div
        className="background"
        style={{
          backgroundImage: `
            linear-gradient(90deg, rgba(3,3,7,.88), rgba(10,7,16,.62), rgba(3,3,7,.88)),
            url(${settings?.background_url || '/motu-bg.jpg'})
          `,
        }}
      />
    )}

    <div className="glow" />

    <div className="screen-shell">
      <Brand settings={settings} />

      <div className="cta-wrapper cinematic-cta">
        <CTA settings={settings} />
      </div>

      <div className="stories-lower">
        <StoryGrid stories={stories} />
      </div>
    </div>
  </main>
);
)}
    {settings?.background_video_url && (
      <video
        className="video-background"
        src={settings.background_video_url}
        autoPlay
        muted
        loop
        playsInline
      />
    )}

    {!settings?.background_video_url && (
      <div
        className="background"
        style={{
          backgroundImage: `
            linear-gradient(90deg, rgba(3,3,7,.88), rgba(10,7,16,.62), rgba(3,3,7,.88)),
            url(${settings?.background_url || '/motu-bg.jpg'})
          `,
        }}
      />
    )}

    <div className="glow" />

    <div className="screen-shell">
      <Brand settings={settings} />

      <div className="cta-wrapper cinematic-cta">
        <CTA settings={settings} />
      </div>

      <div className="stories-lower">
        <StoryGrid stories={stories} />
      </div>
    </div>
  </main>
);
}
