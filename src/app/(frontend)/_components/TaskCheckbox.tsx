'use client'

import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { Label } from '@/components/ui/label'
import { Event } from '@/payload-types'
import { formatTime } from '../_utils/formatTime'
import { WithChangeTimeDialog } from './WithChangeTimeDialog'

import { Pencil } from 'lucide-react'

type TaskCheckboxProps = {
  task: Event
  onChecked?: (checked: boolean) => void
  onChange?: (newDate: Date) => void
}

export const TaskCheckbox = ({ task, onChecked, onChange }: TaskCheckboxProps) => {
  return (
    <div className="flex justify-between">
      <div className="flex items-start gap-3">
        <Checkbox
          id={`${task.id}`}
          checked={task['completed-at'] !== null}
          className="mt-[5px]"
          onCheckedChange={(checked) => {
            onChecked?.(checked.valueOf() === true)
          }}
        />
        <div className="grid gap-2">
          <Label htmlFor={`${task.id}`} className="text-base">
            {/* eslint-disable-next-line @typescript-eslint/ban-ts-comment */}
            {/* @ts-expect-error */}
            {task.routine.title}
          </Label>
          {formatTime(task['scheduled-for']!)}
          {task['completed-at'] ? <>{` - Done at ${formatTime(task['completed-at']!)}`}</> : ''}
        </div>
      </div>
      {task['completed-at'] && (
        <WithChangeTimeDialog date={new Date(task['completed-at'])} onChange={onChange}>
          <Button variant="outline" size="iconsm">
            <Pencil className="!w-[14px] !h-[14px]" />
          </Button>
        </WithChangeTimeDialog>
      )}
    </div>
  )
}
