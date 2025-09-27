'use server'

import { Routine } from '@/payload-types'
import { revalidatePath } from 'next/cache'
import { endOfDayInTimeZone } from '../../_utils/endOfDayInTimezone'
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
