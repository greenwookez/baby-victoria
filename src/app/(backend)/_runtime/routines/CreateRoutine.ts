'use server'

import { Routine } from '@/payload-types'
import { revalidatePath } from 'next/cache'
import { authorize } from '../../apiv1/_authorize'
import { PopulateEvents } from '../events/PopulateEvents'

export type CreateRoutineInput = {
  Title: string
  RRule: string
}

export const CreateRoutine = async (Input: CreateRoutineInput): Promise<Routine | null> => {
  const { user, payload } = await authorize()
  if (!user) {
    return null
  }

  const routine = await payload.create({
    collection: 'routines',
    data: {
      title: Input.Title,
      rrule: Input.RRule,
      user: user.id,
    },
  })

  await PopulateEvents({
    RoutineID: routine.id,
    RRule: Input.RRule,
    UserID: user.id,
  })

  revalidatePath('/routines')
  return routine
}
