import { DateTime } from 'luxon'

/**
 * Get start and end of a day in a specific timezone.
 * @param {string} dateStr - Date string in YYYY-MM-DD format
 * @param {string} timezone - IANA timezone string (e.g. "America/New_York")
 * @returns {{ start: Date, end: Date }}
 */
export function getDayBounds(dateStr: string, timezone: string) {
  const dt = DateTime.fromISO(dateStr, { zone: timezone })

  const start = dt.startOf('day').toJSDate()
  const end = dt.endOf('day').toJSDate()

  return { start, end }
}
