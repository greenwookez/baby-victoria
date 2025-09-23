import { CreateRoutine } from '../../_runtime/routines/CreateRoutine'
import { authorize } from '../_authorize'

type CreateRoutineBody = {
  title: string
  rrule: string
}

export const POST = async (request: Request) => {
  const { user } = await authorize()
  if (!user) {
    return Response.json({ message: 'Unauthorized' }, { status: 403 })
  }

  const body = (await request.json()) as CreateRoutineBody
  const routine = await CreateRoutine({ Title: body.title, RRule: body.rrule })

  return Response.json(routine, { status: 200 })
}
