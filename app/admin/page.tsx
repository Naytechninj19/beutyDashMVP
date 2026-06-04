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
  const [claimedSlotsCount, setClaimedSlotsCount] = useState(0)
  const [reservationsCount, setReservationsCount] = useState(0)
  const [recentReservations, setRecentReservations] = useState<any[]>([])



  const sendClaimEmail = async (
  clientEmail: string,
  clientName: string,
  link: string
) => {
  const response = await fetch('/api/send-claim-email', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      email: clientEmail,
      name: clientName,
      claimLink: link,
    }),
  })

  const result = await response.json()
  console.log(result)

  return result
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
          claimed: false,
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

    for (const client of waitlistClients) {
  await sendClaimEmail(client.email, client.name, link)
}


      alert('Fake cancellation triggered and emails sent!')
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
    .eq('claimed', false)
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
    fetchDashboardStats()
    fetchRecentReservations()
  }, [])

  const copyClaimLink = async () => {
  await navigator.clipboard.writeText(claimLink)
  alert('Claim link copied!')
}

const fetchRecentReservations = async () => {
  const { data, error } = await supabase
    .from('reservations')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(3)

  if (error) {
    console.error(error)
    return
  }

  setRecentReservations(data)
}

const fetchDashboardStats = async () => {
  const { count: claimedCount, error: claimedError } = await supabase
    .from('slots')
    .select('*', { count: 'exact', head: true })
    .eq('claimed', true)

  if (claimedError) {
    console.error(claimedError)
  } else {
    setClaimedSlotsCount(claimedCount || 0)
  }

  const { count: reservationCount, error: reservationError } = await supabase
    .from('reservations')
    .select('*', { count: 'exact', head: true })

  if (reservationError) {
    console.error(reservationError)
  } else {
    setReservationsCount(reservationCount || 0)
  }

}


  return (
    <main className="p-10 flex flex-col gap-4 max-w-md">
      <h1 className="text-3xl font-bold">Beauty Dash Admin</h1>

      <div className="border border-green-600 p-3 rounded bg-green-900/20">
        <p className="font-bold">Monitoring Status</p>

  <p className="text-green-400"></p>
  <p>🟢 Calendly Connected</p>
</div>

<div className="grid grid-cols-2 gap-3">
  <div className="border p-3 rounded">
    <p className="text-sm text-gray-600">Waitlist Clients</p>
    <p className="text-2xl font-bold">{waitlistClients.length}</p>
  </div>

  <div className="border p-3 rounded">
    <p className="text-sm text-gray-600">Available Slots</p>
    <p className="text-2xl font-bold">{availableSlots.length}</p>
  </div>

  <div className="border p-3 rounded">
    <p className="text-sm text-gray-600">Claimed Slots</p>
    <p className="text-2xl font-bold">{claimedSlotsCount}</p>
  </div>

  <div className="border p-3 rounded">
    <p className="text-sm text-gray-600">Reservations</p>
    <p className="text-2xl font-bold">{reservationsCount}</p>
  </div>
</div>

<div className="border-t pt-4 mt-4">
  <h2 className="text-xl font-bold mb-2">Recent Activity</h2>

  {recentReservations.length === 0 ? (
    <p>No recent reservations yet.</p>
  ) : (
    <ul className="flex flex-col gap-2">
      {recentReservations.map((reservation) => (
        <li key={reservation.id} className="border p-2 rounded">
          <p>
            <strong>Reservation created</strong>
          </p>

          <p>
            <strong>Name:</strong> {reservation.client_name}
          </p>

          <p>
            <strong>Email:</strong> {reservation.client_email}
          </p>

          <p>
            <strong>Created:</strong>{' '}
            {new Date(reservation.created_at).toLocaleString()}
          </p>
        </li>
      ))}
    </ul>
  )}
</div>

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