import { User } from '@/payload-types'
import config from '@/payload.config'
import { cookies, headers as getHeaders } from 'next/headers'
import { BasePayload, getPayload } from 'payload'

export const initPayload = async (): Promise<{
  payload: BasePayload
  user: User | null
  timezone: string
}> => {
  const timezone = (await cookies()).get('tz')?.value ?? 'UTC'

  const headers = await getHeaders()
  const payloadConfig = await config
  const payload = await getPayload({ config: payloadConfig })
  const { user } = await payload.auth({ headers })

  return { payload, user, timezone }
}
