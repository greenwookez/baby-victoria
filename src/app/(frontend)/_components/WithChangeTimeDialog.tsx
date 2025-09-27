'use client'

import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { PropsWithChildren, useState } from 'react'
import { pad } from './DateAndTimePicker'

export type WithChangeTimeDialogProps = {
  date: Date | null
  onChange?: (newDate: Date) => void
}

export const WithChangeTimeDialog = ({
  children,
  date,
  onChange,
}: PropsWithChildren<WithChangeTimeDialogProps>) => {
  const [currentDate, setCurrentDate] = useState(date)

  return (
    <Dialog>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Change time</DialogTitle>
          <DialogDescription>
            Choose new time of when the task was completed. Click Save when you&apos;re done.
          </DialogDescription>
        </DialogHeader>
        <div className="flex flex-col gap-3">
          <Label htmlFor="time-picker" className="px-1">
            Time
          </Label>
          <Input
            type="time"
            id="time-picker"
            step={60}
            value={
              currentDate ? `${pad(currentDate.getHours())}:${pad(currentDate.getMinutes())}` : ''
            }
            onChange={(e) => {
              if (!currentDate) return
              const val = e.target.value // e.g. "14:30"
              if (!val) return
              const [hoursStr, minutesStr] = val.split(':')
              const hours = Number(hoursStr ?? 0)
              const minutes = Number(minutesStr ?? 0)
              const newDate = new Date(currentDate)
              newDate.setHours(hours, minutes, 0, 0) // explicitly zero seconds & ms
              setCurrentDate(newDate)
            }}
            className="bg-background appearance-none [&::-webkit-calendar-picker-indicator]:hidden [&::-webkit-calendar-picker-indicator]:appearance-none"
          />
        </div>
        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline">Cancel</Button>
          </DialogClose>
          <DialogClose asChild>
            <Button disabled={!currentDate} onClick={() => onChange?.(currentDate!)}>
              Save
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
