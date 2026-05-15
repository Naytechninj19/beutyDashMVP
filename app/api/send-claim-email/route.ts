import { Resend } from 'resend'
import { NextResponse } from 'next/server'

const resend = new Resend(process.env.RESEND_API_KEY)

export async function POST(request: Request) {
  try {
    const { email, name, claimLink } = await request.json()

    if (!email || !claimLink) {
      return NextResponse.json(
        { error: 'Email and claim link are required' },
        { status: 400 }
      )
    }

    const { data, error } = await resend.emails.send({
      from: 'Beauty Dash <onboarding@resend.dev>',
      to: email,
      subject: 'A cancellation slot is available',
      html: `
        <p>Hi ${name || 'there'},</p>
        <p>A cancellation slot is now available.</p>
        <p>
          <a href="${claimLink}">Click here to claim your slot</a>
        </p>
      `,
    })

    if (error) {
  console.error('Resend error:', error)
  return NextResponse.json({ error }, { status: 500 })
}

    return NextResponse.json({ data })
  } catch (error) {
  console.error('Email route crash:', error)
  return NextResponse.json(
    { error: 'Something went wrong sending the email' },
    { status: 500 }
  )
}
}