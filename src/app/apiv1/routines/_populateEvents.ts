import { Routine } from '@/payload-types'
import { BasePayload } from 'payload'
import { RRule } from 'rrule'

export const populateEvents = async (
  payload: BasePayload,
  routine_id: number,
  rrule: string,
  user_id: number,
) => {
  const rule = RRule.fromString(rrule)
  const dates = rule.between(new Date(), new Date('2030-12-31T23:59:59Z'), true)

  await Promise.all(
    dates.map((date) =>
      payload.create({
        collection: 'events',
        data: {
          user: user_id,
          routine: routine_id,
          'scheduled-for': date.toISOString(),
        },
      }),
    ),
  )
}
