import { redirect } from 'next/navigation'
import { CalendarCard } from './_components/CalendarCard'
import { initPayload } from './_utils/initPayload'
import './styles.css'

export default async function HomePage() {
  const { payload, user } = await initPayload()
  if (!user) {
    redirect('/auth/sign-in')
  }

  const now = new Date()
  const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate())
  const endOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1)

  const taskEvents = await payload.find({
    collection: 'events',
    where: {
      user: { equals: user.id },
      and: [
        {
          'scheduled-for': {
            greater_than_equal: startOfDay.toISOString(),
            less_than: endOfDay.toISOString(),
          },
        },
        {
          routine: {
            not_equals: null,
          },
        },
      ],
    },
  })

  const customEvents = await payload.find({
    collection: 'events',
    sort: 'completed-at',
    where: {
      user: { equals: user.id },
      and: [
        {
          'completed-at': {
            greater_than_equal: startOfDay.toISOString(),
            less_than: endOfDay.toISOString(),
          },
        },
        {
          routine: {
            equals: null,
          },
        },
      ],
    },
  })

  const eventsTypes = await payload.find({
    collection: 'events-types',
  })

  return (
    <CalendarCard
      taskEvents={taskEvents.docs}
      customEvents={customEvents.docs}
      eventsTypes={eventsTypes.docs}
    />
  )
}
