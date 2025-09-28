'use client'

import { Button } from '@/components/ui/button'
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  navigationMenuTriggerStyle,
} from '@/components/ui/navigation-menu'
import { User } from '@/payload-types'
import Link from 'next/link'
import { PropsWithChildren, useEffect } from 'react'
import SignOutButton from './auth/sign-out/SignOutButton'
import './styles.css'

export type RootLayoutClientWrapperProps = {
  user: User | null
}

export const RootLayoutClientWrapper = ({
  user,
  children,
}: PropsWithChildren<RootLayoutClientWrapperProps>) => {
  useEffect(() => {
    const tz = Intl.DateTimeFormat().resolvedOptions().timeZone
    document.cookie = `tz=${tz}; path=/`
  }, [])

  return (
    <html lang="en">
      <body>
        <nav className="border-b bg-background px-4">
          <div className="flex h-14 items-center justify-between">
            <NavigationMenu>
              <NavigationMenuList>
                {user && (
                  <>
                    <NavigationMenuItem>
                      <NavigationMenuLink asChild className={navigationMenuTriggerStyle()}>
                        <Link href="/" prefetch>
                          Calendar
                        </Link>
                      </NavigationMenuLink>
                    </NavigationMenuItem>
                    <NavigationMenuItem>
                      <NavigationMenuLink asChild className={navigationMenuTriggerStyle()}>
                        <Link href="/routines" prefetch>
                          Routines
                        </Link>
                      </NavigationMenuLink>
                    </NavigationMenuItem>
                  </>
                )}
              </NavigationMenuList>
            </NavigationMenu>

            <div className="flex items-center gap-3">
              {!user ? (
                <Button variant="outline" asChild>
                  <Link href="/auth/sign-in" prefetch>
                    Sign In
                  </Link>
                </Button>
              ) : (
                <SignOutButton />
              )}
            </div>
          </div>
        </nav>
        <main className="flex justify-center min-h-[calc(100%-50px)] pl-3 pr-3 w-full">
          {children}
        </main>
      </body>
    </html>
  )
}
