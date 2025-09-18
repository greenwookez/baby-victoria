import type { CollectionConfig } from 'payload'

export const EventsTypes: CollectionConfig = {
  slug: 'events-types',
  admin: {
    useAsTitle: 'title',
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      required: true,
    },
  ],
}
