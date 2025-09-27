'use server'

import { RRule } from 'rrule'
import { authorize } from '../../apiv1/_authorize'

export type PopulateEventsInput = {
  RoutineID: number
  RRule: string
  UserID: number
  StartingFrom?: Date
}

export const PopulateEvents = async (Input: PopulateEventsInput) => {
  const { user, payload } = await authorize()
  if (!user) {
    return
  }

  const startOfToday = new Date()
  startOfToday.setUTCHours(0, 0, 0, 0)

  const dtstart = Input.StartingFrom ?? startOfToday

  const rule = new RRule({
    ...RRule.parseString(Input.RRule),
    dtstart,
  })

  const dates = rule.between(dtstart, new Date(Date.UTC(2026, 11, 31, 23, 59, 59)), true)
  setTimeout(() => {
    for (const date of dates) {
      payload.create({
        collection: 'events',
        data: {
          user: Input.UserID,
          routine: Input.RoutineID,
          'scheduled-for': date.toISOString(),
        },
      })
    }
  })
}
