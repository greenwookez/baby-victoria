'use server'

import { getDayBounds } from '@/app/(backend)/_utils/getDayBounds'
import { DateTime } from 'luxon'
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

  await payload.update({
    collection: 'routines',
    id: Input.RoutineID,
    data: {
      is_deleted: true,
    },
  })

  const { end: EOD } = getDayBounds(
    DateTime.now().setZone(Input.Timezone).toFormat('yyyy-MM-dd'),
    Input.Timezone,
  )

  await payload.delete({
    collection: 'events',
    where: {
      routine: { equals: Input.RoutineID },
      'scheduled-for': {
        greater_than: EOD.toISOString(),
      },
    },
  })

  revalidatePath('/routines')
  return null
}
