'use client'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import { supabase } from '@/lib/supabase'

export default function ClaimPage() {
  const params = useParams()
  const id = params.id as string

  const [slot, setSlot] = useState<any>(null)
  const [claimSuccess, setClaimSuccess] = useState(false)
  const [claimError, setClaimError] = useState('')

  useEffect(() => {
    if (id) {
      fetchSlot()
    }
  }, [id])

  const fetchSlot = async () => {
    const { data, error } = await supabase
      .from('slots')
      .select('*')
      .eq('id', id)
      .single()

    if (error) {
      console.error(error)
    } else {
      setSlot(data)
    }
  }

const claimSlot = async () => {
  const { data, error: slotError } = await supabase
  .from('slots')
  .update({
    status: 'claimed',
    claimed: true,
  })
  .eq('id', id)
  .eq('claimed', false)
  .select()

  if (slotError) {
  alert(slotError.message)
  return
}

if (!data || data.length === 0) {
  setClaimError('This appointment has already been claimed.')
  fetchSlot()
  return
}

  const { error: reservationError } = await supabase
    .from('reservations')
    .insert([
      {
        slot_id: id,
        client_name: 'Test Client',
        client_email: 'test@example.com',
      },
    ])

  if (reservationError) {
    alert(reservationError.message)
  } else {
      setClaimSuccess(true)
      fetchSlot()
  }
}


  if (!slot) {
    return <div className="p-10">Loading...</div>
  }

  const formattedStartTime = slot?.start_time
  ? new Date(slot.start_time).toLocaleString('en-GB', {
      weekday: 'short',
      day: '2-digit',
      month: 'short',
      hour: '2-digit',
      minute: '2-digit',
    })
  : 'Time not available'

  return (
    <main className="relative min-h-screen overflow-hidden bg-[#0b0b0f] text-white flex items-center justify-center p-6">
      <div className="absolute left-0 top-0 h-[420px] w-[420px] rounded-full bg-blue-600/10 blur-[160px]" />

      <div className="absolute right-0 top-0 h-[420px] w-[420px] rounded-full bg-purple-600/10 blur-[160px]" />
        <div className="relative z-10 w-full max-w-md rounded-2xl border border-white/10 bg-white/5 p-8 shadow-xl">

        <div className="mb-6">
        <p className="text-pink-400 font-semibold">
          Beauty Dash
        </p>

        <h1 className="text-3xl font-bold mt-2">
        Claim Your Spot
        </h1>

        <p className="text-gray-400 mt-2">
         A cancellation has become available.
        </p>
        </div>

        <div className="rounded-xl border border-white/10 bg-black/20 p-5">
  <p className="text-gray-400 text-sm">
    Service
  </p>

  <p className="font-semibold text-lg">
    {slot.service}
  </p>

  <div className="mt-4">
    <p className="text-gray-400 text-sm">
      Time
    </p>

    <p>
      {formattedStartTime}
    </p>
  </div>

  <div className="mt-4">
    <p className="text-gray-400 text-sm">
      Status
    </p>

    <p className="font-medium">
      {claimSuccess
        ? 'Confirmed'
        : slot.claimed
        ? 'Claimed'
        : 'Available'}
    </p>
  </div>
</div>
          {claimSuccess ? (
        <div className="mt-6 rounded-xl border border-green-500/30 bg-green-500/10 p-5 text-center">
  <div className="mb-2 text-3xl">
    ✓
  </div>

  <p className="font-bold text-green-400">
    Booking Confirmed
  </p>

  <p className="mt-2 text-sm text-gray-300">
    Your appointment has been secured.
  </p>
</div>
) : claimError ? (
  <div className="mt-6 rounded-xl border border-red-500/30 bg-red-500/10 p-5 text-center">
    <div className="mb-2 text-3xl">
      ⏳
    </div>

    <p className="font-bold text-red-400">
      Spot Already Taken
    </p>

    <p className="mt-2 text-sm text-gray-300">
      {claimError}
    </p>
  </div>
) : !slot.claimed ? (
  <button
    className="mt-6 w-full rounded-xl bg-gradient-to-r from-pink-500 to-purple-600 py-3 font-semibold text-white"
    onClick={claimSlot}
  >
    Claim Slot
  </button>
) : (
  <div className="mt-6 rounded-xl border border-red-500/30 bg-red-500/10 p-5 text-center">
  <div className="mb-2 text-3xl">
    ⏳
  </div>

  <p className="font-bold text-red-400">
    Spot Already Taken
  </p>

  <p className="mt-2 text-sm text-gray-300">
    This appointment has already been claimed.
  </p>
</div>

)}    
      </div>
    </main>
  )
}