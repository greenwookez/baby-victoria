'use server'

import { Routine } from '@/payload-types'
import { DateTime } from 'luxon'
import { revalidatePath } from 'next/cache'
import { getDayBounds } from '../../_utils/getDayBounds'
import { authorize } from '../../apiv1/_authorize'
import { PopulateEvents } from '../events/PopulateEvents'

export type UpdateRoutineInput = {
  RoutineID: number
  Timezone: string
  Title?: string
  RRule?: string
}

export const UpdateRoutine = async (Input: UpdateRoutineInput): Promise<Routine | null> => {
  const { user, payload } = await authorize()
  if (!user) {
    return null
  }

  const routine = await payload.findByID({
    collection: 'routines',
    id: Input.RoutineID,
  })

  if (user.id !== (typeof routine.user === 'number' ? routine.user : routine.user.id)) {
    return null
  }

  const updatedRoutine = await payload.update({
    collection: 'routines',
    id: Input.RoutineID,
    data: {
      title: Input.Title,
      rrule: Input.RRule,
    },
  })

  if (Input.RRule && Input.RRule !== routine.rrule) {
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

    await PopulateEvents({
      RoutineID: Input.RoutineID,
      RRule: Input.RRule,
      UserID: user.id,
      StartingFrom: EOD,
    })
  }

  revalidatePath('/routines')
  return updatedRoutine
}
