'use client'

import { MoreHorizontal } from 'lucide-react'

import { DeleteRoutine } from '@/app/(backend)/_runtime/routines/DeleteRoutine'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Routine } from '@/payload-types'
import { useRouter } from 'next/navigation'
import { useState } from 'react'

export type RoutinesTableProps = {
  routines: Routine[]
}

export function RoutinesTable({ routines }: RoutinesTableProps) {
  return (
    <div className="w-[100%] max-w-5xl">
      <div className="overflow-hidden rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>ID</TableHead>
              <TableHead>Title</TableHead>
              <TableHead>Updated At</TableHead>
              <TableHead>Created At</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {routines.length ? (
              routines.map((routine) => (
                <TableRow key={routine.id}>
                  <TableCell>{routine.id}</TableCell>
                  <TableCell className="w-[100%]">{routine.title}</TableCell>
                  <TableCell className="min-w-[250px]">
                    {routine.updatedAt
                      ? new Date(routine.updatedAt).toLocaleString('en-US', {
                          month: 'long',
                          day: 'numeric',
                          year: 'numeric',
                          hour: 'numeric',
                          minute: '2-digit',
                          hour12: true,
                        })
                      : ''}
                  </TableCell>
                  <TableCell className="min-w-[250px]">
                    {routine.createdAt
                      ? new Date(routine.createdAt).toLocaleString('en-US', {
                          month: 'long',
                          day: 'numeric',
                          year: 'numeric',
                          hour: 'numeric',
                          minute: '2-digit',
                          hour12: true,
                        })
                      : ''}
                  </TableCell>
                  <TableCell className="text-right">
                    <RoutinesTableActionCell routine={routine} />
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={4} className="h-24 text-center">
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}

type RoutinesTableActionCellProps = {
  routine: Routine
}

function RoutinesTableActionCell({ routine }: RoutinesTableActionCellProps) {
  const router = useRouter()
  const [open, setOpen] = useState(false)

  const onEditClick = () => {
    router.push(`/routines/${routine.id}`)
  }

  const onDeleteClick = async () => {
    await DeleteRoutine({
      RoutineID: routine.id,
      Timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
    })
    setOpen(false)
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="h-8 w-8 p-0">
          <span className="sr-only">Open menu</span>
          <MoreHorizontal />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuLabel>Actions</DropdownMenuLabel>
        <DropdownMenuItem onClick={onEditClick}>Edit</DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem className="text-red-500" onClick={() => setOpen(true)}>
          Remove
        </DropdownMenuItem>
      </DropdownMenuContent>

      <AlertDialog open={open} onOpenChange={setOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete your account and remove
              your data from our servers.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={onDeleteClick}>Delete</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </DropdownMenu>
  )
}
