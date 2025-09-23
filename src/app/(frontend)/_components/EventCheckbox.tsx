'use client'

import { UpdateEvent } from '@/app/(backend)/_runtime/events/UpdateEvent'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Label } from '@/components/ui/label'
import { Event } from '@/payload-types'
import { useState } from 'react'
import { formatTime } from '../_utils/formatTime'
import { DateAndTimePicker } from './DateAndTimePicker'

type EventCheckboxProps = {
  event: Event
}

export const EventCheckbox = ({ event }: EventCheckboxProps) => {
  const [date, setDate] = useState<Date | undefined | null>(new Date())
  const [open, setOpen] = useState(false)
  const [checked, setChecked] = useState<boolean>(!!event['completed-at'])

  const onEventComplete = (newDate: Date | null) => async () => {
    await UpdateEvent({
      EventID: event.id,
      CompletedAt: newDate,
    })

    setChecked(!checked)
    setOpen(false)
  }

  return (
    <div className="flex items-start gap-3">
      <Checkbox
        id={`${event.id}`}
        checked={checked}
        onCheckedChange={(checked) => {
          if (checked.valueOf() === true) {
            setDate(new Date())
            setOpen(true)
            return
          }

          setDate(null)
          onEventComplete(null)()
        }}
      />

      <Dialog open={open}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Complete Task</DialogTitle>
            <DialogDescription>
              Choose date and time of when the task was completed. Click Complete when you&apos;re
              done.
            </DialogDescription>
          </DialogHeader>
          <DateAndTimePicker date={date || undefined} onChange={setDate} />
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline" onClick={() => setOpen(false)}>
                Cancel
              </Button>
            </DialogClose>
            <DialogClose asChild>
              <Button onClick={onEventComplete(date || null)} disabled={!date}>
                Complete
              </Button>
            </DialogClose>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      <div className="grid gap-2">
        {/* eslint-disable-next-line @typescript-eslint/ban-ts-comment */}
        {/* @ts-expect-error */}
        <Label htmlFor={`${event.id}`}>{event.routine.title}</Label>
        <p className="text-muted-foreground text-sm">
          {formatTime(event['scheduled-for']!)}
          {event['completed-at'] ? ` - Done at ${formatTime(event['completed-at']!)}` : ''}
        </p>
      </div>
    </div>
  )
}
