import { initPayload } from '@/app/(frontend)/_utils/initPayload'
import { headers as getHeaders } from 'next/headers'

export async function authorize(): ReturnType<typeof initPayload> {
  const { payload, user, timezone } = await initPayload()

  const headers = await getHeaders()
  const authHeader = headers.get('authorization')
  if (authHeader !== null) {
    const authHeaderParts = authHeader.split(' ')
    if (authHeaderParts.length !== 2 || authHeaderParts[0] !== 'Bearer') {
      return { payload, user: null, timezone }
    }

    const user = await payload.find({
      collection: 'users',
      where: {
        'api-key': {
          equals: authHeaderParts[1],
        },
      },
      limit: 1,
    })

    if (user.docs.length !== 1) {
      return { payload, user: null, timezone }
    }

    return { payload, user: user.docs[0], timezone }
  }

  return {
    payload,
    user,
    timezone,
  }
}
