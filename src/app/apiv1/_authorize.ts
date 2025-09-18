import { User } from '@/payload-types'
import configPromise from '@payload-config'
import { headers as getHeaders } from 'next/headers'
import { BasePayload, getPayload } from 'payload'

export async function authorize(): Promise<{ payload: BasePayload; user: User | null }> {
  const payload = await getPayload({
    config: configPromise,
  })

  const headers = await getHeaders()
  const authHeader = headers.get('authorization')
  if (authHeader !== null) {
    const authHeaderParts = authHeader.split(' ')
    if (authHeaderParts.length !== 2 || authHeaderParts[0] !== 'Bearer') {
      return { payload, user: null }
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
      return { payload, user: null }
    }

    return { payload, user: user.docs[0] }
  }

  const { user } = await payload.auth({ headers })
  return {
    payload,
    user,
  }
}
