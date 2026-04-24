'use client';

import { useState } from 'react';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

export default function UploadPage() {
  const [file, setFile] = useState(null);
  const [username, setUsername] = useState('');
  const [caption, setCaption] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleUpload(e) {
    e.preventDefault();
    if (!file) return;

    setLoading(true);

    const fileName = `${Date.now()}-${file.name}`;

    // upload naar storage
    const { error: uploadError } = await supabase.storage
      .from('stories')
      .upload(fileName, file);

    if (uploadError) {
      alert('Upload failed');
      setLoading(false);
      return;
    }

    // public URL ophalen
    const { data } = supabase.storage
      .from('stories')
      .getPublicUrl(fileName);

    const imageUrl = data.publicUrl;

    // in database zetten
    await supabase.from('stories').insert([
      {
        username,
        caption,
        image_url: imageUrl,
        status: 'pending'
      }
    ]);

    setLoading(false);
    alert('Upload gelukt!');

    setFile(null);
    setUsername('');
    setCaption('');
  }

  return (
    <main style={{ padding: 40 }}>
      <h1>Upload je story</h1>

      <form onSubmit={handleUpload}>
        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
        />

        <br /><br />

        <input
          type="text"
          placeholder="Caption"
          value={caption}
          onChange={(e) => setCaption(e.target.value)}
        />

        <br /><br />

        <input
          type="file"
          accept="image/*"
          onChange={(e) => setFile(e.target.files[0])}
          required
        />

        <br /><br />

        <button disabled={loading}>
          {loading ? 'Uploading...' : 'Upload'}
        </button>
      </form>
    </main>
  );
}
