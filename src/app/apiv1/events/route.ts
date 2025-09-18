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
