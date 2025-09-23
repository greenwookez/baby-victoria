'use server'

import { revalidatePath } from 'next/cache'
import { authorize } from '../../apiv1/_authorize'

export type CreateEventInput = {
  EventTypeID: number
  Date: Date
}

export const CreateEvent = async (Input: CreateEventInput) => {
  const { user, payload } = await authorize()
  if (!user) {
    return
  }

  await payload.create({
    collection: 'events',
    data: {
      user: user.id,
      'event-type': Input.EventTypeID,
      'completed-at': Input.Date.toISOString(),
    },
  })
  revalidatePath('/')
}
