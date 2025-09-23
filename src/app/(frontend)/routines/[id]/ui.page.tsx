'use client'

import { CreateRoutine } from '@/app/(backend)/_runtime/routines/CreateRoutine'
import { UpdateRoutine } from '@/app/(backend)/_runtime/routines/UpdateRoutine'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Routine } from '@/payload-types'
import Link from 'next/link'
import { useState } from 'react'

export type SingleRoutinePageUIProps = {
  routine?: Routine
}

export default function SingleRoutinePageUI({ routine }: SingleRoutinePageUIProps) {
  const [title, setTitle] = useState(routine?.title ?? '')
  const [rrule, setRrule] = useState(routine?.rrule ?? '')

  const onSaveClick = async () => {
    if (!routine) {
      await CreateRoutine({
        Title: title,
        RRule: rrule.toString(),
      })
    } else {
      await UpdateRoutine({
        RoutineID: routine.id,
        Timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
        Title: title,
        RRule: rrule.toString(),
      })
    }

    window.location.href = '/routines'
  }

  return (
    <div className="max-w-md mx-auto flex flex-col gap-6">
      <div className="text-center">
        <h1 className="text-3xl font-bold">{!routine ? `Add New Routine` : `Edit Routine`}</h1>
        <p className="text-muted-foreground">
          {!routine ? `Create a` : `Update the`} routine based on your preferences.
        </p>
      </div>
      <Card>
        <CardHeader>
          <Label>Title</Label>
          <Input value={title} onChange={(e) => setTitle(e.target.value)} />
        </CardHeader>
        <CardContent className="flex flex-col gap-3">
          <Label>RRule</Label>
          <Textarea value={rrule} onChange={(e) => setRrule(e.target.value)} rows={5} />
        </CardContent>
        <CardFooter>
          <Button className="w-full" variant="link">
            <Link href="https://jkbrzt.github.io/rrule/" target="_blank" rel="noopener noreferrer">
              Generator
            </Link>
          </Button>
          <Button className="w-full" onClick={onSaveClick}>
            {!routine ? 'Create' : 'Save'}
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}

/* 
  ATTEMPT


export default function SingleRoutinePageUI({ routine }: SingleRoutinePageUIProps) {
  const [title, setTitle] = useState(routine?.title ?? '')
  const [rrule, setRrule] = useState<RRule>(routine ? rrulestr(routine.rrule) : new RRule())
  const [freq, setFreq] = useState<Frequency>(rrule.options.freq)
  const [interval, setInterval] = useState(rrule.options.interval)
  const [dtstart, setDtstart] = useState<Date>(rrule.options.dtstart)

  const onSaveClick = async () => {
    if (!routine) {
      await CreateRoutine({
        Title: title,
        RRule: rrule.toString(),
      })
    } else {
      await UpdateRoutine({
        RoutineID: routine.id,
        Timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
        Title: title,
        RRule: rrule.toString(),
      })
    }

    window.location.href = '/routines'
  }

  useEffect(() => {
    setRrule(new RRule({ ...rrule.options, freq, interval, dtstart }))
  }, [freq, interval, dtstart])

  return (
    <div className="max-w-md mx-auto flex flex-col gap-6">
      <div className="text-center">
        <h1 className="text-3xl font-bold">{!routine ? `Add New Routine` : `Edit Routine`}</h1>
        <p className="text-muted-foreground">
          {!routine ? `Create a` : `Update the`} routine based on your preferences.
        </p>
      </div>
      <Card>
        <CardHeader>
          <Label>Title</Label>
          <Input value={title} onChange={(e) => setTitle(e.target.value)} />
        </CardHeader>
        <CardContent className="flex flex-col gap-3">
          <div>
            <Label>Frequency</Label>
            <Select
              value={freq.toString()}
              onValueChange={(value) => setFreq(Number(value) as Frequency)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select frequency" />
              </SelectTrigger>
              <SelectContent>
                {Object.keys(Frequency)
                  .filter((key) => isNaN(Number(key)))
                  .map((key) => {
                    const val = Frequency[key as keyof typeof Frequency]
                    return (
                      <SelectItem key={val} value={val.toString()}>
                        {key.charAt(0).toUpperCase() + key.slice(1).toLowerCase()}
                      </SelectItem>
                    )
                  })}
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label>Interval</Label>
            <Input
              id="interval"
              type="number"
              min="1"
              value={interval}
              onChange={(e) => setInterval(Number(e.target.value))}
            />
          </div>
          <div>
            <DateAndTimePicker
              onChange={(date) => {
                if (date) setDtstart(date)
              }}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="rrule">Generated RRule</Label>
            <Textarea id="rrule" value={rrule.toString()} readOnly rows={3} />
          </div>
        </CardContent>
        <CardFooter>
          <Button className="w-full" onClick={onSaveClick}>
            {!routine ? 'Create' : 'Save'}
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}


*/
