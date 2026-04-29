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

  useEffect(() => {
    fetchStories();

    const interval = setInterval(fetchStories, 3000);
    return () => clearInterval(interval);
  }, []);

  async function fetchStories() {
    const { data, error } = await supabase
      .from('stories')
      .select('*')
      .eq('status', 'approved')
      .order('created_at', { ascending: false });

    if (!error) {
      setStories(data);
    }
  }

  return (
  <main className="app screen">
    <div className="background" />
    <div className="glow" />

    <div className="screen-shell">
      <Brand />

      <div className="cta-wrapper">
        <CTA />
      </div>

      <StoryGrid stories={stories} />
    </div>
  </main>
);
