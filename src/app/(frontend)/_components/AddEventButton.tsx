'use client'

import { CreateEvent } from '@/app/(backend)/_runtime/events/CreateEvent'
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
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { EventsType } from '@/payload-types'
import { useState } from 'react'
import { DateAndTimePicker } from './DateAndTimePicker'

type AddEventButtonProps = {
  eventsTypes: EventsType[]
}

export function AddEventButton({ eventsTypes }: AddEventButtonProps) {
  const [date, setDate] = useState<Date | undefined>(new Date())
  const [eventType, setEventType] = useState<string | undefined>(undefined)

  const onAddClick = async () => {
    if (date) {
      await CreateEvent({ EventTypeID: Number(eventType), Date: date })
    }
  }
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button className="w-[100%]">Add Event</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add Event</DialogTitle>
          <DialogDescription>
            Choose date and time to add a desired event. Click Add when you&apos;re done.
          </DialogDescription>
        </DialogHeader>
        <Select value={eventType} onValueChange={setEventType}>
          <SelectTrigger className="w-[100%]">
            <SelectValue placeholder="Select a type" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectLabel>Events Types</SelectLabel>
              {eventsTypes.map((type) => (
                <SelectItem key={type.id} value={type.id.toString()}>
                  {type.title}
                </SelectItem>
              ))}
            </SelectGroup>
          </SelectContent>
        </Select>
        <DateAndTimePicker date={date} onChange={setDate} />
        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline">Cancel</Button>
          </DialogClose>
          <DialogClose asChild>
            <Button onClick={onAddClick} disabled={!date || !eventType}>
              Add
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
