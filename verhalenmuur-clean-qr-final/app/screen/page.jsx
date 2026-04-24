'use client';

import { useEffect, useMemo, useState } from 'react';
import { STORAGE_KEY, startStories } from '../data';
import { Brand, CTA, QRFloating, StoryGrid } from '../components';

function loadStories() {
  if (typeof window === 'undefined') return startStories;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : startStories;
  } catch {
    return startStories;
  }
}

export default function ScreenPage() {
  const [stories, setStories] = useState(startStories);

  useEffect(() => {
    setStories(loadStories());
    const interval = setInterval(() => setStories(loadStories()), 2000);
    return () => clearInterval(interval);
  }, []);

  const approved = useMemo(() => stories.filter((story) => story.status === 'approved'), [stories]);

  return (
    <main className="app screen">
      <div className="background" />
      <div className="glow" />
      <div className="screen-shell">
        <Brand />
        <CTA />
        <QRFloating />
        <StoryGrid stories={approved} />
      </div>
    </main>
  );
}
