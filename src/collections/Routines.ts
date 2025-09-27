import type { CollectionConfig } from 'payload'

export const Routines: CollectionConfig = {
  slug: 'routines',
  admin: {
    useAsTitle: 'title',
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      required: true,
    },
    {
      name: 'rrule',
      type: 'textarea',
      required: true,
    },
    {
      name: 'user',
      type: 'relationship',
      relationTo: 'users',
      required: true,
    },
    {
      name: 'is_deleted',
      type: 'checkbox',
      defaultValue: false,
    },
  ],
}
