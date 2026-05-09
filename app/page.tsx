'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'

export default function Home() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [service, setService] = useState('')
  const [claimLink, setClaimLink] = useState('')
  const [waitlistClients, setWaitlistClients] = useState<any[]>([])
  const [availableSlots, setAvailableSlots] = useState<any[]>([])

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
      fetchWaitlistClients()
    }
  }

  const triggerCancellation = async () => {
    const startTime = new Date()
    startTime.setDate(startTime.getDate() + 1)
    startTime.setHours(14, 0, 0, 0)

    const endTime = new Date(startTime)
    endTime.setHours(15, 0, 0, 0)

    const { data, error } = await supabase
      .from('slots')
      .insert([
        {
          service: 'Haircut',
          start_time: startTime.toISOString(),
          end_time: endTime.toISOString(),
          status: 'available',
        },
      ])
      .select()
      .single()

    if (error) {
      console.error(error)
      alert(error.message)
    } else {
      const link = `${window.location.origin}/claim/${data.id}`
      setClaimLink(link)
      fetchAvailableSlots()


      alert('Fake Cancellation triggered!')
    }
  }

  const fetchWaitlistClients = async () => {
  const { data, error } = await supabase
    .from('waitlist')
    .select('*')
    .order('created_at', { ascending: false })

  if (error) {
    console.error(error)
    return
  }

  setWaitlistClients(data)
}



const fetchAvailableSlots = async () => {
  const { data, error } = await supabase
    .from('slots')
    .select('*')
    .eq('status', 'available')
    .order('created_at', { ascending: false })

  if (error) {
    console.error(error)
    return
  }

  setAvailableSlots(data)
}

 useEffect(() => {
    fetchWaitlistClients()
    fetchAvailableSlots()
  }, [])

  const copyClaimLink = async () => {
  await navigator.clipboard.writeText(claimLink)
  alert('Claim link copied!')
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

      <button
        className="bg-blue-600 text-white p-2 rounded mt-4"
        onClick={triggerCancellation}
      >
        Trigger Fake Cancellation
      </button>

      <button
      className="bg-gray-800 text-white p-2 rounded mt-2"
      onClick={copyClaimLink}
      >
      Copy Claim Link
      </button>

      {claimLink && (
        <div className="border p-3 rounded mt-4">
          <p className="font-bold">Claim Link:</p>
          <a
            href={claimLink}
            className="text-blue-600 underline break-all"
          >
            {claimLink}
          </a>
        </div>
        
      )}

      <div className="border-t pt-4 mt-4">
  <h2 className="text-xl font-bold mb-2">Waitlist Clients</h2>

  {waitlistClients.length === 0 ? (
    <p>No clients on the waitlist yet.</p>
  ) : (
    <ul className="flex flex-col gap-2">
      {waitlistClients.map((client) => (
        <li key={client.id} className="border p-2 rounded">
          <p><strong>Name:</strong> {client.name}</p>
          <p><strong>Email:</strong> {client.email}</p>
          <p><strong>Service:</strong> {client.service}</p>
        </li>
      ))}
    </ul>
  )}
</div>

<div className="border-t pt-4 mt-4">
  <h2 className="text-xl font-bold mb-2">
    Available Slots
  </h2>

  {availableSlots.length === 0 ? (
    <p>No slots available yet.</p>
  ) : (
    <ul className="flex flex-col gap-2">
      {availableSlots.map((slot) => (
        <li
          key={slot.id}
          className="border p-2 rounded"
        >
          <p>
            <strong>Service:</strong> {slot.service}
          </p>

          <p>
            <strong>Status:</strong> {slot.status}
          </p>

          <p>
            <strong>Start:</strong>{' '}
            {new Date(slot.start_time).toLocaleString()}
          </p>

          <a
            href={`/claim/${slot.id}`}
            className="text-blue-600 underline"
          >
            Open claim page
          </a>
        </li>
      ))}
    </ul>
  )}
</div>
    </main>
  )
}