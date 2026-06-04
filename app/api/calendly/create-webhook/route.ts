export async function GET() {
  const accessToken = 'eyJraWQiOiIxY2UxZTEzNjE3ZGNmNzY2YjNjZWJjY2Y4ZGM1YmFmYThhNjVlNjg0MDIzZjdjMzJiZTgzNDliMjM4MDEzNWI0IiwidHlwIjoiSldUIiwiYWxnIjoiRVMyNTYifQ.eyJpc3MiOiJodHRwczovL2F1dGguY2FsZW5kbHkuY29tIiwiaWF0IjoxNzgwNDIzODA5LCJqdGkiOiI5ZTJmNDE3Mi05MWMxLTQ4YTYtYTE2Zi0yOGU1ZDMzMzRlMDkiLCJ1c2VyX3V1aWQiOiI2ZWExMTQ0MC01ZjU2LTRlZDEtYWVkYS00ZjFkYzA3OGY3M2UiLCJhcHBfdWlkIjoiU25TY0FfZEdjTEx2bEVINHV1TWJxa3liNklEakR5cHdIdW9XOWR0LVlldyIsInNjb3BlIjoic2NoZWR1bGVkX2V2ZW50czpyZWFkIHdlYmhvb2tzOnJlYWQgd2ViaG9va3M6d3JpdGUgdXNlcnM6cmVhZCIsImV4cCI6MTc4MDQzMTAwOX0.OEVtsLGcjwd3o0I4CWb6JC-7hvoeKmKeiMLAwDEy232-Oly3Tlzpcf40VF7fksbMVmtDo1tuSKqyGkNOXEfOBA'

  const webhookUrl =
    'https://glove-cupped-slab.ngrok-free.dev/api/calendly/webhook'

  const organization =
    'https://api.calendly.com/organizations/0936f972-5c8d-4638-ad61-6a552eacb14e'

  const response = await fetch('https://api.calendly.com/webhook_subscriptions', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      url: webhookUrl,
      events: ['invitee.created', 'invitee.canceled'],
      organization,
      scope: 'organization',
    }),
  })

  const data = await response.json()

  return Response.json(data)
}