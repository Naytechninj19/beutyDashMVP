export async function GET() {
  const clientId = process.env.CALENDLY_CLIENT_ID

  const redirectUri = 'http://localhost:3000/api/calendly/callback'

  const authUrl = new URL('https://auth.calendly.com/oauth/authorize')

  authUrl.searchParams.set('client_id', clientId || '')
  authUrl.searchParams.set('response_type', 'code')
  authUrl.searchParams.set('redirect_uri', redirectUri)

  return Response.redirect(authUrl.toString())
}