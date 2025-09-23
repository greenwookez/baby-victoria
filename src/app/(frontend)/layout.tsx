import { PropsWithChildren } from 'react'
import { initPayload } from './_utils/initPayload'
import { RootLayoutClientWrapper } from './client.layout'
import './styles.css'

export const metadata = {
  description: 'A blank template using Payload in a Next.js app.',
  title: 'Payload Blank Template',
}

export default async function RootLayout({ children }: PropsWithChildren) {
  const { user } = await initPayload()

  return <RootLayoutClientWrapper user={user}>{children}</RootLayoutClientWrapper>
}
