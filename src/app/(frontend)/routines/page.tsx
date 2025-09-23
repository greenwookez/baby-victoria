import { headers as getHeaders } from 'next/headers.js'
import { getPayload } from 'payload'
import React from 'react'

import config from '@/payload.config'
import { RoutinesTable } from './RoutinesTable'
import { Button } from '@/components/ui/button'
import Link from 'next/link'

export default async function RoutinesPage() {
  const headers = await getHeaders()
  const payload = await getPayload({ config: await config })

  const { user } = await payload.auth({ headers })
  if (!user) {
    return <div>No session</div>
  }

  const routines = await payload.find({
    collection: 'routines',
    where: {
      user: {
        equals: user.id,
      },
    },
  })

  return (
    <div className="flex flex-col gap-3">
      <div className="flex justify-end">
        <Button>
          <Link href="/routines/new">Create</Link>
        </Button>
      </div>
      <RoutinesTable routines={routines.docs} />
    </div>
  )
}
