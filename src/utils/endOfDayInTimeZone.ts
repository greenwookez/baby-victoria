export function endOfDayInTimeZone(timeZone: string, year: number, month: number, day: number) {
  // Build the local end-of-day string
  const localString = `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}T23:59:59.999`

  // Interpret that string in the given time zone, convert to UTC Date
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
