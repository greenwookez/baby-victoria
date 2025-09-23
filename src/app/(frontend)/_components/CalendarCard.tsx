'use client'

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { Event, EventsType } from '@/payload-types'
import { formatDate } from '../_utils/formatDate'
import { AddEventButton } from './AddEventButton'
import { EventCheckbox } from './EventCheckbox'

type CalendarCardProps = {
  taskEvents: Event[]
  customEvents: Event[]
  eventsTypes: EventsType[]
}

export const CalendarCard = ({ taskEvents, customEvents, eventsTypes }: CalendarCardProps) => {
  return (
    <Card className="w-[100%] max-w-xl">
      <CardHeader>
        <CardTitle>Today</CardTitle>
        <CardDescription>Here&apos;s what scheduled and already done</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col gap-6">
          <div className="flex flex-col gap-1">
            {customEvents.map((event) => (
              <div key={event.id} className="flex items-start gap-3">
                <div className="flex gap-2 items-center">
                  <p className="text-muted-foreground text-sm">
                    {formatDate(event['completed-at']!)}
                  </p>
                  {/* eslint-disable-next-line @typescript-eslint/ban-ts-comment */}
                  {/* @ts-expect-error */}
                  <Label htmlFor={`${event.id}`}>{event['event-type']?.title}</Label>
                </div>
              </div>
            ))}
          </div>
          {taskEvents.map((event) => (
            <EventCheckbox key={event.id} event={event} />
          ))}
        </div>
      </CardContent>
      <CardFooter>
        <AddEventButton eventsTypes={eventsTypes} />
      </CardFooter>
    </Card>
  )
}
