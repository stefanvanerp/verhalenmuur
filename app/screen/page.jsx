'use client';

import { useEffect, useState } from 'react';
import { startStories } from '../data';
import { supabase, supabaseConfigured } from '../supabase';
import { Brand, CTA, QRFloating, StoryGrid } from '../components';

export default function ScreenPage() {
  const [stories, setStories] = useState(startStories);

  async function loadStories() {
    if (!supabaseConfigured) return;

    const { data, error } = await supabase
      .from('stories')
      .select('*')
      .eq('status', 'approved')
      .order('created_at', { ascending: false })
      .limit(12);

    if (!error && data && data.length) setStories(data);
  }

  useEffect(() => {
    loadStories();
    const interval = setInterval(loadStories, 2500);
    return () => clearInterval(interval);
  }, []);

  return (
    <main className="app screen">
      <div className="background" />
      <div className="glow" />
      <div className="screen-shell">
        <Brand />
        <CTA />
        <QRFloating />
        <StoryGrid stories={stories} />
      </div>
    </main>
  );
}
