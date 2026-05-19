'use client'

import { useState } from 'react'
import { supabase } from '@/lib/supabase'

export default function Home() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [service, setService] = useState('')


  const handleSubmit = async () => {
    const { error } = await supabase.from('waitlist').insert([
      {
        name,
        email,
        service,
      },
    ])

    if (error) {
      console.error(error)
      alert(error.message)
    } else {
      alert('Joined waitlist!')
      setName('')
      setEmail('')
      setService('')
    }
  }

  








  

  return (
    <main className="p-10 flex flex-col gap-4 max-w-md">
      <h1 className="text-3xl font-bold">Beauty Dash</h1>

      <input
        className="border p-2"
        placeholder="Name"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />

      <input
        className="border p-2"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />

      <input
        className="border p-2"
        placeholder="Service"
        value={service}
        onChange={(e) => setService(e.target.value)}
      />

      <button
        className="bg-black text-white p-2 rounded"
        onClick={handleSubmit}
      >
        Join Waitlist
      </button>
 

  

    </main>
  )
}