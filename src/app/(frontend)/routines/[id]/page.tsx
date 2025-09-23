import { notFound, redirect } from 'next/navigation'
import { initPayload } from '../../_utils/initPayload'
import SingleRoutinePageUI from './ui.page'

type SingleRoutinePageProps = {
  params: Promise<{ id: string }>
}

export default async function SingleRoutinePage(props: SingleRoutinePageProps) {
  const { payload, user } = await initPayload()
  const { id } = await props.params

  if (!user) {
    redirect('/auth/sign-in')
  }

  if (id === 'new') {
    return <SingleRoutinePageUI routine={undefined} />
  }

  const numId = Number(id)
  if (Number.isNaN(numId)) {
    notFound()
  }

  const routine = await payload.find({
    collection: 'routines',
    where: {
      id: { equals: numId },
      user: { equals: user.id },
    },
  })

  if (!routine.docs.length) {
    notFound()
  }

  return <SingleRoutinePageUI routine={routine.docs[0]} />
}
