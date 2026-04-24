'use client';

import { useState } from 'react';
import { supabase, supabaseConfigured } from '../supabase';

export default function UploadPage() {
  const [file, setFile] = useState(null);
  const [userName, setUserName] = useState('');
  const [caption, setCaption] = useState('');
  const [preview, setPreview] = useState('');
  const [status, setStatus] = useState('');
  const [busy, setBusy] = useState(false);

  function onFileChange(event) {
    const selected = event.target.files?.[0];
    setFile(selected || null);
    setPreview(selected ? URL.createObjectURL(selected) : '');
  }

  async function submit(event) {
    event.preventDefault();
    if (!supabaseConfigured) {
      setStatus('Supabase is nog niet gekoppeld.');
      return;
    }
    if (!file) {
      setStatus('Kies eerst een foto of screenshot.');
      return;
    }

    setBusy(true);
    setStatus('Uploaden...');

    const safeName = file.name.replace(/[^a-z0-9.]/gi, '-').toLowerCase();
    const filePath = `${Date.now()}-${safeName}`;
    const { error: uploadError } = await supabase.storage
      .from('stories')
      .upload(filePath, file, { upsert: false });

    if (uploadError) {
      setStatus(uploadError.message);
      setBusy(false);
      return;
    }

    const { data: publicData } = supabase.storage.from('stories').getPublicUrl(filePath);

    const { error: insertError } = await supabase.from('stories').insert({
      user_name: userName || '@gast',
      caption: caption || 'Mijn première story',
      image_url: publicData.publicUrl,
      status: 'new'
    });

    if (insertError) {
      setStatus(insertError.message);
      setBusy(false);
      return;
    }

    setStatus('Gelukt! Je upload staat klaar voor moderatie.');
    setFile(null);
    setPreview('');
    setUserName('');
    setCaption('');
    event.target.reset();
    setBusy(false);
  }

  return (
    <main className="upload-page">
      <div className="upload-card">
        <img className="upload-logo" src="/motu-logo.png" alt="Masters of the Universe" />
        <h1>Zie jezelf op het grote doek</h1>
        <p>Upload je story screenshot of première foto. Na goedkeuring verschijnt hij op het bioscoopscherm.</p>

        <form onSubmit={submit} className="upload-form">
          <label>
            Instagram naam
            <input value={userName} onChange={(event) => setUserName(event.target.value)} placeholder="@jouwnaam" />
          </label>

          <label>
            Korte tekst
            <input value={caption} onChange={(event) => setCaption(event.target.value)} placeholder="Bijvoorbeeld: ready voor de film" />
          </label>

          <label>
            Upload beeld
            <input type="file" accept="image/*" onChange={onFileChange} />
          </label>

          {preview ? <img className="upload-preview" src={preview} alt="Preview" /> : null}

          <button disabled={busy} type="submit">{busy ? 'Uploaden...' : 'Insturen'}</button>
        </form>

        {status ? <div className="upload-status">{status}</div> : null}
      </div>
    </main>
  );
}
