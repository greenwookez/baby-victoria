import { DeleteRoutine } from '@/app/(backend)/_runtime/routines/DeleteRoutine'
import { UpdateRoutine } from '@/app/(backend)/_runtime/routines/UpdateRoutine'
import { NextRequest } from 'next/server'
import { authorize } from '../../_authorize'

type UpdateRoutineBody = {
  timezone: string
  title?: string
  rrule?: string
}

export const PUT = async (
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) => {
  const { user } = await authorize()
  if (!user) {
    return Response.json({ message: 'Unauthorized' }, { status: 403 })
  }

  const routine_id = parseInt((await params).id)

  const body = (await request.json()) as UpdateRoutineBody
  const updatedRoutine = await UpdateRoutine({
    RoutineID: routine_id,
    Timezone: body.timezone,
    Title: body.title,
    RRule: body.rrule,
  })

  return Response.json(updatedRoutine, { status: 200 })
}

type DeleteRoutineBody = {
  timezone: string
}

export const DELETE = async (
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) => {
  const { user } = await authorize()

  if (!user) {
    return Response.json({ message: 'Unauthorized' }, { status: 403 })
  }

  const routine_id = parseInt((await params).id)

  const body = (await request.json()) as DeleteRoutineBody
  await DeleteRoutine({ RoutineID: routine_id, Timezone: body.timezone })

  return Response.json({ status_text: 'OK' }, { status: 200 })
}
