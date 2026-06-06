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
  <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[#0b0b0f] p-6 text-white">
    <div className="absolute left-0 top-0 h-[420px] w-[420px] rounded-full bg-blue-600/10 blur-[160px]" />
    <div className="absolute right-0 top-0 h-[420px] w-[420px] rounded-full bg-purple-600/10 blur-[160px]" />

    <div className="relative z-10 w-full max-w-md rounded-2xl border border-white/10 bg-white/5 p-8 shadow-2xl">
      <div className="mb-6">
        <p className="font-semibold text-pink-400">Beauty Dash</p>

        <h1 className="mt-2 text-3xl font-bold">
          Join the Waitlist
        </h1>

        <p className="mt-2 text-gray-400">
          Add your details and we&apos;ll notify you when a cancellation becomes available.
        </p>
      </div>

      <div className="flex flex-col gap-4">
        <input
          className="rounded-xl border border-white/10 bg-black/20 p-3 text-white outline-none placeholder:text-gray-500 focus:border-pink-500"
          placeholder="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />

        <input
          className="rounded-xl border border-white/10 bg-black/20 p-3 text-white outline-none placeholder:text-gray-500 focus:border-pink-500"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          className="rounded-xl border border-white/10 bg-black/20 p-3 text-white outline-none placeholder:text-gray-500 focus:border-pink-500"
          placeholder="Service"
          value={service}
          onChange={(e) => setService(e.target.value)}
        />

        <button
          className="mt-2 rounded-xl bg-gradient-to-r from-pink-500 to-purple-600 py-3 font-semibold text-white shadow-lg hover:opacity-90"
          onClick={handleSubmit}
        >
          Join Waitlist
        </button>
      </div>
    </div>
  </main>
)
}