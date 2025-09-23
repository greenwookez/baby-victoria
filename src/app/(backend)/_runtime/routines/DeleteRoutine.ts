'use server'

import { endOfDayInTimeZone } from '@/app/(backend)/_utils/endOfDayInTimezone'
import { revalidatePath } from 'next/cache'
import { authorize } from '../../apiv1/_authorize'

export type DeleteRoutineInput = {
  RoutineID: number
  Timezone: string
}

export const DeleteRoutine = async (Input: DeleteRoutineInput) => {
  const { user, payload } = await authorize()
  if (!user) {
    return
  }

  const routine = await payload.findByID({
    collection: 'routines',
    id: Input.RoutineID,
  })

  if (user.id !== (typeof routine.user === 'number' ? routine.user : routine.user.id)) {
    return Response.json({ message: 'Unauthorized' }, { status: 403 })
  }

  await payload.delete({
    collection: 'routines',
    id: Input.RoutineID,
  })

  const date = new Date()
  const EOD = endOfDayInTimeZone(
    Input.Timezone,
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

  revalidatePath('/routines')
  return null
}
