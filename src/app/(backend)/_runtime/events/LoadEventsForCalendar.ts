'use server'

import { Event } from '@/payload-types'
import { endOfDayInTimeZone } from '../../_utils/endOfDayInTimezone'
import { startOfDayInTimeZone } from '../../_utils/startOfDayInTimezone'
import { authorize } from '../../apiv1/_authorize'

export type CalendarDay = {
  tasks: Event[]
  events: Record<number, Event[]>
}

/**
 * Loads and organizes events for a specific calendar day for the authorized user.
 *
 * @param ForDate - The date string in `YYYY-MM-DD` format for which to load events.
 * @returns A promise that resolves to a `CalendarDay` object containing the day's events and tasks,
 *          or `null` if the user is not authorized or the date format is invalid.
 *
 * @remarks
 * - Authorizes the user and retrieves their timezone.
 * - Fetches events from the `events` collection that are scheduled for the specified day.
 * - Groups events by their event type and collects routine tasks separately.
 * - Returns the events sorted by event type ID.
 */
export const LoadEventsForCalendar = async (ForDate: string): Promise<CalendarDay | null> => {
  const { user, payload, timezone } = await authorize()
  if (!user) return null

  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(ForDate)
  if (!match) return null
  const year = Number(match[1])
  const month = Number(match[2])
  const day = Number(match[3])

  const startDt = startOfDayInTimeZone(timezone, year, month, day)
  const endDt = endOfDayInTimeZone(timezone, year, month, day)

  const nonDeletedRoutines = await payload.find({
    collection: 'routines',
    where: { is_deleted: { equals: false } },
    pagination: false,
  })

  const eventsForTasks = await payload.find({
    collection: 'events',
    pagination: false,
    where: {
      routine: { in: nonDeletedRoutines.docs.map((r) => r.id) },
      user: { equals: user.id },
      'scheduled-for': {
        greater_than_equal: startDt.toISOString(),
        less_than_equal: endDt.toISOString(),
      },
    },
    sort: 'scheduled-for',
  })

  const events = await payload.find({
    collection: 'events',
    pagination: false,
    where: {
      routine: { equals: null },
      user: { equals: user.id },
      'completed-at': {
        greater_than_equal: startDt.toISOString(),
        less_than_equal: endDt.toISOString(),
      },
    },
    sort: 'scheduled-for',
  })

  const dayEventsMap = new Map<number, Event[]>()
  for (const ev of events.docs) {
    if (ev['event-type'] && typeof ev['event-type'] === 'object') {
      const typeObj = ev['event-type']
      const existing = dayEventsMap.get(typeObj.id)
      if (existing) {
        existing.push(ev)
      } else {
        dayEventsMap.set(typeObj.id, [ev])
      }
    }
  }

  return {
    tasks: eventsForTasks.docs,
    events: Object.fromEntries(dayEventsMap),
  }
}
