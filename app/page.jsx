'use client'

import React, { useMemo, useState } from 'react'
import { Check, X, Star, Monitor, Shield, RefreshCw, Film, Pause, Play, Upload } from 'lucide-react'

const initialStories = [
  { id: 1, username: '@noorlucas', followers: '184K', status: 'new', type: 'Video', image: 'https://images.unsplash.com/photo-1524985069026-dd778a71c7b4?q=80&w=900&auto=format&fit=crop', note: 'Rode loper moment', createdAt: '20:11' },
  { id: 2, username: '@milanvdb', followers: '92K', status: 'new', type: 'Story', image: 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?q=80&w=900&auto=format&fit=crop', note: 'Tagde filmaccount', createdAt: '20:13' },
  { id: 3, username: '@saaronline', followers: '246K', status: 'approved', type: 'Video', image: 'https://images.unsplash.com/photo-1505686994434-e3cc5abf1330?q=80&w=900&auto=format&fit=crop', note: 'Cast selfie', createdAt: '20:15' },
  { id: 4, username: '@julianscene', followers: '61K', status: 'approved', type: 'Story', image: 'https://images.unsplash.com/photo-1536440136628-849c177e76a1?q=80&w=900&auto=format&fit=crop', note: 'Première look', createdAt: '20:16' },
  { id: 5, username: '@laurensmedia', followers: '338K', status: 'approved', type: 'Video', image: 'https://images.unsplash.com/photo-1517604931442-7e0c8ed2963c?q=80&w=900&auto=format&fit=crop', note: 'Zaal binnenkomst', createdAt: '20:18' },
  { id: 6, username: '@filmliefde', followers: '37K', status: 'approved', type: 'Story', image: 'https://images.unsplash.com/photo-1478720568477-152d9b164e26?q=80&w=900&auto=format&fit=crop', note: 'Poster wall', createdAt: '20:19' },
  { id: 7, username: '@emmavdberg', followers: '128K', status: 'favorite', type: 'Video', image: 'https://images.unsplash.com/photo-1440404653325-ab127d49abc1?q=80&w=900&auto=format&fit=crop', note: 'Hoofdcast aanwezig', createdAt: '20:21' }
]

function StoryCard({ story, setStatus }) {
  return <div className="card">
    <div className="media"><img src={story.image} alt=""/><span className="badge">{story.type}</span><div className="overlay"><strong>{story.username}</strong><br/><small>{story.followers} volgers · {story.createdAt}</small></div></div>
    <div className="body"><p>{story.note}</p><div className="row"><button className="btn" onClick={() => setStatus(story.id, 'approved')}><Check size={16}/>Goed</button><button className="btn secondary" onClick={() => setStatus(story.id, 'favorite')}><Star size={16}/></button><button className="btn outline" onClick={() => setStatus(story.id, 'rejected')}><X size={16}/></button></div></div>
  </div>
}

function DisplayWall({ stories }) {
  const approved = stories.filter(s => s.status === 'approved' || s.status === 'favorite').slice(0, 5)
  return <div className="screen">
    <div className="screenHead"><div><div className="kicker"><Film size={16}/> Premiere Stories Wall</div><h2>Tag @filmaccount in je story</h2></div><div className="pill">Live tijdens inloop</div></div>
    <div className="screenGrid">{approved.map(story => <div className="tile" key={story.id}><img src={story.image} alt=""/><div className="tileText"><strong>{story.username}</strong><br/><small>{story.followers} volgers</small></div></div>)}</div>
  </div>
}

export default function Page() {
  const [stories, setStories] = useState(initialStories)
  const [mode, setMode] = useState('moderation')
  const [paused, setPaused] = useState(false)
  const [query, setQuery] = useState('')
  const setStatus = (id, status) => setStories(current => current.map(story => story.id === id ? { ...story, status } : story))
  const filtered = useMemo(() => stories.filter(story => `${story.username} ${story.note}`.toLowerCase().includes(query.toLowerCase())), [stories, query])
  const groups = { new: filtered.filter(s => s.status === 'new'), approved: filtered.filter(s => s.status === 'approved' || s.status === 'favorite'), rejected: filtered.filter(s => s.status === 'rejected') }
  return <main className="page"><div className="wrap">
    <header className="top"><div><div className="kicker">Prototype</div><h1>Premiere Stories Wall</h1><p>Moderatie en bioscoopscherm voor Instagram story mentions tijdens filmpremières.</p></div><div className="actions"><button className={mode === 'moderation' ? 'btn' : 'btn secondary'} onClick={() => setMode('moderation')}><Shield size={16}/>Moderatie</button><button className={mode === 'display' ? 'btn' : 'btn secondary'} onClick={() => setMode('display')}><Monitor size={16}/>Scherm</button><button className="btn outline" onClick={() => setPaused(!paused)}>{paused ? <Play size={16}/> : <Pause size={16}/>}{paused ? 'Hervat' : 'Pauze'}</button></div></header>
    {mode === 'display' ? <DisplayWall stories={stories}/> : <><section className="stats"><div className="stat"><span>Nieuw</span><strong>{groups.new.length}</strong></div><div className="stat"><span>Goedgekeurd</span><strong>{groups.approved.length}</strong></div><div className="stat"><span>Afgewezen</span><strong>{groups.rejected.length}</strong></div><div className="stat"><span>Refresh</span><strong><RefreshCw size={24}/> 12 sec</strong></div></section><section className="toolbar"><input className="search" value={query} onChange={e => setQuery(e.target.value)} placeholder="Zoek op username of notitie"/><button className="btn"><Upload size={16}/>Nieuwe mentions ophalen</button></section><section className="grid"><div className="column"><h2>Nieuw binnen</h2><div className="cards">{groups.new.map(s => <StoryCard key={s.id} story={s} setStatus={setStatus}/>)}</div></div><div className="column"><h2>Op scherm</h2><div className="cards">{groups.approved.map(s => <StoryCard key={s.id} story={s} setStatus={setStatus}/>)}</div></div><div className="column"><h2>Afgewezen</h2><div className="cards">{groups.rejected.map(s => <StoryCard key={s.id} story={s} setStatus={setStatus}/>)}</div></div></section></>}
  </div></main>
}
