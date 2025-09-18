import { endOfDayInTimeZone } from '@/utils/endOfDayInTimeZone'
import { authorize } from '../../_authorize'
import { populateEvents } from '../_populateEvents'
import { NextRequest } from 'next/server'

type UpdateRoutineBody = {
  timezone: string
  title?: string
  rrule?: string
}

export const PUT = async (
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) => {
  const { payload, user } = await authorize()

  if (!user) {
    return Response.json({ message: 'Unauthorized' }, { status: 403 })
  }

  const routine_id = parseInt((await params).id)

  const body = (await request.json()) as UpdateRoutineBody
  const routine = await payload.findByID({
    collection: 'routines',
    id: routine_id,
  })

  if (user.id !== (typeof routine.user === 'number' ? routine.user : routine.user.id)) {
    return Response.json({ message: 'Unauthorized' }, { status: 403 })
  }

  const updatedRoutine = await payload.update({
    collection: 'routines',
    id: routine_id,
    data: {
      title: body.title,
      rrule: body.rrule,
    },
  })

  if (body.rrule && body.rrule !== routine.rrule) {
    const date = new Date()
    const EOD = endOfDayInTimeZone(
      body.timezone,
      date.getFullYear(),
      date.getMonth() + 1,
      date.getDate(),
    )

    await payload.delete({
      collection: 'events',
      where: {
        'scheduled-for': {
          greater_than: EOD.toISOString(),
        },
      },
    })

    await populateEvents(payload, routine_id, body.rrule, user!.id)
  }

  return Response.json(updatedRoutine, { status: 200 })
}

type DeleteRoutineBody = {
  timezone: string
}

export const DELETE = async (
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) => {
  const { payload, user } = await authorize()

  if (!user) {
    return Response.json({ message: 'Unauthorized' }, { status: 403 })
  }

  const routine_id = parseInt((await params).id)

  const body = (await request.json()) as DeleteRoutineBody
  const routine = await payload.findByID({
    collection: 'routines',
    id: routine_id,
  })

  if (user.id !== (typeof routine.user === 'number' ? routine.user : routine.user.id)) {
    return Response.json({ message: 'Unauthorized' }, { status: 403 })
  }

  await payload.delete({
    collection: 'routines',
    id: routine_id,
  })

  const date = new Date()
  const EOD = endOfDayInTimeZone(
    body.timezone,
    date.getFullYear(),
    date.getMonth() + 1,
    date.getDate(),
  )

  await payload.delete({
    collection: 'events',
    where: {
      'scheduled-for': {
        greater_than: EOD.toISOString(),
      },
    },
  })

  return Response.json({ status_text: 'OK' }, { status: 200 })
}
