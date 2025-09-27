'use client'

import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { Label } from '@/components/ui/label'
import { Event } from '@/payload-types'
import { formatTime } from '../_utils/formatTime'
import { WithChangeTimeDialog } from './WithChangeTimeDialog'

type TaskCheckboxProps = {
  task: Event
  onChecked?: (checked: boolean) => void
  onChange?: (newDate: Date) => void
}

export const TaskCheckbox = ({ task, onChecked, onChange }: TaskCheckboxProps) => {
  return (
    <div className="flex items-start gap-3">
      <Checkbox
        id={`${task.id}`}
        checked={task['completed-at'] !== null}
        onCheckedChange={(checked) => {
          onChecked?.(checked.valueOf() === true)
        }}
      />
      <div className="grid gap-2">
        {/* eslint-disable-next-line @typescript-eslint/ban-ts-comment */}
        {/* @ts-expect-error */}
        <Label htmlFor={`${task.id}`}>{task.routine.title}</Label>
        <p className="text-muted-foreground text-sm">
          {formatTime(task['scheduled-for']!)}
          {task['completed-at'] ? (
            <>
              {` - Done at ${formatTime(task['completed-at']!)}`}
              {task['completed-at'] && (
                <WithChangeTimeDialog date={new Date(task['completed-at'])} onChange={onChange}>
                  <Button variant={'ghost'}>Edit</Button>
                </WithChangeTimeDialog>
              )}
            </>
          ) : (
            ''
          )}
        </p>
      </div>
    </div>
  )
}
