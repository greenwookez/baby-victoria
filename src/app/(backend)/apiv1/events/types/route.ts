import { authorize } from '../../_authorize'

export const GET = async () => {
  const { payload, user } = await authorize()

  if (!user) {
    return Response.json({ message: 'Unauthorized' }, { status: 403 })
  }

  const eventsTypes = await payload.find({
    collection: 'events-types',
  })

  return Response.json(eventsTypes, { status: 200 })
}
