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

  await payload.update({
    collection: 'events',
    id: Input.EventID,
    data: {
      'completed-at': Input.CompletedAt === null ? null : Input.CompletedAt?.toISOString(),
    },
  })

  revalidatePath('/')
}
