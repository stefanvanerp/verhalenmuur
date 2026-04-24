'use client';

import { useState } from 'react';
import { STORAGE_KEY, startStories } from '../data';

function getStories() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : startStories;
  } catch {
    return startStories;
  }
}

export default function UploadPage() {
  const [user, setUser] = useState('');
  const [caption, setCaption] = useState('');
  const [image, setImage] = useState('');
  const [done, setDone] = useState(false);

  function handleFile(event) {
    const file = event.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => setImage(String(reader.result));
    reader.readAsDataURL(file);
  }

  function submit(event) {
    event.preventDefault();
    if (!user || !caption || !image) return;
    const current = getStories();
    const newStory = {
      id: Date.now(),
      user: user.replace('@', ''),
      time: 'nu',
      status: 'new',
      image,
      caption
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify([newStory, ...current]));
    setDone(true);
  }

  return (
    <main className="upload-page">
      <form className="upload-card" onSubmit={submit}>
        <div className="kicker">Verhalenmuur</div>
        <h1>Upload je story</h1>
        <p>Maak je story, tag @sonypicturesnl en upload hier je beeld voor het grote doek.</p>

        <label>Instagram naam
          <input value={user} onChange={(e) => setUser(e.target.value)} placeholder="@jouwnaam" />
        </label>

        <label>Caption
          <textarea value={caption} onChange={(e) => setCaption(e.target.value)} placeholder="Bijvoorbeeld: De kracht is terug!" />
        </label>

        <label>Foto of screenshot
          <input type="file" accept="image/*" onChange={handleFile} />
        </label>

        {image && <img className="upload-preview" src={image} alt="Preview" />}

        <button type="submit">Insturen voor moderatie</button>
        {done && <div className="success">Gelukt! Je inzending staat klaar voor moderatie.</div>}
      </form>
    </main>
  );
}
