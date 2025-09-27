import { authorize } from '../_authorize'

export const GET = async () => {
  const { payload, user } = await authorize()

  if (!user) {
    return Response.json({ message: 'Unauthorized' }, { status: 403 })
  }

  const events = await payload.find({
    collection: 'events',
    where: {
      user: {
        equals: user!.id,
      },
    },
  })

  return Response.json(events, { status: 200 })
}
type CreateEventBody = {
  event_type_id: number
}

export const POST = async (request: Request) => {
  const { payload, user } = await authorize()
  if (!user) {
    return Response.json({ message: 'Unauthorized' }, { status: 403 })
  }

  const body = (await request.json()) as CreateEventBody
  const event = await payload.create({
    collection: 'events',
    data: {
      'event-type': body.event_type_id,
      'completed-at': new Date().toISOString(),
      user: user.id,
    },
  })

  return Response.json(event, { status: 200 })
}
