'use client'

import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { DatePicker } from './DatePicker'

export type DateAndTimePickerProps = {
  date?: Date
  onChange?: (date: Date | undefined) => void
}

export function DateAndTimePicker({ date, onChange }: DateAndTimePickerProps) {
  return (
    <div className="flex gap-4">
      <DatePicker
        date={date}
        onChange={(newDate) => {
          if (newDate) {
            const now = new Date()
            newDate.setHours(now.getHours(), now.getMinutes(), now.getSeconds())
            onChange?.(newDate)
          }
        }}
      />
      <div className="flex flex-col gap-3">
        <Label htmlFor="time-picker" className="px-1">
          Time
        </Label>
        <Input
          type="time"
          id="time-picker"
          step={60} // 60 seconds -> minute precision
          value={
            date
              ? `${pad(date.getHours())}:${pad(date.getMinutes())}` // <-- HH:MM (no seconds)
              : ''
          }
          onChange={(e) => {
            if (!date) return
            const val = e.target.value // e.g. "14:30"
            if (!val) return
            const [hoursStr, minutesStr] = val.split(':')
            const hours = Number(hoursStr ?? 0)
            const minutes = Number(minutesStr ?? 0)
            const newDate = new Date(date)
            newDate.setHours(hours, minutes, 0, 0) // explicitly zero seconds & ms
            onChange?.(newDate)
          }}
          className="bg-background appearance-none [&::-webkit-calendar-picker-indicator]:hidden [&::-webkit-calendar-picker-indicator]:appearance-none"
        />
      </div>
    </div>
  )
}

export function pad(n: number) {
  return String(n).padStart(2, '0')
}
