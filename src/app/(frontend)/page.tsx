import { redirect } from 'next/navigation'
import { initPayload } from './_utils/initPayload'
import HomePageUI from './ui.page'

import './styles.css'

export default async function HomePage() {
  const { payload, user } = await initPayload()
  if (!user) {
    redirect('/auth/sign-in')
  }

  const eventsTypes = await payload.find({
    collection: 'events-types',
  })

  return <HomePageUI eventsTypes={eventsTypes.docs} />
}
