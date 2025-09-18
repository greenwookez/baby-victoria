import { authorize } from '../_authorize'
import { populateEvents } from './_populateEvents'

type CreateRoutineBody = {
  title: string
  rrule: string
  user: number
}

export const POST = async (request: Request) => {
  const { payload, user } = await authorize()

  if (!user) {
    return Response.json({ message: 'Unauthorized' }, { status: 403 })
  }

  const body = (await request.json()) as CreateRoutineBody
  const routine = await payload.create({
    collection: 'routines',
    data: body,
  })

  await populateEvents(payload, routine.id, body.rrule, user!.id)

  return Response.json(routine, { status: 200 })
}
