'use server'

import { revalidatePath } from 'next/cache'
import { authorize } from '../../apiv1/_authorize'

export type UpdateEventInput = {
  EventID: number
  CompletedAt?: Date | null
}

export const UpdateEvent = async (Input: UpdateEventInput) => {
  const { user, payload } = await authorize()
  if (!user) {
    return
  }

  console.log('UpdateEvent: Input.CompletedAt.toString()', Input.CompletedAt?.toString())
  console.log('UpdateEvent: Input.CompletedAt.toISOString()', Input.CompletedAt?.toISOString())

  await payload.update({
    collection: 'events',
    id: Input.EventID,
    data: {
      'completed-at': Input.CompletedAt === null ? null : Input.CompletedAt?.toISOString(),
    },
  })

  revalidatePath('/')
}
