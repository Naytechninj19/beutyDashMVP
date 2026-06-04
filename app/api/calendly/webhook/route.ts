import { supabase } from '@/lib/supabase'

export async function POST(request: Request) {
  const payload = await request.json()

  console.log('Calendly event:', payload.event)
  console.log('Scheduled event:', payload.payload?.scheduled_event?.name)

  if (payload.event !== 'invitee.canceled') {
    return Response.json({
      received: true,
      ignored: true,
      reason: 'Not a cancellation event',
    })
  }

  const scheduledEvent = payload.payload.scheduled_event

  const { data: slot, error: slotError } = await supabase
    .from('slots')
    .insert([
      {
        service: scheduledEvent.name,
        start_time: scheduledEvent.start_time,
        end_time: scheduledEvent.end_time,
        status: 'available',
        claimed: false,
      },
    ])
    .select()
    .single()

  if (slotError) {
    console.error('Slot creation error:', slotError)

    return Response.json(
      { error: 'Failed to create slot' },
      { status: 500 }
    )
  }

  const { data: waitlist, error: waitlistError } = await supabase
  .from('waitlist')
  .select('*')

if (waitlistError) {
  console.error('Waitlist fetch error:', waitlistError)

  return Response.json(
    { error: 'Failed to fetch waitlist' },
    { status: 500 }
  )

  
}
  console.log('Waitlist count:', waitlist?.length || 0)

  const claimLink = `${process.env.NEXT_PUBLIC_APP_URL}/claim/${slot.id}`
  
  for (const client of waitlist || []) {
  await fetch(`${process.env.NEXT_PUBLIC_APP_URL}/api/send-claim-email`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      email: client.email,
      name: client.name,
      claimLink,
    }),
  })
}

  return Response.json({
    received: true,
    slotCreated: true,
    slot,
    waitlistCount: waitlist?.length || 0,
    emailsAttempted: waitlist?.length || 0,
    claimLink,
  })


}