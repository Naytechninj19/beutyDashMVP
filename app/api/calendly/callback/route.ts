export async function GET(request: Request) {
  const url = new URL(request.url)
  const code = url.searchParams.get('code')

  if (!code) {
    return Response.json(
      { error: 'Missing Calendly authorization code' },
      { status: 400 }
    )
  }

  const clientId = process.env.CALENDLY_CLIENT_ID
  const clientSecret = process.env.CALENDLY_CLIENT_SECRET
  const redirectUri = 'http://localhost:3000/api/calendly/callback'

  const response = await fetch('https://auth.calendly.com/oauth/token', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: new URLSearchParams({
      grant_type: 'authorization_code',
      code,
      client_id: clientId || '',
      client_secret: clientSecret || '',
      redirect_uri: redirectUri,
    }),
  })

  const data = await response.json()
  const userResponse = await fetch(
  'https://api.calendly.com/users/me',
  {
    headers: {
      Authorization: `Bearer ${data.access_token}`,
    },
  }
)

const userData = await userResponse.json()

const eventsResponse = await fetch(
  `https://api.calendly.com/scheduled_events?user=${userData.resource.uri}`,
  {
    headers: {
      Authorization: `Bearer ${data.access_token}`,
    },
  }
)

const eventsData = await eventsResponse.json()

  return Response.json({
  tokenReceived: Boolean(data.access_token),
  accessToken: data.access_token,
  calendlyUser: userData,
  events: eventsData,
})
}