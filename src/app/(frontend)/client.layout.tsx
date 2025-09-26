'use client'

import { Button } from '@/components/ui/button'
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  navigationMenuTriggerStyle,
} from '@/components/ui/navigation-menu'
import { Separator } from '@/components/ui/separator'
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
                        <Link href="/">Calendar</Link>
                      </NavigationMenuLink>
                    </NavigationMenuItem>
                    <NavigationMenuItem>
                      <NavigationMenuLink asChild className={navigationMenuTriggerStyle()}>
                        <Link href="/routines">Routines</Link>
                      </NavigationMenuLink>
                    </NavigationMenuItem>
                  </>
                )}
                <NavigationMenuItem>
                  <NavigationMenuLink asChild className={navigationMenuTriggerStyle()}>
                    <Link href="/test/client1" prefetch>
                      Client 1
                    </Link>
                  </NavigationMenuLink>
                </NavigationMenuItem>
                <NavigationMenuItem>
                  <NavigationMenuLink asChild className={navigationMenuTriggerStyle()}>
                    <Link href="/test/client2">Client 2</Link>
                  </NavigationMenuLink>
                </NavigationMenuItem>
                <NavigationMenuItem>
                  <NavigationMenuLink asChild className={navigationMenuTriggerStyle()}>
                    <Link href="/test/server1">Server 1</Link>
                  </NavigationMenuLink>
                </NavigationMenuItem>
                <NavigationMenuItem>
                  <NavigationMenuLink asChild className={navigationMenuTriggerStyle()}>
                    <Link href="/test/server2">Server 2</Link>
                  </NavigationMenuLink>
                </NavigationMenuItem>
              </NavigationMenuList>
            </NavigationMenu>

            <div className="flex items-center gap-3">
              {!user ? (
                <Button variant="outline" asChild>
                  <Link href="/auth/sign-in">Sign In</Link>
                </Button>
              ) : (
                <>
                  <span className="text-sm font-semibold text-muted-foreground">
                    Welcome back, {user.email}
                  </span>
                  <Separator orientation="vertical" className="h-6" />
                  <SignOutButton />
                </>
              )}
            </div>
          </div>
        </nav>
        <main className="flex items-center justify-center min-h-[calc(100%-50px)] pl-3 pr-3">
          {children}
        </main>
      </body>
    </html>
  )
}
