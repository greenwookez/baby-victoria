import { PropsWithChildren } from 'react'
import { initPayload } from './_utils/initPayload'
import { RootLayoutClientWrapper } from './client.layout'
import './styles.css'

export const metadata = {
  title: 'Baby Victoria',
  icons: {
    icon: [
      { url: '/favicon-96x96.png', type: 'image/png', sizes: '96x96' },
      { url: '/favicon.svg', type: 'image/svg+xml' },
    ],
    shortcut: '/favicon.ico',
    apple: { url: '/apple-touch-icon.png', sizes: '180x180' },
  },
  manifest: '/site.webmanifest',
  other: {
    'apple-mobile-web-app-title': 'Victoria',
  },
}

export default async function RootLayout({ children }: PropsWithChildren) {
  const { user } = await initPayload()

  return <RootLayoutClientWrapper user={user}>{children}</RootLayoutClientWrapper>
}
