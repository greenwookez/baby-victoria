'use server'

import { RRule } from 'rrule'
import { authorize } from '../../apiv1/_authorize'

export type PopulateEventsInput = {
  RoutineID: number
  RRule: string
  UserID: number
}

export const PopulateEvents = async (Input: PopulateEventsInput) => {
  const { user, payload } = await authorize()
  if (!user) {
    return
  }

  const rule = RRule.fromString(Input.RRule)

  const startOfToday = new Date()
  startOfToday.setHours(0, 0, 0, 0)
  const dates = rule.between(startOfToday, new Date('2030-12-31T23:59:59Z'), true)

  await Promise.all(
    dates.map((date) =>
      payload.create({
        collection: 'events',
        data: {
          user: Input.UserID,
          routine: Input.RoutineID,
          'scheduled-for': date.toISOString(),
        },
      }),
    ),
  )
}
