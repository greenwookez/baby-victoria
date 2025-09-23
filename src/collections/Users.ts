import type { CollectionConfig, Option } from 'payload'

const UserRoleAdmin = 'admin'
const UserRoleDefault = 'default'

const Roles: Option[] = [
  { label: 'Default', value: UserRoleDefault },
  { label: 'Admin', value: UserRoleAdmin },
]

export const Users: CollectionConfig = {
  slug: 'users',
  admin: {
    useAsTitle: 'email',
  },
  access: {
    admin: ({ req: { user } }) => {
      return user?.role === UserRoleAdmin
    },
  },
  auth: {
    tokenExpiration: 60 * 60 * 24 * 365,
  },
  fields: [
    {
      name: 'role',
      type: 'select',
      required: true,
      defaultValue: UserRoleDefault,
      options: Roles,
    },
    {
      name: 'api-key',
      type: 'text',
      unique: true,
      hidden: true,
    },
  ],
}
