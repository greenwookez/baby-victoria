'use client'
import { useEffect, useMemo, useState } from 'react'

import { Button } from '@/components/ui/button'
import { EventsType } from '@/payload-types'
import { addDays } from 'date-fns'
import { ChevronLeft, ChevronRight, Plus } from 'lucide-react'
import { CreateEvent } from '../(backend)/_runtime/events/CreateEvent'
import { DeleteEvent } from '../(backend)/_runtime/events/DeleteEvent'
import {
  CalendarDay,
  LoadEventsForCalendar,
} from '../(backend)/_runtime/events/LoadEventsForCalendar'
import { UpdateEvent } from '../(backend)/_runtime/events/UpdateEvent'
import { DatePicker } from './_components/DatePicker'
import { Spinner } from './_components/Spinner'
import { TaskCheckbox } from './_components/TaskCheckbox'
import { WithAlertDialog } from './_components/WithAlertDialog'
import { WithChangeTimeDialog } from './_components/WithChangeTimeDialog'
import { formatTime } from './_utils/formatTime'

export type HomePageUIProps = {
  eventsTypes: EventsType[]
}

export default function HomePageUI(props: HomePageUIProps) {
  const [date, setDate] = useState(new Date())
  const [state, setState] = useState<CalendarDay | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  const age = useMemo(() => {
    const birthDate = new Date(2025, 8, 5, 14, 24)
    const diffMs = date.getTime() - birthDate.getTime()
    if (diffMs < 0) return 'ещё не родился'
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24))
    const months = Math.floor(diffDays / 30)
    const weeks = Math.floor((diffDays % 30) / 7)
    const days = (diffDays % 30) % 7
    return `${months}м ${weeks}н ${days}д`
  }, [date])

  const reload = async () => {
    const localDate =
      date.getFullYear() +
      '-' +
      String(date.getMonth() + 1).padStart(2, '0') +
      '-' +
      String(date.getDate()).padStart(2, '0')

    setIsLoading(true)
    const newState = await LoadEventsForCalendar(localDate)
    setIsLoading(false)
    setState(newState)
  }

  useEffect(() => {
    reload()
  }, [date])

  if (!state || isLoading) {
    return <Spinner />
  }

  return (
    <div className="flex flex-col gap-4 items-center">
      <div className="flex items-center gap-2">
        <Button variant="ghost" size="icon" onClick={() => setDate(addDays(date, -1))}>
          <ChevronLeft className="w-4 h-4" />
        </Button>
        <DatePicker
          noLabel
          date={date}
          onChange={(newDate) => {
            if (newDate) setDate(newDate)
          }}
        />
        <Button variant="ghost" size="icon" onClick={() => setDate(addDays(date, 1))}>
          <ChevronRight className="w-4 h-4" />
        </Button>
      </div>
      <h1>Наш возраст: {age}</h1>
      <div className="border border-gray-200 rounded-md p-4 w-full flex flex-col gap-4">
        <div>
          Выполнено задач: {state.tasks.filter((t) => t['completed-at']).length} из{' '}
          {state.tasks.length}
        </div>
        {state.tasks.map((task) => (
          <TaskCheckbox
            key={task.id}
            task={task}
            onChecked={async (checked) => {
              await UpdateEvent({ EventID: task.id, CompletedAt: checked ? new Date() : null })
              reload()
            }}
            onChange={async (newDate) => {
              await UpdateEvent({ EventID: task.id, CompletedAt: newDate })
              reload()
            }}
          />
        ))}
      </div>
      <div className="flex flex-col gap-2 min-w-[250px]">
        {props.eventsTypes.map((eventType, key) => (
          <div key={key} className="flex flex-col gap-1">
            <div className="flex justify-between">
              {eventType.title}
              <Button
                onClick={async () => {
                  await CreateEvent({ EventTypeID: eventType.id, Date: new Date() })
                  reload()
                }}
              >
                <Plus className="h-4 w-4" />
                Add
              </Button>
            </div>
            {(state.events[eventType.id] || []).map((event, key) => {
              if (event['event-type'] && typeof event['event-type'] === 'object') {
                return (
                  <div className="flex gap-2" key={key}>
                    {formatTime(event['completed-at']!)}
                    <WithChangeTimeDialog
                      date={new Date(event['completed-at']!)}
                      onChange={async (newDate) => {
                        await UpdateEvent({ EventID: event.id, CompletedAt: newDate })
                        reload()
                      }}
                    >
                      <Button variant={'ghost'}>Edit</Button>
                    </WithChangeTimeDialog>
                    <WithAlertDialog
                      onSuccess={async () => {
                        await DeleteEvent(event.id)
                        reload()
                      }}
                    >
                      <Button variant={'ghost'}>Delete</Button>
                    </WithAlertDialog>
                  </div>
                )
              }
            })}
          </div>
        ))}
      </div>
    </div>
  )
}
