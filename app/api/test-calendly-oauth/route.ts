export async function GET() {
  const clientId = process.env.CALENDLY_CLIENT_ID
  const hasSecret = Boolean(process.env.CALENDLY_CLIENT_SECRET)
  const hasWebhookKey = Boolean(process.env.CALENDLY_WEBHOOK_SIGNING_KEY)

  return Response.json({
    clientIdLoaded: Boolean(clientId),
    secretLoaded: hasSecret,
    webhookKeyLoaded: hasWebhookKey,
  })
}