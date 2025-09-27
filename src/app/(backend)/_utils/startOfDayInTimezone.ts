export function startOfDayInTimeZone(timeZone: string, year: number, month: number, day: number) {
  // Build the local start-of-day string
  const localString = `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}T00:00:00.000`

  // Interpret that string in the given time zone, convert to UTC Date
  // NOTE: This mirrors the approach used in endOfDayInTimeZone. It relies on the
  // runtime (Node likely running in UTC) so that formatting into the target
  // timeZone and then constructing a Date from the numeric parts yields an ISO
  // instant representing the intended wall-clock time in that zone.
  const zoned = new Date(
    new Intl.DateTimeFormat('en-US', {
      timeZone,
      hour12: false,
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    }).format(new Date(localString)),
  )

  return zoned
}
