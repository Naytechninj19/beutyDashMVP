export async function GET() {
  const userId = process.env.ACUITY_USER_ID
  const apiKey = process.env.ACUITY_API_KEY

  const credentials = Buffer.from(
    `${userId}:${apiKey}`
  ).toString('base64')

  const response = await fetch(
    'https://acuityscheduling.com/api/v1/appointments',
    {
      headers: {
        Authorization: `Basic ${credentials}`,
      },
    }
  )

  const data = await response.json()

  return Response.json(data)
}