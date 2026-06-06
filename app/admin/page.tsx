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
  <main className="relative min-h-screen overflow-hidden bg-[#0b0b0f] px-6 py-8 text-white">
    <div className="absolute left-0 top-0 h-[500px] w-[500px] rounded-full bg-blue-600/10 blur-[180px]" />

    <div className="absolute right-0 top-0 h-[500px] w-[500px] rounded-full bg-purple-600/10 blur-[180px]" />

    <div className="relative z-10 mx-auto flex max-w-7xl gap-6">
      <aside className="hidden w-56 flex-col rounded-xl border border-white/10 bg-white/[0.03] p-6 md:flex">
        <h2 className="mb-8 text-xl font-bold">Beauty Dash</h2>
          
        <nav className="flex flex-col gap-4 text-gray-300">
          <a
            href="#"
            className="rounded-lg bg-pink-500/20 px-3 py-2 text-pink-400"
          >
            Dashboard
          </a>

          <a href="#" className="px-3 py-2 text-gray-400 hover:text-white">
            Waitlist
          </a>

          <a href="#" className="px-3 py-2 text-gray-400 hover:text-white">
            Available Slots
          </a>

          <a href="#" className="px-3 py-2 text-gray-400 hover:text-white">
            Bookings
          </a>

          <a href="#" className="px-3 py-2 text-gray-400 hover:text-white">
            Activity Feed
          </a>
        </nav>

        <div className="pt-8 text-gray-500">Logout</div>
      </aside>

      <div className="flex-1">
        <h1 className="text-3xl font-bold tracking-tight md:hidden">
          Beauty Dash
        </h1>

        <p className="text-gray-400 md:hidden">
          Fill cancellations automatically.
        </p>

        <div className="mb-6 hidden md:block">
          <h1 className="text-3xl font-bold">Dashboard Overview</h1>

          <p className="mt-1 text-gray-400">
            Here&apos;s what&apos;s happening with your business today.
          </p>
        </div>

        <div className="rounded-xl border border-green-500/30 bg-green-500/10 p-5">
          <p className="text-sm font-medium text-gray-400">
            Monitoring Status
          </p>

          <div className="mt-3 flex items-center gap-2">
            <div className="h-3 w-3 rounded-full bg-green-400"></div>

            <p className="font-semibold">Calendly Connected</p>
          </div>

          <p className="mt-2 text-sm text-gray-400">
            Monitoring cancellations automatically
          </p>
        </div>

        <div className="mt-4 grid grid-cols-2 gap-4 md:grid-cols-4">
          <div className="rounded-xl border border-white/10 bg-white/[0.04] p-5 shadow-lg">
            <p className="text-sm text-gray-400">Waitlist Clients</p>
            <p className="mt-2 text-3xl font-bold">
              {waitlistClients.length}
            </p>
            <p className="mt-1 text-xs text-pink-400">People waiting</p>
          </div>

          <div className="rounded-xl border border-white/10 bg-white/[0.04] p-5 shadow-lg">
            <p className="text-sm text-gray-400">Available Slots</p>
            <p className="mt-2 text-3xl font-bold">
              {availableSlots.length}
            </p>
            <p className="mt-1 text-xs text-pink-400">Ready to claim</p>
          </div>

          <div className="rounded-xl border border-white/10 bg-white/[0.04] p-5 shadow-lg">
            <p className="text-sm text-gray-400">Claimed Slots</p>
            <p className="mt-2 text-3xl font-bold">{claimedSlotsCount}</p>
            <p className="mt-1 text-xs text-green-400">
              Successfully claimed
            </p>
          </div>

          <div className="rounded-xl border border-white/10 bg-white/[0.04] p-5 shadow-lg">
            <p className="text-sm text-gray-400">Reservations</p>
            <p className="mt-2 text-3xl font-bold">{reservationsCount}</p>
            <p className="mt-1 text-xs text-purple-400">Bookings created</p>
          </div>
        </div>

        <div className="mt-8 border-t border-white/10 pt-8">
          <h2 className="mb-4 text-2xl font-bold">Recent Activity</h2>

          {recentReservations.length === 0 ? (
            <p>No recent reservations yet.</p>
          ) : (
            <ul className="flex flex-col gap-2">
              {recentReservations.map((reservation) => (
                <li
                  key={reservation.id}
                  className="rounded-xl border border-white/10 bg-white/5 p-4"
                >
                  <p className="font-semibold text-pink-400">
                    Booking Confirmed
                  </p>

                  <p className="mt-2 font-medium">
                    {reservation.client_name}
                  </p>

                  <p className="text-sm text-gray-400">
                    {reservation.client_email}
                  </p>

                  <p className="mt-2 text-sm text-gray-500">
                    {new Date(reservation.created_at).toLocaleString()}
                  </p>
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="mt-6 flex flex-col gap-3 sm:flex-row">
          <button
            className="rounded-xl bg-gradient-to-r from-pink-500 to-purple-600 px-5 py-3 font-semibold text-white shadow-lg hover:opacity-90"
            onClick={triggerCancellation}
          >
            Trigger Fake Cancellation
          </button>

          <button
            className="rounded-xl border border-white/10 bg-white/5 px-5 py-3 font-semibold text-white hover:bg-white/10"
            onClick={copyClaimLink}
          >
            Copy Claim Link
          </button>
        </div>

        {claimLink && (
          <div className="mt-4 rounded-xl border border-white/10 bg-white/5 p-4">
            <p className="font-bold">Claim Link:</p>

            <a
              href={claimLink}
              className="break-all text-pink-400 underline hover:text-pink-300"
            >
              {claimLink}
            </a>
          </div>
        )}

        <div className="mt-8 rounded-xl border border-white/10 bg-white/5 p-5">
          <h2 className="mb-4 text-xl font-bold">Waitlist Clients</h2>

          {waitlistClients.length === 0 ? (
            <p>No clients on the waitlist yet.</p>
          ) : (
            <ul className="flex flex-col gap-2">
              {waitlistClients.map((client) => (
                <li
                  key={client.id}
                  className="rounded-xl border border-white/10 bg-black/20 p-5"
                >
                  <p>
                    <strong>Name:</strong> {client.name}
                  </p>
                  <p>
                    <strong>Email:</strong> {client.email}
                  </p>
                  <p>
                    <strong>Service:</strong> {client.service}
                  </p>
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="mt-8 rounded-xl border border-white/10 bg-white/5 p-5">
          <h2 className="mb-4 text-xl font-bold">Available Slots</h2>

          {availableSlots.length === 0 ? (
            <p>No slots available yet.</p>
          ) : (
            <ul className="flex flex-col gap-2">
              {availableSlots.map((slot) => (
                <li
                  key={slot.id}
                  className="rounded-xl border border-white/10 bg-black/20 p-4"
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
                    className="text-pink-400 underline hover:text-pink-300"
                  >
                    Open claim page
                  </a>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  </main>
)
}