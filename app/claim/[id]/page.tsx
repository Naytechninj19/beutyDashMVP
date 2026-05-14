'use client'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import { supabase } from '@/lib/supabase'

export default function ClaimPage() {
  const params = useParams()
  const id = params.id as string

  const [slot, setSlot] = useState<any>(null)

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
  alert('This slot has already been claimed')
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
    alert('Slot claimed and reservation created!')
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
    <main className="p-10 flex flex-col gap-4">
      <h1 className="text-3xl font-bold">Claim Appointment</h1>

      <div>Service: {slot.service}</div>
      <div>Status: {slot.claimed ? 'Claimed' : 'Available'}</div>
      <div>Time: {formattedStartTime}</div>
    {!slot.claimed ? (
      <button
        className="bg-green-600 text-white p-2 rounded"
        onClick={claimSlot}
      >
        Claim Slot
      </button>
    ) : (
        <div className="text-red-600 font-bold">Appointment has already been claimed.</div>
    )}
    </main>
  )
}