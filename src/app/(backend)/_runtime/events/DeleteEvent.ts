'use server'

import { revalidatePath } from 'next/cache'
import { authorize } from '../../apiv1/_authorize'

export type UpdateEventInput = {
  CompletedAt?: Date | null
}

export const DeleteEvent = async (EventID: number) => {
  const { user, payload } = await authorize()
  if (!user) {
    return
  }

  await payload.delete({
    collection: 'events',
    id: EventID,
  })

  revalidatePath('/')
}
