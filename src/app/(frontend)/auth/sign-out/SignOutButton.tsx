'use client'

import { Button } from '@/components/ui/button'

export default function SignOutButton() {
  async function handleSignOut() {
    await fetch(`/api/users/logout`, {
      method: 'POST',
      credentials: 'include', // make sure cookie gets cleared
    })

    window.location.href = '/'
  }

  return <Button onClick={handleSignOut}>Sign Out</Button>
}
