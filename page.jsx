'use client'
import { useState } from 'react'

const stories = [
  {id:1,user:'heman_fan',text:'De kracht is terug!',img:'/img1.jpg'},
  {id:2,user:'retrocollector',text:'He-Man terug!',img:'/img2.jpg'},
  {id:3,user:'cinemadude',text:'Movie night!',img:'/img3.jpg'},
  {id:4,user:'premieregirl',text:'Zie je zo!',img:'/img4.jpg'},
]

export default function Page(){
  const [mode,setMode]=useState('moderation')

  return (
    <div className={mode==='cinema'?'cinema':'moderation'}>
      <nav className="controls">
        <button onClick={()=>setMode('moderation')}>Moderatie</button>
        <button onClick={()=>setMode('cinema')}>Cinema</button>
      </nav>

      <header className="hero">
        <h1>Masters of the Universe</h1>
        <p>4 juni in de bioscoop</p>
      </header>

      <section className="cta">
        <h2>Zie jezelf op het grote doek</h2>
        <p>Maak je story en tag @sonypicturesnl</p>
      </section>

      <section className="story-grid">
        {stories.map(s=>(
          <div key={s.id} className="story-card">
            <div className="story-user">{s.user}</div>
            <div className="story-text">{s.text}</div>
          </div>
        ))}
      </section>
    </div>
  )
}
